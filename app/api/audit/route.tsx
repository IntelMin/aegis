
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const { AEGIS_SRV,SUPABASE_URL,SUPABASE_API_KEY } = process.env;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
export async function POST(req: NextRequest, res: NextResponse) {
    console.log("data")
    const data = await req.json();
    console.log(data)
    const url = `http://${AEGIS_SRV}/audit/`;
    const address = data.address;
    const response = await axios.post(url, { address }).then((response) => {response.data});
    return NextResponse.json({ response });
}

export async function GET(req: NextRequest, res: NextResponse,{ params }: { params: { address: string }}) {
    
    // Query the Supabase table for the status row based on the address input
    const address = params.address;
    const url = `http://${AEGIS_SRV}/`;
    const response = await axios.get(url+`/${address}`).then((response) => {response.data});
    return NextResponse.json({ response });
}
