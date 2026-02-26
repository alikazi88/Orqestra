-- Orqestra Initial Schema Migration
-- Standard: every table has created_at, updated_at, and workspace_id (except workspaces table)

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create workspaces table (Tenant root)
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    brand_profile JSONB DEFAULT '{}'::jsonb,
    subscription_tier TEXT DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'growth', 'scale', 'enterprise')),
    settings JSONB DEFAULT '{}'::jsonb
);

-- 3. Create users table (Profiles and Roles)
-- Linked to Supabase Auth users
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'team_member' CHECK (role IN ('workspace_owner', 'event_director', 'team_member', 'vendor', 'sponsor')),
    preferences JSONB DEFAULT '{}'::jsonb,
    phone_number TEXT
);

-- 4. Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    date_start TIMESTAMP WITH TIME ZONE,
    date_end TIMESTAMP WITH TIME ZONE,
    city TEXT NOT NULL,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'event_day', 'completed', 'archived')),
    budget_estimated NUMERIC(15, 2) DEFAULT 0,
    health_score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. Create venues table
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    tier TEXT CHECK (tier IN ('1A', '1B', '2')),
    capacity INTEGER,
    vibe_tags TEXT[],
    pricing_min NUMERIC(15, 2),
    pricing_max NUMERIC(15, 2),
    amenities TEXT[],
    photos TEXT[],
    location_data JSONB DEFAULT '{}'::jsonb
);

-- 6. Create vendors table
CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL, -- Global marketplace vendors might have NULL workspace_id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    tier TEXT CHECK (tier IN ('1A', '1B', '2')),
    risk_score INTEGER DEFAULT 0,
    portfolio JSONB DEFAULT '{}'::jsonb,
    pricing_packages JSONB DEFAULT '[]'::jsonb,
    city TEXT NOT NULL,
    verified BOOLEAN DEFAULT false
);

-- 7. Create contracts table
CREATE TABLE public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    file_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_sign', 'signed', 'cancelled')),
    payment_schedule JSONB DEFAULT '[]'::jsonb
);

-- 8. Create guests table
CREATE TABLE public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    tier TEXT DEFAULT 'general' CHECK (tier IN ('vip', 'trade', 'press', 'general')),
    dietary TEXT,
    rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined', 'waitlisted')),
    check_in_time TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 9. Create budget_lines table
CREATE TABLE public.budget_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    estimated NUMERIC(15, 2) DEFAULT 0,
    committed NUMERIC(15, 2) DEFAULT 0,
    actual NUMERIC(15, 2) DEFAULT 0,
    gst_rate NUMERIC(5, 2) DEFAULT 0,
    tds_rate NUMERIC(5, 2) DEFAULT 0
);

-- 10. Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'blocked', 'done')),
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    dependencies UUID[] DEFAULT '{}'::uuid[]
);

-- 11. Create run_sheet_items table
CREATE TABLE public.run_sheet_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    title TEXT NOT NULL,
    owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'delayed', 'critical')),
    notes TEXT
);

-- 12. Row Level Security (RLS) Setup

-- Enable RLS on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.run_sheet_items ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current user's workspace_id
-- This assumes the JWT contains a workspace_id claim, or we fetch it from the users table.
-- For multi-tenancy, it's safer to check the users table link.
CREATE OR REPLACE FUNCTION get_user_workspace_id()
RETURNS UUID AS $$
  SELECT workspace_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Workspace Isolation Policy Template
-- Users can only see data belonging to their workspace_id

CREATE POLICY workspace_isolation_policy ON public.workspaces
FOR ALL USING (id = get_user_workspace_id());

CREATE POLICY user_workspace_isolation_policy ON public.users
FOR ALL USING (workspace_id = get_user_workspace_id());

CREATE POLICY event_workspace_isolation_policy ON public.events
FOR ALL USING (workspace_id = get_user_workspace_id());

CREATE POLICY vendor_workspace_isolation_policy ON public.vendors
FOR ALL USING (workspace_id = get_user_workspace_id() OR workspace_id IS NULL); -- Global vendors are visible

CREATE POLICY contract_workspace_isolation_policy ON public.contracts
FOR ALL USING (workspace_id = get_user_workspace_id());

CREATE POLICY guest_workspace_isolation_policy ON public.guests
FOR ALL USING (workspace_id = get_user_workspace_id());

CREATE POLICY budget_workspace_isolation_policy ON public.budget_lines
FOR ALL USING (workspace_id = get_user_workspace_id());

CREATE POLICY task_workspace_isolation_policy ON public.tasks
FOR ALL USING (workspace_id = get_user_workspace_id());

CREATE POLICY run_sheet_workspace_isolation_policy ON public.run_sheet_items
FOR ALL USING (workspace_id = get_user_workspace_id());

-- Venues are global but potentially restricted?
-- For now, visible to all authenticated users.
CREATE POLICY venue_visibility_policy ON public.venues
FOR SELECT USING (auth.role() = 'authenticated');
