import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { HmacSha256 } from "https://deno.land/std@0.160.0/hash/sha256.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const razorpaySecret = Deno.env.get('RAZORPAY_SECRET') ?? '';

        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

        const { razorpayPaymentId, razorpayOrderId, razorpaySignature, dbOrderId } = await req.json();

        // 1. Verify Signature
        const text = `${razorpayOrderId}|${razorpayPaymentId}`;
        const hmac = new HmacSha256(razorpaySecret);
        hmac.update(text);
        const generatedSignature = hmac.toString();

        if (generatedSignature !== razorpaySignature) {
            // Log failure and update order
            await supabaseClient
                .from('orders')
                .update({ status: 'failed' })
                .eq('id', dbOrderId);

            throw new Error('Invalid payment signature');
        }

        // 2. Fetch Order Details for RPC
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .select('total_amount')
            .eq('id', dbOrderId)
            .single();

        if (orderError || !order) throw new Error('Order not found');

        // 3. Confirm Payment and Update Inventory via RPC
        const { error: rpcError } = await supabaseClient.rpc('confirm_order_payment', {
            p_order_id: dbOrderId,
            p_payment_id: razorpayPaymentId,
            p_signature: razorpaySignature,
            p_amount: order.total_amount
        });

        if (rpcError) throw rpcError;

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
