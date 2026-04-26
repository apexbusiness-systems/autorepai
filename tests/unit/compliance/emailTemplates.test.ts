import { describe, it, expect } from 'vitest';
import { getCompliantEmailFooter, DealershipInfo } from '../../../src/lib/compliance/emailTemplates';

describe('getCompliantEmailFooter', () => {
  const mockDealership: DealershipInfo = {
    name: 'Test Motors',
    street: '123 Main St',
    city: 'Testville',
    provinceOrState: 'TS',
    postalCode: 'A1B 2C3',
    phone: '555-0123',
    email: 'contact@testmotors.com',
    dealerLicense: 'DL-123456'
  };

  const leadId = 'lead_789';
  const consentId = 'consent_abc';
  const consentDateStr = '2023-10-27';

  it('renders correctly with all fields including dealer license', () => {
    const result = getCompliantEmailFooter(mockDealership, leadId, consentId, consentDateStr);

    expect(result).toContain('Test Motors');
    expect(result).toContain('123 Main St, Testville, TS A1B 2C3');
    expect(result).toContain('Phone: 555-0123 | Email: contact@testmotors.com');
    expect(result).toContain('Dealer License: DL-123456');
    expect(result).toContain('https://autorepai.app/api/unsubscribe?token=consent_abc&lead=lead_789');
    expect(result).toContain('https://autorepai.app/preferences?lead=lead_789');
    expect(result).toContain("You're receiving this email because you opted in on 2023-10-27.");
    expect(result).toContain('Consent ID: consent_abc');
    expect(result).toContain("Canada's Anti-Spam Legislation (CASL)");
  });

  it('renders correctly without dealer license', () => {
    const dealershipNoLicense = { ...mockDealership, dealerLicense: undefined };
    const result = getCompliantEmailFooter(dealershipNoLicense, leadId, consentId, consentDateStr);

    expect(result).not.toContain('Dealer License:');
  });

  it('uses custom appUrl when provided', () => {
    const customUrl = 'https://custom-dealership.com';
    const result = getCompliantEmailFooter(mockDealership, leadId, consentId, consentDateStr, customUrl);

    expect(result).toContain(`${customUrl}/api/unsubscribe?token=${consentId}&lead=${leadId}`);
    expect(result).toContain(`${customUrl}/preferences?lead=${leadId}`);
  });

  it('uses default appUrl when not provided', () => {
    const result = getCompliantEmailFooter(mockDealership, leadId, consentId, consentDateStr);
    expect(result).toContain('https://autorepai.app/api/unsubscribe');
  });
});
