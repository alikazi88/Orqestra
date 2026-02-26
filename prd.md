**ORQESTRA**

*The Operating System for Event Planning in India*

**PRODUCT REQUIREMENTS DOCUMENT**

Version 1.0 \| Confidential

Web (React + Vite) \| Mobile (React Native) \| Backend (Supabase)

2025 --- Antigravity

**Table of Contents**

**1. Executive Summary**

Orqestra is an AI-powered, all-in-one event planning platform built for brands in India. Today, event teams coordinate across 6 to 7 disconnected tools --- WhatsApp for vendors, Google Sheets for budgets, Excel for guest lists, Canva for invites, separate ticketing platforms --- and nothing talks to each other. When something breaks, and it always does, there is no single place to fix it.

Orqestra solves this by bringing every part of the event planning lifecycle into one platform: discovery, planning, vendor management, guest handling, team coordination, finance, on-ground operations, and post-event intelligence. The AI is not a chatbot sitting in a corner --- it is woven into every workflow, actively making decisions, flagging risks, suggesting alternatives, and learning each brand\'s preferences over time.

  --------------------------- --------------------------------------------------------------------------
  **Product Name**            Orqestra

  **Product Type**            SaaS Platform --- Web Application + Mobile App

  **Primary Market**          India (Tier 1 and Tier 2 cities)

  **Target Users**            Brand marketing teams, event agencies, corporate planners, D2C companies

  **Tech Stack --- Web**      React + Vite (TypeScript)

  **Tech Stack --- Mobile**   React Native (Expo)

  **Backend**                 Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)

  **Document Version**        1.0

  **Status**                  Pre-Development --- Ready for Engineering Handoff
  --------------------------- --------------------------------------------------------------------------

**2. Product Goals & Success Metrics**

**2.1 Primary Goals**

-   Eliminate tool fragmentation for event teams by consolidating all workflows into one platform

-   Make AI the default planning assistant --- not a premium add-on --- for every event

-   Build the most comprehensive vendor and venue network across Indian Tier 1 and Tier 2 cities

-   Create institutional memory per brand so every event they run makes the next one better

-   Enable on-ground real-time coordination that survives the chaos of Indian events

**2.2 Success Metrics by Phase**

  -------------------- --------------------------- -----------------------------
  **Phase**            **Metric**                  **Target**

  Launch (Month 1-3)   Brands onboarded            50 brands in Mumbai & Delhi

  Growth (Month 4-6)   Events run on platform      150+ events

  Scale (Month 7-12)   Vendor network size         500+ verified vendors

  Scale (Month 7-12)   MRR target                  ₹30 lakh/month

  Year 2               Cities covered              10+ cities including Tier 2

  Year 2               Net Promoter Score          50+
  -------------------- --------------------------- -----------------------------

**3. User Personas**

**3.1 Primary Users**

**Persona A --- Brand Marketing Manager**

  ---------------------- --------------------------------------------------------------------------------------------
  **Who they are**       Marketing lead at a D2C brand or fashion label. Plans 4-8 events per year. Reports to CMO.

  **Current pain**       Uses 6+ tools. Spends 60% of time on coordination, 40% on strategy.

  **What they want**     One place to plan, delegate, track, and report on every event.

  **Platform role**      Primary account owner. Sets brand profile. Approves budgets and vendors.
  ---------------------- --------------------------------------------------------------------------------------------

**Persona B --- Event Director / Agency Planner**

  ---------------------- --------------------------------------------------------------------------------------
  **Who they are**       Runs multiple events simultaneously for different brand clients. Has a team of 5-15.

  **Current pain**       Client communication is scattered. Team coordination breaks on event day.

  **What they want**     Multi-event dashboard. Clear task ownership. Client-facing portals.

  **Platform role**      Admin user. Manages multiple events and team members.
  ---------------------- --------------------------------------------------------------------------------------

**Persona C --- Vendor (Caterer, AV, Photographer, etc.)**

  ---------------------- ---------------------------------------------------------------------------------------
  **Who they are**       Runs a vendor business. Not necessarily tech-forward. WhatsApp is their primary tool.

  **Current pain**       Chases payments. Gets vague briefs. Has no digital portfolio.

  **What they want**     Clear briefs, on-time payments, and a way to showcase their work.

  **Platform role**      Vendor portal user. Receives briefs, uploads deliverables, tracks payments.
  ---------------------- ---------------------------------------------------------------------------------------

**Persona D --- Event Team Member (Day-of Staff)**

  ---------------------- ----------------------------------------------------------------------------------
  **Who they are**       On-ground coordinator, logistics lead, or social media person for an event.

  **Current pain**       Run sheets change last minute via WhatsApp. No single source of truth.

  **What they want**     Real-time run sheet. Ability to raise issues. Know their exact responsibilities.

  **Platform role**      Team member with role-based access. Event Day Mode user.
  ---------------------- ----------------------------------------------------------------------------------

**Persona E --- Sponsor / Partner Brand**

  ---------------------- ------------------------------------------------------------------------------------------------
  **Who they are**       Brand contributing sponsorship to an event. Needs asset tracking and deliverable confirmation.

  **Current pain**       Emails get lost. Never sure if their logo is placed correctly.

  **What they want**     A self-serve portal to upload assets and confirm deliverables are done.

  **Platform role**      Sponsor portal user. Read-only access to relevant event sections.
  ---------------------- ------------------------------------------------------------------------------------------------

**4. System Architecture Overview**

**4.1 High-Level Architecture**

Orqestra is a multi-tenant SaaS platform. Every brand, agency, or organization gets its own isolated workspace. Within a workspace, multiple users operate with role-based access. Vendors have a separate lighter-weight portal outside the main workspace.

> *💡 The architecture is designed to scale horizontally. Supabase\'s row-level security (RLS) handles multi-tenancy at the database level so no brand ever sees another brand\'s data.*

**4.2 Backend --- Supabase**

**Core Supabase Services Used**

-   Supabase Auth --- Email/password, magic link, and OAuth (Google) login. JWT-based session management. Row-level security policies on every table.

-   Supabase Database (PostgreSQL) --- Primary data store for all platform data: events, vendors, guests, budgets, tasks, run sheets, and more.

-   Supabase Storage --- File storage for vendor contracts, uploaded photos, brand assets, event documents, and media. Organized by workspace and event.

-   Supabase Realtime --- Powers live collaboration features: real-time run sheet updates, team notifications, door count, incident log, and vendor check-ins on event day.

-   Supabase Edge Functions --- Serverless functions for: AI API calls to Anthropic Claude, WhatsApp message dispatch, UPI payment webhooks, automated email/SMS trigger sequences, and background data processing jobs.

**4.3 Frontend Architecture**

**Web --- React + Vite (TypeScript)**

-   Vite for fast development builds and optimized production bundles

-   React Router v6 for client-side routing with protected and public routes

-   Zustand or React Context for global state management (auth, active workspace, active event)

-   React Query (TanStack Query) for server state management, caching, and background data synchronization

-   Tailwind CSS for utility-first styling with a custom design system

-   Radix UI or shadcn/ui for accessible headless components

-   Supabase JS client for auth, database queries, realtime subscriptions, and storage

-   Recharts or Chart.js for budget charts, analytics dashboards, and event health visualizations

-   React DnD or DnD Kit for drag-and-drop seating charts, 3D layout builder, and kanban task boards

**Mobile --- React Native (Expo)**

-   Expo managed workflow for faster development and OTA updates

-   React Navigation for stack, tab, and drawer navigation patterns

-   Expo Notifications for push notifications --- vendor alerts, run sheet changes, approvals

-   Expo Camera + Expo Barcode Scanner for QR check-in at event entry

-   React Native Reanimated for smooth gesture-based interactions and transitions

-   Expo SecureStore for token storage on device

