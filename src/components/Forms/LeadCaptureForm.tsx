import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { supabase } from '@/integrations/supabase/client';

const leadSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  consentMarketing: z.boolean().refine((val) => val, {
    message: 'Consent is required for marketing outreach'
  })
});

type LeadFormValues = z.infer<typeof leadSchema>;

const LeadCaptureForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema)
  });

  const onSubmit = async (data: LeadFormValues) => {
    // Remove artificial 400ms delay for performance optimization
    const { error } = await supabase.from('leads').insert({
      full_name: data.fullName,
      status: 'new'
    });

    // TODO: The 'leads' table schema currently only supports 'id', 'full_name', and 'status'.
    // Once the schema is updated to include 'email' and 'marketing_consent', they should be persisted here:
    // email: data.email,
    // marketing_consent: data.consentMarketing

    if (error) {
      console.error('Error saving lead:', error);
      // Optional: Handle error UI state if needed
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full name</label>
        <Input
          {...register('fullName')}
          className="bg-slate-900"
          placeholder="Alex Morgan"
        />
        {errors.fullName && <p className="text-xs text-red-300">{errors.fullName.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          {...register('email')}
          className="bg-slate-900"
          placeholder="alex@dealership.com"
        />
        {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
      </div>
      <div className="rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            {...register('consentMarketing')}
            className="mt-1"
          />
          <span>
            I consent to marketing outreach in compliance with CASL and TCPA requirements.
          </span>
        </label>
        {errors.consentMarketing && (
          <p className="text-xs text-red-300">{errors.consentMarketing.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Capture lead'}
      </Button>
    </form>
  );
};

export default LeadCaptureForm;
