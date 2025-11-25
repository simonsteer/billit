CREATE TYPE "public"."currencies" AS ENUM('AED', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'PHP', 'PLN', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'USD', 'VND', 'ZAR');--> statement-breakpoint
CREATE TABLE "invoices" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"from_description" text NOT NULL,
	"to_description" text NOT NULL,
	"payment_description" text NOT NULL,
	"invoice_number" integer NOT NULL,
	"date_issued" date NOT NULL,
	"date_due" date NOT NULL,
	"date_paid" date,
	"currency" "currencies" NOT NULL,
	"line_items" jsonb NOT NULL,
	"tax_items" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"total" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "invoices" USING btree ("user_id");