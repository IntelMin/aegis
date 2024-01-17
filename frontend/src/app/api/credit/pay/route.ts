import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

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
  const credit_menu = [{
    name: "detailed",
    cost: 14
  },
  {
    name: 'quick',
    cost: 12,
  },
  {
    name: 'code',
    cost: 12,
  },
  {
    name: "report",
    cost: 100
  }]


  if (!id) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  const requested_credit = credit_menu.find((credit: any) => credit.name === type)

  const user_credit = await db.credit_balance.findFirst({
    where: { user_id: Number(id) },
  })

  if (!user_credit) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  if (!requested_credit) {
    return NextResponse.json({ status: "error" }, { status: 401 })
  }
  if (user_credit?.credits < requested_credit?.cost) {
    const url = new URL("/payment", req.nextUrl)
    return NextResponse.redirect("/payment")
  }
  try {
    const insert_tx = await db.credit_transactions.create({
      data: {
        type: requested_credit?.name,
        cost: requested_credit?.cost,
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
        credits: user_credit?.credits - requested_credit?.cost,
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
        type: requested_credit.name,

        user: {
          connect: {
            id: Number(id)
          }
        },
      }
    })


    return NextResponse.json({ status: "success", allow: requested_credit.name, credits: updated_credit.credits })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ status: "error" }, { status: 401 })
  }

}
