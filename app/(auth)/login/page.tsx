import { signIn } from "@/lib/auth"
import { Zap } from "lucide-react"

import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-5 h-5" style={{ color: "#0a0a0c" }} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Klivion</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to manage your proposals and invoices
          </p>
        </div>

        {/* GitHub Sign In */}
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/dashboard" })
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg px-4 py-3 font-medium"
          >
            <Image src="/github.svg" alt="GitHub" width={20} height={20} />
            Continue with GitHub
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our {<a href="/terms" className="text-primary underline">Terms of Service</a>}
        </p>
      </div>
    </div>
  )
}