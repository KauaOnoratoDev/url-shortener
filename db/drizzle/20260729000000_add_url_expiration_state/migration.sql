CREATE TYPE "user_plan" AS ENUM ('free', 'premium');
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" "user_plan" DEFAULT 'free' NOT NULL;
--> statement-breakpoint
ALTER TABLE "short_urls" ADD COLUMN "expired" boolean DEFAULT false NOT NULL;
