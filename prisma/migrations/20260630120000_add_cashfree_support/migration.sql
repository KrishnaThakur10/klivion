-- Add Cashfree support: per-freelancer provider choice for invoices,
-- and Klivion's own Cashfree subscription order tracking.

-- User: track pending subscription order for auto-upgrade webhook
ALTER TABLE "User" ADD COLUMN "pendingSubscriptionOrderId" TEXT;

-- Invoice: track which provider was used + Cashfree order/payment ids
ALTER TABLE "Invoice" ADD COLUMN "paymentProvider" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "cashfreeOrderId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "cashfreePaymentId" TEXT;

-- UserSettings: freelancer's chosen provider + Cashfree credentials
ALTER TABLE "UserSettings" ADD COLUMN "paymentProvider" TEXT NOT NULL DEFAULT 'razorpay';
ALTER TABLE "UserSettings" ADD COLUMN "cashfreeAppId" TEXT;
ALTER TABLE "UserSettings" ADD COLUMN "cashfreeSecretKey" TEXT;