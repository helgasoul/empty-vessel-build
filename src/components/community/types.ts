// ============================================================================
// COMMUNITY TYPES FOR PREVENT PLATFORM
// ============================================================================

export interface CommunityUser {
  id: string;
  anonymousHandle: string;
  emotionalProfile: EmotionalProfile;
  healthConcerns: HealthConcern[];
  demographics: Demographics;
  supportRole: 'seeker' | 'giver' | 'both';
  joinDate: Date;
  lastActive: Date;
  privacySettings: PrivacySettings;
}

export interface EmotionalProfile {
  anxietyLevel: 1 | 2 | 3 | 4 | 5;
  supportNeeded: string[];
  communicationStyle: 'direct' | 'gentle' | 'fact-based' | 'emotional';
  triggers: string[];
  copingMechanisms: string[];
}

export interface HealthConcern {
  category: 'breast-cancer' | 'cardiovascular' | 'menopause' | 'fertility' | 'mental-health' | 'general-wellness';
  level: 'low-risk' | 'moderate-risk' | 'high-risk' | 'diagnosed' | 'survivor';
  priority: 1 | 2 | 3;
}

export interface Demographics {
  ageRange: string;
  location: string;
  timeZone: string;
  availableHours: string[];
}

export interface PrivacySettings {
  profileVisibility: 'anonymous' | 'semi-private' | 'community-only';
  shareHealthData: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  enableNotifications: boolean;
}

export interface SupportGroup {
  id: string;
  name: string;
  type: GroupType;
  description: string;
  currentMembers: CommunityUser[];
  maxMembers: number;
  moderator: Moderator;
  schedule: MeetingSchedule;
  tags: string[];
  privacyLevel: 'open' | 'invite-only' | 'application-required';
  healthFocus: string[];
  communicationStyle: string[];
  created: Date;
  groupHealth: GroupHealthMetrics;
}

export type GroupType = 
  | 'circle-of-trust'        // 8-12 участниц
  | 'diagnosis-support'      // по диагнозам
  | 'life-stage'            // возрастные группы
  | 'expert-qa'             // с экспертами
  | 'crisis-support';       // экстренная поддержка

export interface Moderator {
  name: string;
  type: 'professional' | 'peer' | 'volunteer';
  credentials?: string;
  rating?: number;
  specialization?: string;
}

export interface MeetingSchedule {
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  dayOfWeek: string;
  timeSlot: string;
  duration: number; // minutes
  timezone: string;
  format: 'text-chat' | 'video' | 'voice' | 'hybrid';
}

export interface GroupHealthMetrics {
  participationRate: number;
  emotionalSafety: number;
  supportQuality: number;
  conflictLevel?: number;
  memberSatisfaction?: number;
  progressIndicators?: string[];
}

// ============================================================================
// EMOTIONAL INTELLIGENCE TYPES
// ============================================================================

export interface EmotionalState {
  anxiety: number;      // 0-100
  stress: number;       // 0-100
  sadness: number;      // 0-100
  hope: number;         // 0-100
  confidence: number;   // 0-100
  overwhelm: number;    // 0-100
  timestamp: Date;
  triggers?: string[];
  copingMethods?: string[];
}

export interface EmotionalAnalysis {
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: Recommendation[];
  insights: string[];
  confidenceLevel?: number;
}

export interface Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
  action: string;
  priority: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // minutes
  category?: 'immediate' | 'short-term' | 'long-term';
}

export type RecommendationType = 
  | 'breathing' 
  | 'mindfulness' 
  | 'support-group' 
  | 'professional-help' 
  | 'gentle-redirect'
  | 'physical-activity'
  | 'social-connection'
  | 'creative-expression';

