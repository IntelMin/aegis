import supabase from "@/server/supabase";
import { hashString } from "@/server/utils";
import { NextRequest, NextResponse } from "next/server";


export default async function POST(req: NextRequest, res: NextResponse) {
    const { name, email, password } = (await req.json()) as {
        name: string;
        email: string;
        password: string;
    };
    console.log("name=======>", name)
    const hashed_password = hashString(password);
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()
    if (user) {
        return "user already exist";
    }
    const { data, error: error2 } = await supabase.from("users").insert([{ name, email, hashed_password, }]);
    if (error2) {
        console.log(error2)
        return "error creating user";
    }
    return data;
}