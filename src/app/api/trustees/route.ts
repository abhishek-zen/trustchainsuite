
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Utility for extracting user from Supabase session
async function getUser(req: NextRequest) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// GET: List trustee policies for user
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient();
  const { data: policies, error } = await supabase
    .from("trustee_policies")
    .select("*")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(policies);
}

// POST: Create a new trustee policy
export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { trustee_id, policy_type, resource, notes } = body;

  if (!trustee_id || !policy_type || !resource) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("trustee_policies")
    .insert([
      {
        user_id: user.id,
        trustee_id,
        policy_type,
        resource,
        notes: notes ?? "",
      },
    ])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

// DELETE: Remove a trustee policy by id
export async function DELETE(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase
    .from("trustee_policies")
    .delete()
    .match({ id, user_id: user.id });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
