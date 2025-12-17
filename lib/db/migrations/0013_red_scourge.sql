ALTER TABLE "invoices" ALTER COLUMN "date_paid" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paid_at" date;