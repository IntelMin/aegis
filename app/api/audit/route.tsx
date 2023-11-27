
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);
const { AEGIS_SRV } = process.env;
export default async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const url = `http://${AEGIS_SRV}/`;
    const address = data.address;
    
    const info = await axios.get(url+`info/${address}`).then(res => res.data);
    if (info.metadata){
        const audit = await axios.get(url+`code/${address}`).then(res => res.data);
    }
    if (info.error) {
        return NextResponse.json({ error: info.error });
    }
    // Your code to process the address input goes here
    
}

// export async function GET(req: NextRequest, res: NextResponse) {
//     const { address } = req.query;
//     const data = await req.json();

//     // Query the Supabase table for the status row based on the address input
//     const { data, error } = await supabase
//         .from('your_table_name')
//         .select('*')
//         .eq('address', address)
//         .single();

//     if (error) {
//         return NextResponse.json({ error });
//     }

//     return NextResponse.json({ data });
// }
