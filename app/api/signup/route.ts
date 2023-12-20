import supabase from "@/server/supabase";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/resend";
import  hashString  from "@/app/utils/hash"

export async function POST(req: NextRequest, res: NextResponse) {
    const {
        name,
        email,
        password,
        projectname,
        website,
        tokenAddress,
        teleAccount,
        projectX,
        projectInsta,
        projectEmail,
        twitter,
        teleId,
        about,
        vcContactName,
        vcEmail,
        role
    } = (await req.json()) as {
        email: string;
        password: string;

        projectname: string,
        website: string,
        tokenAddress: string,
        teleAccount: string,
        projectX: string,
        projectInsta: string,
        role: string,
        // individual
        name: string,
        twitter: string,
        teleId: string,
        about: string,
        // vc
        vcContactName: string,
        vcEmail: string,
        // team
        projectEmail: string,
    };
    let hashed_password = await hashString(password);
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (user) {
        return NextResponse.json("user already exists", { status: 400 })
    }
    const { data, error: error2 } = await supabase.from("users").insert([{ email:email,
        password:hashed_password,
        project_name: projectname,
        website,
        token_address: tokenAddress,
        tele_account: teleAccount,
        project_x: projectX,
        project_insta: projectInsta,
        project_email: projectEmail,
        twitter,
        tele_id: teleId,
        about,
        vc_contact_name: vcContactName,
        vc_email: vcEmail,
        role
    }]);
    if (error2) {
        console.log(error2, "error")
        return NextResponse.json("error creating user")
    }
    const html = `<h1>Welcome to Aegis, ${name}!</h1>`
    await sendEmail(email, name, html);

    return NextResponse.json({ data: data });
}