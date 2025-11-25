CREATE TABLE "conversion_rates" (
	"updated_at" timestamp,
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"data" jsonb NOT NULL
);
