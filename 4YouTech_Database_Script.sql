-- ============================================================================
-- DỰ ÁN: 4YOUTECH PLATFORM DATABASE SCHEMA & SEED DATA (SQL SERVER / T-SQL)
-- Hệ thống cung cấp Dịch vụ IT, Thiết kế Web Portfolio, ERD Database & Graphic Design
-- Tác giả: Đội ngũ Phát triển 4YouTech
-- Ngày khởi tạo: 2026-09-18
-- ============================================================================

USE [master];
GO

-- 1. TẠO CƠ SỞ DỮ LIỆU
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'4YouTechDB')
BEGIN
    CREATE DATABASE [4YouTechDB];
    PRINT N'==> Đã tạo Cơ sở dữ liệu [4YouTechDB] thành công.';
END
GO

USE [4YouTechDB];
GO

-- 2. XÓA BẢNG NẾU ĐÃ TỒN TẠI (Theo thứ tự ngược lại của khóa ngoại)
IF OBJECT_ID('dbo.PaymentTransactions', 'U') IS NOT NULL DROP TABLE dbo.PaymentTransactions;
IF OBJECT_ID('dbo.SupportTickets', 'U') IS NOT NULL DROP TABLE dbo.SupportTickets;
IF OBJECT_ID('dbo.ServiceReviews', 'U') IS NOT NULL DROP TABLE dbo.ServiceReviews;
IF OBJECT_ID('dbo.OrderMessages', 'U') IS NOT NULL DROP TABLE dbo.OrderMessages;
IF OBJECT_ID('dbo.OrderRevisions', 'U') IS NOT NULL DROP TABLE dbo.OrderRevisions;
IF OBJECT_ID('dbo.OrderDeliverables', 'U') IS NOT NULL DROP TABLE dbo.OrderDeliverables;
IF OBJECT_ID('dbo.OrderMilestones', 'U') IS NOT NULL DROP TABLE dbo.OrderMilestones;
IF OBJECT_ID('dbo.CartItems', 'U') IS NOT NULL DROP TABLE dbo.CartItems;
IF OBJECT_ID('dbo.ServiceOrders', 'U') IS NOT NULL DROP TABLE dbo.ServiceOrders;
IF OBJECT_ID('dbo.SampleProjects', 'U') IS NOT NULL DROP TABLE dbo.SampleProjects;
IF OBJECT_ID('dbo.Services', 'U') IS NOT NULL DROP TABLE dbo.Services;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

PRINT N'==> Đã dọn dẹp các bảng cũ.';
GO

-- ============================================================================
-- 3. KHỞI TẠO CÁC BẢNG DỮ LIỆU (TABLES CREATION)
-- ============================================================================

