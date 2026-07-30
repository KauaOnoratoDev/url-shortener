CREATE TYPE "device_type" AS ENUM ('desktop', 'mobile', 'tablet', 'unknown');
--> statement-breakpoint
CREATE TABLE "url_accesses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "url_accesses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"shortUrlId" integer NOT NULL,
	"accessedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"browser" varchar(100) DEFAULT 'Unknown' NOT NULL,
	"operatingSystem" varchar(100) DEFAULT 'Unknown' NOT NULL,
	"deviceType" "device_type" DEFAULT 'unknown' NOT NULL,
	"country" varchar(100),
	"state" varchar(100),
	"city" varchar(150)
);
--> statement-breakpoint
CREATE TABLE "url_analytics_legacy" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "url_analytics_legacy_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"shortUrlId" integer NOT NULL,
	"accessCount" integer NOT NULL CONSTRAINT "url_analytics_legacy_access_count_check" CHECK ("accessCount" >= 0)
);
--> statement-breakpoint
INSERT INTO "url_analytics_legacy" ("shortUrlId", "accessCount")
SELECT "id", "clicks"
FROM "short_urls"
WHERE "clicks" > 0;
--> statement-breakpoint
ALTER TABLE "short_urls" DROP COLUMN "clicks";
--> statement-breakpoint
ALTER TABLE "url_accesses" ADD CONSTRAINT "url_accesses_shortUrlId_short_urls_id_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "short_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
--> statement-breakpoint
ALTER TABLE "url_analytics_legacy" ADD CONSTRAINT "url_analytics_legacy_shortUrlId_short_urls_id_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "short_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
--> statement-breakpoint
CREATE INDEX "url_accesses_short_url_accessed_at_idx" ON "url_accesses" USING btree ("shortUrlId", "accessedAt");
--> statement-breakpoint
CREATE INDEX "url_accesses_short_url_browser_idx" ON "url_accesses" USING btree ("shortUrlId", "browser");
--> statement-breakpoint
CREATE INDEX "url_accesses_short_url_os_idx" ON "url_accesses" USING btree ("shortUrlId", "operatingSystem");
--> statement-breakpoint
CREATE INDEX "url_accesses_short_url_device_idx" ON "url_accesses" USING btree ("shortUrlId", "deviceType");
--> statement-breakpoint
CREATE INDEX "url_accesses_short_url_location_idx" ON "url_accesses" USING btree ("shortUrlId", "country", "state", "city");
--> statement-breakpoint
CREATE UNIQUE INDEX "url_analytics_legacy_short_url_id_idx" ON "url_analytics_legacy" USING btree ("shortUrlId");
