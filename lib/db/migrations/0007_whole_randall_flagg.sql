ALTER TABLE "clients" ADD COLUMN "address_line_1" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "address_line_2" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "zip_code" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "client_information";