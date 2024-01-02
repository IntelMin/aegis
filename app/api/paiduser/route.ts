
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const request = await req.json();
  const { email, token } = request;
  try {
    const paiduser = await supabase
      .from("paid_users")
      .select("*")
      .eq("email", email)
      .eq("paid_token", token);
    if (paiduser.error) return NextResponse.error();
    if (paiduser.data.length === 0)
      return NextResponse.json({ paiduser: false });
    return NextResponse.json({ paiduser: true });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

