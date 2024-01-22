import { authOptions } from '@/lib/auth';
import { creditConfig } from '@/lib/credit-config';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
type creditconfigType = keyof typeof creditConfig

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  const user = await db.user.findUnique({ where: { email: email } })
  const id = user?.id
  const request = await req.json()
  const { type } = request
  if (!id) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  const selected_type = ["detailed", "report", "quick", "code"].find((t) => t === type)
  if (!selected_type) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  const requested_credit = creditConfig[type as creditconfigType]

  const user_credit = await db.credit_balance.findFirst({
    where: { user_id: Number(id) },
  })

  if (!user_credit) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  if (requested_credit === null || requested_credit === undefined) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  if (user_credit?.credits < requested_credit) {
    const url = new URL("/payment", req.nextUrl)
    return NextResponse.redirect("/payment")
  }
  try {
    const insert_tx = await db.credit_transactions.create({
      data: {
        type: selected_type,
        cost: requested_credit,
        created_at: new Date(),
        user: {
          connect: {
            id: Number(id)
          }
        }
      }
    })
    const updated_credit = await db.credit_balance.update({
      where: { user_id: Number(id) },
      data: {
        credits: user_credit?.credits - requested_credit,
      }
    })
    console.log(updated_credit)
    console.log(insert_tx)
    if (!updated_credit || !insert_tx) {
      return NextResponse.error()
    }
    const { address } = request
    const insert_audit = await db.paid_audits.create({
      data: {
        address: address ? address : " ",
        credit_transaction_id: id,
        type: selected_type,

        user: {
          connect: {
            id: Number(id)
          }
        },
      }
    })


    return NextResponse.json({ status: "success", allow: selected_type, credits: updated_credit.credits })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ status: "error" }, { status: 401 })
  }

}