-   Same Supabase JS client as web for consistent data access patterns

-   Event Day Mode optimized for outdoor use --- large tap targets, offline-capable run sheet caching

**4.4 Database Schema --- Key Entities**

The following table describes the primary database tables and their relationships. All tables include created_at, updated_at, and workspace_id for multi-tenancy.

  ----------------- ------------------------------------------------------------------------- -----------------------------------------------------------------
  **Table**         **Key Fields**                                                            **Relationships**

  workspaces        id, name, brand_profile, subscription_tier, settings                      Has many: users, events, vendors

  users             id, workspace_id, role, name, email, preferences                          Belongs to: workspace

  events            id, workspace_id, title, type, date, city, status, budget, health_score   Has many: vendors, guests, tasks, run_sheet_items, budget_lines

  venues            id, name, city, tier, capacity, vibe_tags, pricing, amenities, photos     Referenced by events

  vendors           id, workspace_id, name, category, tier, risk_score, portfolio, pricing    Has many: contracts, reviews, payments

  contracts         id, event_id, vendor_id, file_url, status, payment_schedule               Belongs to: event, vendor

  guests            id, event_id, name, tier, dietary, rsvp_status, seat_id, check_in_time    Belongs to: event

  budget_lines      id, event_id, category, estimated, committed, actual, gst                 Belongs to: event

  tasks             id, event_id, assigned_to, title, status, due_date, dependencies          Belongs to: event, user

  run_sheet_items   id, event_id, time, title, owner, status, notes                           Belongs to: event

  incidents         id, event_id, reporter_id, description, severity, status, resolved_at     Belongs to: event

  sponsor_tiers     id, event_id, tier_name, deliverables, sponsor_brand, assets_uploaded     Belongs to: event

  ai_memories       id, workspace_id, category, insight, confidence, derived_from             Belongs to: workspace
  ----------------- ------------------------------------------------------------------------- -----------------------------------------------------------------

**5. Information Architecture & Navigation**

**5.1 Web App --- Global Navigation Structure**

The web app is organized into a persistent left sidebar navigation with a main content area and a contextual right panel for AI assistant and notifications.

> *💡 Every screen in the web app maintains workspace context. A user never loses their place when switching between modules.*

**Top-Level Navigation (Left Sidebar)**

-   Home / Dashboard --- Workspace overview, upcoming events, activity feed, AI nudges

-   Events --- Event list view with filters; entry point into individual event workspaces

-   Venue Discovery --- Browse and search venues with filters, map view, AI matching

-   Vendor Marketplace --- Browse vendors by category and city, RFQ management

-   Calendar --- Cross-event calendar view, team availability, festival/conflict intelligence

-   Finance --- Cross-event budget overview, invoice queue, payment tracker, P&L reports

-   Reports --- Post-event analytics, brand equity tracker, comparative reports

-   Team --- Team member management, roles, permissions

-   Settings --- Workspace settings, billing, integrations, brand profile

**Within Each Event (Event Sidebar)**

-   Overview --- Event health score, timeline, quick status snapshot

-   Planning --- AI blueprint, venue, mood board, 3D layout

-   Vendors --- Vendor shortlist, RFQs, contracts, payment schedules

-   Guests --- Guest list, ticketing page, RSVP tracker, seating chart

-   Team --- Run sheet, task board, role assignments, briefing documents

-   Budget --- Estimated / Committed / Actual view, GST tracker, invoices

-   Sponsors --- Tier management, deliverable tracker, sponsor portal

-   Content --- Social calendar, captions, shot list, content hub

-   Event Day --- Event Day Mode trigger, live run sheet, incidents, check-in

-   Post-Event --- Report, feedback, debrief, archive

**5.2 Mobile App --- Navigation Structure**

The mobile app uses a bottom tab bar for primary navigation and stack navigation within each tab. The experience is designed mobile-first with particular emphasis on Event Day Mode usability.

**Bottom Tab Bar (5 Tabs)**

-   Home --- Dashboard with upcoming events, AI nudges, quick actions

-   Events --- Event list and individual event access

-   Day Mode --- Event Day Mode landing; activates contextual event operations

-   Vendors --- Quick vendor lookup and communication

-   More --- Settings, team, notifications, help

**6. Feature Modules --- Detailed Specification**

**6.1 Authentication & Onboarding**

**Web & Mobile --- Screens**

-   Splash / Landing Screen --- Marketing page with login and signup CTAs (web only; mobile has a simplified version)

-   Sign Up Screen --- Name, email, password, company name, city, phone number. Google OAuth option. Terms acceptance.

-   Email Verification --- Email sent with magic link. Screen shows confirmation with resend option.

-   Onboarding Flow --- 5-step wizard after first login:

    -   Step 1: Brand Profile --- Upload logo, set brand colors, event history (how many events per year), team size

    -   Step 2: Typical Budget Range --- Slider-based input for average event budget. Helps AI calibrate predictions.

    -   Step 3: Event Types You Run --- Multi-select: Fashion, Corporate, Gen Z / Product Launch, Social / Wedding, Other

    -   Step 4: Import Existing Vendors --- CSV upload or manual add of vendor contacts from current tools

    -   Step 5: Invite Team --- Email invites for team members with role assignment

-   Login Screen --- Email/password. Google OAuth. Forgot password flow with magic link.

-   Workspace Selector --- Users belonging to multiple workspaces (e.g., agency users) see a switcher after login

**User Roles & Permissions**

  ------------------- -------------------------------------------------------- ----------------------------------
  **Role**            **Access Level**                                         **Typical User**

  Workspace Owner     Full access to all modules, billing, settings            Founder, Head of Events

  Event Director      Full access within events they manage, no billing        Senior Event Manager

  Team Member         Role-specific view within assigned events                Logistics, Social, Finance leads

  Vendor              Vendor portal only --- briefs, deliverables, payments    External vendor partner

  Sponsor             Sponsor portal only --- asset upload, deliverable view   Sponsoring brand contact

  Guest (Read-only)   RSVP and ticket management only                          Event guest accessing invite
  ------------------- -------------------------------------------------------- ----------------------------------

**6.2 Event Creation & AI Blueprint**

The AI Blueprint is the core value differentiator. It transforms a 10-field form into a complete operational plan within seconds.

**Web --- Event Creation Flow**

1.  User clicks \'New Event\' from the dashboard or events list

2.  Event type selection screen --- grid of event type cards: Fashion Show, Product Launch, Corporate Summit, Gen Z Drop, Wedding, Custom

3.  Basic details form --- Event name, date (or date range), city, expected headcount, rough budget

4.  AI Blueprint is generated automatically and displayed as a structured document with sections the user can expand and edit:

    -   Venue shortlist --- 3 to 5 matched venues with match score and reasoning

    -   Vendor category checklist --- pre-populated based on event type (e.g., Fashion Show auto-adds: models agency, makeup, styling, AV, photographer, catering, security)

    -   Budget allocation draft --- percentage splits by category based on similar past events on the platform

    -   Timeline milestones --- 8 to 12 weeks of pre-event milestones with suggested due dates

    -   Risk flags --- AI pre-identifies risks: date conflicts with city events, short lead time, unusual budget distribution

    -   Mood board direction --- 3 visual direction options the user can pick as a starting point

5.  User reviews and confirms the blueprint. They can regenerate individual sections or edit fields manually.

6.  Event workspace is created and the user lands on the Event Overview screen

> *💡 The AI Blueprint improves with each event run on the platform. After a brand completes 3 events, the AI starts incorporating their specific preferences --- preferred vendor categories, typical overruns, team structure patterns --- into new blueprints.*

**Mobile --- Event Creation**

On mobile, event creation is simplified to a quick-add form: name, type, date, city, rough budget. The full AI Blueprint is generated but presented in a mobile-optimized card layout that the user reviews and can edit. Complex blueprint editing is nudged to the web app.

