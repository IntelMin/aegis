import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Console } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    const user = await db.user.findUnique({
        where: {
            email: session?.user?.email ?? undefined
        }
    })
    if (!user) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 })
    }
    console.log(user)
    if (user.role != 0) {
        return NextResponse.json({ error: "Not admin" }, { status: 401 })
    }
    const userstable = await db.user.findMany()
    console.log(userstable)
    return NextResponse.json(userstable)
}