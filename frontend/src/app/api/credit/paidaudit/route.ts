import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
        return NextResponse.json({ status: "error" }, { status: 401 })
    }
    const request = await req.json()
    const { address, type } = request
    const user = await db.user.findUnique({ where: { email: email } })
    if (!user) {
        return NextResponse.json({ status: "error" }, { status: 401 })
    }
    const id = user?.id
    const paid_audits = await db.paid_audits.findMany({
        where: { user_id: Number(id), address: address },
    })
    if (!paid_audits) {
        return NextResponse.json({ status: "error" }, { status: 401 })
    }
    const paid_audit = paid_audits.find((audit: any) => audit.address === address)
    if (!paid_audit) {
        return NextResponse.json({ status: "error" }, { status: 401 })
    }
    if (paid_audit?.type !== type) {
        return NextResponse.json({ status: "error" }, { status: 401 })
    }

    return NextResponse.json({ status: "success", paid_user: true })
}

