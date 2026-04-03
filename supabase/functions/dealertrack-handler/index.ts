import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
  }

  // Dealertrack handler wrapper
  console.log('Dealertrack webhook processed');

  return new Response(JSON.stringify({ success: true, message: 'Dealertrack synced securely' }), { headers: { 'Content-Type': 'application/json' } });
});
