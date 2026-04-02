export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'dealer_admin'
  | 'sales_manager'
  | 'sales_rep'
  | 'finance_manager'
  | 'viewer';

export interface Organization {
  id: string;
  name: string;
  jurisdiction: string;
  timezone: string;
}

export interface Dealership {
  id: string;
  organizationId: string;
  name: string;
  license: string;
  contactEmail: string;
}

export interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
  intent_score: number;
  dealership_id?: string;
  consent_marketing: boolean;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  vin: string;
  stock_number: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  mileage: number;
  status: 'available' | 'pending' | 'sold';
  dealership_id: string;
  image_url?: string;
  features?: string[];
  created_at: string;
}

export interface CreditApplication {
  id: string;
  lead_id: string;
  status: 'pending' | 'approved' | 'declined' | 'review';
  submitted_at: string;
  amount_requested: number;
  decision_notes?: string;
}
