export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: { Row: { id: string; name: string; jurisdiction: string | null } };
      dealerships: { Row: { id: string; organization_id: string; name: string } };
      profiles: { Row: { id: string; email: string; organization_id: string | null } };
      user_roles: { Row: { id: string; user_id: string; role: string } };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          status: string;
          consent_marketing: boolean;
          intent_score: number;
          created_at: string;
        };
        Insert: {
          full_name: string;
          email: string;
          status?: string;
          consent_marketing: boolean;
          intent_score?: number;
        };
      };
      inventory: {
        Row: {
          id: string;
          vin: string;
          stock_number: string;
          year: number;
          make: string;
          model: string;
          price: number;
          status: string;
          image_url: string | null;
        }
      };
      credit_applications: {
        Row: {
          id: string;
          lead_id: string;
          status: string;
          amount_requested: number;
          submitted_at: string;
        }
      }
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: 'super_admin' | 'org_admin' | 'dealer_admin' | 'sales_manager' | 'sales_rep' | 'finance_manager' | 'viewer';
    };
    CompositeTypes: {};
  };
};
