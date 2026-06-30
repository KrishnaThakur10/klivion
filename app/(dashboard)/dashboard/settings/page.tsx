import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { SettingsPage } from "@/components/settings-page"

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) return null

  const settings = await db.userSettings.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <SettingsPage
      initialSettings={{
        businessName: settings?.businessName ?? "",
        phone: settings?.phone ?? "",
        address: settings?.address ?? "",
        website: settings?.website ?? "",
        paymentProvider: settings?.paymentProvider ?? "razorpay",
        razorpayKeyId: settings?.razorpayKeyId ?? "",
        razorpaySecret: settings?.razorpaySecret ?? "",
        cashfreeAppId: settings?.cashfreeAppId ?? "",
        cashfreeSecretKey: settings?.cashfreeSecretKey ?? "",
      }}
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
      userImage={session.user.image ?? null}
    />
  )
}