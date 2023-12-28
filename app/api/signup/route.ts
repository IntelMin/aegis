import supabase from "@/server/supabase";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/resend";
import  hashString  from "@/app/utils/hash"

export async function POST(req: NextRequest, res: NextResponse) {
    const { name, email, password,project_name, website,token_address, tele_account,project_x,project_insta,project_email,twitter,tele_id,about,vc_contact_name,vc_email,role } = (await req.json()) as {
        email: string;
        password: string;

        project_name: string,
        website: string,
        token_address: string,
        tele_account: string,
        project_x: string,
        project_insta: string,
        role: string,
        // individual
        name: string,
        twitter: string,
        tele_id: string,
        about: string,
        // vc
        vc_contact_name: string,
        vc_email: string,
        // team
        project_email: string,
    };
    let hashed_password = await hashString(password);
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (user) {
        return NextResponse.json("user already exists", { status: 400 })
    }
    const { data, error: error2 } = await supabase.from("users").insert([{ email:email, password:hashed_password,project_name, website,token_address, tele_account,project_x,project_insta,project_email,twitter,tele_id,about,vc_contact_name,vc_email,role }]);
    if (error2) {
        console.log(error2, "error")
        return NextResponse.json("error creating user")
    }
    const html = `<h1>Welcome to Aegis, ${name}!</h1>`
    await sendEmail(email, name);

    return NextResponse.json({ data: data });
}