export interface CrisisProtocol {
  level: CrisisLevel;
  message: string;
  actions: string[];
  contacts?: EmergencyContact[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  followUpRequired: boolean;
}

export type CrisisLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'emergency';

export interface EmergencyContact {
  type: 'crisis-line' | 'emergency' | 'professional' | 'trusted-person';
  name: string;
  phone: string;
  available24h: boolean;
  description?: string;
}

// ============================================================================
// MATCHING SYSTEM TYPES
// ============================================================================

export interface MatchingCriteria {
  healthConcerns: string[];
  ageRange: string;
  communicationStyle: string;
  supportType: string;
  timePreference: string;
  groupSize: 'small' | 'medium' | 'large';
  professionalModeration: boolean;
  anonymityLevel: 'full' | 'partial' | 'open';
}

export interface MatchingResult {
  group: SupportGroup;
  compatibilityScore: number;
  matchReasons: string[];
  potentialChallenges: string[];
  recommendationStrength: 'weak' | 'moderate' | 'strong' | 'excellent';
}

export interface CompatibilityFactors {
  healthConcernOverlap: number;
  communicationStyleMatch: number;
  scheduleCompatibility: number;
  groupSizePreference: number;
  emotionalNeedsAlignment: number;
  experienceLevelMatch: number;
}

// ============================================================================
// EXPERT SESSIONS TYPES
// ============================================================================

export interface ExpertSession {
  id: string;
  expert: MedicalExpert;
  topic: string;
  description: string;
  scheduledTime: Date;
  duration: number;
  maxParticipants: number;
  spotsAvailable: number;
  format: 'live-qa' | 'pre-submitted' | 'case-study' | 'workshop';
  category: 'prevention' | 'treatment' | 'wellness' | 'mental-health';
  tags: string[];
  materials?: SessionMaterial[];
  isRegistered?: boolean;
}

export interface MedicalExpert {
  id: string;
  name: string;
  credentials: string;
  specialization: string[];
  rating: number;
  experience: string;
  languages: string[];
  bio?: string;
  photo?: string;
  availableTimeSlots?: TimeSlot[];
}

export interface SessionMaterial {
  type: 'document' | 'video' | 'audio' | 'link';
  title: string;
  url: string;
  description?: string;
  downloadable: boolean;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  timezone: string;
}

// ============================================================================
// MENTORSHIP TYPES
// ============================================================================

export interface MentorshipPair {
  id: string;
  mentor: CommunityUser;
  mentee: CommunityUser;
  startDate: Date;
  status: 'active' | 'paused' | 'completed' | 'ended';
  meetingFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  communicationPreference: 'chat' | 'voice' | 'video';
  goals: string[];
  progress: MentorshipProgress;
}

export interface MentorshipProgress {
  sessionsCompleted: number;
  goalsAchieved: number;
  totalGoals: number;
  satisfactionRating?: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
}

// ============================================================================
// COMMUNICATION TYPES
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  recipientId?: string; // for DMs
  groupId?: string; // for group messages
  content: string;
  type: 'text' | 'image' | 'voice' | 'system';
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  reactions: MessageReaction[];
  metadata?: MessageMetadata;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface MessageMetadata {
  emotionalTone?: 'positive' | 'neutral' | 'negative' | 'supportive';
  supportType?: 'emotional' | 'informational' | 'practical';
  crisisFlag?: boolean;
  moderatorReviewed?: boolean;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface CommunityAnalytics {
  userId: string;
  engagementMetrics: EngagementMetrics;
  wellbeingMetrics: WellbeingMetrics;
  supportMetrics: SupportMetrics;
  period: 'week' | 'month' | 'quarter' | 'year';
  generatedAt: Date;
}

export interface EngagementMetrics {
  sessionsPerWeek: number;
  messagesSent: number;
  messagesReceived: number;
  groupParticipation: number;
  expertSessionAttendance: number;
  averageSessionLength: number;
}

export interface WellbeingMetrics {
  anxietyTrend: 'improving' | 'stable' | 'worsening';
  stressLevelAverage: number;
  copingSkillsUsage: string[];
  supportSeekingBehavior: 'active' | 'moderate' | 'passive';
  emotionalStability: number;
}

export interface SupportMetrics {
  supportGiven: number;
  supportReceived: number;
  helpfulnessRating: number;
  mentorshipParticipation: boolean;
  crisisInterventions: number;
  professionalReferrals: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface CommunityNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType = 
  | 'group-invitation'
  | 'meeting-reminder'
  | 'expert-session'
  | 'mentorship-match'
  | 'support-request'
  | 'wellness-check'
  | 'achievement'
  | 'system-update';

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface CommunityEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  organizerId: string;
  participants: string[];
  maxParticipants?: number;
  isPublic: boolean;
  tags: string[];
  location?: EventLocation;
  materials?: SessionMaterial[];
}

export type EventType = 
  | 'group-meeting'
  | 'expert-session'
  | 'wellness-workshop'
  | 'peer-support'
  | 'educational-webinar'
  | 'community-gathering';

export interface EventLocation {
  type: 'online' | 'in-person' | 'hybrid';
  url?: string; // for online events
  address?: string; // for in-person events
  platform?: string; // Zoom, Teams, etc.
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  version: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'date' | 'popularity' | 'rating';
  sortOrder?: 'asc' | 'desc';
}