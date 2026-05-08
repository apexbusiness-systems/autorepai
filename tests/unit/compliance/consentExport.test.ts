import { describe, it, expect, beforeEach } from 'vitest';
import { ConsentExporter, ConsentRecord } from '../../../src/lib/compliance/consentExport';

describe('ConsentExporter', () => {
  let exporter: ConsentExporter;

  beforeEach(() => {
    exporter = new ConsentExporter();
  });

  describe('validateConsentProof', () => {
    const validRecord: ConsentRecord = {
      id: '1',
      contact_email: 'test@example.com',
      contact_name: 'Test User',
      type: 'marketing',
      status: 'granted',
      jurisdiction: 'CA-ON',
      purpose: 'Newsletters',
      granted_at: '2023-01-01T00:00:00Z',
      ip_address: '127.0.0.1',
      user_agent: 'Mozilla/5.0',
      channel: 'web',
      created_at: '2023-01-01T00:00:00Z'
    };

    it('should return valid: true for a complete record', () => {
      const result = exporter.validateConsentProof(validRecord);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should return valid: false when granted_at is missing', () => {
      // @ts-expect-error - testing missing required field
      const record: ConsentRecord = { ...validRecord, granted_at: '' };
      const result = exporter.validateConsentProof(record);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('granted_at');
    });

    it('should return valid: false when purpose is missing', () => {
      // @ts-expect-error - testing missing required field
      const record: ConsentRecord = { ...validRecord, purpose: '' };
      const result = exporter.validateConsentProof(record);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('purpose');
    });

    it('should return warnings when recommended fields are missing', () => {
      const record: ConsentRecord = {
        ...validRecord,
        ip_address: undefined,
        user_agent: undefined,
        channel: undefined
      };
      const result = exporter.validateConsentProof(record);
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('ip_address_recommended_for_audit');
      expect(result.warnings).toContain('user_agent_recommended');
      expect(result.warnings).toContain('channel_recommended');
    });

    it('should handle multiple missing and warning fields', () => {
      // @ts-expect-error - testing missing required field
      const record: ConsentRecord = {
        ...validRecord,
        granted_at: '',
        ip_address: undefined
      };
      const result = exporter.validateConsentProof(record);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('granted_at');
      expect(result.warnings).toContain('ip_address_recommended_for_audit');
    });
  });
});
