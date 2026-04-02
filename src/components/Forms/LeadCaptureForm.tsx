import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { supabase } from '../../integrations/supabase/client';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const leadSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  consentMarketing: z.boolean().refine((val) => val, {
    message: 'Consent is required for marketing outreach'
  })
});

type LeadFormValues = z.infer<typeof leadSchema>;

const LeadCaptureForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema)
  });

  const onSubmit = async (data: LeadFormValues) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        await supabase.from('leads').insert({
          full_name: data.fullName,
          email: data.email,
          consent_marketing: data.consentMarketing,
          status: 'new',
          intent_score: Math.floor(Math.random() * 50) + 50 // Mocking intent score analysis
        });
      } else {
        // Mock success for pitch if no DB connected
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Error capturing lead:', error);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300">Full name</label>
          <Input
            {...register('fullName')}
            className="bg-black border-slate-800 focus-visible:ring-brand-500 mt-1"
            placeholder="Alex Morgan"
          />
          {errors.fullName && <p className="text-xs text-brand-500 mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Email</label>
          <Input
            {...register('email')}
            className="bg-black border-slate-800 focus-visible:ring-brand-500 mt-1"
            placeholder="alex@dealership.com"
          />
          {errors.email && <p className="text-xs text-brand-500 mt-1">{errors.email.message}</p>}
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm transition-colors hover:border-brand-500/50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('consentMarketing')}
              className="mt-1 h-4 w-4 rounded border-slate-700 bg-black text-brand-500 focus:ring-brand-500"
            />
            <span className="text-slate-300">
              I consent to marketing outreach in compliance with CASL and TCPA requirements.
            </span>
          </label>
          {errors.consentMarketing && (
            <p className="text-xs text-brand-500 mt-2">{errors.consentMarketing.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-500 hover:bg-brand-600 text-black font-semibold h-12 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-500/20"
        >
          {isSubmitting ? 'Capturing Lead...' : 'Capture Lead & Analyze Intent'}
        </Button>
      </form>

      {isSuccess && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg animate-fade-in-up z-10">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-brand-500 mx-auto mb-2" />
            <p className="font-semibold text-white">Lead Captured</p>
            <p className="text-sm text-slate-400">AMVIC consent logged</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadCaptureForm;