-- Bảng 1: Người dùng (Users - Khách hàng, Nhân viên, Admin)
CREATE TABLE dbo.Users (
    UserId          NVARCHAR(50) NOT NULL PRIMARY KEY,
    Name            NVARCHAR(150) NOT NULL,
    Email           NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash    NVARCHAR(255) NULL,
    Role            NVARCHAR(20) NOT NULL CONSTRAINT CHK_Users_Role CHECK (Role IN ('guest', 'customer', 'staff', 'admin')),
    Phone           NVARCHAR(20) NULL,
    SkillsJson      NVARCHAR(MAX) NULL, -- Lưu danh sách kỹ năng của Staff dưới dạng JSON Array
    AvatarUrl       NVARCHAR(500) NULL,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'active' CONSTRAINT CHK_Users_Status CHECK (Status IN ('active', 'locked', 'pending_otp')),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 2: Catalog Dịch vụ (Services)
CREATE TABLE dbo.Services (
    ServiceId       NVARCHAR(50) NOT NULL PRIMARY KEY,
    Name            NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NOT NULL,
    Category        NVARCHAR(50) NOT NULL CONSTRAINT CHK_Services_Category CHECK (Category IN ('IT', 'Design', 'IT/Design')),
    EstimatedDays   INT NULL,
    EstimatedPrice  DECIMAL(18, 2) NULL,
    MaxRevisions    INT NOT NULL DEFAULT 3,
    ScopeOutput     NVARCHAR(MAX) NOT NULL,
    SupportType     NVARCHAR(20) NOT NULL CONSTRAINT CHK_Services_SupportType CHECK (SupportType IN ('Online', 'Direct', 'Hybrid')),
    DemoImagesJson  NVARCHAR(MAX) NULL, -- JSON Array hình ảnh sản phẩm mẫu
    IsHidden        BIT NOT NULL DEFAULT 0, -- 1: Ẩn dịch vụ khỏi Catalog khách hàng/staff
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 3: Dự án Mẫu Showcase (SampleProjects)
CREATE TABLE dbo.SampleProjects (
    ProjectId       NVARCHAR(50) NOT NULL PRIMARY KEY,
    Name            NVARCHAR(200) NOT NULL,
    Category        NVARCHAR(50) NOT NULL,
    Description     NVARCHAR(MAX) NOT NULL,
    ImageUrl        NVARCHAR(500) NOT NULL,
    ProjectLink     NVARCHAR(500) NULL,
    IsFeatured      BIT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 4: Đơn hàng & Yêu cầu Dịch vụ (ServiceOrders)
CREATE TABLE dbo.ServiceOrders (
    OrderId                 NVARCHAR(50) NOT NULL PRIMARY KEY,
    ServiceId               NVARCHAR(50) NOT NULL CONSTRAINT FK_Orders_Services REFERENCES dbo.Services(ServiceId),
    ServiceName             NVARCHAR(200) NOT NULL,
    Category                NVARCHAR(50) NOT NULL,
    CustomerId              NVARCHAR(50) NOT NULL CONSTRAINT FK_Orders_Customers REFERENCES dbo.Users(UserId),
    CustomerName            NVARCHAR(150) NOT NULL,
    CustomerEmail           NVARCHAR(150) NOT NULL,
    CustomerPhone           NVARCHAR(20) NULL,
    Requirements            NVARCHAR(MAX) NOT NULL,
    AttachmentsJson         NVARCHAR(MAX) NULL,
    DesiredDeadline         DATE NOT NULL,
    
    Status                  NVARCHAR(30) NOT NULL CONSTRAINT CHK_Orders_Status CHECK (Status IN (
                                'submitted', 'under_review', 'info_requested', 'quoted', 'deposit_pending',
                                'in_progress', 'deliverable_sent', 'revision_requested', 'accepted',
                                'completed', 'cancel_requested', 'cancelled'
                            )),
    ProgressPercent         INT NOT NULL DEFAULT 0 CONSTRAINT CHK_Orders_Progress CHECK (ProgressPercent BETWEEN 0 AND 100),
    
    AssignedStaffId         NVARCHAR(50) NULL CONSTRAINT FK_Orders_Staff REFERENCES dbo.Users(UserId),
    AssignedStaffName       NVARCHAR(150) NULL,
    CollaboratorsJson       NVARCHAR(MAX) NULL,

    -- Báo Giá từ Admin (Quotation Details)
    QuotationAmount         DECIMAL(18, 2) NULL,
    QuotationFinalDeadline  DATE NULL,
    QuotationMaxRevisions   INT NULL,
    QuotationScopeDetails   NVARCHAR(MAX) NULL,
    QuotationIssuedAt       DATETIME2 NULL,

    -- Thông tin Thanh toán (Payment Details)
    PaymentAmountPaid       DECIMAL(18, 2) NOT NULL DEFAULT 0,
    PaymentMethod           NVARCHAR(50) NULL,
    PaymentStatus           NVARCHAR(30) NOT NULL DEFAULT 'unpaid' CONSTRAINT CHK_Orders_PaymentStatus CHECK (PaymentStatus IN ('unpaid', 'pending_approval', 'verified', 'refunded')),
    PaymentReceiptImage     NVARCHAR(500) NULL,
    PaymentNote             NVARCHAR(MAX) NULL,

    -- Cờ trạng thái chỉnh sửa của Admin
    IsBeingEdited           BIT NOT NULL DEFAULT 0,
    EditingNote             NVARCHAR(500) NULL,

    CreatedAt               DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt               DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 5: Cột mốc Tiến độ Đơn hàng (OrderMilestones)
CREATE TABLE dbo.OrderMilestones (
    MilestoneId     NVARCHAR(50) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(50) NOT NULL CONSTRAINT FK_Milestones_Orders REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    Title           NVARCHAR(255) NOT NULL,
    TargetDate      DATE NOT NULL,
    IsCompleted     BIT NOT NULL DEFAULT 0,
    UpdatedBy       NVARCHAR(150) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 6: Sản phẩm Bàn giao (OrderDeliverables)
CREATE TABLE dbo.OrderDeliverables (
    DeliverableId   NVARCHAR(50) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(50) NOT NULL CONSTRAINT FK_Deliverables_Orders REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    Version         INT NOT NULL DEFAULT 1,
    Title           NVARCHAR(255) NOT NULL,
    FileLink        NVARCHAR(500) NOT NULL,
    PreviewUrl      NVARCHAR(500) NULL,
    Notes           NVARCHAR(MAX) NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT 'pending' CONSTRAINT CHK_Deliverables_Status CHECK (Status IN ('pending', 'accepted', 'revision_needed')),
    Timestamp       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 7: Yêu cầu Chỉnh sửa (OrderRevisions)
CREATE TABLE dbo.OrderRevisions (
    RevisionId      NVARCHAR(50) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(50) NOT NULL CONSTRAINT FK_Revisions_Orders REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    Version         INT NOT NULL,
    Feedback        NVARCHAR(MAX) NOT NULL,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'pending' CONSTRAINT CHK_Revisions_Status CHECK (Status IN ('pending', 'resolved')),
    RequestedAt     DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 8: Tin nhắn Trực tiếp (OrderMessages)
CREATE TABLE dbo.OrderMessages (
    MessageId       NVARCHAR(50) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(50) NOT NULL CONSTRAINT FK_Messages_Orders REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    SenderId        NVARCHAR(50) NOT NULL CONSTRAINT FK_Messages_Users REFERENCES dbo.Users(UserId),
    SenderName      NVARCHAR(150) NOT NULL,
    SenderRole      NVARCHAR(20) NOT NULL,
    Text            NVARCHAR(MAX) NOT NULL,
    AttachmentUrl   NVARCHAR(500) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 9: Đánh giá Dịch vụ từ Khách hàng (ServiceReviews)
CREATE TABLE dbo.ServiceReviews (
    ReviewId        NVARCHAR(50) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(50) NOT NULL CONSTRAINT FK_Reviews_Orders REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    ServiceId       NVARCHAR(50) NOT NULL CONSTRAINT FK_Reviews_Services REFERENCES dbo.Services(ServiceId),
    ServiceName     NVARCHAR(200) NOT NULL,
    CustomerId      NVARCHAR(50) NOT NULL CONSTRAINT FK_Reviews_Customers REFERENCES dbo.Users(UserId),
    CustomerName    NVARCHAR(150) NOT NULL,
    Rating          INT NOT NULL CONSTRAINT CHK_Reviews_Rating CHECK (Rating BETWEEN 1 AND 5),
    Comment         NVARCHAR(MAX) NOT NULL,
    IsModerated     BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 10: Ticket Hỗ trợ & Khiếu nại (SupportTickets)
CREATE TABLE dbo.SupportTickets (
    TicketId            NVARCHAR(50) NOT NULL PRIMARY KEY,
    OrderId             NVARCHAR(50) NOT NULL CONSTRAINT FK_Tickets_Orders REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    CustomerId          NVARCHAR(50) NOT NULL CONSTRAINT FK_Tickets_Customers REFERENCES dbo.Users(UserId),
    CustomerName        NVARCHAR(150) NOT NULL,
    CustomerEmail       NVARCHAR(150) NOT NULL,
    Subject             NVARCHAR(255) NOT NULL,
    Content             NVARCHAR(MAX) NOT NULL,
    Type                NVARCHAR(20) NOT NULL CONSTRAINT CHK_Tickets_Type CHECK (Type IN ('support', 'complaint')),
    Status              NVARCHAR(20) NOT NULL DEFAULT 'open' CONSTRAINT CHK_Tickets_Status CHECK (Status IN ('open', 'processing', 'resolved')),
    AssignedStaffId     NVARCHAR(50) NULL CONSTRAINT FK_Tickets_Staff REFERENCES dbo.Users(UserId),
    AssignedStaffName   NVARCHAR(150) NULL,
    Response            NVARCHAR(MAX) NULL,
    CreatedAt           DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 11: Giỏ hàng Dịch vụ (CartItems)
CREATE TABLE dbo.CartItems (
    CartItemId      NVARCHAR(50) NOT NULL PRIMARY KEY,
    UserId          NVARCHAR(50) NOT NULL CONSTRAINT FK_Cart_Users REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    ServiceId       NVARCHAR(50) NOT NULL CONSTRAINT FK_Cart_Services REFERENCES dbo.Services(ServiceId),
    ServiceName     NVARCHAR(200) NOT NULL,
    Category        NVARCHAR(50) NOT NULL,
    EstimatedPrice  DECIMAL(18, 2) NULL,
    EstimatedDays   INT NULL,
    Requirements    NVARCHAR(MAX) NULL,
    DesiredDeadline DATE NULL,
    AddedAt         DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 12: Lịch sử Giao dịch Thanh toán VietQR & VNPay (PaymentTransactions)
CREATE TABLE dbo.PaymentTransactions (
    TransactionId   NVARCHAR(50) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(50) NOT NULL CONSTRAINT FK_Txn_Orders REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    CustomerId      NVARCHAR(50) NOT NULL CONSTRAINT FK_Txn_Customers REFERENCES dbo.Users(UserId),
    CustomerName    NVARCHAR(150) NOT NULL,
    Amount          DECIMAL(18, 2) NOT NULL,
    PaymentType     NVARCHAR(20) NOT NULL CONSTRAINT CHK_Txn_PaymentType CHECK (PaymentType IN ('deposit', 'full', 'remaining')),
    PaymentMethod   NVARCHAR(50) NOT NULL CONSTRAINT CHK_Txn_PaymentMethod CHECK (PaymentMethod IN ('VNPay', 'VietQR', 'BankTransfer')),
    VnpTxnRef       NVARCHAR(100) NULL,
    VnpBankCode     NVARCHAR(50) NULL,
    VnpResponseCode NVARCHAR(20) NULL,
    ReceiptImage    NVARCHAR(500) NULL,
    Note            NVARCHAR(MAX) NULL,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'pending' CONSTRAINT CHK_Txn_Status CHECK (Status IN ('pending', 'verified', 'rejected')),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

PRINT N'==> Khởi tạo 12 Bảng Dữ Liệu thành công.';
GO

-- ============================================================================
-- 4. TẠO INDEXES TỐI ƯU HIỆU NĂNG TRUY VẤN
-- ============================================================================
CREATE NONCLUSTERED INDEX IX_ServiceOrders_CustomerId ON dbo.ServiceOrders(CustomerId);
CREATE NONCLUSTERED INDEX IX_ServiceOrders_AssignedStaffId ON dbo.ServiceOrders(AssignedStaffId);
CREATE NONCLUSTERED INDEX IX_ServiceOrders_Status ON dbo.ServiceOrders(Status);
CREATE NONCLUSTERED INDEX IX_OrderMilestones_OrderId ON dbo.OrderMilestones(OrderId);
CREATE NONCLUSTERED INDEX IX_OrderDeliverables_OrderId ON dbo.OrderDeliverables(OrderId);
CREATE NONCLUSTERED INDEX IX_OrderMessages_OrderId ON dbo.OrderMessages(OrderId);
CREATE NONCLUSTERED INDEX IX_PaymentTransactions_OrderId ON dbo.PaymentTransactions(OrderId);
CREATE NONCLUSTERED INDEX IX_CartItems_UserId ON dbo.CartItems(UserId);
GO

PRINT N'==> Đã khởi tạo các chỉ mục (Indexes) hiệu năng.';
GO

-- ============================================================================
-- 5. NẠP DỮ LIỆU MẪU BAN ĐẦU (SEED DATA INSERTIONS)
-- ============================================================================

-- Seed Người Dùng (Users)
INSERT INTO dbo.Users (UserId, Name, Email, PasswordHash, Role, Phone, SkillsJson, AvatarUrl, Status) VALUES
(N'usr-guest', N'Khách xem', N'guest@4youtech.com', NULL, N'guest', NULL, NULL, NULL, N'active'),
(N'usr-cust-1', N'Nguyễn Văn An', N'an.nguyen@student.edu.vn', N'hash_1b932c0', N'customer', N'0912345678', NULL, N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-2', N'Lê Minh Tuấn (CLB IT)', N'tuan.le@clbit.org', N'hash_1b932c0', N'customer', N'0987654321', NULL, N'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-staff-it', N'Trần Bảo IT', N'bao.it@4youtech.com', N'hash_2c810d1', N'staff', N'0901112233', N'["Next.js", "Node.js", "Database", "System Architecture"]', N'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-staff-des', N'Phạm Hà Design', N'ha.design@4youtech.com', N'hash_2c810d1', N'staff', N'0904445566', N'["Figma UI/UX", "Branding", "Banner/Poster", "Motion Graphic"]', N'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-admin', N'Quản trị viên 4YouTech', N'admin@4youtech.com', N'hash_3f44e1a', N'admin', N'0999888777', NULL, N'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', N'active');
GO

-- Seed Catalog Dịch Vụ (Services)
INSERT INTO dbo.Services (ServiceId, Name, Description, Category, EstimatedDays, EstimatedPrice, MaxRevisions, ScopeOutput, SupportType, DemoImagesJson, IsHidden) VALUES
(N'portfolio-co-san', N'Portfolio từ thiết kế có sẵn', N'Xây dựng website portfolio cá nhân tối ưu SEO & responsive dựa trên file Figma/Adobe XD sẵn có.', N'IT', 3, 1000000.00, 3, N'Mã nguồn Next.js/React, Responsive chuẩn Mobile/Tablet, Deploy Vercel/Netlify miễn phí.', N'Online', N'["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"]', 0),
(N'portfolio-chua-co-thiet-ke', N'Portfolio trọn gói (Thiết kế & Code)', N'Tư vấn ý tưởng, thiết kế UI cá tính và lập trình hoàn thiện website cá nhân từ A đến Z.', N'IT/Design', 6, 1800000.00, 4, N'File Figma UI, Mã nguồn Front-end, Tích hợp Form liên hệ, Hướng dẫn quản trị.', N'Hybrid', N'["https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"]', 0),
(N'ui-design', N'Thiết kế Giao diện Web & App (UI/UX)', N'Thiết kế UI/UX hiện đại theo chuẩn Design System, Wireframe, Prototype tương tác mượt mà.', N'Design', 5, 1500000.00, 3, N'File Figma master, Component Design System, Export PNG/SVG assets, Prototype link.', N'Online', N'["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"]', 0),
(N'database-design-support', N'Hỗ trợ Thiết kế Cơ sở dữ liệu & ERD', N'Chuẩn hóa bảng dữ liệu, vẽ sơ đồ ERD, tối ưu truy vấn SQL / MongoDB cho đồ án & sản phẩm.', N'IT', 2, 500000.00, 2, N'Sơ đồ ERD (Draw.io/dbdiagram), File SQL script khởi tạo, Tài liệu giải thích mối quan hệ bảng.', N'Online', N'["https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"]', 0),
(N'system-analysis-support', N'Phân tích & Thiết kế Hệ thống (BA / System)', N'Xác định Actor, Use Case, Sequence Diagram, Activity Diagram & lập tài liệu SRS bài bản.', N'IT', 4, 800000.00, 3, N'File tài liệu SRS PDF/Word, Bộ biểu đồ PlantUML/Draw.io đầy đủ.', N'Online', N'["https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"]', 0),
(N'nhan-dien-thuong-hieu', N'Nhận diện thương hiệu & Ấn phẩm truyền thông', N'Thiết kế Logo, Banner sự kiện, Poster, Standee, Slide thuyết trình chuyên nghiệp cho CLB/Nhóm.', N'Design', 3, 700000.00, 3, N'File thiết kế Vector (AI/PSD), File in chất lượng cao (PDF/PNG), Mockup thực tế.', N'Online', N'["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80"]', 0);
GO

-- Seed Dự Án Mẫu Showcase (SampleProjects)
INSERT INTO dbo.SampleProjects (ProjectId, Name, Category, Description, ImageUrl, ProjectLink, IsFeatured) VALUES
(N'proj-1', N'Website Đặt Sân & Quản Lý Sự Kiện Sinh Viên', N'IT', N'Hệ thống Web Fullstack hỗ trợ CLB trường đặt lịch sự kiện, thanh toán và quản lý thành viên.', N'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', N'https://demo.4youtech.com/student-event', 1),
(N'proj-2', N'Bộ Giao diện UI App Sức Khỏe & Thể Thao', N'Design', N'Thiết kế UI/UX 18 màn hình phong cách Glassmorphism màu neon dành cho gen Z.', N'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80', N'https://figma.com/file/demo-fitness-ui', 1),
(N'proj-3', N'Phân Tích ERD & Hệ Thống E-Commerce Chuyên Sâu', N'IT', N'Thiết kế CSDL SQL gồm 32 bảng chuẩn hóa 3NF xử lý đơn hàng, kho và khuyến mãi.', N'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', N'https://dbdiagram.io/d/demo-ecommerce', 0),
(N'proj-4', N'Bộ Nhận Diện Thương Hiệu CLB Sáng Tạo TechClub', N'Design', N'Logo, Brand Guidelines, Template slide thuyết trình và 10 mẫu poster truyền thông.', N'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&auto=format&fit=crop&q=80', N'https://behance.net/gallery/techclub-brand', 1);
GO

-- Seed Đơn Hàng (ServiceOrders)
INSERT INTO dbo.ServiceOrders (
    OrderId, ServiceId, ServiceName, Category, CustomerId, CustomerName, CustomerEmail, CustomerPhone,
    Requirements, AttachmentsJson, DesiredDeadline, Status, ProgressPercent, AssignedStaffId, AssignedStaffName,
    CollaboratorsJson, QuotationAmount, QuotationFinalDeadline, QuotationMaxRevisions, QuotationScopeDetails,
    QuotationIssuedAt, PaymentAmountPaid, PaymentMethod, PaymentStatus, PaymentReceiptImage, PaymentNote
) VALUES
(
    N'REQ-2026-001', N'portfolio-chua-co-thiet-ke', N'Portfolio trọn gói (Thiết kế & Code)', N'IT/Design',
    N'usr-cust-1', N'Nguyễn Văn An', N'an.nguyen@student.edu.vn', N'0912345678',
    N'Cần xây dựng website portfolio cá nhân 5 trang (Trang chủ, Giới thiệu, Dự án, Kỹ năng, Liên hệ). Giao diện tối màu hiện đại, responsive tốt.',
    N'["https://dribbble.com/shots/example-portfolio-ref"]', '2026-10-05', N'in_progress', 65,
    N'usr-staff-it', N'Trần Bảo IT', N'["Phạm Hà Design"]',
    1800000.00, '2026-10-04', 4, N'Gồm file thiết kế Figma + Source code Next.js + Deploy Vercel.', '2026-09-15 10:00',
    900000.00, N'VNPay', N'verified', N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Khách đã đặt cọc 50% qua VNPay Sandbox'
),
(
    N'REQ-2026-002', N'nhan-dien-thuong-hieu', N'Nhận diện thương hiệu & Ấn phẩm truyền thông', N'Design',
    N'usr-cust-2', N'Lê Minh Tuấn (CLB IT)', N'tuan.le@clbit.org', N'0987654321',
    N'Cần thiết kế Banner và Poster cho cuộc phạm Hackathon Sinh viên 2026. Màu sắc chủ đạo: Xanh Neon + Tím.',
    NULL, '2026-09-28', N'deliverable_sent', 90,
    N'usr-staff-des', N'Phạm Hà Design', NULL,
    700000.00, '2026-09-27', 3, N'Gồm 1 Poster 4k + 2 Banner Facebook + File vector thiết kế gốc.', '2026-09-18 11:00',
    700000.00, N'VietQR', N'verified', N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Đã thanh toán full 100%'
),
(
    N'REQ-2026-003', N'database-design-support', N'Hỗ trợ Thiết kế Cơ sở dữ liệu & ERD', N'IT',
    N'usr-cust-1', N'Nguyễn Văn An', N'an.nguyen@student.edu.vn', N'0912345678',
    N'Cần hỗ trợ vẽ sơ đồ ERD và chuẩn hóa CSDL cho ứng dụng quản lý thư viện sách trực tuyến.',
    NULL, '2026-10-10', N'submitted', 10,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    0.00, NULL, N'unpaid', NULL, NULL
);
GO

-- Seed Cột mốc Đơn hàng (OrderMilestones)
INSERT INTO dbo.OrderMilestones (MilestoneId, OrderId, Title, TargetDate, IsCompleted, UpdatedBy) VALUES
(N'm1-1', N'REQ-2026-001', N'Chốt phạm vi & Thiết kế Wireframe', '2026-09-18', 1, N'Trần Bảo IT'),
(N'm1-2', N'REQ-2026-001', N'Hoàn thiện Figma UI Design', '2026-09-22', 1, N'Phạm Hà Design'),
(N'm1-3', N'REQ-2026-001', N'Lập trình Web Front-end', '2026-09-30', 0, N'Trần Bảo IT'),
(N'm1-4', N'REQ-2026-001', N'Nghiệm thu & Bàn giao source code', '2026-10-04', 0, N'Admin'),
(N'm2-1', N'REQ-2026-002', N'Phác thảo concept ấn phẩm', '2026-09-20', 1, N'Phạm Hà Design'),
(N'm2-2', N'REQ-2026-002', N'Xuất file thiết kế demo v1', '2026-09-24', 1, N'Phạm Hà Design');
GO

-- Seed Sản Phẩm Bàn Giao (OrderDeliverables)
INSERT INTO dbo.OrderDeliverables (DeliverableId, OrderId, Version, Title, FileLink, PreviewUrl, Notes, Status, Timestamp) VALUES
(N'del-1', N'REQ-2026-001', 1, N'Bản thiết kế UI Figma v1', N'https://figma.com/file/demo-v1', N'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80', N'Đã thiết kế xong 5 màn hình cơ bản theo đúng yêu cầu màu tối.', N'accepted', '2026-09-22 15:30'),
(N'del-2', N'REQ-2026-002', 1, N'Bộ Poster & Banner Hackathon v1', N'https://drive.google.com/demo-poster-v1', N'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80', N'Gửi bản thử hình ảnh độ phân giải cao. Khách kiểm tra thông tin sự kiện giúp nhóm nhé.', N'pending', '2026-09-24 10:00');
GO

-- Seed Chat Messages
INSERT INTO dbo.OrderMessages (MessageId, OrderId, SenderId, SenderName, SenderRole, Text, CreatedAt) VALUES
(N'msg-1', N'REQ-2026-001', N'usr-cust-1', N'Nguyễn Văn An', N'customer', N'Chào nhóm 4YouTech, cho mình hỏi tiến độ làm web thế nào rồi ạ?', '2026-09-16 09:15'),
(N'msg-2', N'REQ-2026-001', N'usr-staff-it', N'Trần Bảo IT', N'staff', N'Chào An! Nhóm đã hoàn thành xong bản UI Figma v1 và đang tiến hành code phần Front-end bạn nhé.', '2026-09-16 09:30');
GO

-- Seed Đánh Giá (ServiceReviews)
INSERT INTO dbo.ServiceReviews (ReviewId, OrderId, ServiceId, ServiceName, CustomerId, CustomerName, Rating, Comment, IsModerated, CreatedAt) VALUES
(N'rev-1', N'REQ-2026-001', N'portfolio-co-san', N'Portfolio từ thiết kế có sẵn', N'usr-cust-1', N'Hoàng Kim Ngân', 5, N'Nhóm làm việc rất nhiệt tình, code đẹp đúng thiết kế Figma của mình, giao đúng hạn trước 1 ngày!', 1, '2026-09-10 16:00'),
(N'rev-2', N'REQ-2026-002', N'ui-design', N'Thiết kế Giao diện Web & App (UI/UX)', N'usr-cust-2', N'Đỗ Quốc Việt', 5, N'Giao diện hiện đại, phối màu sinh động. Sẽ ủng hộ 4YouTech trong các đồ án tiếp theo!', 1, '2026-09-12 11:20');
GO

-- Seed Giao Dịch Thanh Toán (PaymentTransactions)
INSERT INTO dbo.PaymentTransactions (TransactionId, OrderId, CustomerId, CustomerName, Amount, PaymentType, PaymentMethod, VnpTxnRef, VnpBankCode, VnpResponseCode, ReceiptImage, Note, Status, CreatedAt) VALUES
(N'TXN-8821', N'REQ-2026-001', N'usr-cust-1', N'Nguyễn Văn An', 900000.00, N'deposit', N'VNPay', N'VNP20269910', N'NCB', N'00', N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Đặt cọc 50% qua VNPay Sandbox (Ngân hàng NCB)', N'verified', '2026-09-15 10:30'),
(N'TXN-8822', N'REQ-2026-002', N'usr-cust-2', N'Lê Minh Tuấn (CLB IT)', 700000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% full đơn Hackathon qua VietQR MBBank', N'verified', '2026-09-18 11:15');
GO

PRINT N'==> Nạp Dữ Liệu Mẫu (Seed Data) thành công.';
GO

-- ============================================================================
-- 6. TẠO CÁC VIEWS BÁO CÁO THỐNG KÊ (ANALYTICS VIEWS)
-- ============================================================================

-- View 1: Thống kê Chi tiết Đơn hàng
CREATE OR ALTER VIEW dbo.vw_OrderDetailsSummary
AS
SELECT 
    o.OrderId,
    o.ServiceName,
    o.Category,
    o.CustomerName,
    o.CustomerEmail,
    o.Status,
    o.ProgressPercent,
    ISNULL(o.QuotationAmount, 0) AS TotalAmount,
    ISNULL(o.PaymentAmountPaid, 0) AS PaidAmount,
    (ISNULL(o.QuotationAmount, 0) - ISNULL(o.PaymentAmountPaid, 0)) AS RemainingAmount,
    o.AssignedStaffName,
    o.CreatedAt,
    o.DesiredDeadline
FROM dbo.ServiceOrders o;
GO

-- View 2: Thống kê Doanh thu & Đánh giá theo Dịch vụ
CREATE OR ALTER VIEW dbo.vw_ServicePerformanceAnalytics
AS
SELECT 
    s.ServiceId,
    s.Name AS ServiceName,
    s.Category,
    COUNT(o.OrderId) AS TotalOrdersCount,
    SUM(ISNULL(o.PaymentAmountPaid, 0)) AS TotalRevenueGenerated,
    AVG(CAST(r.Rating AS FLOAT)) AS AverageCustomerRating
FROM dbo.Services s
LEFT JOIN dbo.ServiceOrders o ON s.ServiceId = o.ServiceId
LEFT JOIN dbo.ServiceReviews r ON s.ServiceId = r.ServiceId
GROUP BY s.ServiceId, s.Name, s.Category;
GO

PRINT N'==> Tạo các Views Thống Kê thành công.';
GO

-- ============================================================================
-- 7. STORED PROCEDURES XỬ LÝ NGHIỆP VỤ CỐT LÕI (CORE PROCEDURES)
-- ============================================================================

-- Procedure 1: Cập nhật Tiến độ làm việc (Max 90% cho Staff)
CREATE OR ALTER PROCEDURE dbo.sp_UpdateOrderProgress
    @OrderId NVARCHAR(50),
    @ProgressPercent INT,
    @UpdatedByStaffId NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Giới hạn tối đa 90% (100% tự động khi Khách nghiệm thu)
    DECLARE @ClampedProgress INT = @ProgressPercent;
    IF @ClampedProgress > 90 SET @ClampedProgress = 90;
    IF @ClampedProgress < 0  SET @ClampedProgress = 0;

    UPDATE dbo.ServiceOrders
    SET ProgressPercent = @ClampedProgress,
        UpdatedAt = GETDATE()
    WHERE OrderId = @OrderId;

    SELECT OrderId, ProgressPercent, Status FROM dbo.ServiceOrders WHERE OrderId = @OrderId;
END;
GO

-- Procedure 2: Khách hàng Nghiệm thu sản phẩm (Đặt 100% Tiến độ)
CREATE OR ALTER PROCEDURE dbo.sp_AcceptOrderDeliverable
    @OrderId NVARCHAR(50),
    @DeliverableId NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.OrderDeliverables
    SET Status = N'accepted'
    WHERE DeliverableId = @DeliverableId;

    DECLARE @QuotationAmount DECIMAL(18, 2);
    DECLARE @PaymentAmountPaid DECIMAL(18, 2);

    SELECT @QuotationAmount = ISNULL(QuotationAmount, 0),
           @PaymentAmountPaid = ISNULL(PaymentAmountPaid, 0)
    FROM dbo.ServiceOrders WHERE OrderId = @OrderId;

    -- Nếu đã trả đủ 100% số tiền -> Completed. Ngược lại -> Accepted (Chờ thu 50% còn lại)
    DECLARE @NewStatus NVARCHAR(30) = N'accepted';
    IF (@PaymentAmountPaid >= @QuotationAmount AND @QuotationAmount > 0)
    BEGIN
        SET @NewStatus = N'completed';
    END

    UPDATE dbo.ServiceOrders
    SET ProgressPercent = 100,
        Status = @NewStatus,
        UpdatedAt = GETDATE()
    WHERE OrderId = @OrderId;

    SELECT OrderId, ProgressPercent, Status FROM dbo.ServiceOrders WHERE OrderId = @OrderId;
END;
GO

PRINT N'==> Khởi tạo Stored Procedures thành công.';
GO

-- ============================================================================
-- XÁC NHẬN HOÀN TẤT
-- ============================================================================
PRINT N'';
PRINT N'----------------------------------------------------------------------------';
PRINT N'  CƠ SỞ DỮ LIỆU [4YouTechDB] ĐÃ ĐƯỢC THIẾT KẾ VÀ NẠP DỮ LIỆU THÀNH CÔNG!   ';
PRINT N'----------------------------------------------------------------------------';
GO
