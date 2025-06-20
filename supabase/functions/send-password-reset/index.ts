
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Password reset function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.text();
    console.log('Request body received:', requestBody);
    
    let data: PasswordResetRequest;
    try {
      data = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email } = data;
    console.log('Processing password reset for email:', email);

    if (!email) {
      console.error('No email provided');
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the origin from request headers for redirect URL
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://wbydubxjcdhoinhrozwx.supabase.co';
    const redirectTo = `${origin}/auth?type=recovery`;
    
    console.log('Using redirect URL:', redirectTo);

    // Generate password reset link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectTo
      }
    });

    if (linkError) {
      console.error('Error generating reset link:', linkError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate reset link',
          details: linkError.message 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('Reset link generated successfully');

    // Send email with reset link
    try {
      const emailResponse = await resend.emails.send({
        from: "PREVENT <noreply@resend.dev>",
        to: [email],
        subject: "Восстановление пароля PREVENT",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">PREVENT</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Персонализированная медицина</p>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Восстановление пароля</h2>
              
              <p style="color: #4b5563; margin-bottom: 25px; line-height: 1.6;">
                Мы получили запрос на восстановление пароля для вашего аккаунта в PREVENT. 
                Если это были вы, нажмите на кнопку ниже, чтобы создать новый пароль.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${linkData.properties?.action_link}" 
                   style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600;
                          display: inline-block;">
                  Восстановить пароль
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо. 
                Ваш пароль останется без изменений.
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                Ссылка для восстановления действительна в течение 1 часа.
              </p>
            </div>
            
            <div style="background-color: #e5e7eb; padding: 20px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 PREVENT. Платформа персонализированной превентивной медицины.
              </p>
            </div>
          </div>
        `,
      });

      console.log("Password reset email response:", emailResponse);

      // Check if there's an error in the response
      if (emailResponse.error) {
        console.error('Resend API error:', emailResponse.error);
        
        // Handle specific Resend API errors
        if (emailResponse.error.statusCode === 403) {
          return new Response(
            JSON.stringify({ 
              success: true,
              message: "Ссылка для восстановления пароля была сгенерирована. В тестовом режиме письма отправляются только на зарегистрированный email.",
              testMode: true,
              resetLink: linkData.properties?.action_link
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send email',
            details: emailResponse.error.message || 'Unknown email service error'
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Success case
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Ссылка для восстановления пароля отправлена на ваш email",
          emailId: emailResponse.data?.id
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email",
          details: emailError.message
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
