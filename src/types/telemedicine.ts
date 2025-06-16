
export interface VideoConferenceIntegration {
  id: string;
  user_id: string;
  platform_type: 'zoom' | 'google_meet' | 'teams' | 'webex';
  platform_user_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  integration_status: 'active' | 'inactive' | 'error';
  platform_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CalendarIntegration {
  id: string;
  user_id: string;
  calendar_type: 'google_calendar' | 'outlook' | 'apple_calendar';
  calendar_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  integration_status: 'active' | 'inactive' | 'error';
  sync_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EnhancedTelemedicineSession {
  id: string;
  user_id: string;
  appointment_id: string;
  doctor_id: string;
  session_status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  ended_at?: string;
  duration_minutes?: number;
  session_notes?: string;
  room_id?: string;
  session_token?: string;
  follow_up_required: boolean;
  prescription_issued: boolean;
  meeting_link?: string;
  session_recording_url?: string;
  payment_amount?: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  calendar_event_id?: string;
  video_conference_id?: string;
  conference_platform?: string;
  calendar_platform?: string;
  created_at: string;
  updated_at: string;
}

// Типы для данных из Supabase (до преобразования)
export interface RawVideoConferenceIntegration {
  id: string;
  user_id: string;
  platform_type: string;
  platform_user_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  integration_status: string;
  platform_settings: any;
  created_at: string;
  updated_at: string;
}

export interface RawCalendarIntegration {
  id: string;
  user_id: string;
  calendar_type: string;
  calendar_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  integration_status: string;
  sync_settings: any;
  created_at: string;
  updated_at: string;
}
