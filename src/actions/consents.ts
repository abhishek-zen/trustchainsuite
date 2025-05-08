
'use server';

import { createClient } from "@/lib/supabase/server";

// Capture a new consent
export async function captureConsent({
  subject,
  trustee,
  data_scope,
}: {
  subject: string;
  trustee: string;
  data_scope: string;
}) {
  if (!subject || !trustee || !data_scope) {
    throw new Error("Missing required consent information.");
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("consents")
    .insert([
      {
        subject,
        trustee,
        data_scope,
        status: "active",
        granted_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Revoke an existing consent
export async function revokeConsent(consentId: string) {
  if (!consentId) throw new Error("Consent ID required.");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("consents")
    .update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
    })
    .match({ id: consentId })
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}
