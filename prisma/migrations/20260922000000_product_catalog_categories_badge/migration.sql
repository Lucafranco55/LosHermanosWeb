-- Keep the schema/data transition atomic: any failed mapping rolls back the full migration.
BEGIN;

-- Normalize existing category text without deleting products or changing their order.
CREATE TABLE "ProductCategory" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Product"
  ADD COLUMN "badgeText" TEXT,
  ADD COLUMN "categoryId" TEXT;

WITH source_categories AS (
  SELECT
    "id",
    "createdAt",
    COALESCE(
      NULLIF(BTRIM(REGEXP_REPLACE("category", '[[:space:]]+', ' ', 'g')), ''),
      'Sin categoria'
    ) AS "displayName",
    LOWER(
      COALESCE(
        NULLIF(BTRIM(REGEXP_REPLACE("category", '[[:space:]]+', ' ', 'g')), ''),
        'Sin categoria'
      )
    ) AS "normalizedKey"
  FROM "Product"
),
ranked_display_names AS (
  SELECT
    "displayName",
    "normalizedKey",
    ROW_NUMBER() OVER (
      PARTITION BY "normalizedKey"
      ORDER BY "createdAt" ASC, "id" ASC
    ) AS "displayRank"
  FROM source_categories
),
category_names AS (
  -- Case and whitespace variants share one category; preserve the earliest existing spelling.
  SELECT "displayName" AS "name", "normalizedKey"
  FROM ranked_display_names
  WHERE "displayRank" = 1
),
slugged AS (
  SELECT
    "name",
    "normalizedKey",
    COALESCE(
      NULLIF(
        TRIM(
          BOTH '-' FROM REGEXP_REPLACE(
            TRANSLATE(LOWER("name"), 'áéíóúüñ', 'aeiouun'),
            '[^a-z0-9]+',
            '-',
            'g'
          )
        ),
        ''
      ),
      'categoria'
    ) AS "baseSlug"
  FROM category_names
),
ranked AS (
  SELECT
    "name",
    "normalizedKey",
    "baseSlug",
    COUNT(*) OVER (PARTITION BY "baseSlug") AS "slugCount",
    (ROW_NUMBER() OVER (ORDER BY "normalizedKey") - 1)::INTEGER AS "position"
  FROM slugged
)
INSERT INTO "ProductCategory" ("id", "name", "slug", "isActive", "sortOrder", "createdAt", "updatedAt")
SELECT
  'pc_' || MD5("normalizedKey"),
  "name",
  CASE
    WHEN "slugCount" > 1 OR "baseSlug" = 'categoria'
      THEN "baseSlug" || '-' || SUBSTRING(MD5("normalizedKey") FROM 1 FOR 8)
    ELSE "baseSlug"
  END,
  true,
  "position",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM ranked;

UPDATE "Product" AS product
SET "categoryId" = category."id"
FROM "ProductCategory" AS category
WHERE LOWER(
  COALESCE(
    NULLIF(BTRIM(REGEXP_REPLACE(product."category", '[[:space:]]+', ' ', 'g')), ''),
    'Sin categoria'
  )
) = LOWER(category."name");

-- Abort before dropping the legacy column if any existing product was not mapped.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Product" WHERE "categoryId" IS NULL) THEN
    RAISE EXCEPTION 'Product category migration aborted: at least one product has no categoryId';
  END IF;
END $$;

ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");
CREATE UNIQUE INDEX "ProductCategory_slug_key" ON "ProductCategory"("slug");
CREATE INDEX "Product_categoryId_isActive_sortOrder_idx" ON "Product"("categoryId", "isActive", "sortOrder");

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Product" DROP COLUMN "category";

COMMIT;
