import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
    const data = await req.json();

    console.log(data);

    const requestMethod = req.method;
    // const body = JSON.parse(req.body);
    // const { sourcecode } = body;
  //   const response = await fetch(
  //     `https://polygon.api.0x.org/swap/v1/price?${query}`,
  //     {
  //       headers: {
  //         "0x-api-key": "c9f13c84-9fcb-4f42-aa30-a11b0d016aa5", // process.env.NEXT_PUBLIC_0X_API_KEY,
  //       },
  //     }
  //   );

  //   const data = await response.json();

  //   res.status(200).json(data);
  return NextResponse.json({ message: `You submitted the following data: ${data}` });
//   res
//     .status(200)
//     .json({ message: `You submitted the following data: ${body}` });
}

// export default function handler(req, res) {

//     res.status(200).json({ message: `You submitted the following data: ${body}` })

//   }
