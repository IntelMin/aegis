import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { stat } from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
        return NextResponse.json({ error: "Not logged in" })
    }

    const user = await db.user.findUnique({
        where: {
            email: email
        }
    })
    if (!user) {
        return NextResponse.json({ error: "No User found" })
    }
    const user_meta = await db.user_meta.findUnique({
        where: {
            user_id: user.id
        }
    })
    return NextResponse.json({ user: user, user_meta: user_meta })
}
export async function POST(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const request = await req.json()
    const { name, emailmew, type, social_twitter, social_telegram, social_insta, social_discord } = request

    if (!email) {
        return NextResponse.json({ error: "Not logged in" })
    }
    const user = await db.user.findUnique({
        where: {
            email: email
        }
    })
    if (!user) {
        return NextResponse.json({ error: "No User found" })
    }
    const user_update = await db.user.update({
        where: {
            id: user.id
        },
        data: {
            username: name,
            email: emailmew,
            role: type
        }
    })
    const user_meta_update = await db.user_meta.update({
        where: {
            user_id: user.id
        },
        data: {
            social_twitter: social_twitter,
            social_telegram: social_telegram,
            social_instagram: social_insta,
            social_discord: social_discord
        }
    })

    return NextResponse.json({ status: "success" })
}