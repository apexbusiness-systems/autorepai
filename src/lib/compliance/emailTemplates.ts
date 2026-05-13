export interface DealershipInfo {
  name: string;
  street: string;
  city: string;
  provinceOrState: string;
  postalCode: string;
  phone: string;
  email: string;
  dealerLicense?: string;
}

export function getCompliantEmailFooter(
  dealership: DealershipInfo,
  leadId: string,
  consentId: string,
  consentDateStr: string,
  appUrl: string = 'https://autorepai.app'
): string {
  const licenseText = dealership.dealerLicense
    ? `<p>Dealer License: ${dealership.dealerLicense}</p>`
    : '';

  return `
<footer style="background: #f5f5f5; padding: 20px; border-top: 2px solid #ddd; font-family: sans-serif; font-size: 12px; color: #333;">
  <p><strong>${dealership.name}</strong></p>
  <p>${dealership.street}, ${dealership.city}, ${dealership.provinceOrState} ${dealership.postalCode}</p>
  <p>Phone: ${dealership.phone} | Email: ${dealership.email}</p>
  ${licenseText}

  <p style="margin: 15px 0;">
    <a href="${appUrl}/api/unsubscribe?token=${consentId}&lead=${leadId}" style="color: #0066cc;">
      Unsubscribe
    </a> |
    <a href="${appUrl}/preferences?lead=${leadId}" style="color: #0066cc;">
      Update Preferences
    </a>
  </p>

  <p style="font-size: 10px; color: #666; margin-top: 15px;">
    You're receiving this email because you opted in on ${consentDateStr}.
    Consent ID: ${consentId}
  </p>

  <p style="font-size: 10px; color: #666;">
    This message complies with Canada's Anti-Spam Legislation (CASL) and CAN-SPAM regulations.
  </p>
</footer>
  `;
}
