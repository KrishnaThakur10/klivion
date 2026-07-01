export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    limits: {
      proposalsPerMonth: 3,
      invoicesPerMonth: 5,
      clientsTotal: 5,
    },
    features: {
      payments: false,
      aiProposals: false,
    },
  },
  pro: {
    name: "Pro",
    price: 499,
    limits: {
      proposalsPerMonth: 999999,
      invoicesPerMonth: 999999,
      clientsTotal: 999999,
    },
    features: {
      payments: true,
      aiProposals: true,
    },
  },
} as const

export type Plan = keyof typeof PLANS

export function getPlanLimits(plan: string) {
  return PLANS[plan as Plan]?.limits ?? PLANS.free.limits
}

export function getPlanFeatures(plan: string) {
  return PLANS[plan as Plan]?.features ?? PLANS.free.features
}

// Get start of current month in UTC
export function getMonthStart(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}