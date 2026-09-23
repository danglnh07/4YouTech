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
(N'it-lap-trinh-portfolio', N'Lập trình Portfolio', N'Lập trình website portfolio cá nhân tối ưu SEO, giao diện cá tính, responsive chuẩn di động & web.', N'IT', 3, 1000000.00, 3, N'Mã nguồn Next.js/React, Chuẩn Responsive Mobile/Tablet, Hướng dẫn quản trị & Deploy Vercel/Netlify miễn phí.', N'Online', N'["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"]', 0),
(N'it-thiet-ke-web', N'Thiết kế Web', N'Xây dựng & lập trình website doanh nghiệp, trang bán hàng, landing page hiện đại, chuẩn SEO & tối ưu tốc độ.', N'IT', 5, 1500000.00, 4, N'Fullstack Website, Tích hợp CMS Quản lý nội dung, Form liên hệ, Chuẩn SEO Google & Security.', N'Hybrid', N'["https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"]', 0),
(N'it-ui-ux', N'UI/UX', N'Nghiên cứu hành vi người dùng, vẽ Wireframe, thiết kế Prototype tương tác & lập trình giao diện Web/App mượt mà.', N'IT', 4, 1200000.00, 3, N'Wireframe UI/UX, Prototype tương tác Figma, Component Design System & Code Front-end.', N'Online', N'["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"]', 0),
(N'it-test-loi-phan-mem', N'Test lỗi phần mềm', N'Kiểm thử phần mềm (Manual & Automation Testing), rà soát lỗi UI/UX, bảo mật, hiệu năng & xuất báo cáo chi tiết.', N'IT', 2, 500000.00, 2, N'Báo cáo Test Case (Excel/PDF), Danh sách Bug Log, Video/Hình ảnh minh chứng lỗi & Đề xuất khắc phục.', N'Online', N'["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"]', 0),
(N'design-thiet-ke-ui', N'Thiết kế UI', N'Thiết kế Giao diện người dùng (User Interface) sắc nét, hiện đại trên Figma dành cho Website & Mobile App.', N'Design', 3, 1000000.00, 3, N'File Figma Master, Bộ Style Guide (Màu sắc, Typography, Icons), Export PNG/SVG assets.', N'Online', N'["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"]', 0),
(N'design-logo', N'Logo', N'Thiết kế Logo nhận diện thương hiệu độc quyền, sáng tạo ấn tượng, kèm Brand Guidelines & file Vector gốc.', N'Design', 2, 600000.00, 3, N'File Vector AI/PSD/PNG/SVG, Logo Mockup thực tế, Hướng dẫn quy chuẩn sử dụng Logo.', N'Online', N'["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80","/images/logo-phin-coffee.png","/images/logo-ladybug-or.png"]', 0),
(N'design-banner', N'Banner', N'Thiết kế Banner quảng cáo, banner website, mạng xã hội (Facebook/Zalo/Instagram) bắt mắt, chuẩn tỷ lệ.', N'Design', 1, 300000.00, 2, N'File thiết kế Vector/PSD, File ảnh xuất chất lượng cao (PNG/JPG/WebP), Banner kích thước chuẩn.', N'Online', N'["/images/banner-y-te.png","/images/banner-mat-kinh.png","/images/banner-dau-tu.png"]', 0),
(N'design-poster', N'Poster', N'Thiết kế Poster sự kiện, poster truyền thông, nghệ thuật độ phân giải cao dành cho in ấn & đăng tải truyền thông.', N'Design', 2, 400000.00, 3, N'File in ấn PDF/TIFF chất lượng cao, File ảnh PNG/JPG truyền thông, Mockup poster thực tế.', N'Online', N'["/images/poster-avocado.png","/images/poster-longan.png","/images/poster-ocean.jpg"]', 0);
GO

