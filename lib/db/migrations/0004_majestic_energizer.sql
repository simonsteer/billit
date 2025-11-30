CREATE TABLE "clients" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"contact_information" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
DROP INDEX "user_id_idx";--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "client_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "index_clients_on_user_id" ON "clients" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "index_invoices_on_user_id" ON "invoices" USING btree ("user_id");