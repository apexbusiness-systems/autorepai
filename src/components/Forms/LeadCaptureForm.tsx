import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';

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
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log('Lead submitted', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full name</label>
        <input
          {...register('fullName')}
          className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
          placeholder="Alex Morgan"
        />
        {errors.fullName && <p className="text-xs text-red-300">{errors.fullName.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          {...register('email')}
          className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
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
