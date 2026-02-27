import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

interface ReminderPayload {
  event_id: string;
  workspace_id: string;
  mode?: "manual" | "auto";
}

Deno.serve(async (req) => {
  const { event_id, workspace_id, mode = "auto" } = await req.json() as ReminderPayload;

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  console.log(`RSVP Reminder Engine started for event ${event_id} (Mode: ${mode})`);

  try {
    const { data: pendingGuests, error: guestError } = await supabaseAdmin
      .from("guests")
      .select("id, name, email, rsvp_status")
      .eq("event_id", event_id)
      .eq("rsvp_status", "pending");

    if (guestError) throw guestError;

    if (!pendingGuests || pendingGuests.length === 0) {
      return new Response(JSON.stringify({ message: "No pending guests to remind." }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const reminderLogs = [];
    for (const guest of pendingGuests) {
      const { count } = await supabaseAdmin
        .from("guest_reminders")
        .select("*", { count: "exact", head: true })
        .eq("guest_id", guest.id);

      const reminderType = (count ?? 0) === 0 ? "initial" : "follow_up";

      reminderLogs.push({
        workspace_id,
        event_id,
        guest_id: guest.id,
        reminder_type: reminderType,
        status: "sent",
        metadata: { channel: "email", mode }
      });
    }

    if (reminderLogs.length > 0) {
      const { error: logError } = await supabaseAdmin
        .from("guest_reminders")
        .insert(reminderLogs);
      if (logError) throw logError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      sent: reminderLogs.length,
      message: `Processed ${reminderLogs.length} reminders.` 
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
