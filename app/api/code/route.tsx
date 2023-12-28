import { NextRequest, NextResponse } from "next/server";
import {runAudit} from '@/server/modules/audit/gpt_auditor'
import removeAnnotations from '@/server/modules/audit/preprocess'
export async function POST(req: NextRequest) {
    try {
        const request = await req.json();
        const sourceCode = request.sourcecode;
        const processedCode = removeAnnotations(sourceCode);
        const findings = await runAudit(processedCode,'gpt-4', 0.7, 3, 1,true);
        console.log({findings})
        return NextResponse.json({findings});

    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch data" });
    }


}