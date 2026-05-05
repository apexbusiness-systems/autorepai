import { describe, expect, it } from 'vitest';
import { getCompliantEmailFooter, type DealershipInfo } from '../../../src/lib/compliance/emailTemplates';

describe('getCompliantEmailFooter', () => {
  const mockDealership: DealershipInfo = {
    name: 'Test Motors',
    street: '123 Main St',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5V 2N2',
    phone: '416-555-0199',
    email: 'info@testmotors.ca',
    dealerLicense: 'DL123456'
  };

  const leadId = 'lead_789';
  const consentId = 'consent_456';
  const consentDateStr = '2023-10-27';

  it('renders full dealership information including license', () => {
    const footer = getCompliantEmailFooter(mockDealership, leadId, consentId, consentDateStr);

    expect(footer).toContain('Test Motors');
    expect(footer).toContain('123 Main St, Toronto, ON M5V 2N2');
    expect(footer).toContain('Phone: 416-555-0199 | Email: info@testmotors.ca');
    expect(footer).toContain('Dealer License: DL123456');
  });

  it('omits license text when dealerLicense is not provided', () => {
    const { dealerLicense: _, ...dealershipWithoutLicense } = mockDealership;
    const footer = getCompliantEmailFooter(dealershipWithoutLicense, leadId, consentId, consentDateStr);

    expect(footer).not.toContain('Dealer License:');
  });

  it('correctly constructs unsubscribe and preferences URLs with default appUrl', () => {
    const footer = getCompliantEmailFooter(mockDealership, leadId, consentId, consentDateStr);

    const expectedUnsubscribeUrl = `https://autorepai.app/api/unsubscribe?token=${consentId}&lead=${leadId}`;
    const expectedPreferencesUrl = `https://autorepai.app/preferences?lead=${leadId}`;

    expect(footer).toContain(expectedUnsubscribeUrl);
    expect(footer).toContain(expectedPreferencesUrl);
  });

  it('correctly constructs URLs with custom appUrl', () => {
    const customAppUrl = 'https://custom.dealership.com';
    const footer = getCompliantEmailFooter(mockDealership, leadId, consentId, consentDateStr, customAppUrl);

    expect(footer).toContain(`${customAppUrl}/api/unsubscribe?token=${consentId}&lead=${leadId}`);
    expect(footer).toContain(`${customAppUrl}/preferences?lead=${leadId}`);
  });

  it('includes consent information and compliance statement', () => {
    const footer = getCompliantEmailFooter(mockDealership, leadId, consentId, consentDateStr);

    expect(footer).toContain(`You're receiving this email because you opted in on ${consentDateStr}`);
    expect(footer).toContain(`Consent ID: ${consentId}`);
    expect(footer).toContain("This message complies with Canada's Anti-Spam Legislation (CASL) and CAN-SPAM regulations.");
  });
});
