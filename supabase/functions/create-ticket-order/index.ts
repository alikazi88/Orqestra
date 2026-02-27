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
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const raisePayKeyId = Deno.env.get('RAZORPAY_KEY_ID') ?? '';
        const razorpaySecret = Deno.env.get('RAZORPAY_SECRET') ?? '';

        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

        const { eventId, items, customerName, customerEmail } = await req.json();

        // 1. Validate items and inventory
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const { data: ticketType, error: ticketError } = await supabaseClient
                .from('ticket_types')
                .select('*')
                .eq('id', item.ticketTypeId)
                .single();

            if (ticketError || !ticketType) {
                throw new Error(`Ticket type ${item.ticketTypeId} not found`);
            }

            const remaining = ticketType.quantity_total - ticketType.quantity_sold;
            if (remaining < item.quantity) {
                throw new Error(`Insufficient inventory for ${ticketType.name}`);
            }

            totalAmount += ticketType.price * item.quantity;
            orderItems.push({
                ticket_type_id: ticketType.id,
                quantity: item.quantity,
                unit_price: ticketType.price
            });
        }

        // 2. Create Razorpay Order
        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${raisePayKeyId}:${razorpaySecret}`)}`
            },
            body: JSON.stringify({
                amount: totalAmount * 100, // Razorpay expects amount in paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            })
        });

        const razorpayOrder = await razorpayResponse.json();

        if (!razorpayResponse.ok) {
            throw new Error(razorpayOrder.error?.description || 'Failed to create Razorpay order');
        }

        // 3. Create Order in Supabase
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .insert([{
                workspace_id: items[0].workspaceId, // Assumes same workspace for all items
                event_id: eventId,
                customer_name: customerName,
                customer_email: customerEmail,
                total_amount: totalAmount,
                gateway_order_id: razorpayOrder.id,
                status: 'pending'
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 4. Create Order Items
        const { error: itemsError } = await supabaseClient
            .from('order_items')
            .insert(orderItems.map(item => ({
                ...item,
                order_id: order.id
            })));

        if (itemsError) throw itemsError;

        return new Response(
            JSON.stringify({
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                dbOrderId: order.id
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
