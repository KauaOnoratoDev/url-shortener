CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX "refresh_tokens_expires_in_idx" ON "refresh_tokens" USING btree ("expiresIn");
--> statement-breakpoint
CREATE INDEX "short_urls_user_id_idx" ON "short_urls" USING btree ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX "short_urls_alias_unique_idx" ON "short_urls" USING btree ("alias");
--> statement-breakpoint
CREATE TABLE "short_url_identifiers" (
	"identifier" text PRIMARY KEY,
	"shortUrlId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "short_url_identifiers" ADD CONSTRAINT "short_url_identifiers_shortUrlId_short_urls_id_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "short_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
--> statement-breakpoint
CREATE INDEX "short_url_identifiers_short_url_id_idx" ON "short_url_identifiers" USING btree ("shortUrlId");
--> statement-breakpoint
INSERT INTO "short_url_identifiers" ("identifier", "shortUrlId")
SELECT "shortUrlCode", "id"
FROM "short_urls"
WHERE "shortUrlCode" IS NOT NULL
UNION ALL
SELECT "alias", "id"
FROM "short_urls"
WHERE "alias" IS NOT NULL;
--> statement-breakpoint
CREATE FUNCTION "sync_short_url_identifiers"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
	IF TG_OP = 'UPDATE' THEN
		DELETE FROM "short_url_identifiers"
		WHERE "shortUrlId" = NEW."id";
	END IF;

	IF NEW."shortUrlCode" IS NOT NULL THEN
		INSERT INTO "short_url_identifiers" ("identifier", "shortUrlId")
		VALUES (NEW."shortUrlCode", NEW."id");
	END IF;

	IF NEW."alias" IS NOT NULL THEN
		INSERT INTO "short_url_identifiers" ("identifier", "shortUrlId")
		VALUES (NEW."alias", NEW."id");
	END IF;

	RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER "short_urls_identifiers_sync"
AFTER INSERT OR UPDATE OF "shortUrlCode", "alias"
ON "short_urls"
FOR EACH ROW
EXECUTE FUNCTION "sync_short_url_identifiers"();
