import { describe, it, expect } from 'vitest';
import { ConsentExporter, ConsentRecord } from '@/lib/compliance/consentExport';

describe('ConsentExporter', () => {
  const exporter = new ConsentExporter();

  const mockRecord: ConsentRecord = {
    id: '123',
    contact_email: 'test@example.com',
    contact_name: 'Test User',
    type: 'marketing',
    status: 'active',
    jurisdiction: 'CA-ON',
    purpose: 'Newsletter',
    granted_at: '2023-01-01T00:00:00Z',
    ip_address: '127.0.0.1',
    user_agent: 'Mozilla/5.0',
    channel: 'web',
    created_at: '2023-01-01T00:00:00Z',
  };

  describe('validateConsentProof', () => {
    it('should return valid true and no missing/warnings for a complete record', () => {
      const result = exporter.validateConsentProof(mockRecord);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should return valid false when required fields are missing', () => {
      const incompleteRecord = { ...mockRecord, granted_at: '', purpose: '' };
      const result = exporter.validateConsentProof(incompleteRecord as any);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain('granted_at');
      expect(result.missing).toContain('purpose');
    });

    it('should return warnings when recommended fields are missing', () => {
      const recordWithWarnings = {
        ...mockRecord,
        ip_address: undefined,
        user_agent: undefined,
        channel: undefined
      };
      const result = exporter.validateConsentProof(recordWithWarnings as any);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('ip_address_recommended_for_audit');
      expect(result.warnings).toContain('user_agent_recommended');
      expect(result.warnings).toContain('channel_recommended');
    });

    it('should handle both missing fields and warnings simultaneously', () => {
      const veryIncompleteRecord = {
        ...mockRecord,
        granted_at: '',
        ip_address: undefined
      };
      const result = exporter.validateConsentProof(veryIncompleteRecord as any);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain('granted_at');
      expect(result.warnings).toContain('ip_address_recommended_for_audit');
    });

    it('should treat empty strings as missing/warnings', () => {
       const emptyFieldsRecord = {
         ...mockRecord,
         granted_at: '',
         purpose: '',
         ip_address: '',
         user_agent: '',
         channel: ''
       };
       const result = exporter.validateConsentProof(emptyFieldsRecord as any);

       expect(result.valid).toBe(false);
       expect(result.missing).toEqual(['granted_at', 'purpose']);
       expect(result.warnings).toEqual([
         'ip_address_recommended_for_audit',
         'user_agent_recommended',
         'channel_recommended'
       ]);
    });
  });
});
