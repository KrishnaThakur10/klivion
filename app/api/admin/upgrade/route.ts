import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  // Protected by admin secret
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { email, plan } = await req.json()

  if (!email || !["free", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const user = await db.user.update({
    where: { email },
    data: { plan, planUpdatedAt: new Date() },
  })

  return NextResponse.json({
    success: true,
    user: { email: user.email, plan: user.plan }
  })
}