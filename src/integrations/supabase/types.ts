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
      community_posts: {
        Row: {
          anonymous_name: string
          author_id: string | null
          content: string
          created_at: string
          group_id: string
          id: string
          is_anonymous: boolean | null
          like_count: number | null
          post_type: string | null
          reply_count: number | null
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          anonymous_name: string
          author_id?: string | null
          content: string
          created_at?: string
          group_id: string
          id?: string
          is_anonymous?: boolean | null
          like_count?: number | null
          post_type?: string | null
          reply_count?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          anonymous_name?: string
          author_id?: string | null
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          is_anonymous?: boolean | null
          like_count?: number | null
          post_type?: string | null
          reply_count?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      crc_pro_assessments: {
        Row: {
          age: number
          alcohol_consumption: string | null
          assessment_id: string | null
          calcium_supplements: boolean | null
          created_at: string
          diabetes_type2: boolean | null
          family_history_crc: boolean | null
          family_history_ibd: boolean | null
          family_history_polyps: boolean | null
          fiber_intake: string | null
          gender: string
          height_cm: number | null
          id: string
          last_colonoscopy_date: string | null
          multivitamin_use: boolean | null
          nsaid_use: boolean | null
          number_affected_relatives: number | null
          personal_history_ibd: boolean | null
          personal_history_polyps: boolean | null
          physical_activity: string | null
          previous_colonoscopy: boolean | null
          processed_meat_consumption: string | null
          red_meat_consumption: string | null
          smoking_status: string | null
          updated_at: string
          user_id: string
          vegetable_intake: string | null
          weight_kg: number | null
        }
        Insert: {
          age: number
          alcohol_consumption?: string | null
          assessment_id?: string | null
          calcium_supplements?: boolean | null
          created_at?: string
          diabetes_type2?: boolean | null
          family_history_crc?: boolean | null
          family_history_ibd?: boolean | null
          family_history_polyps?: boolean | null
          fiber_intake?: string | null
          gender: string
          height_cm?: number | null
          id?: string
          last_colonoscopy_date?: string | null
          multivitamin_use?: boolean | null
          nsaid_use?: boolean | null
          number_affected_relatives?: number | null
          personal_history_ibd?: boolean | null
          personal_history_polyps?: boolean | null
          physical_activity?: string | null
          previous_colonoscopy?: boolean | null
          processed_meat_consumption?: string | null
          red_meat_consumption?: string | null
          smoking_status?: string | null
          updated_at?: string
          user_id: string
          vegetable_intake?: string | null
          weight_kg?: number | null
        }
        Update: {
          age?: number
          alcohol_consumption?: string | null
          assessment_id?: string | null
          calcium_supplements?: boolean | null
          created_at?: string
          diabetes_type2?: boolean | null
          family_history_crc?: boolean | null
          family_history_ibd?: boolean | null
          family_history_polyps?: boolean | null
          fiber_intake?: string | null
          gender?: string
          height_cm?: number | null
          id?: string
          last_colonoscopy_date?: string | null
          multivitamin_use?: boolean | null
          nsaid_use?: boolean | null
          number_affected_relatives?: number | null
          personal_history_ibd?: boolean | null
          personal_history_polyps?: boolean | null
          physical_activity?: string | null
          previous_colonoscopy?: boolean | null
          processed_meat_consumption?: string | null
          red_meat_consumption?: string | null
          smoking_status?: string | null
          updated_at?: string
          user_id?: string
          vegetable_intake?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crc_pro_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_health_summary: {
        Row: {
          active_minutes: number | null
          additional_metrics: Json | null
          avg_heart_rate: number | null
          calories_burned: number | null
          created_at: string
          distance_km: number | null
          glucose_avg: number | null
          glucose_readings_count: number | null
          id: string
          max_heart_rate: number | null
          min_heart_rate: number | null
          sleep_hours: number | null
          sleep_quality: string | null
          summary_date: string
          total_steps: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_minutes?: number | null
          additional_metrics?: Json | null
          avg_heart_rate?: number | null
          calories_burned?: number | null
          created_at?: string
          distance_km?: number | null
          glucose_avg?: number | null
          glucose_readings_count?: number | null
          id?: string
          max_heart_rate?: number | null
          min_heart_rate?: number | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          summary_date: string
          total_steps?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_minutes?: number | null
          additional_metrics?: Json | null
          avg_heart_rate?: number | null
          calories_burned?: number | null
          created_at?: string
          distance_km?: number | null
          glucose_avg?: number | null
          glucose_readings_count?: number | null
          id?: string
          max_heart_rate?: number | null
          min_heart_rate?: number | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          summary_date?: string
          total_steps?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      external_health_data: {
        Row: {
          created_at: string
          data_payload: Json
          data_type: string
          external_id: string | null
          id: string
          integration_id: string
          recorded_date: string
          synced_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_payload: Json
          data_type: string
          external_id?: string | null
          id?: string
          integration_id: string
          recorded_date: string
          synced_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_payload?: Json
          data_type?: string
          external_id?: string | null
          id?: string
          integration_id?: string
          recorded_date?: string
          synced_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_health_data_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "health_app_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      group_members: {
        Row: {
          anonymous_name: string
          group_id: string
          id: string
          is_active: boolean | null
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          anonymous_name: string
          group_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          anonymous_name?: string
          group_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      health_app_integrations: {
        Row: {
          access_token: string | null
          app_name: string
          app_user_id: string | null
          created_at: string
          id: string
          integration_status: string
          last_sync_at: string | null
          refresh_token: string | null
          sync_settings: Json | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          app_name: string
          app_user_id?: string | null
          created_at?: string
          id?: string
          integration_status?: string
          last_sync_at?: string | null
          refresh_token?: string | null
          sync_settings?: Json | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          app_name?: string
          app_user_id?: string | null
          created_at?: string
          id?: string
          integration_status?: string
          last_sync_at?: string | null
          refresh_token?: string | null
          sync_settings?: Json | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_device_data: {
        Row: {
          created_at: string
          data_details: Json | null
          data_type: string
          data_unit: string | null
          data_value: number | null
          device_id: string
          id: string
          recorded_at: string
          synced_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_details?: Json | null
          data_type: string
          data_unit?: string | null
          data_value?: number | null
          device_id: string
          id?: string
          recorded_at: string
          synced_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_details?: Json | null
          data_type?: string
          data_unit?: string | null
          data_value?: number | null
          device_id?: string
          id?: string
          recorded_at?: string
          synced_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_device_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "user_devices"
            referencedColumns: ["id"]
          },
        ]
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
      medical_appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          cost: number | null
          created_at: string
          doctor_id: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          payment_status: string | null
          provider_id: string
          reason: string | null
          reminder_sent: boolean | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          cost?: number | null
          created_at?: string
          doctor_id?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          provider_id: string
          reason?: string | null
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          cost?: number | null
          created_at?: string
          doctor_id?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          provider_id?: string
          reason?: string | null
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "partner_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "partner_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          attachments: Json | null
          clinic_name: string | null
          created_at: string
          description: string | null
          doctor_name: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          record_date: string
          record_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          clinic_name?: string | null
          created_at?: string
          description?: string | null
          doctor_name?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          record_date: string
          record_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          clinic_name?: string | null
          created_at?: string
          description?: string | null
          doctor_name?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          record_date?: string
          record_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          notes: string | null
          side_effects_experienced: string | null
          taken_at: string
          user_id: string
          was_on_time: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          notes?: string | null
          side_effects_experienced?: string | null
          taken_at?: string
          user_id: string
          was_on_time?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          notes?: string | null
          side_effects_experienced?: string | null
          taken_at?: string
          user_id?: string
          was_on_time?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_reminders: {
        Row: {
          created_at: string
          days_of_week: number[]
          id: string
          is_active: boolean
          last_taken_at: string | null
          medication_id: string
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[]
          id?: string
          is_active?: boolean
          last_taken_at?: string | null
          medication_id: string
          reminder_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          id?: string
          is_active?: boolean
          last_taken_at?: string | null
          medication_id?: string
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_reminders_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          frequency: string
          id: string
          instructions: string | null
          is_active: boolean
          medication_name: string
          side_effects: string | null
          specific_times: string[] | null
          times_per_day: number
          treatment_plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage: string
          frequency: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          medication_name: string
          side_effects?: string | null
          specific_times?: string[] | null
          times_per_day?: number
          treatment_plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage?: string
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          medication_name?: string
          side_effects?: string | null
          specific_times?: string[] | null
          times_per_day?: number
          treatment_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      menstrual_cycles: {
        Row: {
          created_at: string
          cycle_end_date: string | null
          cycle_length: number | null
          cycle_start_date: string
          flow_intensity: string | null
          id: string
          notes: string | null
          period_length: number | null
          predicted_next_cycle: string | null
          symptoms: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length?: number | null
          cycle_start_date: string
          flow_intensity?: string | null
          id?: string
          notes?: string | null
          period_length?: number | null
          predicted_next_cycle?: string | null
          symptoms?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length?: number | null
          cycle_start_date?: string
          flow_intensity?: string | null
          id?: string
          notes?: string | null
          period_length?: number | null
          predicted_next_cycle?: string | null
          symptoms?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_doctors: {
        Row: {
          available_slots: Json | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          experience_years: number | null
          full_name: string
          id: string
          is_available: boolean
          photo_url: string | null
          provider_id: string
          qualification: string | null
          rating: number | null
          specialization: string
          updated_at: string
        }
        Insert: {
          available_slots?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          full_name: string
          id?: string
          is_available?: boolean
          photo_url?: string | null
          provider_id: string
          qualification?: string | null
          rating?: number | null
          specialization: string
          updated_at?: string
        }
        Update: {
          available_slots?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          is_available?: boolean
          photo_url?: string | null
          provider_id?: string
          qualification?: string | null
          rating?: number | null
          specialization?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_doctors_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "partner_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_providers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          provider_type: string
          rating: number | null
          specializations: string[] | null
          updated_at: string
          website: string | null
          working_hours: Json | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          provider_type: string
          rating?: number | null
          specializations?: string[] | null
          updated_at?: string
          website?: string | null
          working_hours?: Json | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          provider_type?: string
          rating?: number | null
          specializations?: string[] | null
          updated_at?: string
          website?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "post_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      post_replies: {
        Row: {
          anonymous_name: string
          author_id: string | null
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          like_count: number | null
          post_id: string
          updated_at: string
        }
        Insert: {
          anonymous_name: string
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          like_count?: number | null
          post_id: string
          updated_at?: string
        }
        Update: {
          anonymous_name?: string
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          like_count?: number | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
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
      support_groups: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          member_count: number | null
          name: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          member_count?: number | null
          name: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          member_count?: number | null
          name?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      symptom_mood_logs: {
        Row: {
          created_at: string
          energy_level: number | null
          id: string
          log_date: string
          mood_rating: number | null
          mood_tags: string[] | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          symptoms: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date: string
          mood_rating?: number | null
          mood_tags?: string[] | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date?: string
          mood_rating?: number | null
          mood_tags?: string[] | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      telemedicine_sessions: {
        Row: {
          appointment_id: string
          created_at: string
          doctor_id: string
          duration_minutes: number | null
          ended_at: string | null
          follow_up_required: boolean | null
          id: string
          prescription_issued: boolean | null
          room_id: string | null
          session_notes: string | null
          session_status: string
          session_token: string | null
          started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          doctor_id: string
          duration_minutes?: number | null
          ended_at?: string | null
          follow_up_required?: boolean | null
          id?: string
          prescription_issued?: boolean | null
          room_id?: string | null
          session_notes?: string | null
          session_status?: string
          session_token?: string | null
          started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          doctor_id?: string
          duration_minutes?: number | null
          ended_at?: string | null
          follow_up_required?: boolean | null
          id?: string
          prescription_issued?: boolean | null
          room_id?: string | null
          session_notes?: string | null
          session_status?: string
          session_token?: string | null
          started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "medical_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemedicine_sessions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "partner_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          consultation_id: string | null
          created_at: string
          doctor_name: string | null
          end_date: string | null
          id: string
          is_active: boolean
          notes: string | null
          plan_name: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          doctor_name?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          plan_name: string
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          doctor_name?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          plan_name?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          access_token: string | null
          connection_status: string | null
          created_at: string
          device_name: string
          device_settings: Json | null
          device_type: string
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connection_status?: string | null
          created_at?: string
          device_name: string
          device_settings?: Json | null
          device_type: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          connection_status?: string | null
          created_at?: string
          device_name?: string
          device_settings?: Json | null
          device_type?: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
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
