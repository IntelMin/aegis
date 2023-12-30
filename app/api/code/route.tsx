import { NextRequest, NextResponse } from "next/server";

import axios from "axios";

const AEGIS_SRV = process.env.AEGIS_SRV as string;
export async function POST(req: NextRequest) {
    try {
        const request = await req.json();
        const sourceCode = request.sourcecode;
        const findings = await axios.post(`${AEGIS_SRV}/code`, { sourceCode })
        console.log(findings.data);
        return NextResponse.json({ findings: findings.data});
    } catch (error) {
        // console.error("Fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch data" });
    }
}