import { describe, expect, it } from 'vitest';
import { z } from 'zod';

// Recreate the schema for isolated testing
const leadSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  consentMarketing: z.boolean().refine((val) => val, {
    message: 'Consent is required for marketing outreach'
  })
});

type LeadFormValues = z.infer<typeof leadSchema>;

describe('Lead Capture Form Schema Validation', () => {
  describe('fullName validation', () => {
    it('accepts valid names with 2+ characters', () => {
      const result = leadSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('accepts minimum valid name (2 chars)', () => {
      const result = leadSchema.safeParse({
        fullName: 'Jo',
        email: 'jo@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('rejects single character names', () => {
      const result = leadSchema.safeParse({
        fullName: 'J',
        email: 'j@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Full name is required');
      }
    });

    it('rejects empty name', () => {
      const result = leadSchema.safeParse({
        fullName: '',
        email: 'test@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(false);
    });

    it('accepts names with special characters', () => {
      const result = leadSchema.safeParse({
        fullName: "Mary O'Connor-Smith",
        email: 'mary@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('accepts names with unicode characters', () => {
      const result = leadSchema.safeParse({
        fullName: 'José García',
        email: 'jose@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('accepts standard email format', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('accepts email with subdomain', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test@mail.example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('accepts email with plus addressing', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test+tag@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('rejects email without @', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'testexample.com',
        consentMarketing: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valid email required');
      }
    });

    it('rejects email without domain', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test@',
        consentMarketing: true
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty email', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: '',
        consentMarketing: true
      });
      expect(result.success).toBe(false);
    });

    it('rejects email with spaces', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test @example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(false);
    });
  });

  describe('consentMarketing validation (CASL/TCPA Compliance)', () => {
    it('accepts when consent is true', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test@example.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('rejects when consent is false (compliance requirement)', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test@example.com',
        consentMarketing: false
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Consent is required for marketing outreach');
      }
    });

    it('rejects when consent is missing', () => {
      const result = leadSchema.safeParse({
        fullName: 'Test User',
        email: 'test@example.com'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Complete form validation', () => {
    it('accepts valid complete form', () => {
      const validData: LeadFormValues = {
        fullName: 'John Smith',
        email: 'john.smith@dealership.com',
        consentMarketing: true
      };
      const result = leadSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('rejects completely empty form', () => {
      const result = leadSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });

    it('collects all validation errors', () => {
      const result = leadSchema.safeParse({
        fullName: '',
        email: 'invalid',
        consentMarketing: false
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        // Should have errors for all three fields
        const paths = result.error.issues.map(i => i.path[0]);
        expect(paths).toContain('fullName');
        expect(paths).toContain('email');
        expect(paths).toContain('consentMarketing');
      }
    });
  });

  describe('Real-world dealership scenarios', () => {
    it('accepts typical Canadian customer lead', () => {
      const result = leadSchema.safeParse({
        fullName: 'Jean-Pierre Tremblay',
        email: 'jp.tremblay@gmail.com',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('accepts business email lead', () => {
      const result = leadSchema.safeParse({
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@company.ca',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });

    it('accepts lead with dealership-domain email', () => {
      const result = leadSchema.safeParse({
        fullName: 'Mike Wilson',
        email: 'mwilson@autorepai.ca',
        consentMarketing: true
      });
      expect(result.success).toBe(true);
    });
  });
});
