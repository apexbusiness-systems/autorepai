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
