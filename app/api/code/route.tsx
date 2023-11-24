import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
    const data = await req.json();

    console.log(data);

    const requestMethod = req.method;

  return NextResponse.json({ message: `--- ${data}` });

}
