
import axios from 'axios';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const AEGIS_SRV = process.env.AEGIS_SRV || "localhost:9898"
export async function POST(req: NextRequest) {
try {
    const data = await req.json();
    console.log(data);
    const url = `${AEGIS_SRV}/audit/`;
    const address = data.address;
    console.log(url);
    const response = await axios.post(url, { address })
    const Newdata = await response.data
    return NextResponse.json({Newdata});
} catch (error) {NextResponse.json(error);}
}
export async function GET(req: NextRequest, res: NextResponse) {
    // export async function GET(req: NextRequest, res: NextResponse) {

    // Query the Supabase table for the status row based on the address input
   try{
    const {searchParams}= new URL(req.url);
    console.log(searchParams)
    const address = searchParams.get('address');
    console.log(address)
    // const address = "0xdac17f958d2ee523a2206206994597c13d831ec7"
    const url = `${AEGIS_SRV}/`;
    const formated =`${url}audit/${address}`
    console.log(formated);
    const response = await axios.get(formated)

    const Newdata = await response.data
    return NextResponse.json({ Newdata });
}
    catch (error) {NextResponse.json(error);}
}