**Event Health Score --- Ongoing**

The Event Health Score is a live dashboard metric visible on every event overview. It scores readiness across 12 dimensions and updates in real time as actions are completed.

  --------------------------- --------------------------------------------------
  **Dimension**               **What It Tracks**

  Venue Confirmed             Signed contract or booking confirmation uploaded

  Core Vendors Booked         \% of vendor categories from blueprint confirmed

  Budget Coverage             Committed spend vs estimated budget

  Guest Invites Sent          \% of target guest list with invites dispatched

  RSVP Rate                   Current RSVP rate vs target acceptance rate

  Run Sheet Status            Run sheet created and reviewed by team

  Team Briefed                All team members confirmed role assignments

  Payment Schedule On Track   No overdue vendor payments

  Legal/Compliance            Required NOCs, FSSAIs, permits filed or flagged

  Content Plan Active         Social calendar has pre-event content scheduled

  Sponsor Deliverables        All sponsor deliverables assigned and tracked

  Timeline On Track           No overdue milestone tasks in the system
  --------------------------- --------------------------------------------------

**6.3 Venue Intelligence**

**Web --- Venue Discovery Screen**

-   Map view and list view toggle --- venues plotted on a city map with filter panel on the left

-   Filter panel --- Event type, vibe tags (industrial, luxury, rooftop, blank canvas, heritage), capacity range, city/area, price tier, parking, metro proximity, load-in access for AV equipment

-   AI Match toggle --- when enabled, venues are ranked by match to the current event\'s DNA, not just generic filters. A Gen Z drop and a luxury launch at identical capacity venues will receive a completely different ranked list.

-   Venue card --- photo carousel, name, location, capacity, key vibe tags, pricing range, and AI match score with a one-line reasoning

-   Venue detail page --- full photo gallery, 360 walkthrough embed, floor plan, amenity checklist, pricing breakdown (deposit, full day, half day, weekday vs weekend), owner contact, past events hosted (anonymized), and negotiation history pulled from the user\'s own account if they\'ve used the venue before

-   Request Tour --- sends an inquiry directly to the venue manager inside the platform

-   Save to Event --- one-click saves a venue to the current event\'s shortlist for side-by-side comparison

**AR Venue Layout Tool (Web)**

From a venue\'s detail page, users can open the Layout Studio. They input the venue\'s dimensions (or the system pulls them if on file) and access a drag-and-drop 2D/3D layout builder where they can place:

-   Stage and backstage area

-   Seating configurations (theatre, round tables, lounge clusters)

-   Bar counters and serving stations

-   Photo wall and activation zones

-   DJ booth and AV equipment placements

-   Entrance / registration desk

The layout is saved to the event and shared with vendors like the AV team and decor team as part of their brief.

**Mobile --- Venue Discovery**

Mobile venue browsing uses the same filter system but presented as a swipe-card stack for browsing and a map view. Saving to event shortlist and requesting tours work identically. The 3D layout builder is not available on mobile --- users are prompted to open on desktop.

**6.4 Vendor Marketplace & Management**

**Vendor Categories**

-   AV & Lighting

-   Decor & Floral

-   Catering & Beverage

-   Photography

-   Videography & Reels

-   DJ, Artists & Live Entertainment

-   Security & Crowd Management

-   Staffing Agencies

-   Printing & Signage

-   Tech Experiences (LED walls, holograms, interactive installations)

-   Models & Talent Agencies

-   Makeup & Styling

-   Transport & Logistics

-   Event Furniture Rental

**Web --- Vendor Discovery**

-   Browse page with category tabs, city filter, price tier filter, event-type tag filter, and availability checker

-   Each vendor card shows: category badge, name, city, pricing tier (₹ to ₹₹₹₹), portfolio thumbnail, number of events completed, and a contextual review snippet rather than a generic star rating

-   Vendor Risk Score is shown as a colored indicator (green/yellow/red) with a hover tooltip explaining the score based on: completion rate, payment dispute history, event-day no-show record on the platform

-   AI Shortlist button --- within an event, one click generates an AI-curated shortlist of vendors per category that matches the event type, budget, city, and style DNA. The user sees reasoning for each recommendation.

-   Vendor Profile Page --- full portfolio gallery, video showreel embed if provided, pricing packages, available dates calendar, team size, specializations, verified reviews with event context, and response time badge

**RFQ (Request for Quote) Flow**

7.  User selects vendors to receive an RFQ

8.  AI pre-fills the RFQ brief based on event blueprint: date, venue, headcount, event type, specific requirements, tone/mood description, and questions tailored to the vendor category

9.  User reviews and edits the brief, then sends it in-platform

10. Vendor receives notification via platform notification and WhatsApp (for vendors without platform accounts)

11. Vendor submits proposal through vendor portal or WhatsApp reply (which gets parsed and logged)

12. All proposals are listed in a comparison view --- user can compare line-by-line across vendors

13. User selects preferred vendor and moves to contract phase

**Contract Management**

-   Upload existing contracts as PDF or use platform contract templates for standard vendor types

-   In-platform e-signature using Supabase Storage + a signing flow (name typed, date-stamped, IP logged)

-   Payment schedule built from contract: deposit due date, milestone payments, final payment

-   Automated payment reminders sent to the brand\'s finance approver and to the vendor 5 days and 1 day before each due date

-   Invoice upload by vendor, approval by brand, payment triggered via UPI or bank transfer with platform integration

**WhatsApp Integration for Vendors**

Vendors who are not on the platform receive all briefs, updates, and payment confirmations via WhatsApp through a Business API integration. Their replies are parsed by an Edge Function and logged in the platform. This ensures the platform captures all vendor communication even when the vendor is not a platform user. From the brand\'s side, they see everything in one place regardless of which channel the vendor used to respond.

**Mobile --- Vendor Management**

-   Browse vendors and view profiles

-   Review and respond to proposals

-   Approve invoices and flag payment issues

-   Message vendors via in-platform chat (synced with WhatsApp for non-platform vendors)

-   View vendor check-in status on event day

**6.5 Decor & Interior Planning Studio**

**AI Mood Board Generator**

User inputs: brand colors, event theme (text description), reference images (upload up to 5), target vibe adjectives (from a preset list: editorial, intimate, maximalist, minimalist, industrial, festive, futuristic, etc.). The AI generates 3 distinct visual direction options as mood boards with:

-   Color palette with hex codes

-   Texture and material suggestions

-   Key decor elements per zone (entrance, main floor, stage, lounge)

-   Vendor products from the marketplace mapped to each direction --- if a decor vendor on the platform has a product that fits the direction, it is linked directly

> *💡 Mood boards are generated by calling the AI API with the user\'s inputs. The output is structured JSON that maps to a visual component in the frontend. This is not an image generation feature --- it is a structured decor direction with real vendor product links.*

**3D Room Layout Tool**

Built on the same layout tool introduced in the venue section. Within an event, the Decor module extends it with:

-   Decor layer toggle --- add decor elements on top of the furniture/stage layout

-   Zone tagging --- mark areas as Entrance, Main Floor, Stage, Lounge, Bar, Photo Wall, Backstage

-   Budget overlay --- as decor elements are added, a live cost estimate updates in the sidebar based on the user\'s shortlisted decor vendor pricing

-   Sustainability flag --- elements tagged as single-use plastic are highlighted with a yellow warning and an AI-suggested alternative

**Trend Engine**

A read-only section in the Decor module showing what is working across real events on the platform, updated monthly. Organized by event type:

-   Gen Z Events --- trending activation types, color stories, social-first decor moments

-   Luxury Events --- current material trends, floral directions, lighting styles

-   Corporate --- clean, functional setups that photograph well for coverage

-   Wedding & Social --- regional trends by city, seasonal directions

