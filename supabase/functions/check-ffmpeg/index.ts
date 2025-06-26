import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simulate a successful FFMPEG check for the web application
    // The actual FFMPEG check happens in the n8n workflow
    return new Response(
      JSON.stringify({ 
        installed: true, 
        version: "ffmpeg version simulated (for web app only)" 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in check-ffmpeg function:', error);
    
    return new Response(
      JSON.stringify({ 
        installed: false, 
        error: error.message || 'Failed to check FFMPEG' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});