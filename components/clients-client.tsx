"use client"

import { useState, useTransition } from "react"
import { createClient, deleteClient } from "@/app/actions/clients"
import { Users, Plus, Trash2, Building2, Mail, Phone } from "lucide-react"

type Client = {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  createdAt: Date
}

export function ClientsClient({ clients }: { clients: Client[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function handleSubmit(formData: FormData) {
    setError("")
    startTransition(async () => {
      const result = await createClient(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setShowForm(false)
      }
    })
  }

  function handleDelete(clientId: string) {
    startTransition(async () => {
      await deleteClient(clientId)
    })
  }

  return (
    <div>
      {/* Add Client Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mb-6"
      >
        <Plus className="w-4 h-4" />
        Add Client
      </button>

      {/* Add Client Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">New Client</h2>
          <form action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="John Doe"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="john@company.com"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Company</label>
              <input
                name="company"
                placeholder="Acme Corp"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <input
                name="phone"
                placeholder="+91 98765 43210"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && (
              <p className="col-span-2 text-sm text-red-500">{error}</p>
            )}
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Saving..." : "Save Client"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients List */}
      {clients.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-1">No clients yet</h3>
          <p className="text-sm text-muted-foreground">
            Add your first client to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-card border border-border rounded-xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" /> {client.email}
                    </span>
                    {client.company && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" /> {client.company}
                      </span>
                    )}
                    {client.phone && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" /> {client.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(client.id)}
                disabled={isPending}
                className="text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}