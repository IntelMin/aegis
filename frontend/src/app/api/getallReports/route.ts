
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json({
            status: 'failed',
            message: 'User not logged in.',
        });
    }
    const user = await db.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        return NextResponse.json({
            status: 'failed',
            message: 'User not found.',
        });
    }
    const user_id = user.id;
    const reports = await db.report_requests.findMany({
        where: {
            status: "completed",
        },
    });

    return NextResponse.json({
        status: 'success',
        reports: reports,
    });
}