-- Seed Dự Án Mẫu Showcase (SampleProjects)
INSERT INTO dbo.SampleProjects (ProjectId, Name, Category, Description, ImageUrl, ProjectLink, IsFeatured) VALUES
(N'proj-1', N'Website Đặt Sân & Quản Lý Sự Kiện Sinh Viên', N'IT', N'Hệ thống Web Fullstack hỗ trợ CLB trường đặt lịch sự kiện, thanh toán và quản lý thành viên.', N'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', N'https://demo.4youtech.com/student-event', 1),
(N'proj-2', N'Bộ Giao diện UI App Sức Khỏe & Thể Thao', N'Design', N'Thiết kế UI/UX 18 màn hình phong cách Glassmorphism màu neon dành cho gen Z.', N'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80', N'https://figma.com/file/demo-fitness-ui', 1),
(N'proj-3', N'Phân Tích ERD & Hệ Thống E-Commerce Chuyên Sâu', N'IT', N'Thiết kế CSDL SQL gồm 32 bảng chuẩn hóa 3NF xử lý đơn hàng, kho và khuyến mãi.', N'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', N'https://dbdiagram.io/d/demo-ecommerce', 0),
(N'proj-4', N'Bộ Nhận Diện Thương Hiệu CLB Sáng Tạo TechClub', N'Design', N'Logo, Brand Guidelines, Template slide thuyết trình và 10 mẫu poster truyền thông.', N'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&auto=format&fit=crop&q=80', N'https://behance.net/gallery/techclub-brand', 1),
(N'proj-banner-yte', N'Banner Quảng Cáo Trung Tâm Y Tế & Chăm Sóc Sức Khỏe Gia Đình', N'Design', N'Banner quảng cáo cho chủ đề chăm sóc sức khỏe gia đình và lối sống lành mạnh, năng động, mang lại cảm giác tươi mới và giàu sức sống ngay từ cái nhìn đầu tiên. Nhờ sự kết hợp giữa màu xanh ngọc cùng với hình ảnh lá cây, biểu tượng dấu cộng y tế cùng hình ảnh các nhân vật hoạt hình đang tích cực vận động, banner truyền tải tinh thần tích cực, sự tận tâm và cảm giác được bảo vệ, đồng hành toàn diện cho sức khỏe của cả gia đình.', N'/images/banner-y-te.png', N'/images/banner-y-te.png', 1),
(N'proj-banner-matkinh', N'Banner Quảng Cáo Mắt Kính Thông Minh AR & Bluetooth', N'Design', N'Banner mang chủ đề giới thiệu sản phẩm công nghệ đeo thông minh thế hệ mới, tập trung vào khả năng kết nối và hỗ trợ tiện ích rảnh tay cho người dùng. Tổng thể thiết kế tỏa ra cảm giác hiện đại, tối giản và tinh tế. Nền trắng sáng kết hợp với xanh lam nhạt và gọng kính đen sắc nét tạo nên một không gian thị giác sạch sẽ và hi-tech, mang lại cho người xem sự tin tưởng vào tính sáng tạo, tiện nghi và đột phá của sản phẩm.', N'/images/banner-mat-kinh.png', N'/images/banner-mat-kinh.png', 1),
(N'proj-banner-dautu', N'Banner Truyền Thông Dịch Vụ Đầu Tư Tài Chính & Bất Động Sản', N'Design', N'Banner hướng đến chủ đề giải pháp tài chính và dịch vụ tư vấn đầu tư sinh lời bền vững. Banner này mang đến sự uy tín và chuyên nghiệp. Phông nền xanh navy trầm kết hợp cùng các gam màu tương phản mạnh như vàng kim của tiền tài và xanh lá của sự tăng trưởng tạo nên một cảm giác đáng tin. Sự xuất hiện của các biểu tượng đồ thị stock và đồng vàng làm tăng thêm cảm giác tài sản và thịnh vượng về một tương lai tài chính vững vàng.', N'/images/banner-dau-tu.png', N'/images/banner-dau-tu.png', 1),
(N'proj-poster-avocado', N'Poster Truyền Thông Sản Phẩm Trái Bơ Nông Sản Sạch (Avocado)', N'Design', N'Poster quảng cáo trái bơ "FRUIT AVOCADO" được thiết kế theo phong cách hiện đại, tối giản và vô cùng sang trọng. Cận cảnh nửa quả bơ tươi ngon với phần thịt quả xanh bơ mịn màng, hạt bơ tròn màu nâu bóng ở chính giữa và lớp vỏ xanh đậm tự nhiên, gợi cảm giác béo ngậy và giàu dinh dưỡng. Chữ "FRUIT" màu đen thanh lịch nằm phía trên. Tên sản phẩm "AVOCADO" được in hoa, nét chữ nghệ thuật uốn lượn màu vàng rực rỡ, chiếm vị trí trung tâm vô cùng thu hút. Sử dụng tông màu vàng mù tạt / vàng đất làm chủ đạo ở nửa trên, kết hợp cùng sắc đen xám ở giữa và nền xanh lá / nâu tự nhiên ở nửa dưới. Bố cục chia mảng màu giúp poster có chiều sâu và làm nổi bật hình ảnh trái bơ.', N'/images/poster-avocado.png', N'/images/poster-avocado.png', 1),
(N'proj-poster-longan', N'Poster Quảng Báo Trái Cây Nhiệt Đới Việt Nam - Quả Nhãn (Longan)', N'Design', N'Poster quảng cáo trái nhãn "tropical fruit LONGAN" được thiết kế vô cùng bắt mắt, hiện đại và tràn đầy cảm hứng tự nhiên. Sử dụng hình ảnh tán cây nhãn sai trĩu quả dưới ánh nắng vàng nhẹ, tạo cảm giác xanh tươi, tự nhiên và ngập tràn không khí nhiệt đới. Cận cảnh một quả nhãn đã bóc vỏ, để lộ phần cơm nhãn trắng trong, mọng nước cùng hạt đen bên trong, tạo ấn tượng thị giác vô cùng kích thích vị giác. Tông màu chủ đạo là sự kết hợp giữa xanh lá đậm của cây cỏ, màu nâu ấm của vỏ nhãn và sắc vàng rực rỡ của nắng/chữ. Poster truyền tải trọn vẹn thông điệp về một loại trái cây đặc sản Việt Nam tươi ngon, nguyên bản, giàu dưỡng chất và đậm đà hương vị nhiệt đới.', N'/images/poster-longan.png', N'/images/poster-longan.png', 1),
(N'proj-poster-ocean', N'Poster Truyền Thông Bảo Vệ Đại Dương & Sinh Vật Biển (Adaptation)', N'Design', N'Poster với thông điệp cảnh tỉnh về môi trường được thể hiện với phong cách như hình chụp. Trung tâm bức ảnh là một con cá đang bơi lội giữa lòng đại dương xanh nhưng phần đuôi tự nhiên của nó đã bị biến đổi, xoắn lại và chuyển dần thành một chiếc bọc nilon trong suốt với các xác cá chết trôi nổi xung quanh. Hình ảnh này tương phản hoàn toàn với luồng ánh sáng mặt trời rạng rỡ đang xuyên qua làn nước trong xanh từ phía trên, gợi lên cảm giác mong manh của hệ sinh thái biển. Tone màu xanh lam đậm bao trùm không gian mang lại chiều sâu lặng lẽ, làm nổi bật sắc trắng của dải nhựa cùng tiêu đề "ADAPTATION" phía dưới. Đi kèm với câu khẩu hiệu "When nature suffers, so do we", poster là một lời nhắc nhở rằng sự "thích nghi" cưỡng ép này của sinh vật biển chính là lời cảnh báo cho tương lai và sức khỏe của chính con người nếu ô nhiễm nhựa tiếp tục tàn phá đại dương.', N'/images/poster-ocean.jpg', N'/images/poster-ocean.jpg', 1),
(N'proj-logo-ladybug', N'Logo Monogram Chú Bọ Rùa Đỏ Cách Điệu (OR Monogram Ladybug Logo)', N'Design', N'Thiết kế Logo Monogram sáng tạo hình chú bọ rùa (Ladybug) sắc đỏ nổi bật, lồng ghép khéo léo 2 chữ cái ''O'' và ''R''. Phong cách đồ họa Vector hiện đại, đường nét mềm mại tinh tế, tượng trưng cho sự may mắn, tràn đầy sức sống và tinh thần sáng tạo đột phá.', N'/images/logo-ladybug-or.png', N'/images/logo-ladybug-or.png', 1),
(N'proj-logo-phin-coffee', N'Logo Thương Hiệu Cà Phê Quý Ông PHIN COFFEE', N'Design', N'Thiết kế Logo nhận diện thương hiệu PHIN COFFEE độc đáo, phối màu vàng chanh nổi bật kết hợp sắc nâu sẫm cà phê rang xay. Ý tưởng tạo hình phin cà phê truyền thống kết hợp chiếc mũ Fedora quý ông lịch lãm, tạo nên dấu ấn thương hiệu cà phê mộc đậm đà, sang trọng và cá tính.', N'/images/logo-phin-coffee.png', N'/images/logo-phin-coffee.png', 1),
(N'proj-logo-vplus-health', N'Logo Y Tế & Chăm Sóc Sức Khỏe Trái Tim V+ (V+ Medical & Health Logo)', N'Design', N'Thiết kế Logo thương hiệu trung tâm y tế & chăm sóc sức khỏe V+ biểu tượng hình trái tim kết hợp chiếc lá mầm xanh và dấu cộng y tế. Phối màu gradient chuyển sắc xanh lam - xanh lá dịu mát, truyền tải thông điệp về sự an tâm, yêu thương, tận tụy và sức sống vươn lên.', N'/images/logo-vplus-health.png', N'/images/logo-vplus-health.png', 1);
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
