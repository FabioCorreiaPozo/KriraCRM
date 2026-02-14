
export enum Sender {
  USER = 'user',
  AI = 'ai',
  CLIENT = 'client'
}

export enum Channel {
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram'
}

export enum UserRole {
  ADMIN = 'admin',
  ATTENDANT = 'attendant'
}

export interface User {
  id: string;
  company_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  api_key: string;
}

export interface AISettings {
  id: string;
  company_id: string;
  ai_name: string;
  ai_tone: string;
  ai_behavior_prompt: string;
  max_discount_percent: number;
  active: boolean;
  birthday_automation_active: boolean;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
  images?: string[]; // Base64 or URL strings, max 6
}

export interface KanbanStage {
  id: string;
  company_id: string;
  name: string;
  order_position: number;
  is_fixed?: boolean;
}

export interface InstagramPost {
  id: string;
  type: 'post' | 'story';
  thumbnail_url: string;
  caption: string;
  created_at: string;
  custom_instruction?: string;
  auto_reply_active: boolean;
}

export interface ScheduledPost {
  id: string;
  product_id: string;
  scheduled_at: string; // ISO string
  caption: string;
  status: 'pending' | 'posted' | 'failed';
}

export interface Lead {
  id: string;
  company_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  birthday?: string; // YYYY-MM-DD
  instagram_id?: string;
  source: Channel;
  stage_id: string;
  assigned_to?: string;
  last_message_at: string;
  is_human_takeover: boolean;
  interest_product?: string;
}

export interface Message {
  id: string;
  lead_id: string;
  sender: Sender;
  content: string;
  timestamp: string;
  channel: Channel;
  sender_user_id?: string;
}

export interface DashboardStats {
  totalLeads: number;
  conversionRate: number;
  aiResponseRate: number;
  avgResponseTime: string;
  leadsPerStage: Record<string, number>;
  attendantStats: AttendantStat[];
}

export interface AttendantStat {
  name: string;
  totalServices: number;
  totalClosings: number;
}
