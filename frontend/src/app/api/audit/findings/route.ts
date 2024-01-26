import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    const url = `${process.env.AEGIS_SRV}/info/summary/${address}`;

    try {
        const res = await fetch(url, {
            next: {
                revalidate: 30,
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        const med = data.table.number_of_medium_severity_issues
        const high = data.table.number_of_high_severity_issues
        const low = data.table.number_of_low_severity_issues
        return NextResponse.json({ medium: med, high: high, low: low });
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 404 });
    }
}
