CREATE TYPE "DeliveryWeekday" AS ENUM (
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
);

CREATE TYPE "WhatsAppNotificationStatus" AS ENUM (
  'PENDING',
  'SIMULATED',
  'SENT',
  'FAILED',
  'SKIPPED'
);

CREATE TABLE "DeliveryZone" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "deliveryWeekday" "DeliveryWeekday" NOT NULL,
  "noticeAdvanceDays" INTEGER NOT NULL DEFAULT 2,
  "orderDeadlineWeekday" "DeliveryWeekday",
  "orderDeadlineTime" TEXT NOT NULL DEFAULT '13:00',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "notes" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Customer" (
  "id" TEXT NOT NULL,
  "commercialName" TEXT NOT NULL,
  "contactName" TEXT NOT NULL DEFAULT '',
  "phone" TEXT NOT NULL DEFAULT '',
  "whatsapp" TEXT NOT NULL DEFAULT '',
  "city" TEXT NOT NULL,
  "deliveryZoneId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "receivesWhatsappReminders" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WhatsAppTemplate" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "metaTemplateName" TEXT,
  "metaLanguage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WhatsAppNotification" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "zoneId" TEXT NOT NULL,
  "templateId" TEXT,
  "deliveryDate" TIMESTAMP(3) NOT NULL,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "attemptedAt" TIMESTAMP(3),
  "generatedMessage" TEXT NOT NULL,
  "status" "WhatsAppNotificationStatus" NOT NULL DEFAULT 'PENDING',
  "providerMessageId" TEXT,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "WhatsAppNotification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeliveryZone_name_key" ON "DeliveryZone"("name");
CREATE INDEX "Customer_deliveryZoneId_idx" ON "Customer"("deliveryZoneId");
CREATE INDEX "Customer_city_idx" ON "Customer"("city");
CREATE UNIQUE INDEX "WhatsAppTemplate_name_key" ON "WhatsAppTemplate"("name");
CREATE UNIQUE INDEX "WhatsAppNotification_customerId_zoneId_deliveryDate_key" ON "WhatsAppNotification"("customerId", "zoneId", "deliveryDate");
CREATE INDEX "WhatsAppNotification_scheduledFor_status_idx" ON "WhatsAppNotification"("scheduledFor", "status");
CREATE INDEX "WhatsAppNotification_zoneId_deliveryDate_idx" ON "WhatsAppNotification"("zoneId", "deliveryDate");

ALTER TABLE "Customer"
  ADD CONSTRAINT "Customer_deliveryZoneId_fkey"
  FOREIGN KEY ("deliveryZoneId") REFERENCES "DeliveryZone"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "WhatsAppNotification"
  ADD CONSTRAINT "WhatsAppNotification_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WhatsAppNotification"
  ADD CONSTRAINT "WhatsAppNotification_zoneId_fkey"
  FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WhatsAppNotification"
  ADD CONSTRAINT "WhatsAppNotification_templateId_fkey"
  FOREIGN KEY ("templateId") REFERENCES "WhatsAppTemplate"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