**6.6 Guest & Ticketing Engine**

**Ticketing Types Supported**

-   Free events --- RSVP only

-   Paid ticketing --- single tier or multiple pricing tiers

-   Invite-only --- no public page, invite sent directly to the guest list

-   Hybrid --- some paid public tickets, some invite-only allocations (e.g., VIP + Press + General)

-   Drop-style ticketing --- for Gen Z events. Limited inventory revealed at a specific time, scarcity mechanics, waitlist activation

-   Waitlist --- for sold-out events with automatic slot release on cancellations

**Guest List Management --- Web**

-   Import guest list via CSV upload with column mapping wizard

-   AI guest segmentation --- on import, AI categorizes guests by influence tier, relationship type, and flags special requirements (dietary, accessibility, VIP preferences) based on CRM data patterns or manual tagging

-   Guest profile --- name, company, contact, tier (VIP / Press / Trade / General / Waitlist), dietary, accessibility needs, seating preferences, past attendance history on platform

-   Smart seating chart --- drag-and-drop table layout with AI-suggested placements that respect: competing brand founders not seated together, press separated from VIP clients who have a no-photo preference, dietary clusters for catering convenience

-   RSVP flow --- every guest receives a branded digital invite. RSVP link goes to a brand-styled confirmation page. WhatsApp and email sequences auto-activate on send.

-   RSVP reminder sequences --- configurable: Invite sent → reminder at T-7 days → reminder at T-2 days → day-of confirmation. Tone escalates politely. Platform handles sends automatically.

**Ticketing Page (Public-Facing)**

-   Brand-customized design --- pulls brand colors and logo from workspace profile

-   Ticket tiers with descriptions, pricing, and availability counts

-   Payment via Razorpay (UPI, cards, net banking) integrated through Supabase Edge Function

-   Post-purchase confirmation email + WhatsApp with QR code ticket

-   Attendee information collection at checkout --- configurable per event (dietary, company name, role)

-   Waitlist signup form for sold-out events

**Event Day Check-In**

-   QR code scanner --- works on any team member\'s phone via the mobile app camera

-   Facial recognition option --- for luxury or high-security events, optional integration with a third-party facial recognition API

-   Manual search --- search by name, phone, or ticket number as backup

-   Real-time door count --- visible to all logged-in team members on event day dashboard

-   No-show list --- guests who haven\'t checked in by a configurable time are flagged for follow-up or waitlist activation

**Post-Event Attendance Analytics**

-   Attendance rate vs RSVP rate vs invite list size

-   First-time vs returning attendees (across events in workspace history)

-   Check-in time distribution (when did the crowd arrive?)

-   No-show analysis --- segments that consistently don\'t show up vs those that always attend

-   Guest behaviour prediction model --- for recurring events, AI scores each guest on predicted attendance likelihood based on past behavior, flagging guests the brand should personally follow up with for high-priority events

**6.7 Team Command Center**

**Team Structure**

Within each event, the Event Director assigns team members to predefined roles. Each role has a curated view --- they see only the modules and data relevant to their function.

  -------------------- ------------------------------------------------------
  **Role**             **Modules Visible**

  Event Director       All modules

  Logistics Lead       Vendors, Run Sheet, Team, Event Day

  Guest Relations      Guests, Ticketing, RSVP, Check-in

  Vendor Coordinator   Vendors, Contracts, Payments

  Finance Lead         Budget, Invoices, Payments, GST

  Social Media Lead    Content, Social Calendar, Content Hub

  On-Ground Staff      Event Day Mode only (run sheet, incidents, check-in)
  -------------------- ------------------------------------------------------

**Run Sheet**

-   Created by Event Director, editable by all roles that have access

-   Timeline view and list view toggle

-   Each run sheet item: time, title, responsible person (from team), vendor involved (if applicable), notes, status (upcoming / in progress / completed / delayed / critical)

-   Dependencies --- items can be marked as dependent on another. If item A is delayed, items B, C, D that depend on it are automatically flagged.

-   Real-time sync via Supabase Realtime --- any update is reflected on all logged-in devices within 2 seconds

-   Event Day Mode --- run sheet becomes the primary interface on mobile with large status toggle buttons, color coding, and a countdown timer for the next upcoming item

**Task Board**

-   Kanban-style board with columns: To Do, In Progress, Blocked, Done

-   Tasks can be created manually or auto-generated from the AI blueprint milestones

-   Each task: title, assignee, due date, linked event section, priority, dependencies

-   AI Critical Path Detection --- AI identifies which pending tasks are blocking the most downstream tasks and surfaces them as Critical Path items at the top of the board

-   Deadline alerts --- assignees receive in-app and push notifications for tasks due within 24 hours

**Voice Notes --- Event Day**

On mobile, any team member can record a short voice note (up to 60 seconds) and post it to the team feed on event day. Voice notes are transcribed by an Edge Function and logged with speaker, time, and auto-transcription. This is faster than typing during a live event and maintains accountability.

**6.8 Budget & Finance Module**

**Budget Builder**

When an event is created, the AI Blueprint auto-populates a budget draft with line items by category and estimated amounts based on: event type, headcount, city, and market rate data from past events on the platform. The budget has three columns throughout its lifecycle:

-   Estimated --- initial AI-suggested or user-defined target per line item

-   Committed --- total of signed contracts and confirmed spend

-   Actual --- invoices received and payments made

> *💡 The gap between Estimated and Committed triggers AI alerts. If any category is trending more than 15% over estimate, the user receives a proactive notification with a suggested reallocation from underspent categories.*

**GST & Tax Management**

-   Every invoice can have GST rate applied (5%, 12%, 18%, 28%) based on vendor service category --- with defaults pre-set per vendor category

-   Input tax credit (ITC) tracking --- for brands registered under GST, the platform tracks which vendor invoices are GST-eligible for ITC claims and generates a summary report

-   TDS deduction tracking --- for applicable vendor payments, the platform flags TDS requirement and tracks deduction amounts

-   GST summary exportable as CSV for CA / finance team submission

**Payments & Invoice Flow**

-   Vendor invoices are uploaded by the vendor in the vendor portal or by the brand team

-   Finance Lead or Workspace Owner receives an approval notification

-   On approval, payment is triggered via UPI (Razorpay Business payout API) or logged as pending for bank transfer

-   Payment confirmation is automatically sent to the vendor via platform notification and WhatsApp

-   Full payment ledger per event with downloadable PDF statement

**Sponsorship Revenue Tracking**

-   Sponsor contributions are added as income lines in the budget

-   Each sponsor tier has a committed amount and a received amount

-   Automatically adjusts the net budget (spend minus sponsorship income)

-   Post-event P&L auto-generated: total spend, total sponsorship income, net cost to brand, cost per attendee

**6.9 Sponsorship & Partnership Module**

**Sponsor Deck Builder**

From within an event, the user can generate a sponsor deck in minutes. The AI pre-fills:

-   Event overview --- format, date, city, expected audience size and profile

-   Audience demographics --- pulled from the brand\'s past event attendance data

-   Sponsorship tiers --- with suggested naming (Title Sponsor, Gold, Silver, Community Partner) and associated deliverables per tier

-   Past event highlights --- photos and metrics from previous events in the workspace

The deck is generated as a downloadable PDF and a shareable link. Users can edit all content before publishing.

**Deliverable Tracking**

Once a sponsor tier is confirmed, the platform creates a deliverable checklist:

-   Logo placement on backdrop --- confirmed by photo upload after setup

-   VIP ticket allocation --- tracked in the guest list module automatically

-   Social mention --- linked to the content calendar; marked complete when post is published

-   Dedicated email blast --- linked to email send confirmation

-   Demo booth setup --- tracked as a vendor task in the run sheet

**Sponsor Portal**

