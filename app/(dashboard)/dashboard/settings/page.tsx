import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { SettingsClient } from "@/components/settings-client"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const settings = await db.userSettings.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and payment settings
        </p>
      </div>
      <SettingsClient
        initialSettings={settings}
        userName={session.user.name ?? ""}
        userEmail={session.user.email ?? ""}
        userImage={session.user.image ?? null}
      />
    </div>
  )
}