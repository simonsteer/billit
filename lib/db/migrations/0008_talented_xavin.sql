CREATE TABLE "business_profiles" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_name" text,
	"address_line_1" text,
	"address_line_2" text,
	"city" text,
	"zip_code" text,
	"state" text,
	"country" text,
	"email" text
);
--> statement-breakpoint
CREATE INDEX "index_business_profiles_on_user_id" ON "business_profiles" USING btree ("user_id");