Sponsors receive a limited-access portal link (no platform account required) where they can:

-   Upload brand assets (logo, brand guidelines, approved copy)

-   Track the status of their deliverables in real time

-   See event updates and schedule

-   Download post-event report with their specific deliverable confirmation

**6.10 Content & Social Command Center**

**Social Media Calendar**

A visual calendar tied to the event timeline with three zones:

-   Pre-event buzz --- teaser content, venue reveals, talent announcements, countdown posts. Starts 3 to 4 weeks before the event.

-   Day-of content --- live posts, behind-the-scenes, check-in moments, key highlight posts. Run sheet item integration shows the Social Media Lead what\'s happening at each time.

-   Post-event wrap --- highlights recap, thank-you posts, user-generated content reposts, coverage shares. Runs for 5 to 7 days after the event.

**AI Caption & Copy Generator**

-   Platform, tone, and audience selector per post

-   AI generates 3 caption variations per post slot with hashtag sets

-   Post-event email copy generated for: attendee thank-you, press follow-up, sponsor impact report

-   All generated copy is editable before use

**Photographer & Videographer Brief Generator**

User selects event type and inputs key moments (VIP arrivals, CEO speech, product demo, DJ set opening, etc.). AI generates a structured shot list:

-   Must-have shots --- non-negotiable brand moments with camera position suggestions

-   Context shots --- atmosphere, crowd, decor detail shots

-   Social-first shots --- formats designed for Instagram Stories, Reels, and LinkedIn

-   B-roll list for video team

Brief is exported as a PDF and shared directly with the photographer/videographer through the vendor portal.

**Content Collection Hub**

After the event, the platform creates a shareable upload link for:

-   Photographer --- uploads final edited photos to the event\'s storage folder

-   Videographer --- uploads video files or links to deliver folder

-   Attendees --- optional UGC collection link shared via post-event WhatsApp/email asking for their photos

-   Team members --- upload phone captures from event day

All content is organized in a searchable media library. AI tags photos by: people, moments, zones, and quality score.

**Real-Time Social Listening (Event Day)**

On event day, the platform monitors mentions of the event\'s hashtag and the brand\'s handle across Instagram and Twitter/X. The Social Media Lead sees:

-   Live feed of tagged posts

-   Influencer content flagged by follower count threshold (configurable --- default 10K+ followers)

-   Sentiment scoring --- positive vs neutral vs negative mention ratio

-   One-click repost suggestions for the best UGC

**6.11 On-Ground Operations --- Event Day Mode**

Event Day Mode activates 24 hours before the event and is designed to function under stress. The interface is simplified, mobile-first, and touch-optimized. Every interaction is designed for someone standing in a loud venue, wearing an earpiece, trying to make a decision in 10 seconds.

**Activation**

-   System automatically suggests switching to Event Day Mode at T-24 hours

-   Event Director confirms activation via one-tap prompt

-   All team members with the mobile app receive a push notification: \'Event Day Mode is live. Tap to enter.\'

**Event Day Mode --- Core Screens (Mobile)**

**Live Run Sheet**

-   Timeline view with color coding: gray (upcoming), blue (in progress), green (completed), yellow (delayed), red (critical)

-   Current item shown prominently at top with countdown timer

-   Tap to update status --- one-tap status changes, no form required

-   Tap to add note --- voice note or text note attached to any item

-   Delayed item triggers downstream impact warning: \'Marking this as delayed will push 3 items. Confirm?\'

**Check-In Dashboard**

-   Live door count --- large number display, updates in real time

-   QR scan button --- opens camera scanner immediately

-   Manual search --- type to find guest by name or phone

-   Arrival pace chart --- guests per 15-minute slot, helps predict crowd surge for logistics

**Vendor Status Board**

-   List of all vendors expected on event day with arrival windows

-   Each vendor has a check-in button --- vendor or team member taps when they arrive

-   Alert if vendor has not checked in within 30 minutes of their expected arrival time

**Incident Log**

-   Any team member can raise an incident: tap \'Report Issue\' → select category (AV, Catering, Guest, Safety, General) → describe in text or voice → submit

-   Incidents are visible to the Event Director immediately with a notification

-   Incidents are triaged: assigned to a team member to resolve with a 15-minute SLA by default

-   Resolved incidents log time-to-resolution for post-event review

**Emergency Protocols**

-   Always-visible emergency card accessible from any Event Day screen

-   Contents: venue emergency exit map, nearest hospital and ambulance number, event day emergency contact list, venue manager\'s direct number, police NOC reference number

-   Pre-loaded during final week setup, reviewed by Event Director before activation

**Event Day Mode --- Web (Supporting Screen)**

The web app in Event Day Mode shows a Command Center view for the Event Director on a laptop:

-   Live run sheet on the left panel

-   Door count and check-in stats on the right

-   Incident log feed in the center

-   Vendor status board below the fold

-   Live social listening feed for the Social Media Lead

**6.12 Post-Event Intelligence**

**Automated Guest Feedback Survey**

-   Survey sent via WhatsApp and email 2 hours after the event ends

-   5-question NPS-style survey: Overall experience, Venue quality, Content/programming, Catering, Likelihood to attend next event

-   Open-text question: \'What one thing would have made this event better?\'

-   Response collection window: 48 hours. Reminder at 24 hours for non-respondents.

**Post-Event Report**

Auto-generated within 48 hours of event end. Sections:

-   Executive Summary --- one-paragraph AI narrative of how the event went

-   Attendance --- final headcount, RSVP rate, no-show analysis

-   Budget --- final P&L, variance analysis per category, recommendations for next time

-   Vendor Performance --- scored per vendor based on: on-time arrival, brief adherence (team-rated), payment process, and any incident log mentions

-   Guest Feedback Summary --- NPS score, sentiment analysis of open-text responses, top themes from feedback

-   Content Performance --- reach on social posts during and after event (if social integrations are connected), media coverage links

-   Sponsor Deliverable Confirmation --- all deliverables listed with completion status and evidence

-   Incident Log Summary --- all incidents raised, resolution time, patterns

**AI Event Debrief Session**

A conversational AI session (text-based) where the Event Director talks through what went wrong and right. The AI:

-   Asks structured debrief questions: What surprised you positively? What would you change? Which vendors exceeded expectations? What ran over schedule?

-   Extracts action items and adds them automatically to a \'Lessons Learned\' checklist

-   Flags recurring patterns --- if similar issues appeared in past events, the AI surfaces the pattern

-   Lessons are automatically pulled into the next event\'s AI Blueprint as pre-loaded flags

**Brand Equity Tracker**

For brands running recurring events (3 or more on the platform), the system builds a longitudinal view:

-   NPS trend over events --- is attendee satisfaction improving?

-   Repeat attendance rate --- what % of guests came back from the previous event?

-   Guest tier growth --- is the brand attracting more high-influence guests over time?

-   Vendor reliability score --- which vendors have delivered consistently across events?

**Event Archive**

-   Every completed event is fully archived and searchable

-   Archived assets: all contracts, final run sheet, guest list (anonymized for compliance), photo/video library, final budget, post-event report, feedback responses

-   Search across archives: find all events at a specific venue, all events with a specific vendor, all events exceeding a certain headcount

-   Archived events feed the AI\'s workspace memory --- the platform gets smarter about this brand\'s preferences and patterns over time

**7. AI Features --- Detailed Specification**

All AI features call the Anthropic Claude API via Supabase Edge Functions. The Edge Function handles prompt construction, API call, response parsing, and data storage. The frontend never calls the AI API directly.

