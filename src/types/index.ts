export type Language = 'en' | 'te' | 'hi';

export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'DEMO';

export type FacilityCategory =
  | 'bathing_ghat'
  | 'hospital'
  | 'medical_camp'
  | 'drinking_water'
  | 'public_toilet'
  | 'police_station'
  | 'help_desk'
  | 'bus_stop'
  | 'parking_area'
  | 'food_assistance'
  | 'accessibility_assistance'
  | 'lost_found_desk';

export interface MultilingualText {
  en: string;
  te: string;
  hi: string;
}

export interface Facility {
  id: string;
  name: MultilingualText;
  category: FacilityCategory;
  description: MultilingualText;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  contactNumber?: string;
  availabilityStatus?: 'OPEN_24_7' | 'DAY_HOURS' | 'TEMPORARY_CAMP' | 'UNDER_MAINTENANCE';
  verificationStatus: VerificationStatus;
  source: string;
  isDemo: boolean;
  lastUpdated: string;
  accessibilityFeatures?: string[];
  capacityEstimated?: string;
}

export type AnnouncementCategory =
  | 'safety_alert'
  | 'route_advisory'
  | 'medical_info'
  | 'transport_update'
  | 'facility_update'
  | 'festival_info'
  | 'general';

export interface Announcement {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  category: AnnouncementCategory;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  publicationDate: string;
  expiryDate?: string;
  source: string;
  verificationStatus: VerificationStatus;
  isPublished: boolean;
  isDemo: boolean;
}

export interface FAQ {
  id: string;
  category: string;
  question: MultilingualText;
  answer: MultilingualText;
  source: string;
  verificationStatus: VerificationStatus;
  isDemo: boolean;
}

export interface SafetyGuideline {
  id: string;
  title: MultilingualText;
  content: MultilingualText;
  icon: string;
  category: 'river_safety' | 'crowd_management' | 'heat_health' | 'children_seniors' | 'lost_person' | 'emergency_contacts';
}

export interface LostFoundReport {
  id: string;
  type: 'LOST' | 'FOUND';
  itemCategory: string;
  title: string;
  description: string;
  approxLocation: string;
  date: string;
  contactName: string;
  contactInfo: string; // Private, visible only to authorized admin
  status: 'PENDING_REVIEW' | 'VERIFIED_BY_DESK' | 'RESOLVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  category: 'suggestion' | 'incorrect_info' | 'facility_feedback' | 'technical_issue' | 'general';
  message: string;
  contactInfo?: string;
  rating?: number;
  status: 'NEW' | 'REVIEWED' | 'ACTIONED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language: Language;
  sourceReference?: string;
  verificationStatus?: VerificationStatus;
  isFallback?: boolean;
}

export interface AnalyticsSummary {
  totalFacilities: number;
  verifiedFacilities: number;
  unverifiedFacilities: number;
  demoFacilities: number;
  categoryCounts: Record<string, number>;
  totalAnnouncements: number;
  publishedAnnouncements: number;
  announcementCategoryCounts: Record<string, number>;
  totalFeedback: number;
  feedbackStatusCounts: Record<string, number>;
  totalLostFound: number;
  pendingLostFound: number;
  totalFaqs: number;
}
