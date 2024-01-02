import { NextRequest,NextResponse } from "next/server";
import supabase from "@/server/supabase";

export async function POST(req: NextRequest,res: NextResponse) {
    const request  = await req.json();
    
    console.log(request);
    const {email,token} = request;
    const paiduser = await supabase.from('paid_users').insert({email:email,paid_token:token});
    console.log(paiduser);
    if(paiduser.error) return NextResponse.error();
    if(paiduser?.data) return NextResponse.json({paiduser:false});
    return NextResponse.json({paiduser:true});
}