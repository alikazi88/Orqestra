export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            budget_lines: {
                Row: {
                    actual: number | null
                    category: string
                    committed: number | null
                    created_at: string
                    description: string | null
                    estimated: number | null
                    event_id: string
                    gst_rate: number | null
                    id: string
                    tds_rate: number | null
                    updated_at: string
                    workspace_id: string
                }
                Insert: {
                    actual?: number | null
                    category: string
                    committed?: number | null
                    created_at?: string
                    description?: string | null
                    estimated?: number | null
                    event_id: string
                    gst_rate?: number | null
                    id?: string
                    tds_rate?: number | null
                    updated_at?: string
                    workspace_id: string
                }
                Update: {
                    actual?: number | null
                    category?: string
                    committed?: number | null
                    created_at?: string
                    description?: string | null
                    estimated?: number | null
                    event_id?: string
                    gst_rate?: number | null
                    id?: string
                    tds_rate?: number | null
                    updated_at?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "budget_lines_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "budget_lines_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contracts: {
                Row: {
                    created_at: string
                    event_id: string
                    file_url: string | null
                    id: string
                    payment_schedule: Json | null
                    status: string | null
                    updated_at: string
                    vendor_id: string | null
                    workspace_id: string
                }
                Insert: {
                    created_at?: string
                    event_id: string
                    file_url?: string | null
                    id?: string
                    payment_schedule?: Json | null
                    status?: string | null
                    updated_at?: string
                    vendor_id?: string | null
                    workspace_id: string
                }
                Update: {
                    created_at?: string
                    event_id?: string
                    file_url?: string | null
                    id?: string
                    payment_schedule?: Json | null
                    status?: string | null
                    updated_at?: string
                    vendor_id?: string | null
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contracts_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contracts_vendor_id_fkey"
                        columns: ["vendor_id"]
                        isOneToOne: false
                        referencedRelation: "vendors"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contracts_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            dispatch_messages: {
                Row: {
                    content: string
                    created_at: string
                    event_id: string | null
                    id: string
                    type: string
                    user_id: string | null
                    workspace_id: string
                }
                Insert: {
                    content: string
                    created_at?: string
                    event_id?: string | null
                    id?: string
                    type?: string
                    user_id?: string | null
                    workspace_id: string
                }
                Update: {
                    content?: string
                    created_at?: string
                    event_id?: string | null
                    id?: string
                    type?: string
                    user_id?: string | null
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "dispatch_messages_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "dispatch_messages_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "dispatch_messages_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            events: {
                Row: {
                    branding: Json | null
                    budget_estimated: number | null
                    city: string
                    created_at: string
                    date_end: string | null
                    date_start: string | null
                    health_score: number | null
                    id: string
                    metadata: Json | null
                    slug: string | null
                    status: string | null
                    title: string
                    type: string
                    updated_at: string
                    workspace_id: string
                }
                Insert: {
                    branding?: Json | null
                    budget_estimated?: number | null
                    city: string
                    created_at?: string
                    date_end?: string | null
                    date_start?: string | null
                    health_score?: number | null
                    id?: string
                    metadata?: Json | null
                    slug?: string | null
                    status?: string | null
                    title: string
                    type: string
                    updated_at?: string
                    workspace_id: string
                }
                Update: {
                    branding?: Json | null
                    budget_estimated?: number | null
                    city?: string
                    created_at?: string
                    date_end?: string | null
                    date_start?: string | null
                    health_score?: number | null
                    id?: string
                    metadata?: Json | null
                    slug?: string | null
                    status?: string | null
                    title?: string
                    type?: string
                    updated_at?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "events_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            guest_reminders: {
                Row: {
                    event_id: string | null
                    guest_id: string | null
                    id: string
                    metadata: Json | null
                    reminder_type: string
                    sent_at: string | null
                    status: string
                    workspace_id: string | null
                }
                Insert: {
                    event_id?: string | null
                    guest_id?: string | null
                    id?: string
                    metadata?: Json | null
                    reminder_type: string
                    sent_at?: string | null
                    status: string
                    workspace_id?: string | null
                }
                Update: {
                    event_id?: string | null
                    guest_id?: string | null
                    id?: string
                    metadata?: Json | null
                    reminder_type?: string
                    sent_at?: string | null
                    status?: string
                    workspace_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "guest_reminders_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "guest_reminders_guest_id_fkey"
                        columns: ["guest_id"]
                        isOneToOne: false
                        referencedRelation: "guests"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "guest_reminders_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            guests: {
                Row: {
                    check_in_time: string | null
                    created_at: string
                    dietary: string | null
                    email: string | null
                    event_id: string
                    id: string
                    metadata: Json | null
                    name: string
                    phone: string | null
                    rsvp_status: string | null
                    seat_number: number | null
                    table_id: string | null
                    tier: string | null
                    updated_at: string
                    workspace_id: string
                }
                Insert: {
                    check_in_time?: string | null
                    created_at?: string
                    dietary?: string | null
                    email?: string | null
                    event_id: string
                    id?: string
                    metadata?: Json | null
                    name: string
                    phone?: string | null
                    rsvp_status?: string | null
                    seat_number?: number | null
                    table_id?: string | null
                    tier?: string | null
                    updated_at?: string
                    workspace_id: string
                }
                Update: {
                    check_in_time?: string | null
                    created_at?: string
                    dietary?: string | null
                    email?: string | null
                    event_id?: string
                    id?: string
                    metadata?: Json | null
                    name?: string
                    phone?: string | null
                    rsvp_status?: string | null
                    seat_number?: number | null
                    table_id?: string | null
                    tier?: string | null
                    updated_at?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "guests_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "guests_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            payment_reminders: {
                Row: {
                    contract_id: string | null
                    id: string
                    metadata: Json | null
                    reminder_type: string
                    sent_at: string
                    workspace_id: string | null
                }
                Insert: {
                    contract_id?: string | null
                    id?: string
                    metadata?: Json | null
                    reminder_type: string
                    sent_at?: string
                    workspace_id?: string | null
                }
                Update: {
                    contract_id?: string | null
                    id?: string
                    metadata?: Json | null
                    reminder_type?: string
                    sent_at?: string
                    workspace_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "payment_reminders_contract_id_fkey"
                        columns: ["contract_id"]
                        isOneToOne: false
                        referencedRelation: "contracts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "payment_reminders_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            run_sheet_items: {
                Row: {
                    created_at: string
                    event_id: string
                    id: string
                    notes: string | null
                    owner_id: string | null
                    scheduled_time: string
                    status: string | null
                    title: string
                    updated_at: string
                    vendor_id: string | null
                    workspace_id: string
                }
                Insert: {
                    created_at?: string
                    event_id: string
                    id?: string
                    notes?: string | null
                    owner_id?: string | null
                    scheduled_time: string
                    status?: string | null
                    title: string
                    updated_at?: string
                    vendor_id?: string | null
                    workspace_id: string
                }
                Update: {
                    created_at?: string
                    event_id?: string
                    id?: string
                    notes?: string | null
                    owner_id?: string | null
                    scheduled_time?: string
                    status?: string | null
                    title?: string
                    updated_at?: string
                    vendor_id?: string | null
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "run_sheet_items_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "run_sheet_items_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "run_sheet_items_vendor_id_fkey"
                        columns: ["vendor_id"]
                        isOneToOne: false
                        referencedRelation: "vendors"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "run_sheet_items_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tasks: {
                Row: {
                    assigned_to: string | null
                    created_at: string
                    dependencies: string[] | null
                    description: string | null
                    due_date: string | null
                    event_id: string
                    id: string
                    priority: string | null
                    status: string | null
                    title: string
                    updated_at: string
                    workspace_id: string
                }
                Insert: {
                    assigned_to?: string | null
                    created_at?: string
                    dependencies?: string[] | null
                    description?: string | null
                    due_date?: string | null
                    event_id: string
                    id?: string
                    priority?: string | null
                    status?: string | null
                    title: string
                    updated_at?: string
                    workspace_id: string
                }
                Update: {
                    assigned_to?: string | null
                    created_at?: string
                    dependencies?: string[] | null
                    description?: string | null
                    due_date?: string | null
                    event_id?: string
                    id?: string
                    priority?: string | null
                    status?: string | null
                    title?: string
                    updated_at?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tasks_assigned_to_fkey"
                        columns: ["assigned_to"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tasks_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tasks_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            ticket_types: {
                Row: {
                    created_at: string | null
                    description: string | null
                    event_id: string | null
                    id: string
                    name: string
                    perks: Json | null
                    price: number
                    quantity_sold: number
                    quantity_total: number
                    updated_at: string | null
                    workspace_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    event_id?: string | null
                    id?: string
                    name: string
                    perks?: Json | null
                    price?: number
                    quantity_sold?: number
                    quantity_total?: number
                    updated_at?: string | null
                    workspace_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    event_id?: string | null
                    id?: string
                    name?: string
                    perks?: Json | null
                    price?: number
                    quantity_sold?: number
                    quantity_total?: number
                    updated_at?: string | null
                    workspace_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "ticket_types_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "ticket_types_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    created_at: string
                    email: string
                    id: string
                    name: string | null
                    phone_number: string | null
                    preferences: Json | null
                    role: string | null
                    updated_at: string
                    workspace_id: string | null
                }
                Insert: {
                    created_at?: string
                    email: string
                    id: string
                    name?: string | null
                    phone_number?: string | null
                    preferences?: Json | null
                    role?: string | null
                    updated_at?: string
                    workspace_id?: string | null
                }
                Update: {
                    created_at?: string
                    email?: string
                    id?: string
                    name?: string | null
                    phone_number?: string | null
                    preferences?: Json | null
                    role?: string | null
                    updated_at?: string
                    workspace_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "users_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            vendor_rfqs: {
                Row: {
                    created_at: string
                    data: Json
                    event_id: string | null
                    id: string
                    status: string
                    updated_at: string
                    vendor_id: string
                    workspace_id: string
                }
                Insert: {
                    created_at?: string
                    data?: Json
                    event_id?: string | null
                    id?: string
                    status?: string
                    updated_at?: string
                    vendor_id: string
                    workspace_id: string
                }
                Update: {
                    created_at?: string
                    data?: Json
                    event_id?: string | null
                    id?: string
                    status?: string
                    updated_at?: string
                    vendor_id?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "vendor_rfqs_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "vendor_rfqs_vendor_id_fkey"
                        columns: ["vendor_id"]
                        isOneToOne: false
                        referencedRelation: "vendors"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "vendor_rfqs_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            vendors: {
                Row: {
                    category: string
                    city: string
                    created_at: string
                    id: string
                    name: string
                    phone_number: string | null
                    portfolio: Json | null
                    pricing_packages: Json | null
                    risk_score: number | null
                    tier: string | null
                    updated_at: string
                    verified: boolean | null
                    workspace_id: string | null
                }
                Insert: {
                    category: string
                    city: string
                    created_at?: string
                    id?: string
                    name: string
                    phone_number?: string | null
                    portfolio?: Json | null
                    pricing_packages?: Json | null
                    risk_score?: number | null
                    tier?: string | null
                    updated_at?: string
                    verified?: boolean | null
                    workspace_id?: string | null
                }
                Update: {
                    category?: string
                    city?: string
                    created_at?: string
                    id?: string
                    name?: string
                    phone_number?: string | null
                    portfolio?: Json | null
                    pricing_packages?: Json | null
                    risk_score?: number | null
                    tier?: string | null
                    updated_at?: string
                    verified?: boolean | null
                    workspace_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "vendors_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            venue_layouts: {
                Row: {
                    created_at: string
                    data: Json
                    id: string
                    is_template: boolean | null
                    name: string
                    updated_at: string
                    venue_id: string
                    workspace_id: string
                }
                Insert: {
                    created_at?: string
                    data?: Json
                    id?: string
                    is_template?: boolean | null
                    name: string
                    updated_at?: string
                    venue_id: string
                    workspace_id: string
                }
                Update: {
                    created_at?: string
                    data?: Json
                    id?: string
                    is_template?: boolean | null
                    name?: string
                    updated_at?: string
                    venue_id?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "venue_layouts_venue_id_fkey"
                        columns: ["venue_id"]
                        isOneToOne: false
                        referencedRelation: "venues"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "venue_layouts_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            venue_tours: {
                Row: {
                    created_at: string
                    id: string
                    notes: string | null
                    scheduled_at: string
                    status: string
                    type: string
                    updated_at: string
                    user_id: string
                    venue_id: string
                    workspace_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    notes?: string | null
                    scheduled_at: string
                    status?: string
                    type: string
                    updated_at?: string
                    user_id: string
                    venue_id: string
                    workspace_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    notes?: string | null
                    scheduled_at?: string
                    status?: string
                    type?: string
                    updated_at?: string
                    user_id?: string
                    venue_id?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "venue_tours_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "venue_tours_venue_id_fkey"
                        columns: ["venue_id"]
                        isOneToOne: false
                        referencedRelation: "venues"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "venue_tours_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            venues: {
                Row: {
                    amenities: string[] | null
                    capacity: number | null
                    city: string
                    created_at: string
                    id: string
                    location_data: Json | null
                    name: string
                    photos: string[] | null
                    pricing_max: number | null
                    pricing_min: number | null
                    tier: string | null
                    updated_at: string
                    vibe_tags: string[] | null
                }
                Insert: {
                    amenities?: string[] | null
                    capacity?: number | null
                    city: string
                    created_at?: string
                    id?: string
                    location_data?: Json | null
                    name: string
                    photos?: string[] | null
                    pricing_max?: number | null
                    pricing_min?: number | null
                    tier?: string | null
                    updated_at?: string
                    vibe_tags?: string[] | null
                }
                Update: {
                    amenities?: string[] | null
                    capacity?: number | null
                    city?: string
                    created_at?: string
                    id?: string
                    location_data?: Json | null
                    name?: string
                    photos?: string[] | null
                    pricing_max?: number | null
                    pricing_min?: number | null
                    tier?: string | null
                    updated_at?: string
                    vibe_tags?: string[] | null
                }
                Relationships: []
            }
            workspaces: {
                Row: {
                    brand_profile: Json | null
                    created_at: string
                    created_by: string | null
                    id: string
                    name: string
                    settings: Json | null
                    subscription_tier: string | null
                    updated_at: string
                }
                Insert: {
                    brand_profile?: Json | null
                    created_at?: string
                    created_by?: string | null
                    id?: string
                    name: string
                    settings?: Json | null
                    subscription_tier?: string | null
                    updated_at?: string
                }
                Update: {
                    brand_profile?: Json | null
                    created_at?: string
                    created_by?: string | null
                    id?: string
                    name?: string
                    settings?: Json | null
                    subscription_tier?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_user_workspace_id: { Args: never; Returns: string }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
