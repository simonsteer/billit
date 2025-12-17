ALTER TABLE "invoices" ALTER COLUMN "paid_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "date_paid";