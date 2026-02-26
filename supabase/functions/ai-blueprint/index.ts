import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { title, type, budget, guestCount, city, date, workspaceId } = await req.json()

        // 1. Fetch Workspace Context (Brand profile, typical budget)
        const { data: workspace } = await supabaseClient
            .from('workspaces')
            .select('*')
            .eq('id', workspaceId)
            .single()

        // 2. Construct AI Prompt
        // In a real app, you would call Claude/Gemini here.
        // We'll simulate a high-quality response.

        const blueprint = {
            summary: `A high-impact ${type} event in ${city} for ${guestCount} guests.`,
            tasks: [
                { title: 'Secure Venue in ' + city, priority: 'critical', daysOffset: -90 },
                { title: 'Finalize F&B Menu', priority: 'medium', daysOffset: -45 },
                { title: 'Send Speaker/Artist Invites', priority: 'high', daysOffset: -60 },
                { title: 'Launch Early Bird Tickets', priority: 'high', daysOffset: -75 },
            ],
            budgetLines: [
                { category: 'Venue & Infrastructure', estimated: parseFloat(budget) * 0.4 },
                { category: 'Food & Beverage', estimated: parseFloat(budget) * 0.25 },
                { category: 'Marketing & PR', estimated: parseFloat(budget) * 0.15 },
                { category: 'Tech & AV', estimated: parseFloat(budget) * 0.2 },
            ],
            runSheet: [
                { time: '08:00', title: 'On-site Team Briefing' },
                { time: '09:00', title: 'Doors Open & Registration' },
                { time: '10:00', title: 'Keynote Session' },
                { time: '13:00', title: 'Lunch Networking' },
            ]
        }

        return new Response(
            JSON.stringify(blueprint),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
