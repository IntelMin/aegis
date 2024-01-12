import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user) {
        return NextResponse.error()
    }
    if (user.role != 1) {
        return NextResponse.error()
    }
    const userstable = await db.user.findMany()
    return NextResponse.json(userstable)
}