export type HelpCategory =
  | 'Medis & Darurat'
  | 'Sembako'
  | 'Peminjaman Alat'
  | 'Tenaga Relawan';

export type HelpStatus = 'menunggu' | 'selesai';

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: HelpCategory;
  location: string;
  status: HelpStatus;
  user_id: string;
  contact: string;
  helper_id: string | null;
  created_at: string;
  updated_at: string;
  requester_name?: string | null;
}

export interface VolunteerHelpResponse {
  success: boolean;
  message: string;
  contact?: string;
  title?: string;
  location?: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      help_requests: {
        Row: HelpRequest;
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: HelpCategory;
          location: string;
          status?: HelpStatus;
          user_id: string;
          contact: string;
          helper_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: HelpCategory;
          location?: string;
          status?: HelpStatus;
          user_id?: string;
          contact?: string;
          helper_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      help_requests_view: {
        Row: HelpRequest;
        Relationships: [];
      };
    };
    Functions: {
      volunteer_help: {
        Args: {
          p_request_id: string;
        };
        Returns: {
          success: boolean;
          message: string;
          contact?: string;
          title?: string;
          location?: string;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

