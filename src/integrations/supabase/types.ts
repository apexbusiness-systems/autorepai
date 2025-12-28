export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: { Row: { id: string; name: string; jurisdiction: string | null } };
      dealerships: { Row: { id: string; organization_id: string; name: string } };
      profiles: { Row: { id: string; email: string; organization_id: string | null } };
      user_roles: { Row: { id: string; user_id: string; role: string } };
      leads: { Row: { id: string; full_name: string; status: string } };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: 'super_admin' | 'org_admin' | 'dealer_admin' | 'sales_manager' | 'sales_rep' | 'finance_manager' | 'viewer';
    };
    CompositeTypes: {};
  };
};
