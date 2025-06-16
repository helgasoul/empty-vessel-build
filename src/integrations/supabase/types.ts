export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      genetic_data: {
        Row: {
          created_at: string
          gene_variants: Json | null
          id: string
          lab_name: string | null
          results: Json | null
          test_date: string | null
          test_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gene_variants?: Json | null
          id?: string
          lab_name?: string | null
          results?: Json | null
          test_date?: string | null
          test_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gene_variants?: Json | null
          id?: string
          lab_name?: string | null
          results?: Json | null
          test_date?: string | null
          test_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_recommendations: {
        Row: {
          category: string
          completed: boolean
          created_at: string
          description: string
          id: string
          priority: number
          risk_assessment_id: string | null
          title: string
        }
        Insert: {
          category: string
          completed?: boolean
          created_at?: string
          description: string
          id?: string
          priority?: number
          risk_assessment_id?: string | null
          title: string
        }
        Update: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string
          id?: string
          priority?: number
          risk_assessment_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_recommendations_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          alcohol_consumption: string | null
          allergies: string | null
          chronic_conditions: string | null
          created_at: string
          current_health_issues: string | null
          current_medications: string | null
          date_of_birth: string | null
          dietary_restrictions: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          exercise_frequency: string | null
          family_history: string | null
          full_name: string | null
          gender: string | null
          health_goals: string | null
          height: number | null
          id: string
          insurance_info: string | null
          last_checkup_date: string | null
          lifestyle: string | null
          medical_history: string | null
          mental_health_history: string | null
          preferred_doctor: string | null
          previous_surgeries: string | null
          reproductive_health: string | null
          sleep_patterns: string | null
          smoking_status: string | null
          stress_levels: string | null
          updated_at: string
          vaccination_history: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          alcohol_consumption?: string | null
          allergies?: string | null
          chronic_conditions?: string | null
          created_at?: string
          current_health_issues?: string | null
          current_medications?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          exercise_frequency?: string | null
          family_history?: string | null
          full_name?: string | null
          gender?: string | null
          health_goals?: string | null
          height?: number | null
          id: string
          insurance_info?: string | null
          last_checkup_date?: string | null
          lifestyle?: string | null
          medical_history?: string | null
          mental_health_history?: string | null
          preferred_doctor?: string | null
          previous_surgeries?: string | null
          reproductive_health?: string | null
          sleep_patterns?: string | null
          smoking_status?: string | null
          stress_levels?: string | null
          updated_at?: string
          vaccination_history?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          alcohol_consumption?: string | null
          allergies?: string | null
          chronic_conditions?: string | null
          created_at?: string
          current_health_issues?: string | null
          current_medications?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          exercise_frequency?: string | null
          family_history?: string | null
          full_name?: string | null
          gender?: string | null
          health_goals?: string | null
          height?: number | null
          id?: string
          insurance_info?: string | null
          last_checkup_date?: string | null
          lifestyle?: string | null
          medical_history?: string | null
          mental_health_history?: string | null
          preferred_doctor?: string | null
          previous_surgeries?: string | null
          reproductive_health?: string | null
          sleep_patterns?: string | null
          smoking_status?: string | null
          stress_levels?: string | null
          updated_at?: string
          vaccination_history?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          assessment_data: Json
          assessment_type: string
          created_at: string
          id: string
          recommendations: string[] | null
          results_data: Json
          risk_level: string
          risk_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_data: Json
          assessment_type: string
          created_at?: string
          id?: string
          recommendations?: string[] | null
          results_data: Json
          risk_level: string
          risk_percentage: number
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_data?: Json
          assessment_type?: string
          created_at?: string
          id?: string
          recommendations?: string[] | null
          results_data?: Json
          risk_level?: string
          risk_percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