**7.1 AI Feature Inventory**

  ----------------------------- -------------------------------------- ----------------------------------------------------------------
  **Feature**                   **Trigger**                            **Output**

  Event Blueprint Generation    New event creation                     Structured blueprint: venues, vendors, budget, timeline, risks

  Budget Prediction             Event parameters set                   Line-by-line budget estimate with confidence range

  Vendor Shortlist              AI Shortlist button in vendor module   Ranked vendor list per category with reasoning

  Mood Board Generation         Decor module inputs submitted          3 visual direction options with product links

  RFQ Brief Generation          Vendor selected for RFQ                Pre-filled vendor brief tailored to category

  Caption Generation            Post slot in social calendar           3 caption variations with hashtags

  Shot List Generation          Content module, brief generator        Structured photo/video brief

  Sponsor Outreach Draft        Sponsor module, outreach action        Personalized outreach email per sponsor category

  Event Debrief Session         Post-event, user initiates             Structured conversation with extracted action items

  Run Sheet Problem Solver      Delayed item flagged on event day      Suggested recovery actions, updated run sheet draft

  Guest Attendance Prediction   Invite list finalized                  Predicted attendance with individual likelihood scores

  Budget Alert & Reallocation   Category trending over estimate        Alert with specific reallocation suggestion

  Conflict Detection            Event date set                         Flags conflicting city events, surge pricing periods

  Critical Path Detection       Task board viewed                      Identifies highest-priority blocking tasks
  ----------------------------- -------------------------------------- ----------------------------------------------------------------

**7.2 AI Memory System**

The AI Memory System is what makes Orqestra genuinely smarter over time for each brand. It is a structured collection of insights derived from completed events and stored in the ai_memories table in the database. Key memory categories:

-   Vendor Preferences --- which vendor categories and specific vendors this brand consistently selects and rates highly

-   Budget Patterns --- how much this brand typically spends per category, how their actual spend compares to estimates

-   Schedule Patterns --- does this brand typically run over schedule? Which run sheet item types are most commonly delayed?

-   Guest Behavior --- which guest segments have high RSVP-to-attendance conversion for this brand

-   Event Type Learnings --- what works specifically for this brand\'s Gen Z events vs corporate events

Memory insights are surfaced proactively in the AI Blueprint for each new event. They are displayed as \'Based on your past events\' callouts that the user can accept or dismiss.

**8. India-Specific Features**

**8.1 Compliance & Legal Tracking**

-   Police NOC --- platform creates a task with the local police station contact, required documents checklist, and typical lead time for the event\'s city. Tracks filing status.

-   FSSAI License / NOC --- required for events with food and beverage. Platform flags this requirement based on event type and catering vendor selection.

-   Sound Permission --- time-sensitive, city-specific. Platform flags based on venue location and event type. Tracks filing and approval.

-   Fire Safety NOC --- for large-capacity events. Platform provides the checklist and tracks filing.

All compliance items appear as tasks in the Team Command Center assigned to the Logistics Lead by default, with due dates set to recommended lead times before the event.

**8.2 Festival Calendar Intelligence**

The platform maintains an India-specific events and festival calendar that the AI references during blueprint generation and conflict detection. Key signals:

-   Major national festivals --- Diwali, Holi, Eid, Christmas, Dussehra: expect 30 to 60% venue and vendor price surges and acute scarcity in all major cities

-   Fashion Week conflicts --- Lakmé Fashion Week (Mumbai), Amazon India Fashion Week (Delhi): venue scarcity, photography and styling vendor unavailability

-   IPL Season --- sustained demand spike for premium venues across all cities during IPL matches in that city

-   Award Season --- Bollywood award season creates demand for luxury venues and certain vendor categories in Mumbai

-   City-specific local festivals --- Ganesh Chaturthi in Mumbai, Durga Puja in Kolkata flagged for relevant cities

> *💡 When a user sets an event date, the AI checks it against the festival calendar for that city and proactively flags any pricing or scarcity risks before the user has invested time in planning.*

**8.3 City-Tier Intelligence**

Orqestra maintains separate benchmarks for venue pricing, vendor pricing, and availability patterns across city tiers:

-   Tier 1A --- Mumbai, Delhi NCR: highest pricing, densest vendor network, highest competition for premium venues

-   Tier 1B --- Bangalore, Hyderabad, Chennai: slightly lower pricing, strong vendor network, growing premium venue supply

-   Tier 2 --- Pune, Jaipur, Kochi, Chandigarh, Surat: materially lower pricing, thinner vendor network requiring longer lead times, fewer premium venue options

AI budget predictions, vendor risk scores, and timeline recommendations all adjust based on the event\'s city tier.

**8.4 Language & Communication**

-   Hindi support across the vendor communication module --- briefs and confirmations can be generated in Hindi for vendors who prefer it

-   Regional language support roadmap --- Marathi, Tamil, Telugu, Kannada planned for Year 2

-   WhatsApp Business API integration --- all vendor communication, payment confirmations, and critical alerts can be dispatched via WhatsApp, the primary communication tool for the Indian vendor ecosystem

**8.5 Payments**

-   UPI for all vendor payments and collections --- Razorpay integration for both payouts (brand to vendor) and collections (guest ticket payments)

-   NEFT/RTGS for larger vendor payments above ₹2 lakhs

-   Automatic TDS deduction tracking for applicable professional service vendors

-   GST invoice requirement flagging and input credit tracking

**9. Notifications System**

**9.1 Notification Channels**

-   In-app notifications --- bell icon in web and mobile nav; notification center accessible from any screen

-   Push notifications --- mobile app via Expo Notifications; opt-in per category

-   Email --- for critical actions: new contract, payment due, RSVP updates, post-event report ready

-   WhatsApp --- for vendors (not platform users) and for high-priority guest communications

**9.2 Notification Categories & Triggers**

  ------------------------------------ ------------------------------------ --------------------------
  **Trigger**                          **Recipients**                       **Channel**

  New vendor proposal received         Event Director, Vendor Coordinator   In-app, Push

  Vendor payment due in 5 days         Finance Lead, Vendor                 In-app, Email, WhatsApp

  Task deadline in 24 hours            Assigned team member                 In-app, Push

  Event Health Score drops below 60%   Event Director                       In-app, Push, Email

  RSVP rate below target at T-7 days   Event Director, Guest Relations      In-app, Email

  Budget category 15% over estimate    Finance Lead, Event Director         In-app, Push

  Incident raised on event day         Event Director                       In-app, Push (immediate)

  Vendor not checked in (T+30 min)     Logistics Lead, Event Director       In-app, Push (immediate)

  Post-event report ready              Workspace Owner, Event Director      In-app, Email

  New guest feedback submitted         Event Director                       In-app (batched)
  ------------------------------------ ------------------------------------ --------------------------

**10. Scalability Architecture**

**10.1 Database Scalability**

-   Supabase PostgreSQL scales vertically through plan upgrades (Supabase Pro and Enterprise plans support dedicated database instances and read replicas)

-   Row-Level Security (RLS) is used for all multi-tenant data isolation --- no application-layer tenant filtering required, reducing risk of data leakage

-   Database indexes on: workspace_id, event_id, created_at, and any frequently filtered fields (city, vendor category, event type, status)

-   Table partitioning for high-volume tables (guests, run_sheet_items, ai_memories) as the platform grows --- partition by workspace or by time period

-   Archival strategy --- completed events older than 24 months are moved to a cold storage partition to keep the hot database lean

**10.2 Realtime Scalability**

-   Supabase Realtime uses PostgreSQL\'s replication slot and WebSocket broadcasting. Channel subscriptions are scoped to event_id to prevent unnecessary broadcast overhead.

-   On event day with high concurrent team member connections (20 to 50 per event, potentially hundreds of events simultaneously), channel isolation is critical. Each event gets its own Realtime channel.

-   For very large events (5000+ guests at check-in), check-in data is batch-written in 5-second intervals rather than row-by-row to reduce write amplification on the Realtime channel

**10.3 Edge Functions Scalability**

