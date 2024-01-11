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
    const request = await req.json()
    const { user_id } = request
    if (!user_id) {
        return NextResponse.error()
    }
    try {
        const user = await db.user.findUnique({
            where: { id: user_id }
        })
        const toggle_user = await db.user.update({
            where: { id: user_id },
            data: {
                whitelisted: !user?.whitelisted,
                updated_at: new Date()
            }
        })
        if (!toggle_user) {
            return NextResponse.error()
        }
        return NextResponse.json(toggle_user)
    } catch (e) {
        return NextResponse.error()
    }
}