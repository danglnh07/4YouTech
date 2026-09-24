-- ============================================================================
-- 4YOUTECH PLATFORM DATABASE SCHEMA (POSTGRESQL / NEON / VERCEL POSTGRES)
-- Ported from 4YouTech_MySQL_Script.sql (canonical MySQL shape)
-- Idempotent: safe to re-run (CREATE ... IF NOT EXISTS)
-- ============================================================================

-- Auto-refresh UpdatedAt (replaces MySQL "ON UPDATE CURRENT_TIMESTAMP")
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW."UpdatedAt" := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Bảng 1: Người dùng (Users - Khách hàng, Nhân viên, Admin)
CREATE TABLE IF NOT EXISTS "Users" (
    "UserId"        VARCHAR(100) PRIMARY KEY,
    "Name"          VARCHAR(255) NOT NULL,
    "Email"         VARCHAR(255) NOT NULL,
    "PasswordHash"  VARCHAR(255) NULL,
    "Role"          VARCHAR(50) NOT NULL DEFAULT 'customer',
    "Phone"         VARCHAR(50) NULL,
    "SkillsJson"    TEXT NULL,
    "AvatarUrl"     TEXT NULL,
    "Status"        VARCHAR(50) NOT NULL DEFAULT 'active',
    "CreatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_Users_Email" ON "Users" ("Email");

-- Bảng 2: Catalog Dịch vụ (Services)
CREATE TABLE IF NOT EXISTS "Services" (
    "ServiceId"     VARCHAR(100) PRIMARY KEY,
    "Name"          VARCHAR(255) NOT NULL,
    "Description"   TEXT NOT NULL,
    "Category"      VARCHAR(50) NOT NULL DEFAULT 'IT',
    "EstimatedDays" INT NULL,
    "MaxDays"       INT NULL,
    "EstimatedPrice" NUMERIC(18, 2) NULL,
    "MaxPrice"      NUMERIC(18, 2) NULL,
    "MaxRevisions"  INT NOT NULL DEFAULT 3,
    "ScopeOutput"   TEXT NOT NULL,
    "SupportType"   VARCHAR(50) NOT NULL DEFAULT 'Online',
    "DemoImagesJson" TEXT NULL,
    "IsHidden"      BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 3: Dự án Mẫu Showcase (SampleProjects)
CREATE TABLE IF NOT EXISTS "SampleProjects" (
    "ProjectId"     VARCHAR(100) PRIMARY KEY,
    "Name"          VARCHAR(255) NOT NULL,
    "Category"      VARCHAR(50) NOT NULL,
    "SubCategory"   VARCHAR(100) NULL,
    "Description"   TEXT NOT NULL,
    "ImageUrl"      TEXT NOT NULL,
    "DemoLink"      TEXT NULL,
    "IsFeatured"    BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 4: Đơn hàng & Yêu cầu Dịch vụ (ServiceOrders)
CREATE TABLE IF NOT EXISTS "ServiceOrders" (
    "OrderId"               VARCHAR(100) PRIMARY KEY,
    "ServiceId"             VARCHAR(100) NOT NULL,
    "ServiceName"           VARCHAR(255) NOT NULL,
    "Category"              VARCHAR(50) NOT NULL,
    "CustomerId"            VARCHAR(100) NOT NULL,
    "CustomerName"          VARCHAR(255) NOT NULL,
    "CustomerEmail"         VARCHAR(255) NOT NULL,
    "CustomerPhone"         VARCHAR(50) NULL,
    "Requirements"          TEXT NOT NULL,
    "AttachmentsJson"       TEXT NULL,
    "DesiredDeadline"       VARCHAR(100) NULL,
    "Status"                VARCHAR(50) NOT NULL DEFAULT 'submitted',
    "ProgressPercent"       INT NOT NULL DEFAULT 5,
    "WorkEstimateJson"      TEXT NULL,
    "QuotationJson"         TEXT NULL,
    "PaymentInfoJson"       TEXT NULL,
    "AssignedStaffId"       VARCHAR(100) NULL,
    "AssignedStaffName"     VARCHAR(255) NULL,
    "CollaboratorsJson"     TEXT NULL,
    "MilestonesJson"        TEXT NULL,
    "DeliverablesJson"      TEXT NULL,
    "RevisionsJson"         TEXT NULL,
    "SupportTicketsJson"    TEXT NULL,
    "CancellationJson"      TEXT NULL,
    "IsBeingEdited"         BOOLEAN NOT NULL DEFAULT false,
    "EditingNote"           TEXT NULL,
    "CreatedAt"             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt"             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("CustomerId") REFERENCES "Users" ("UserId") ON DELETE CASCADE
);

-- Bảng 5: Cột mốc Tiến độ Đơn hàng (OrderMilestones)
CREATE TABLE IF NOT EXISTS "OrderMilestones" (
    "MilestoneId"   VARCHAR(100) PRIMARY KEY,
    "OrderId"       VARCHAR(100) NOT NULL,
    "Title"         VARCHAR(255) NOT NULL,
    "TargetDate"    VARCHAR(100) NOT NULL,
    "IsCompleted"   BOOLEAN NOT NULL DEFAULT false,
    "UpdatedBy"     VARCHAR(255) NULL,
    "CreatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("OrderId") REFERENCES "ServiceOrders" ("OrderId") ON DELETE CASCADE
);

-- Bảng 6: Sản phẩm Bàn giao (OrderDeliverables)
CREATE TABLE IF NOT EXISTS "OrderDeliverables" (
    "DeliverableId" VARCHAR(100) PRIMARY KEY,
    "OrderId"       VARCHAR(100) NOT NULL,
    "Version"       INT NOT NULL DEFAULT 1,
    "Title"         VARCHAR(255) NOT NULL,
    "FileLink"      TEXT NOT NULL,
    "PreviewUrl"    TEXT NULL,
    "Notes"         TEXT NULL,
    "Status"        VARCHAR(50) NOT NULL DEFAULT 'pending',
    "Timestamp"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("OrderId") REFERENCES "ServiceOrders" ("OrderId") ON DELETE CASCADE
);

-- Bảng 7: Yêu cầu Chỉnh sửa (OrderRevisions)
CREATE TABLE IF NOT EXISTS "OrderRevisions" (
    "RevisionId"    VARCHAR(100) PRIMARY KEY,
    "OrderId"       VARCHAR(100) NOT NULL,
    "Version"       INT NOT NULL,
    "Feedback"      TEXT NOT NULL,
    "Status"        VARCHAR(50) NOT NULL DEFAULT 'pending',
    "RequestedAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("OrderId") REFERENCES "ServiceOrders" ("OrderId") ON DELETE CASCADE
);

-- Bảng 8: Tin nhắn Trực tiếp (OrderMessages)
CREATE TABLE IF NOT EXISTS "OrderMessages" (
    "MessageId"     VARCHAR(100) PRIMARY KEY,
    "OrderId"       VARCHAR(100) NOT NULL,
    "SenderId"      VARCHAR(100) NOT NULL,
    "SenderName"    VARCHAR(255) NOT NULL,
    "SenderRole"    VARCHAR(50) NOT NULL,
    "Text"          TEXT NOT NULL,
    "AttachmentUrl" TEXT NULL,
    "CreatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("OrderId") REFERENCES "ServiceOrders" ("OrderId") ON DELETE CASCADE
);

-- Bảng 9: Đánh giá Dịch vụ từ Khách hàng (ServiceReviews)
CREATE TABLE IF NOT EXISTS "ServiceReviews" (
    "ReviewId"      VARCHAR(100) PRIMARY KEY,
    "OrderId"       VARCHAR(100) NOT NULL,
    "ServiceId"     VARCHAR(100) NOT NULL,
    "ServiceName"   VARCHAR(255) NOT NULL,
    "CustomerId"    VARCHAR(100) NULL,
    "CustomerName"  VARCHAR(255) NOT NULL,
    "Rating"        INT NOT NULL DEFAULT 5,
    "Comment"       TEXT NOT NULL,
    "Moderated"     BOOLEAN NOT NULL DEFAULT true,
    "ReplyText"     TEXT NULL,
    "RepliedBy"     VARCHAR(255) NULL,
    "RepliedAt"     VARCHAR(100) NULL,
    "CreatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 10: Ticket Hỗ trợ & Khiếu nại (SupportTickets)
CREATE TABLE IF NOT EXISTS "SupportTickets" (
    "TicketId"          VARCHAR(100) PRIMARY KEY,
    "OrderId"           VARCHAR(100) NOT NULL,
    "CustomerId"        VARCHAR(100) NULL,
    "CustomerName"      VARCHAR(255) NOT NULL,
    "CustomerEmail"     VARCHAR(255) NOT NULL,
    "Subject"           VARCHAR(255) NOT NULL,
    "Content"           TEXT NOT NULL,
    "Type"              VARCHAR(50) NOT NULL DEFAULT 'support',
    "Status"            VARCHAR(50) NOT NULL DEFAULT 'open',
    "AssignedStaffId"   VARCHAR(100) NULL,
    "AssignedStaffName" VARCHAR(255) NULL,
    "Response"          TEXT NULL,
    "CreatedAt"         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("OrderId") REFERENCES "ServiceOrders" ("OrderId") ON DELETE CASCADE
);

-- Bảng 11: Giỏ hàng Dịch vụ (CartItems)
CREATE TABLE IF NOT EXISTS "CartItems" (
    "CartItemId"        VARCHAR(100) PRIMARY KEY,
    "UserId"            VARCHAR(100) NOT NULL,
    "ServiceId"         VARCHAR(100) NOT NULL,
    "ServiceName"       VARCHAR(255) NOT NULL,
    "Category"          VARCHAR(50) NOT NULL,
    "EstimatedPrice"    NUMERIC(18, 2) NULL,
    "EstimatedDays"     INT NULL,
    "Requirements"      TEXT NULL,
    "DesiredDeadline"   VARCHAR(100) NULL,
    "AddedAt"           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("UserId") REFERENCES "Users" ("UserId") ON DELETE CASCADE
);

-- Bảng 12: Lịch sử Giao dịch Thanh toán VietQR & VNPay (PaymentTransactions)
CREATE TABLE IF NOT EXISTS "PaymentTransactions" (
    "TransactionId"     VARCHAR(100) PRIMARY KEY,
    "OrderId"           VARCHAR(100) NOT NULL,
    "CustomerId"        VARCHAR(100) NULL,
    "CustomerName"      VARCHAR(255) NOT NULL,
    "Amount"            NUMERIC(18, 2) NOT NULL,
    "PaymentType"       VARCHAR(50) NOT NULL DEFAULT 'deposit',
    "PaymentMethod"     VARCHAR(50) NOT NULL DEFAULT 'VietQR',
    "VnpTxnRef"         VARCHAR(100) NULL,
    "VnpBankCode"       VARCHAR(50) NULL,
    "VnpResponseCode"   VARCHAR(50) NULL,
    "ReceiptImage"      TEXT NULL,
    "Note"              TEXT NULL,
    "Status"            VARCHAR(50) NOT NULL DEFAULT 'pending',
    "CreatedAt"         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("OrderId") REFERENCES "ServiceOrders" ("OrderId") ON DELETE CASCADE
);

-- ============================================================================
-- 2. UpdatedAt TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_users_updated_at ON "Users";
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON "Users"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_serviceorders_updated_at ON "ServiceOrders";
CREATE TRIGGER trg_serviceorders_updated_at BEFORE UPDATE ON "ServiceOrders"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS "IX_ServiceOrders_CustomerId" ON "ServiceOrders" ("CustomerId");
CREATE INDEX IF NOT EXISTS "IX_ServiceOrders_AssignedStaffId" ON "ServiceOrders" ("AssignedStaffId");
CREATE INDEX IF NOT EXISTS "IX_ServiceOrders_Status" ON "ServiceOrders" ("Status");
CREATE INDEX IF NOT EXISTS "IX_OrderMilestones_OrderId" ON "OrderMilestones" ("OrderId");
CREATE INDEX IF NOT EXISTS "IX_OrderDeliverables_OrderId" ON "OrderDeliverables" ("OrderId");
CREATE INDEX IF NOT EXISTS "IX_OrderMessages_OrderId" ON "OrderMessages" ("OrderId");
CREATE INDEX IF NOT EXISTS "IX_PaymentTransactions_OrderId" ON "PaymentTransactions" ("OrderId");
CREATE INDEX IF NOT EXISTS "IX_CartItems_UserId" ON "CartItems" ("UserId");

-- ============================================================================
-- 4. VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW "vw_OrderDetailsSummary" AS
SELECT
    o."OrderId",
    o."ServiceName",
    o."Category",
    o."CustomerName",
    o."CustomerEmail",
    o."Status",
    o."ProgressPercent",
    o."AssignedStaffName",
    o."CreatedAt",
    o."DesiredDeadline"
FROM "ServiceOrders" o;

CREATE OR REPLACE VIEW "vw_ServicePerformanceAnalytics" AS
SELECT
    s."ServiceId",
    s."Name" AS "ServiceName",
    s."Category",
    COUNT(o."OrderId") AS "TotalOrdersCount",
    AVG(r."Rating") AS "AverageCustomerRating"
FROM "Services" s
LEFT JOIN "ServiceOrders" o ON s."ServiceId" = o."ServiceId"
LEFT JOIN "ServiceReviews" r ON s."ServiceId" = r."ServiceId"
GROUP BY s."ServiceId", s."Name", s."Category";
