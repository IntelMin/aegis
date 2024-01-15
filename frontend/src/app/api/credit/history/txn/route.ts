import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
        return NextResponse.json({ status: 401, message: "Unauthorized" })
    }
    const user = await db.user.findFirst({
        where: {
            email
        }
    })
    if (!user) {
        return NextResponse.json({ status: 404, message: "User not found" })
    }
    const txn = await db.credit_transactions.findMany({
        where: {
            user_id: user.id
        },
        orderBy: {
            created_at: "desc"
        }
    })
    if (!txn) {
        return NextResponse.json({ status: 200, message: "No transactions found" })
    }
    return NextResponse.json({ status: 200, txn })

}