-   Supabase Edge Functions run on Deno Deploy, which scales automatically. AI API calls are the most latency-sensitive and compute-intensive operations.

-   AI calls are queued for non-blocking operations (mood board generation, sponsor deck creation, post-event report) --- the user receives a \'generating\' state and a push notification when ready

-   Real-time AI features (event day problem solver, budget alerts) are synchronous with a 10-second timeout and a graceful degradation fallback

-   Rate limiting on the AI Edge Function is handled via a Supabase table tracking API calls per workspace per day, with plan-based limits

**10.4 File Storage Scalability**

-   Supabase Storage uses S3-compatible object storage. Files are organized in buckets by purpose: contracts, media, brand-assets, exports

-   Large file uploads (video) use multipart upload via Supabase Storage\'s built-in multipart support

-   CDN delivery is configured for all public-facing media (ticketing page images, mood boards, sponsor assets)

-   Storage quotas enforced per workspace tier to prevent runaway storage costs --- Starter gets 10GB, Growth gets 100GB, Scale gets 1TB

**10.5 Frontend Performance**

-   Vite code splitting --- each major module (venue, vendor, budget, event day) is a separate lazy-loaded chunk

-   React Query caching --- event data cached for 5 minutes, vendor directory cached for 30 minutes, reducing redundant API calls

-   Optimistic updates --- run sheet status changes, task completions, and check-in actions update the UI instantly before the server confirms

-   Mobile app uses Expo\'s OTA updates --- bug fixes and minor feature updates deploy without App Store review

-   Event Day Mode caches the run sheet locally on device --- if connectivity drops during an event, the run sheet remains viewable (read-only) until connection restores

**11. Integrations**

  ------------------------- -------------------------------------------------------------- ---------------------------
  **Integration**           **Purpose**                                                    **Phase**

  Razorpay                  Payment collection (tickets) + vendor payouts (UPI/NEFT)       Launch

  WhatsApp Business API     Vendor comms, guest RSVPs, payment alerts                      Launch

  Anthropic Claude API      All AI features --- blueprint, captions, briefs, debrief       Launch

  Google OAuth              Login with Google option                                       Launch

  Expo Push Notifications   Mobile push for all alert categories                           Launch

  Twilio SMS / MSG91        SMS fallback for RSVPs and critical alerts                     Launch

  Resend / SendGrid         Transactional emails: invites, confirmations, reports          Launch

  Google Maps API           Venue map view, proximity calculations, address autocomplete   Launch

  Instagram Graph API       Social listening on event day, UGC collection                  Phase 2

  Slack                     Team notification forwarding for corporate customers           Phase 2

  Zoho CRM / Salesforce     Guest list import from CRM systems                             Phase 2

  Tally / QuickBooks        Finance data export for accounting teams                       Phase 2

  Luma / Lu.ma              Calendar event publishing for community-facing events          Phase 3
  ------------------------- -------------------------------------------------------------- ---------------------------

**12. Monetization & Subscription Tiers**

  -------------------- ----------------------- ------------------------ -------------------------- ------------------------
  **Feature**          **Starter ₹4,999/mo**   **Growth ₹14,999/mo**    **Scale ₹39,999/mo**       **Enterprise**

  Events per year      3                       10                       Unlimited                  Unlimited

  Team members         1                       5                        20                         Custom

  AI features          Basic blueprint         Full AI suite            Full AI suite              Full + Custom

  Ticketing capacity   500 per event           5,000 per event          Unlimited                  Unlimited

  Vendor marketplace   Directory only          Full marketplace + RFQ   Full marketplace + RFQ     Full marketplace + RFQ

  White-labeling       No                      No                       Guest-facing touchpoints   Full white-label

  API access           No                      No                       Yes                        Yes + custom webhooks

  Storage              10 GB                   100 GB                   1 TB                       Custom

  Account manager      No                      No                       Yes                        Dedicated CSM
  -------------------- ----------------------- ------------------------ -------------------------- ------------------------

**12.1 Transaction Revenue**

-   1.5% platform fee on all ticket sales processed through the platform (on top of Razorpay payment processing fees)

-   3% platform fee on vendor bookings made through the marketplace where Orqestra facilitates the payment

-   Vendor premium listing --- vendors can pay for promoted placement in search results (launched Phase 2)

**13. Complete Screen Inventory**

**13.1 Web App --- All Screens**

**Authentication & Onboarding**

-   Landing / Marketing Page

-   Sign Up

-   Email Verification Pending

-   Onboarding Step 1 --- Brand Profile

-   Onboarding Step 2 --- Budget Range

-   Onboarding Step 3 --- Event Types

-   Onboarding Step 4 --- Import Vendors

-   Onboarding Step 5 --- Invite Team

-   Login

-   Forgot Password

-   Workspace Selector

**Dashboard & Global**

-   Home Dashboard

-   Notification Center

-   Global Calendar View

-   Global Finance Overview

-   Global Reports

-   Team Management

-   Workspace Settings

-   Billing & Subscription

-   Integrations Settings

-   Brand Profile Settings

**Venue Module**

-   Venue Discovery --- Map View

-   Venue Discovery --- List View

-   Venue Detail Page

-   Venue Layout Studio (3D builder)

-   Venue Shortlist (within event)

**Vendor Module**

-   Vendor Marketplace --- Browse

-   Vendor Category Page

-   Vendor Profile Page

-   RFQ Compose Screen

-   RFQ Proposals Comparison

-   Contract Upload / Sign

-   Payment Schedule Screen

-   Vendor Communication Thread

-   My Vendors (imported/existing)

**Event Module (Per Event)**

-   Event Overview / Health Score

-   AI Blueprint Review Screen

-   Planning --- Venue Shortlist

-   Planning --- Mood Board Studio

-   Planning --- Decor Layout

-   Planning --- Trend Engine

-   Vendor --- Shortlist & RFQs

-   Vendor --- Contracts

-   Vendor --- Payment Schedule

-   Guests --- Import & Manage

-   Guests --- RSVP Tracker

-   Guests --- Seating Chart

-   Guests --- Ticketing Page Builder

-   Guests --- Public Ticketing Page (public-facing)

-   Guests --- Check-In (event day web view)

-   Team --- Task Board

-   Team --- Run Sheet Builder

-   Team --- Role Assignment

-   Team --- Briefing Documents

-   Budget --- Builder & Tracker

-   Budget --- Invoice Management

-   Budget --- GST & Tax Summary

-   Sponsors --- Tier Builder

-   Sponsors --- Deliverable Tracker

-   Sponsors --- Sponsor Portal (external, limited access)

-   Content --- Social Calendar

-   Content --- Caption Generator

-   Content --- Shot List Builder

-   Content --- Content Collection Hub

-   Content --- Social Listening (event day)

-   Event Day --- Command Center (web)

-   Post-Event --- Report View

-   Post-Event --- Feedback Dashboard

-   Post-Event --- AI Debrief Session

-   Post-Event --- Brand Equity Tracker

-   Post-Event --- Event Archive

**Vendor Portal (Separate Light App)**

-   Vendor Login / Registration

-   Vendor Profile Setup

-   Active Briefs List

-   Brief Detail View

-   Proposal Submission

-   Contract Review & Sign

-   Invoice Upload

-   Payment Status Tracker

-   Portfolio Manager

-   Event Day Check-In Confirmation

**13.2 Mobile App --- All Screens**

**Authentication**

-   Splash Screen

-   Login

-   Sign Up (simplified)

-   Onboarding Quick Flow (5 steps, mobile-optimized)

**Tab: Home**

-   Home Dashboard

-   Notifications

**Tab: Events**

-   Events List

-   Event Overview

-   Vendor List (within event)

-   Vendor Chat

-   Guest List (within event)

-   Task Board

-   Run Sheet (planning view)

-   Budget Summary

