-- Create order status enum
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    gateway_order_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway_payment_id TEXT UNIQUE,
    gateway_signature TEXT,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (customer_email = auth.jwt()->>'email' OR workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Public can create orders via edge function" ON orders
    FOR INSERT WITH CHECK (true);

-- Policies for order items
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_email = auth.jwt()->>'email' OR workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Public can create order items via edge function" ON order_items
    FOR INSERT WITH CHECK (true);

-- Policies for payments
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_email = auth.jwt()->>'email' OR workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Public can create payments via edge function" ON payments
    FOR INSERT WITH CHECK (true);

-- RPC for atomic inventory decrement and order completion
CREATE OR REPLACE FUNCTION confirm_order_payment(
    p_order_id UUID,
    p_payment_id TEXT,
    p_signature TEXT,
    p_amount DECIMAL
) RETURNS VOID AS $$
DECLARE
    v_item RECORD;
BEGIN
    -- 1. Update order status
    UPDATE orders SET status = 'paid' WHERE id = p_order_id;

    -- 2. Record payment
    INSERT INTO payments (order_id, gateway_payment_id, gateway_signature, amount, status)
    VALUES (p_order_id, p_payment_id, p_signature, p_amount, 'captured');

    -- 3. Decrement inventory (Increment sold count)
    FOR v_item IN SELECT ticket_type_id, quantity FROM order_items WHERE order_id = p_order_id LOOP
        UPDATE ticket_types 
        SET quantity_sold = quantity_sold + v_item.quantity
        WHERE id = v_item.ticket_type_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
