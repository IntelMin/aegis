import supabase from "@/server/supabase";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

export default async function POST(req:NextRequest, res:NextResponse) {
    const { name, email, password } = (await req.json()) as {
        name: string;
        email: string;
        password: string;
      };
      console.log("name=======>", name)
      const hashed_password = await hash(password, 12);
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()
    if (user) {
        return "user already exist";
    }
    const { data, error: error2 } = await supabase.from("users").insert([{ name,email, hashed_password, }]);
    if (error2) {
        console.log(error2)
        return "error creating user";
    }
    return data;
}