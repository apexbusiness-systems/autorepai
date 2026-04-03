import { supabase } from '@/integrations/supabase/client';

export interface ConsentRecord {
  id: string;
  contact_email: string;
  contact_name: string;
  type: string;
  status: string;
  jurisdiction: string;
  purpose: string;
  granted_at: string;
  withdrawn_at?: string;
  expires_at?: string;
  ip_address?: string;
  user_agent?: string;
  channel?: string;
  proof_url?: string;
  created_at: string;
}

export interface ExportOptions {
  organizationId: string;
  startDate: Date;
  endDate: Date;
  format: 'csv' | 'json';
}

export class ConsentExporter {
  async exportConsents(options: ExportOptions): Promise<Blob> {
    const { data: consents, error } = await supabase
      .from('consents')
      .select(`
        id, type, status, jurisdiction, purpose, granted_at, withdrawn_at,
        expires_at, ip_address, user_agent, channel, proof_url, created_at,
        lead_id,
        leads:lead_id ( email, first_name, last_name )
      `)
      .gte('created_at', options.startDate.toISOString())
      .lte('created_at', options.endDate.toISOString());

    if (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export consents');
    }

    const records: ConsentRecord[] = (consents || []).map((c: any) => ({
      id: c.id,
      contact_email: c.leads?.email || '',
      contact_name: `${c.leads?.first_name || ''} ${c.leads?.last_name || ''}`.trim(),
      type: c.type,
      status: c.status,
      jurisdiction: c.jurisdiction,
      purpose: c.purpose,
      granted_at: c.granted_at,
      withdrawn_at: c.withdrawn_at,
      expires_at: c.expires_at,
      ip_address: c.ip_address,
      user_agent: c.user_agent,
      channel: c.channel,
      proof_url: c.proof_url,
      created_at: c.created_at,
    }));

    if (options.format === 'csv') {
      return this.toCsv(records);
    } else {
      return this.toJson(records);
    }
  }

  private toCsv(records: ConsentRecord[]): Blob {
    const headers = [
      'ID', 'Contact Email', 'Contact Name', 'Consent Type', 'Status',
      'Jurisdiction', 'Purpose', 'Granted At', 'Withdrawn At', 'Expires At',
      'IP Address', 'User Agent', 'Channel', 'Proof URL', 'Created At'
    ];

    const rows = records.map(r => [
      r.id, r.contact_email, r.contact_name, r.type, r.status,
      r.jurisdiction, r.purpose, r.granted_at, r.withdrawn_at || '', r.expires_at || '',
      r.ip_address || '', r.user_agent || '', r.channel || '', r.proof_url || '', r.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  private toJson(records: ConsentRecord[]): Blob {
    const content = JSON.stringify({
      exportDate: new Date().toISOString(),
      recordCount: records.length,
      consents: records
    }, null, 2);

    return new Blob([content], { type: 'application/json;charset=utf-8;' });
  }

  validateConsentProof(record: ConsentRecord) {
    const missing: string[] = [];
    const warnings: string[] = [];

    if (!record.granted_at) missing.push('granted_at');
    if (!record.purpose) missing.push('purpose');

    if (!record.ip_address) warnings.push('ip_address_recommended_for_audit');
    if (!record.user_agent) warnings.push('user_agent_recommended');
    if (!record.channel) warnings.push('channel_recommended');

    return {
      valid: missing.length === 0,
      missing,
      warnings
    };
  }
}

export const consentExporter = new ConsentExporter();
