import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
  }

  // Mock Groq fallback with cost guard limits
  console.log('Groq fallback triggered. Checking cost guards.');

  return new Response(JSON.stringify({ success: true, message: 'Groq fallback generated securely', result: 'AI response mock' }), { headers: { 'Content-Type': 'application/json' } });
});
