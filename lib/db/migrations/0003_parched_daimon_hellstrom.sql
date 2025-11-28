ALTER TABLE "invoices" ALTER COLUMN "subtotal" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "total" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "total_usd" integer NOT NULL;