**Tab: Day Mode**

-   Day Mode Home --- Event Selector

-   Live Run Sheet

-   Check-In Dashboard

-   QR Scanner

-   Vendor Status Board

-   Incident Log

-   Raise Incident Form

-   Emergency Protocols

-   Live Door Count

-   Social Listening Feed

**Tab: Vendors**

-   Vendor Search

-   Vendor Profile

-   My Vendors

-   Vendor Chat

**Tab: More**

-   Profile & Settings

-   Workspace Settings

-   Notification Preferences

-   Help & Support

-   Switch Workspace

**14. Development Phases --- Roadmap to Production**

**Phase 0 --- Foundation (Weeks 1 to 4)**

-   Supabase project setup: database schema, RLS policies, auth configuration

-   Design system: color palette, typography, component library in Figma, Tailwind config

-   Web: Vite + React project structure, routing, auth flow, Supabase client setup

-   Mobile: Expo project setup, navigation structure, Supabase client, push notification configuration

-   Environments: dev, staging, production configured on Supabase

-   CI/CD pipeline: GitHub Actions for web deploy (Vercel or Netlify), Expo EAS Build for mobile

**Phase 1 --- MVP Core (Weeks 5 to 16)**

-   Authentication complete (web + mobile)

-   Onboarding flow complete

-   Event creation + AI Blueprint (core AI integration done)

-   Venue discovery (static database of 200 venues across Mumbai and Delhi)

-   Vendor marketplace (static database of 300 vendors across core categories in Mumbai and Delhi)

-   Guest management + basic ticketing (invite-only and free RSVPs)

-   Budget builder (manual, no AI predictions yet)

-   Team management + run sheet builder

-   Event Day Mode on mobile (run sheet, incidents, check-in)

-   Basic post-event report (manual data)

**Phase 2 --- AI & Payments (Weeks 17 to 28)**

-   Full AI feature suite (all 14 AI features from Section 7)

-   Paid ticketing with Razorpay

-   Vendor payment flow with UPI payouts

-   WhatsApp integration for vendor communication

-   Contract management with e-signature

-   Sponsorship module complete

-   Content & social calendar

-   GST + tax tracking

-   Post-event intelligence complete (AI debrief, brand equity tracker)

**Phase 3 --- Scale & Expansion (Weeks 29 to 52)**

-   Vendor portal launch (separate web app)

-   Sponsor portal launch

-   Bangalore and Hyderabad venue and vendor coverage

-   3D venue layout builder

-   Advanced guest behavior prediction

-   Social listening integration

-   API access for Scale tier

-   White-labeling for Scale tier

-   Tier 2 city expansion: Pune, Jaipur, Kochi

-   Hindi language support

-   Wedding & social event type intelligence

**15. Non-Functional Requirements**

**15.1 Performance**

-   Web app initial load time under 2 seconds on a 4G connection (India average)

-   Page-to-page navigation under 300ms for cached routes

-   AI Blueprint generation under 8 seconds --- user sees a loading state with progressive content reveal

-   Event Day Mode run sheet updates reflected across devices within 2 seconds (Realtime SLA)

-   QR check-in scan-to-confirmation under 1 second

**15.2 Reliability**

-   Target uptime: 99.5% for all environments (Supabase Pro SLA is 99.5%)

-   Event Day Mode has offline fallback --- run sheet readable offline, actions queued and synced on reconnection

-   Database backups: Supabase automated daily backups with 7-day retention on Pro, 30-day on Enterprise

-   Zero data loss guarantee on event day actions --- all mutations are queued client-side if connectivity drops

**15.3 Security**

-   Row-Level Security enforced at the database layer --- no cross-workspace data access possible regardless of application bugs

-   JWT tokens expire in 1 hour. Refresh tokens expire in 7 days.

-   All file uploads scanned for malicious content via Supabase Storage security rules

-   No PII stored in AI prompt context --- guest names and contact details are pseudonymized before being sent to the AI API

-   DPDP Act (India Digital Personal Data Protection Act) compliance roadmap --- consent management, data deletion workflows, and data localization strategy documented for Phase 3

-   Vendor contract files and financial documents stored in private Supabase Storage buckets with signed URL access (24-hour expiry on download links)

**15.4 Accessibility**

-   WCAG 2.1 AA compliance target for the web app

-   All interactive elements have keyboard navigation support

-   Color contrast ratios meet AA standards across all UI components

-   Screen reader support for core workflows (authentication, event creation, run sheet)

**15.5 Mobile-Specific**

-   iOS 15+ and Android 11+ support

-   Optimized for both phone and tablet (iPad layout for run sheet and event day command center)

-   Dark mode support in mobile app --- critical for event day use in dark venues

-   Battery-efficient: Realtime subscriptions use exponential backoff when app is backgrounded

**16. Open Questions & Decisions Pending**

  ---------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------
  **Question**                                                                             **Options / Notes**

  Facial recognition check-in: build in-house or integrate third-party?                    Third-party (e.g., Innovatrics or FaceFirst) preferred. Requires DPDP Act consent flow. Defer to Phase 3.

  3D layout builder: build custom or embed a third-party (e.g., Matterport, Roomstyler)?   Custom build gives more control and cost efficiency at scale. Third-party faster to launch. Recommend third-party for Phase 1, migrate in Phase 3.

  Vendor onboarding: self-serve or curated?                                                Curated for first 6 months (quality control). Self-serve with approval queue from Month 7 onward.

  AI model: Anthropic Claude API only, or multi-model?                                     Start with Claude only. Evaluate adding a smaller, cheaper model for high-volume, lower-stakes AI calls (caption generation) in Phase 3.

  Mobile app distribution: Expo Go for beta, or direct EAS build?                          EAS Build from Day 1. Expo Go limitations (notifications, camera) make it unsuitable beyond internal testing.

  WhatsApp BSP (Business Solution Provider): which to use?                                 Recommend Gupshup or Wati for India-optimized WhatsApp Business API access. Evaluate on pricing and throughput limits.
  ---------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------

**17. Glossary**

  ------------------------ -------------------------------------------------------------------------------------------------------------------
  **AI Blueprint**         The AI-generated event plan produced at event creation, covering venue, vendors, budget, timeline, and risk flags

  **Event Health Score**   A real-time readiness score (0-100) across 12 dimensions, visible on every event overview

  **RFQ**                  Request for Quote --- a structured brief sent to vendors asking for pricing and availability proposals

  **Run Sheet**            The minute-by-minute schedule for an event, shared across all team members in real time

  **Event Day Mode**       A simplified mobile interface that activates 24 hours before an event, optimized for on-ground use

  **AI Memory System**     Workspace-level insights derived from past events, fed back into future AI Blueprint generation

  **Vendor Risk Score**    A platform-generated score per vendor based on completion rate, dispute history, and no-show record

  **ITC**                  Input Tax Credit --- GST paid on vendor invoices that a registered brand can claim back

  **TDS**                  Tax Deducted at Source --- applicable to professional service payments in India

  **NOC**                  No Objection Certificate --- required from police and other authorities for large events

  **FSSAI**                Food Safety and Standards Authority of India --- license required for events with food and beverage

  **RLS**                  Row-Level Security --- Supabase / PostgreSQL feature that enforces data access rules at the database level

  **Edge Function**        Supabase serverless function that runs API calls, AI calls, and background processing jobs

  **UGC**                  User Generated Content --- photos and videos created by event attendees organically

  **BSP**                  Business Solution Provider --- authorized WhatsApp Business API access partner

  **DPDP Act**             Digital Personal Data Protection Act --- India\'s primary data privacy legislation, enacted 2023
  ------------------------ -------------------------------------------------------------------------------------------------------------------

*End of Document --- Orqestra PRD v1.0*

Prepared for Antigravity \| Confidential