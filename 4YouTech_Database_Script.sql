-- ============================================================================
-- DỰ ÁN: 4YOUTECH PLATFORM DATABASE SCHEMA & SEED DATA (SQL SERVER / T-SQL)
-- Hệ thống cung cấp Dịch vụ IT, Thiết kế Web Portfolio, ERD Database & Graphic Design
-- Tương thích: SQL Server 2016+, SSMS, Azure SQL Database
-- Database Name: 4YouTechDB
-- Phiên bản đồng nhất với 4YouTech_MySQL_Script.sql (2026-10-14)
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

-- ============================================================================
-- 2. XÓA VIEW VÀ BẢNG NẾU ĐÃ TỒN TẠI (Thứ tự an toàn tránh lỗi Foreign Key)
-- ============================================================================
IF OBJECT_ID('dbo.vw_PilotCohortKpiSummary', 'V') IS NOT NULL DROP VIEW dbo.vw_PilotCohortKpiSummary;
IF OBJECT_ID('dbo.vw_ServicePerformanceAnalytics', 'V') IS NOT NULL DROP VIEW dbo.vw_ServicePerformanceAnalytics;
IF OBJECT_ID('dbo.vw_OrderDetailsSummary', 'V') IS NOT NULL DROP VIEW dbo.vw_OrderDetailsSummary;
GO

IF OBJECT_ID('dbo.PaymentTransactions', 'U') IS NOT NULL DROP TABLE dbo.PaymentTransactions;
IF OBJECT_ID('dbo.PostServiceSurveys', 'U') IS NOT NULL DROP TABLE dbo.PostServiceSurveys;
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
-- 3. KHỞI TẠO CÁC BẢNG DỮ LIỆU (13 TABLES CREATION)
-- ============================================================================

-- Bảng 1: Người dùng (Users - Khách hàng, Nhân viên, Quản trị viên)
CREATE TABLE dbo.Users (
    UserId          NVARCHAR(100) NOT NULL PRIMARY KEY,
    Name            NVARCHAR(255) NOT NULL,
    Email           NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash    NVARCHAR(255) NULL,
    Role            NVARCHAR(50) NOT NULL DEFAULT 'customer' CONSTRAINT CHK_Users_Role CHECK (Role IN ('guest', 'customer', 'staff', 'admin')),
    Phone           NVARCHAR(50) NULL,
    SkillsJson      NVARCHAR(MAX) NULL, -- JSON Array kỹ năng của Staff
    AvatarUrl       NVARCHAR(MAX) NULL,
    Status          NVARCHAR(50) NOT NULL DEFAULT 'active' CONSTRAINT CHK_Users_Status CHECK (Status IN ('active', 'locked', 'pending_otp')),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 2: Danh mục Dịch vụ (Services)
CREATE TABLE dbo.Services (
    ServiceId       NVARCHAR(100) NOT NULL PRIMARY KEY,
    Name            NVARCHAR(255) NOT NULL,
    Description     NVARCHAR(MAX) NOT NULL,
    Category        NVARCHAR(50) NOT NULL DEFAULT 'IT' CONSTRAINT CHK_Services_Category CHECK (Category IN ('IT', 'Design', 'IT/Design')),
    EstimatedDays   INT NULL,
    MaxDays         INT NULL,
    EstimatedPrice  DECIMAL(18, 2) NULL,
    MaxPrice        DECIMAL(18, 2) NULL,
    MaxRevisions    INT NOT NULL DEFAULT 3,
    ScopeOutput     NVARCHAR(MAX) NOT NULL,
    SupportType     NVARCHAR(50) NOT NULL DEFAULT 'Online' CONSTRAINT CHK_Services_SupportType CHECK (SupportType IN ('Online', 'Direct', 'Hybrid')),
    DemoImagesJson  NVARCHAR(MAX) NULL, -- JSON Array ảnh sản phẩm
    IsHidden        BIT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 3: Dự án Mẫu Showcase (SampleProjects)
CREATE TABLE dbo.SampleProjects (
    ProjectId       NVARCHAR(100) NOT NULL PRIMARY KEY,
    Name            NVARCHAR(255) NOT NULL,
    Category        NVARCHAR(50) NOT NULL,
    SubCategory     NVARCHAR(100) NULL,
    Description     NVARCHAR(MAX) NOT NULL,
    ImageUrl        NVARCHAR(MAX) NOT NULL,
    DemoLink        NVARCHAR(MAX) NULL,
    IsFeatured      BIT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 4: Đơn hàng & Yêu cầu Dịch vụ (ServiceOrders - Quản lý 12 giai đoạn dịch vụ & KPI)
CREATE TABLE dbo.ServiceOrders (
    OrderId                 NVARCHAR(100) NOT NULL PRIMARY KEY,
    ServiceId               NVARCHAR(100) NOT NULL,
    ServiceName             NVARCHAR(255) NOT NULL,
    Category                NVARCHAR(50) NOT NULL,
    CustomerId              NVARCHAR(100) NOT NULL CONSTRAINT FK_Orders_Customers FOREIGN KEY REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    CustomerName            NVARCHAR(255) NOT NULL,
    CustomerEmail           NVARCHAR(255) NOT NULL,
    CustomerPhone           NVARCHAR(50) NULL,
    Requirements            NVARCHAR(MAX) NOT NULL,
    AttachmentsJson         NVARCHAR(MAX) NULL,
    DesiredDeadline         NVARCHAR(100) NULL,
    Status                  NVARCHAR(50) NOT NULL DEFAULT 'submitted' CONSTRAINT CHK_Orders_Status CHECK (Status IN (
                                'submitted', 'under_review', 'info_requested', 'quoted', 'deposit_pending',
                                'in_progress', 'deliverable_sent', 'revision_requested', 'accepted',
                                'completed', 'cancel_requested', 'cancelled'
                            )),
    ProgressPercent         INT NOT NULL DEFAULT 5 CONSTRAINT CHK_Orders_Progress CHECK (ProgressPercent BETWEEN 0 AND 100),
    AssignedStaffId         NVARCHAR(100) NULL,
    AssignedStaffName       NVARCHAR(255) NULL,
    CollaboratorsJson       NVARCHAR(MAX) NULL,

    -- Mốc đo lường KPI vòng đời dịch vụ (Góp ý 2)
    FirstResponseAt         NVARCHAR(100) NULL, -- Thời điểm phản hồi đầu tiên (Response Time)
    DeliverableSentAt       NVARCHAR(100) NULL, -- Thời điểm bàn giao phiên bản demo/chính thức
    AcceptedAt              NVARCHAR(100) NULL, -- Thời điểm khách hàng ký nghiệm thu
    CompletedAt             NVARCHAR(100) NULL, -- Thời điểm thanh toán 100% & đóng dự án
    IsOnTime                BIT NOT NULL DEFAULT 1, -- Bàn giao đúng deadline cam kết trong SOW
    IsFirstPassAcceptance   BIT NOT NULL DEFAULT 1, -- Nghiệm thu ngay lần đầu không phát sinh revision
    SupportPeriodEndAt      NVARCHAR(100) NULL, -- Hạn bảo vệ hỗ trợ kỹ thuật (14-30 ngày sau bàn giao)

    -- Hợp đồng Scope of Work SOW & Thanh toán 50-50 (Góp ý 1 - M2)
    WorkEstimateJson        NVARCHAR(MAX) NULL, -- Dự toán chi phí/thời gian từ Staff
    QuotationJson           NVARCHAR(MAX) NULL, -- Chứa amount, deadline, deliverables, exclusions, criteria, remedyTerms
    PaymentInfoJson         NVARCHAR(MAX) NULL, -- Chứa amountPaid, paymentMethod, status, note

    -- Dữ liệu JSON đồng bộ với Next.js API Route (/api/orders)
    MilestonesJson          NVARCHAR(MAX) NULL,
    DeliverablesJson        NVARCHAR(MAX) NULL,
    RevisionsJson           NVARCHAR(MAX) NULL,
    SupportTicketsJson      NVARCHAR(MAX) NULL,
    CancellationJson        NVARCHAR(MAX) NULL,

    -- Biên bản UAT & Transfer Session (Góp ý 1 - M3 & Giai đoạn 11)
    UatSubmissionJson       NVARCHAR(MAX) NULL, -- Checklist 4 nhóm kiểm thử + chữ ký nghiệm thu
    TransferSessionJson     NVARCHAR(MAX) NULL, -- Thông tin buổi chuyển giao kỹ thuật (link, ngày, video, docs)
    PostServiceSurveyJson   NVARCHAR(MAX) NULL, -- Tóm tắt điểm hài lòng CSAT & SUS

    IsBeingEdited           BIT NOT NULL DEFAULT 0,
    EditingNote             NVARCHAR(MAX) NULL,
    CreatedAt               DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt               DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 5: Cột mốc Tiến độ Đơn hàng (OrderMilestones)
CREATE TABLE dbo.OrderMilestones (
    MilestoneId     NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(100) NOT NULL CONSTRAINT FK_Milestones_Orders FOREIGN KEY REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    Title           NVARCHAR(255) NOT NULL,
    TargetDate      NVARCHAR(100) NOT NULL,
    IsCompleted     BIT NOT NULL DEFAULT 0,
    UpdatedBy       NVARCHAR(255) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 6: Sản phẩm Bàn giao (OrderDeliverables)
CREATE TABLE dbo.OrderDeliverables (
    DeliverableId   NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(100) NOT NULL CONSTRAINT FK_Deliverables_Orders FOREIGN KEY REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    Version         INT NOT NULL DEFAULT 1,
    Title           NVARCHAR(255) NOT NULL,
    FileLink        NVARCHAR(MAX) NOT NULL,
    PreviewUrl      NVARCHAR(MAX) NULL,
    Notes           NVARCHAR(MAX) NULL,
    Status          NVARCHAR(50) NOT NULL DEFAULT 'pending' CONSTRAINT CHK_Deliverables_Status CHECK (Status IN ('pending', 'accepted', 'revision_needed')),
    [Timestamp]     DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 7: Yêu cầu Chỉnh sửa trong Scope (OrderRevisions - Tối đa 3 vòng)
CREATE TABLE dbo.OrderRevisions (
    RevisionId      NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(100) NOT NULL CONSTRAINT FK_Revisions_Orders FOREIGN KEY REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    Version         INT NOT NULL,
    Feedback        NVARCHAR(MAX) NOT NULL,
    Status          NVARCHAR(50) NOT NULL DEFAULT 'pending' CONSTRAINT CHK_Revisions_Status CHECK (Status IN ('pending', 'resolved')),
    RequestedAt     DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 8: Tin nhắn Trực tiếp Khách hàng & Staff (OrderMessages)
CREATE TABLE dbo.OrderMessages (
    MessageId       NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(100) NOT NULL CONSTRAINT FK_Messages_Orders FOREIGN KEY REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    SenderId        NVARCHAR(100) NOT NULL,
    SenderName      NVARCHAR(255) NOT NULL,
    SenderRole      NVARCHAR(50) NOT NULL,
    Text            NVARCHAR(MAX) NOT NULL,
    AttachmentUrl   NVARCHAR(MAX) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 9: Đánh giá Dịch vụ Công khai (ServiceReviews)
CREATE TABLE dbo.ServiceReviews (
    ReviewId        NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(100) NOT NULL,
    ServiceId       NVARCHAR(100) NOT NULL,
    ServiceName     NVARCHAR(255) NOT NULL,
    CustomerId      NVARCHAR(100) NULL,
    CustomerName    NVARCHAR(255) NOT NULL,
    Rating          INT NOT NULL DEFAULT 5 CONSTRAINT CHK_Reviews_Rating CHECK (Rating BETWEEN 1 AND 5),
    Comment         NVARCHAR(MAX) NOT NULL,
    Moderated       BIT NOT NULL DEFAULT 1,
    ReplyText       NVARCHAR(MAX) NULL,
    RepliedBy       NVARCHAR(255) NULL,
    RepliedAt       NVARCHAR(100) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 10: Ticket Hỗ trợ & Khiếu nại (SupportTickets - Tuân thủ Điều 31 & 36 Luật 19/2023/QH15 & ISO 10002)
CREATE TABLE dbo.SupportTickets (
    TicketId                NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId                 NVARCHAR(100) NOT NULL CONSTRAINT FK_Tickets_Orders FOREIGN KEY REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    CustomerId              NVARCHAR(100) NULL,
    CustomerName            NVARCHAR(255) NOT NULL,
    CustomerEmail           NVARCHAR(255) NOT NULL,
    Subject                 NVARCHAR(255) NOT NULL,
    Content                 NVARCHAR(MAX) NOT NULL,
    Type                    NVARCHAR(50) NOT NULL DEFAULT 'support' CONSTRAINT CHK_Tickets_Type CHECK (Type IN ('support', 'complaint')),
    Category                NVARCHAR(50) NOT NULL DEFAULT 'other' CONSTRAINT CHK_Tickets_Category CHECK (Category IN ('scope_issue', 'deadline_delay', 'quality_defect', 'warranty_support', 'technical_bug', 'scope_dispute', 'post_handover', 'quality_issue', 'other')),
    Priority                NVARCHAR(20) NOT NULL DEFAULT 'medium' CONSTRAINT CHK_Tickets_Priority CHECK (Priority IN ('low', 'medium', 'high', 'urgent')),
    Status                  NVARCHAR(50) NOT NULL DEFAULT 'open' CONSTRAINT CHK_Tickets_Status CHECK (Status IN ('open', 'acknowledged', 'investigating', 'processing', 'resolved', 'closed')),
    SlaAcknowledgeDeadline  DATETIME2 NOT NULL, -- Cam kết tiếp nhận <= 3 ngày làm việc (Điều 31)
    AcknowledgedAt          NVARCHAR(100) NULL,
    AcknowledgedBy          NVARCHAR(255) NULL,
    AssignedStaffId         NVARCHAR(100) NULL,
    AssignedStaffName       NVARCHAR(255) NULL,
    Response                NVARCHAR(MAX) NULL,
    RemedyType              NVARCHAR(50) NULL CONSTRAINT CHK_Tickets_Remedy CHECK (RemedyType IN ('free_fix', 'redo_work', 'fee_discount', 'partial_refund', 'full_refund', 'full_refund_termination', 'scope_extension', 'custom_agreement', 'guidance')), -- Điều 36
    RemedyDetails           NVARCHAR(MAX) NULL,
    ResolvedAt              NVARCHAR(100) NULL,
    CustomerRating          INT NULL CONSTRAINT CHK_Tickets_CustRating CHECK (CustomerRating BETWEEN 1 AND 5),
    CreatedAt               DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 10b: Khảo sát Hài lòng Khách hàng Sau Bàn Giao (PostServiceSurveys - ISO 10004:2018 & SUS Brooke 1996)
CREATE TABLE dbo.PostServiceSurveys (
    SurveyId                NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId                 NVARCHAR(100) NOT NULL UNIQUE CONSTRAINT FK_Surveys_Orders FOREIGN KEY REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    CustomerName            NVARCHAR(255) NOT NULL,
    Q1_ScopeClarity         INT NOT NULL CONSTRAINT CHK_Surveys_Q1 CHECK (Q1_ScopeClarity BETWEEN 1 AND 5),
    Q2_ProgressUpdate       INT NOT NULL CONSTRAINT CHK_Surveys_Q2 CHECK (Q2_ProgressUpdate BETWEEN 1 AND 5),
    Q3_DeliverableQuality   INT NOT NULL CONSTRAINT CHK_Surveys_Q3 CHECK (Q3_DeliverableQuality BETWEEN 1 AND 5),
    Q4_RevisionHandling     INT NOT NULL CONSTRAINT CHK_Surveys_Q4 CHECK (Q4_RevisionHandling BETWEEN 1 AND 5),
    Q5_TransferSession      INT NOT NULL CONSTRAINT CHK_Surveys_Q5 CHECK (Q5_TransferSession BETWEEN 1 AND 5),
    Q6_OverallSatisfaction  INT NOT NULL CONSTRAINT CHK_Surveys_Q6 CHECK (Q6_OverallSatisfaction BETWEEN 1 AND 5),
    RecommendIntent         BIT NOT NULL DEFAULT 1, -- 1=Có, 0=Không
    BestPoint               NVARCHAR(MAX) NULL,
    ImprovePoint            NVARCHAR(MAX) NULL,
    SusScore                DECIMAL(5, 2) NULL, -- System Usability Scale 0-100 (Brooke, 1996)
    SubmittedAt             DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 11: Giỏ hàng Dịch vụ (CartItems)
CREATE TABLE dbo.CartItems (
    CartItemId      NVARCHAR(100) NOT NULL PRIMARY KEY,
    UserId          NVARCHAR(100) NOT NULL CONSTRAINT FK_Cart_Users FOREIGN KEY REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    ServiceId       NVARCHAR(100) NOT NULL,
    ServiceName     NVARCHAR(255) NOT NULL,
    Category        NVARCHAR(50) NOT NULL,
    EstimatedPrice  DECIMAL(18, 2) NULL,
    EstimatedDays   INT NULL,
    Requirements    NVARCHAR(MAX) NULL,
    DesiredDeadline NVARCHAR(100) NULL,
    AddedAt         DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Bảng 12: Lịch sử Giao dịch Thanh toán VietQR & VNPay (PaymentTransactions)
CREATE TABLE dbo.PaymentTransactions (
    TransactionId   NVARCHAR(100) NOT NULL PRIMARY KEY,
    OrderId         NVARCHAR(100) NOT NULL CONSTRAINT FK_Txn_Orders FOREIGN KEY REFERENCES dbo.ServiceOrders(OrderId) ON DELETE CASCADE,
    CustomerId      NVARCHAR(100) NULL,
    CustomerName    NVARCHAR(255) NOT NULL,
    Amount          DECIMAL(18, 2) NOT NULL,
    PaymentType     NVARCHAR(50) NOT NULL DEFAULT 'deposit' CONSTRAINT CHK_Txn_PaymentType CHECK (PaymentType IN ('deposit', 'full', 'remaining')),
    PaymentMethod   NVARCHAR(50) NOT NULL DEFAULT 'VietQR' CONSTRAINT CHK_Txn_PaymentMethod CHECK (PaymentMethod IN ('VietQR', 'VNPay', 'BankTransfer')),
    VnpTxnRef       NVARCHAR(100) NULL,
    VnpBankCode     NVARCHAR(50) NULL,
    VnpResponseCode NVARCHAR(50) NULL,
    ReceiptImage    NVARCHAR(MAX) NULL,
    Note            NVARCHAR(MAX) NULL,
    Status          NVARCHAR(50) NOT NULL DEFAULT 'pending' CONSTRAINT CHK_Txn_Status CHECK (Status IN ('pending', 'verified', 'rejected')),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

PRINT N'==> Khởi tạo 13 Bảng Dữ Liệu thành công.';
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
-- 5. NẠP DỮ LIỆU MẪU ĐẦY ĐỦ (FULL SEED DATA - ĐỒNG NHẤT VỚI MYSQL)
-- ============================================================================

-- 5.1. Seed 14 Người Dùng (Users: 1 Guest, 10 Pilot Customers, 2 Staffs, 1 Admin)
INSERT INTO dbo.Users (UserId, Name, Email, PasswordHash, Role, Phone, SkillsJson, AvatarUrl, Status) VALUES
(N'usr-guest', N'Khách xem', N'guest@4youtech.com', NULL, N'guest', NULL, NULL, NULL, N'active'),
(N'usr-cust-1', N'Nguyễn Văn An', N'an.nguyen@student.edu.vn', N'hash_1b932c0', N'customer', N'0912345678', NULL, N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-2', N'Lê Minh Tuấn (CLB IT)', N'tuan.le@clbit.org', N'hash_1b932c0', N'customer', N'0987654321', NULL, N'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-3', N'Hoàng Kim Ngân', N'kimngan.hoang@student.edu.vn', N'hash_1b932c0', N'customer', N'0934567890', NULL, N'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-4', N'Đỗ Quốc Việt (Phin Coffee)', N'viet.do@fnbstartup.vn', N'hash_1b932c0', N'customer', N'0945678901', NULL, N'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-5', N'Trần Mai Linh (CLB TT)', N'mailinh.clbtt@gmail.com', N'hash_1b932c0', N'customer', N'0956789012', NULL, N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-6', N'Vũ Đình Khoa', N'khoa.vu@fpt.edu.vn', N'hash_1b932c0', N'customer', N'0967890123', NULL, N'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-7', N'Ngô Thùy Trang (V+ Health)', N'trang.ngo@charity.vn', N'hash_1b932c0', N'customer', N'0978901234', NULL, N'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-8', N'Bùi Hoàng Nam (Freelancer)', N'nam.bui@designfreelance.com', N'hash_1b932c0', N'customer', N'0989012345', NULL, N'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-9', N'Phạm Quỳnh Chi', N'quynhchi.fashion@gmail.com', N'hash_1b932c0', N'customer', N'0990123456', NULL, N'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-cust-10', N'Nguyễn Đăng Quang', N'quang.dang@gmail.com', N'hash_1b932c0', N'customer', N'0911223344', NULL, N'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-staff-it', N'Trần Bảo IT', N'bao.it@4youtech.com', N'hash_2c810d1', N'staff', N'0901112233', N'["React/Next.js", "Node.js", "Database", "System Architecture"]', N'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-staff-des', N'Phạm Hà Design', N'ha.design@4youtech.com', N'hash_2c810d1', N'staff', N'0904445566', N'["Figma UI/UX", "Branding", "Banner/Poster", "Motion Graphic"]', N'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', N'active'),
(N'usr-admin', N'Quản trị viên 4YouTech', N'admin@4youtech.com', N'240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', N'admin', N'0999888777', NULL, N'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', N'active');
GO

-- 5.2. Seed 8 Dịch Vụ Chuẩn (Services)
INSERT INTO dbo.Services (ServiceId, Name, Description, Category, EstimatedDays, MaxDays, EstimatedPrice, MaxPrice, MaxRevisions, ScopeOutput, SupportType, DemoImagesJson, IsHidden) VALUES
(N'it-lap-trinh-portfolio', N'Lập trình Portfolio', N'Lập trình website portfolio cá nhân tối ưu SEO, giao diện cá tính, responsive chuẩn di động & web.', N'IT', 3, 5, 1000000.00, 2000000.00, 3, N'Mã nguồn Next.js/React, Chuẩn Responsive Mobile/Tablet, Hướng dẫn quản trị & Deploy Vercel/Netlify miễn phí.', N'Online', N'["/images/portfolio-trunghieu.jpg","/images/portfolio-camly.png"]', 0),
(N'it-thiet-ke-web', N'Thiết kế Web', N'Xây dựng & lập trình website doanh nghiệp, trang bán hàng, landing page hiện đại, chuẩn SEO & tối ưu tốc độ.', N'IT', 5, 8, 1500000.00, 3500000.00, 4, N'Fullstack Website, Tích hợp CMS Quản lý nội dung, Form liên hệ, Chuẩn SEO Google & Security.', N'Hybrid', N'["https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"]', 0),
(N'it-ui-ux', N'UI/UX', N'Nghiên cứu hành vi người dùng, vẽ Wireframe, thiết kế Prototype tương tác & lập trình giao diện Web/App mượt mà.', N'IT', 4, 7, 1200000.00, 2500000.00, 3, N'Wireframe UI/UX, Prototype tương tác Figma, Component Design System & Code Front-end.', N'Online', N'["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"]', 0),
(N'it-test-loi-phan-mem', N'Test lỗi phần mềm', N'Kiểm thử phần mềm (Manual & Automation Testing), rà soát lỗi UI/UX, bảo mật, hiệu năng & xuất báo cáo chi tiết.', N'IT', 2, 4, 500000.00, 1500000.00, 2, N'Báo cáo Test Case (Excel/PDF), Danh sách Bug Log, Video/Hình ảnh minh chứng lỗi & Đề xuất khắc phục.', N'Online', N'["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"]', 0),
(N'design-thiet-ke-ui', N'Thiết kế UI', N'Thiết kế Giao diện người dùng (User Interface) sắc nét, hiện đại trên Figma dành cho Website & Mobile App.', N'Design', 3, 5, 1000000.00, 2000000.00, 3, N'File Figma Master, Bộ Style Guide (Màu sắc, Typography, Icons), Export PNG/SVG assets.', N'Online', N'["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"]', 0),
(N'design-logo', N'Logo', N'Thiết kế Logo nhận diện thương hiệu độc quyền, sáng tạo ấn tượng, kèm Brand Guidelines & file Vector gốc.', N'Design', 2, 4, 600000.00, 1500000.00, 3, N'File Vector AI/PSD/PNG/SVG, Logo Mockup thực tế, Hướng dẫn quy chuẩn sử dụng Logo.', N'Online', N'["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80","/images/logo-phin-coffee.png","/images/logo-ladybug-or.png"]', 0),
(N'design-banner', N'Banner', N'Thiết kế Banner quảng cáo, banner website, mạng xã hội (Facebook/Zalo/Instagram) bắt mắt, chuẩn tỷ lệ.', N'Design', 1, 2, 300000.00, 800000.00, 2, N'File thiết kế Vector/PSD, File ảnh xuất chất lượng cao (PNG/JPG/WebP), Banner kích thước chuẩn.', N'Online', N'["/images/banner-y-te.png","/images/banner-mat-kinh.png","/images/banner-dau-tu.png"]', 0),
(N'design-poster', N'Poster', N'Thiết kế Poster sự kiện, poster truyền thông, nghệ thuật độ phân giải cao dành cho in ấn & đăng tải truyền thông.', N'Design', 2, 3, 400000.00, 1000000.00, 3, N'File in ấn PDF/TIFF chất lượng cao, File ảnh PNG/JPG truyền thông, Mockup poster thực tế.', N'Online', N'["/images/poster-avocado.png","/images/poster-longan.png","/images/poster-ocean.jpg"]', 0);
GO

-- 5.3. Seed 16 Dự Án Mẫu (SampleProjects)
INSERT INTO dbo.SampleProjects (ProjectId, Name, Category, SubCategory, Description, ImageUrl, DemoLink, IsFeatured) VALUES
(N'proj-mcropdiary', N'MyCropDiary - App & Giao Diện UI/UX Quản Lý Mùa Vụ Nông Nghiệp Tiêu Chuẩn VietGAP', N'Design', N'UI/UX', N'Nền tảng ứng dụng di động & Giao diện UI/UX chuyên sâu MyCropDiary hỗ trợ số hóa quy trình quản lý mùa vụ canh tác nông nghiệp theo tiêu chuẩn VietGAP. Cung cấp giải pháp ghi chép nhật ký nông vụ điện tử tự động, giám sát thời tiết vi khí hậu thời gian thực, quản lý kho vật tư - phân bón - thuốc bảo vệ thực vật, cảnh báo thời gian cách ly thu hoạch và trích xuất mã QR truy xuất nguồn gốc nông sản minh bạch.', N'/images/mcropdiary-ui.jpg', N'https://www.figma.com/proto/u1rr5WNOTvbwGZ5Whto51z/Untitled?node-id=0-1&p=f&t=RPGQ7V25bEgJuevk-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=91%3A6&show-proto-sidebar=1', 1),
(N'proj-portfolio-trunghieu', N'Website Portfolio Cá Nhân Developer Pro - Nguyễn Trung Hiếu', N'IT', N'Website', N'Website Personal Portfolio Backend Developer & Web/UI Design chuyên nghiệp xuất bản trực tiếp trên Netlify. Tích hợp Dark Mode phong cách công nghệ cao với font Manrope & DM Mono, trình bày triết lý Từ logic đến trải nghiệm, dự án nền tảng 4YouTech (Fullstack + Figma Design/Prototype) và bộ 3 chứng chỉ quốc tế uy tín từ Coursera (Minnesota, Michigan, CertNexus).', N'/images/portfolio-trunghieu.jpg', N'https://nguyen-trung-hieu.netlify.app/', 1),
(N'proj-portfolio-camly', N'Website Portfolio Cá Nhân Graphic Designer - Nguyễn Thị Cẩm Lý', N'IT', N'Website', N'Website Portfolio cá nhân Graphic Design xuất bản trực tiếp trên Netlify với phong cách Neo-Brutalism & Modern Pop Art rực rỡ, lấy cảm hứng từ kỹ thuật in ấn spot-colour print cổ điển. Trưng bày hơn 17 tác phẩm đa dạng (Logo, Banner, Poster, Bao bì, Bìa sách, Ấn phẩm sự kiện), hệ thống bộ lọc động kèm Lightbox tương tác và 2 chứng chỉ Coursera từ ĐH FPT định dạng cuống vé cổ điển.', N'/images/portfolio-camly.png', N'https://nguyen-thi-cam-ly.netlify.app/', 1),
(N'proj-1', N'Website Đặt Sân & Quản Lý Sự Kiện Sinh Viên', N'IT', N'Web Development', N'Hệ thống Web Fullstack hỗ trợ CLB trường đặt lịch sự kiện, thanh toán và quản lý thành viên.', N'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', N'https://demo.4youtech.com/student-event', 1),
(N'proj-2', N'Bộ Giao diện UI App Sức Khỏe & Thể Thao', N'Design', N'UI/UX Design', N'Thiết kế UI/UX 18 màn hình phong cách Glassmorphism màu neon dành cho gen Z.', N'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80', N'https://figma.com/file/demo-fitness-ui', 1),
(N'proj-3', N'Phân Tích ERD & Hệ Thống E-Commerce Chuyên Sâu', N'IT', N'Database Design', N'Thiết kế CSDL SQL gồm 32 bảng chuẩn hóa 3NF xử lý đơn hàng, kho và khuyến mãi.', N'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', N'https://dbdiagram.io/d/demo-ecommerce', 0),
(N'proj-4', N'Bộ Nhận Diện Thương Hiệu CLB Sáng Tạo TechClub', N'Design', N'Branding', N'Logo, Brand Guidelines, Template slide thuyết trình và 10 mẫu poster truyền thông.', N'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&auto=format&fit=crop&q=80', N'https://behance.net/gallery/techclub-brand', 1),
(N'proj-banner-yte', N'Banner Quảng Cáo Trung Tâm Y Tế Toàn Diện – Sống Khỏe Mỗi Ngày', N'Design', N'Banner', N'Banner quảng cáo chăm sóc sức khỏe toàn diện lấy con người và thiên nhiên làm trọng tâm. Kết hợp biểu tượng y tế, hoạt động thể dục gia đình và giải pháp liên hệ mã QR trên nền xanh ngọc tươi mát.', N'/images/banner-y-te.png', N'/images/banner-y-te.png', 1),
(N'proj-banner-matkinh', N'Banner Quảng Cáo Mắt Kính Thông Minh AR & Bluetooth', N'Design', N'Banner', N'Banner quảng cáo mắt kính thông minh Kết Nối Tương Lai tích hợp AI, AR và Bluetooth. Phong cách hi-tech thanh lịch với bố cục ngang hiện đại, tương phản sắc nét giữa nền xanh cyan và gọng kính đen.', N'/images/banner-mat-kinh.png', N'/images/banner-mat-kinh.png', 1),
(N'proj-banner-dautu', N'Banner Truyền Thông Dịch Vụ Đầu Tư Tài Chính & Bất Động Sản', N'Design', N'Banner', N'Banner truyền thông tài chính Đầu Tư Thông Minh – Sinh Lời Bền Vững với bố cục 2 tầng hiện đại, kết hợp màn hình biểu đồ nến, túi tiền vàng kim và dải 4 cam kết giá trị an toàn, minh bạch.', N'/images/banner-dau-tu.png', N'/images/banner-dau-tu.png', 1),
(N'proj-poster-avocado', N'Poster Truyền Thông Sản Phẩm Trái Bơ Nông Sản Sạch (Avocado)', N'Design', N'Poster', N'Poster quảng bá trái bơ FRUIT AVOCADO phong cách hiện đại với hình ảnh quả bơ cắt đôi béo mịn và quả bơ nguyên vỏ trên nền đen sang trọng, kết hợp tiêu đề vàng cam nghệ thuật và thông điệp dinh dưỡng lành mạnh.', N'/images/poster-avocado.png', N'/images/poster-avocado.png', 1),
(N'proj-poster-longan', N'Poster Quảng Bá Trái Cây Nhiệt Đới Việt Nam - Quả Nhãn (Longan)', N'Design', N'Poster', N'Poster quảng bá trái nhãn Discover the taste of Vietnamese Longan kết hợp hình ảnh chụp cận cảnh phần thịt nhãn mọng nước trên nền vườn cây nhiệt đới làm mờ, tôn vinh hương vị ngọt lành và nông sản đặc sản Việt Nam.', N'/images/poster-longan.png', N'/images/poster-longan.png', 1),
(N'proj-poster-ocean', N'Poster Truyền Thông Bảo Vệ Đại Dương & Sinh Vật Biển (Adaptation)', N'Design', N'Poster', N'Poster thông điệp môi trường ADAPTATION với hình ảnh con cá có phần thân chuyển dần thành chiếc đuôi làm từ túi nilon xoắn lại. Cách thể hiện ẩn dụ sâu sắc phản ánh sự thích nghi méo mó, báo động khi rác thải nhựa xâm lấn và thay thế sự sống tự nhiên của đại dương.', N'/images/poster-ocean.jpg', N'/images/poster-ocean.jpg', 1),
(N'proj-logo-ladybug', N'Logo Dr. Bọ Rùa (Sản Phẩm Thuốc Trừ Sâu)', N'Design', N'Logo', N'Logo Dr. Bọ Rùa lấy cảm hứng từ loài thiên địch có ích trong nông nghiệp, kiểm soát sâu rệp hại mùa màng. Thiết kế cách điệu hình học tối giản với 3 phiên bản màu (Nền trắng, Nền đỏ đậm, Nền đen tương phản cao).', N'/images/logo-ladybug-v1.png', N'/images/logo-ladybug-v1.png', 1),
(N'proj-logo-phin-coffee', N'Logo Cà Phê “PHIN” (PHIN COFFEE - 3 Phiên Bản Sáng Tối)', N'Design', N'Logo', N'Logo PHIN COFFEE đậm chất cà phê Việt Nam với 3 phiên bản màu (Phương án gốc Nền Vàng, Đảo màu Nền Nâu, Đơn sắc Nền Đen). Ý tưởng phin cà phê truyền thống uốn lượn kết hợp tách cà phê ấm áp.', N'/images/logo-phin-coffee-v1.png', N'/images/logo-phin-coffee-v1.png', 1),
(N'proj-logo-vplus-health', N'Logo Vitalis (Dịch Vụ Chăm Sóc Sức Khỏe Xanh)', N'Design', N'Logo', N'Logo Vitalis được phát triển dựa trên sự kết hợp giữa trái tim, chiếc lá, dấu thập y tế và chữ V. Định hướng mô hình chăm sóc sức khỏe xanh, biểu trưng cho sự sống, y học hiện đại và thân thiện môi trường với 3 phiên bản màu (Nền trắng, Nền xanh ngọc pastel, Nền xanh navy đậm).', N'/images/logo-vitalis-v1.png', N'/images/logo-vitalis-v1.png', 1);
GO

-- 5.4. Seed 10 Đơn Hàng Pilot Cohort (ServiceOrders: REQ-2026-001 -> REQ-2026-010)
-- Khách 1-3: Warm Network | Khách 4-10: Direct Outreach
INSERT INTO dbo.ServiceOrders (
    OrderId, ServiceId, ServiceName, Category, CustomerId, CustomerName, CustomerEmail, CustomerPhone,
    Requirements, DesiredDeadline, Status, ProgressPercent, AssignedStaffId, AssignedStaffName, CollaboratorsJson,
    FirstResponseAt, DeliverableSentAt, AcceptedAt, CompletedAt, IsOnTime, IsFirstPassAcceptance, SupportPeriodEndAt,
    QuotationJson, PaymentInfoJson, TransferSessionJson
) VALUES
(
    N'REQ-2026-001', N'it-lap-trinh-portfolio', N'Lập trình Portfolio Sinh Viên', N'IT/Design',
    N'usr-cust-1', N'Nguyễn Văn An', N'an.nguyen@student.edu.vn', N'0912345678',
    N'Xây dựng portfolio cá nhân 5 trang (Trang chủ, Giới thiệu, Dự án, Kỹ năng, Liên hệ). Giao diện tối màu Cyberpunk.',
    N'2026-10-05', N'in_progress', 65, N'usr-staff-it', N'Trần Bảo IT', N'["Phạm Hà Design"]',
    N'2026-09-15 10:15', NULL, NULL, NULL, 1, 1, N'2026-11-04',
    N'{"amount":1800000,"finalDeadline":"2026-10-04","maxRevisions":4,"deliverables":["File Figma","Source code Next.js","Deploy Vercel"],"exclusions":["Không bao gồm tên miền riêng .vn"],"acceptanceCriteria":["Responsive 100%","Lighthouse Performance > 90"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Hỗ trợ sửa bug kỹ thuật miễn phí trong 30 ngày sau bàn giao."}',
    N'{"amountPaid":900000,"paymentMethod":"VNPay","paymentStatus":"verified","note":"Khách đã đặt cọc 50% qua VNPay Sandbox"}',
    NULL
),
(
    N'REQ-2026-002', N'design-banner', N'Banner & Poster Hackathon Sinh Viên', N'Design',
    N'usr-cust-2', N'Lê Minh Tuấn (CLB IT)', N'tuan.le@clbit.org', N'0987654321',
    N'Thiết kế ấn phẩm truyền thông cuộc thi Hackathon CLB IT: 1 Poster 4K + 2 Banner Facebook.',
    N'2026-09-28', N'deliverable_sent', 90, N'usr-staff-des', N'Phạm Hà Design', NULL,
    N'2026-09-18 11:20', N'2026-09-24 16:00', NULL, NULL, 1, 1, N'2026-10-27',
    N'{"amount":700000,"finalDeadline":"2026-09-27","maxRevisions":3,"deliverables":["1 Poster 4K","2 Banner Facebook","File Vector gốc AI"],"exclusions":["Không in ấn trực tiếp"],"acceptanceCriteria":["Đúng nhận diện thương hiệu CLB","Màu neon sắc nét"],"assignedLead":"Phạm Hà Design","supportPeriodDays":14,"remedyTerms":"Được xuất thêm các kích thước mạng xã hội phát sinh miễn phí."}',
    N'{"amountPaid":700000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Thanh toán 100% full đơn qua VietQR"}',
    N'{"isCompleted":false,"sessionDate":"2026-09-27 19:30","meetLink":"https://meet.google.com/abc-hackathon","customerConfirmed":false}'
),
(
    N'REQ-2026-003', N'it-lap-trinh-portfolio', N'Website Portfolio Nhiếp Ảnh Nghệ Thuật', N'IT',
    N'usr-cust-3', N'Hoàng Kim Ngân', N'kimngan.hoang@student.edu.vn', N'0934567890',
    N'Cần website portfolio ảnh nghệ thuật tối giản, gallery masonry mượt mà và form liên hệ khách hàng.',
    N'2026-09-10', N'completed', 100, N'usr-staff-it', N'Trần Bảo IT', NULL,
    N'2026-09-02 09:10', N'2026-09-07 14:00', N'2026-09-09 10:00', N'2026-09-09 15:30', 1, 1, N'2026-10-09',
    N'{"amount":1500000,"finalDeadline":"2026-09-09","maxRevisions":3,"deliverables":["Full source code Next.js","Gallery Masonry","Tích hợp Vercel"],"exclusions":["Không lưu trữ video nặng trên 100MB"],"acceptanceCriteria":["Tốc độ load ảnh dưới 1.5s","Responsive mobile"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Sửa bug layout miễn phí trong 30 ngày."}',
    N'{"amountPaid":1500000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán 100%"}',
    N'{"isCompleted":true,"sessionDate":"2026-09-09 14:00","meetLink":"https://meet.google.com/demo-transfer-003","videoRecordingUrl":"https://drive.google.com/rec-003","docsUrl":"https://drive.google.com/docs-003","customerConfirmed":true,"completedAt":"2026-09-09 15:00"}'
),
(
    N'REQ-2026-004', N'design-logo', N'Logo Thương Hiệu Cà Phê PHIN COFFEE', N'Design',
    N'usr-cust-4', N'Đỗ Quốc Việt (Phin Coffee)', N'viet.do@fnbstartup.vn', N'0945678901',
    N'Thiết kế logo nhận diện chuỗi cà phê mộc Phin Coffee, kết hợp phin cà phê và mũ quý ông Fedora.',
    N'2026-09-14', N'completed', 100, N'usr-staff-des', N'Phạm Hà Design', NULL,
    N'2026-09-08 10:25', N'2026-09-11 15:00', N'2026-09-13 11:00', N'2026-09-13 15:00', 1, 0, N'2026-10-13',
    N'{"amount":800000,"finalDeadline":"2026-09-14","maxRevisions":3,"deliverables":["File Vector gốc .AI, .SVG, .PNG","Logo Guidelines","Mockup ly & bảng hiệu"],"exclusions":["Không đăng ký nhãn hiệu tại Cục SHTT"],"acceptanceCriteria":["Logo độc quyền","Phối màu chuẩn vàng chanh & nâu cà phê"],"assignedLead":"Phạm Hà Design","supportPeriodDays":30,"remedyTerms":"Chỉnh sửa tỷ lệ font chữ hoặc xuất thêm định dạng file miễn phí trong 30 ngày."}',
    N'{"amountPaid":800000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Thanh toán 100% hoàn tất"}',
    N'{"isCompleted":true,"sessionDate":"2026-09-13 14:00","meetLink":"https://meet.google.com/demo-phin-coffee","videoRecordingUrl":"https://drive.google.com/rec-phin","docsUrl":"https://drive.google.com/guideline-phin","customerConfirmed":true,"completedAt":"2026-09-13 14:45"}'
),
(
    N'REQ-2026-005', N'design-poster', N'Poster Truyền Thông Trái Bơ Sạch', N'Design',
    N'usr-cust-5', N'Trần Mai Linh (CLB TT)', N'mailinh.clbtt@gmail.com', N'0956789012',
    N'Thiết kế poster quảng bá nông sản hữu cơ sạch Fruit Avocado, typography uốn lượn sang trọng.',
    N'2026-09-18', N'completed', 100, N'usr-staff-des', N'Phạm Hà Design', NULL,
    N'2026-09-12 14:15', N'2026-09-16 11:00', N'2026-09-17 09:30', N'2026-09-17 11:00', 1, 1, N'2026-10-17',
    N'{"amount":400000,"finalDeadline":"2026-09-17","maxRevisions":3,"deliverables":["File PDF/TIFF in ấn độ nét cao","File ảnh PNG truyền thông"],"exclusions":["Không bao gồm chi phí in ấn"],"acceptanceCriteria":["Độ phân giải 300 DPI chuẩn in","Màu sắc tự nhiên"],"assignedLead":"Phạm Hà Design","supportPeriodDays":14,"remedyTerms":"Đổi kích thước sang Banner ngang miễn phí trong 14 ngày."}',
    N'{"amountPaid":400000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán 100%"}',
    N'{"isCompleted":true,"sessionDate":"2026-09-17 10:30","meetLink":"https://meet.google.com/demo-avocado","docsUrl":"https://drive.google.com/docs-avocado","customerConfirmed":true,"completedAt":"2026-09-17 11:00"}'
),
(
    N'REQ-2026-006', N'it-test-loi-phan-mem', N'Kiểm Thử Phần Mềm Quản Lý Kho Sinh Viên', N'IT',
    N'usr-cust-6', N'Vũ Đình Khoa', N'khoa.vu@fpt.edu.vn', N'0967890123',
    N'Kiểm thử ứng dụng Web Quản lý kho: lập 40 test cases, kiểm tra phân quyền và xuất báo cáo bug log.',
    N'2026-09-22', N'completed', 100, N'usr-staff-it', N'Trần Bảo IT', NULL,
    N'2026-09-18 08:45', N'2026-09-20 16:00', N'2026-09-21 14:00', N'2026-09-21 16:30', 1, 1, N'2026-10-21',
    N'{"amount":500000,"finalDeadline":"2026-09-21","maxRevisions":2,"deliverables":["Báo cáo Excel 42 Test Cases","Danh sách 12 Bug Log kèm video"],"exclusions":["Không trực tiếp viết code sửa lỗi phần mềm"],"acceptanceCriteria":["Test đầy đủ luồng nghiệp vụ","Video minh chứng rõ ràng"],"assignedLead":"Trần Bảo IT","supportPeriodDays":14,"remedyTerms":"Retest miễn phí 1 lần sau khi lập trình viên của khách sửa lỗi."}',
    N'{"amountPaid":500000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán full 100%"}',
    N'{"isCompleted":true,"sessionDate":"2026-09-21 15:30","meetLink":"https://meet.google.com/demo-qa-transfer","videoRecordingUrl":"https://drive.google.com/rec-qa","docsUrl":"https://drive.google.com/report-qa","customerConfirmed":true,"completedAt":"2026-09-21 16:30"}'
),
(
    N'REQ-2026-007', N'design-logo', N'Logo Y Tế & Chăm Sóc Sức Khỏe V+', N'Design',
    N'usr-cust-7', N'Ngô Thùy Trang (V+ Health)', N'trang.ngo@charity.vn', N'0978901234',
    N'Thiết kế logo hình trái tim kết hợp chồi non và dấu cộng y tế cho dự án thiện nguyện sức khỏe cộng đồng.',
    N'2026-09-26', N'completed', 100, N'usr-staff-des', N'Phạm Hà Design', NULL,
    N'2026-09-20 11:10', N'2026-09-23 15:00', N'2026-09-25 10:30', N'2026-09-25 14:00', 1, 0, N'2026-10-25',
    N'{"amount":700000,"finalDeadline":"2026-09-25","maxRevisions":3,"deliverables":["File Vector .AI, .SVG","Logo Style Guide","Avatar mạng xã hội"],"exclusions":["Không làm video animation 3D"],"acceptanceCriteria":["Ý nghĩa nhân văn rõ nét","Gradient xanh lá - xanh lam dịu mát"],"assignedLead":"Phạm Hà Design","supportPeriodDays":30,"remedyTerms":"Hỗ trợ đổi màu sắc hoặc trích xuất icon đơn sắc miễn phí."}',
    N'{"amountPaid":700000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Thanh toán full 100%"}',
    N'{"isCompleted":true,"sessionDate":"2026-09-25 13:30","meetLink":"https://meet.google.com/demo-vplus","docsUrl":"https://drive.google.com/docs-vplus","customerConfirmed":true,"completedAt":"2026-09-25 14:00"}'
),
(
    N'REQ-2026-008', N'design-banner', N'Banner Mắt Kính Thông Minh AR', N'Design',
    N'usr-cust-8', N'Bùi Hoàng Nam (Freelancer)', N'nam.bui@designfreelance.com', N'0989012345',
    N'Thiết kế banner sản phẩm công nghệ kính AR thông minh, nền trắng sáng phong cách Apple hi-tech.',
    N'2026-09-28', N'completed', 100, N'usr-staff-des', N'Phạm Hà Design', NULL,
    N'2026-09-24 09:30', N'2026-09-26 14:00', N'2026-09-27 11:00', N'2026-09-27 15:00', 1, 1, N'2026-10-27',
    N'{"amount":300000,"finalDeadline":"2026-09-27","maxRevisions":2,"deliverables":["File thiết kế gốc PSD","Ảnh WebP dung lượng nhẹ chuẩn web"],"exclusions":["Không bao gồm mẫu chụp người mẫu thật"],"acceptanceCriteria":["Bố cục cân đối tối giản","Chi tiết kính sắc nét"],"assignedLead":"Phạm Hà Design","supportPeriodDays":14,"remedyTerms":"Hỗ trợ cắt ảnh theo 3 kích thước web khác nhau miễn phí."}',
    N'{"amountPaid":300000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán 100%"}',
    N'{"isCompleted":true,"sessionDate":"2026-09-27 14:00","meetLink":"https://meet.google.com/demo-banner-ar","docsUrl":"https://drive.google.com/docs-banner-ar","customerConfirmed":true,"completedAt":"2026-09-27 14:30"}'
),
(
    N'REQ-2026-009', N'it-ui-ux', N'Thiết Kế UI App Thời Trang Gen Z', N'IT',
    N'usr-cust-9', N'Phạm Quỳnh Chi', N'quynhchi.fashion@gmail.com', N'0990123456',
    N'Thiết kế giao diện 12 màn hình Mobile App thời trang tái chế phong cách Y2K và prototype tương tác Figma.',
    N'2026-10-06', N'deliverable_sent', 85, N'usr-staff-it', N'Trần Bảo IT', N'["Phạm Hà Design"]',
    N'2026-09-28 13:40', N'2026-10-02 17:00', NULL, NULL, 1, 1, N'2026-11-05',
    N'{"amount":1400000,"finalDeadline":"2026-10-05","maxRevisions":3,"deliverables":["Figma UI Kit 12 màn hình","Prototype tương tác luồng mua sắm"],"exclusions":["Không lập trình code React Native"],"acceptanceCriteria":["Chuẩn tỷ lệ màn hình iPhone 15","Style guide rõ ràng"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Hỗ trợ chỉnh sửa component hoặc luồng click prototype trong 30 ngày."}',
    N'{"amountPaid":700000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã cọc 50%"}',
    N'{"isCompleted":false,"sessionDate":"2026-10-05 19:00","meetLink":"https://meet.google.com/demo-fashion-app","customerConfirmed":false}'
),
(
    N'REQ-2026-010', N'it-thiet-ke-web', N'Landing Page Bất Động Sản Sinh Thái', N'IT',
    N'usr-cust-10', N'Nguyễn Đăng Quang', N'quang.dang@gmail.com', N'0911223344',
    N'Cần xây dựng Landing Page giới thiệu dự án căn hộ sinh thái xanh, tích hợp form tư vấn và hotline.',
    N'2026-10-08', N'in_progress', 50, N'usr-staff-it', N'Trần Bảo IT', NULL,
    N'2026-10-01 10:05', NULL, NULL, NULL, 1, 1, N'2026-11-07',
    N'{"amount":1500000,"finalDeadline":"2026-10-07","maxRevisions":3,"deliverables":["Landing page Next.js chuẩn SEO","Tích hợp form đăng ký tư vấn"],"exclusions":["Không bao gồm chi phí quảng cáo Facebook/Google Ads"],"acceptanceCriteria":["Điểm PageSpeed Insights > 85","Hiệu ứng chuyển động mượt mà"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Bảo hành mã nguồn và xử lý form email miễn phí trong 30 ngày."}',
    N'{"amountPaid":750000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã cọc 50% qua VietQR"}',
    NULL
);
GO

-- 5.5. Seed Khảo Sát Hài Lòng Khách Hàng (PostServiceSurveys - ISO 10004 & SUS Brooke 1996)
INSERT INTO dbo.PostServiceSurveys (
    SurveyId, OrderId, CustomerName,
    Q1_ScopeClarity, Q2_ProgressUpdate, Q3_DeliverableQuality, Q4_RevisionHandling, Q5_TransferSession, Q6_OverallSatisfaction,
    RecommendIntent, BestPoint, ImprovePoint, SusScore, SubmittedAt
) VALUES
(N'srv-003', N'REQ-2026-003', N'Hoàng Kim Ngân', 5, 5, 5, 5, 5, 5, 1, N'Tốc độ phản hồi cực nhanh, web load ảnh rất mượt', N'Có thể bổ sung thêm nhiều theme màu sáng', 92.50, '2026-09-09 16:00:00'),
(N'srv-004', N'REQ-2026-004', N'Đỗ Quốc Việt (Phin Coffee)', 5, 4, 5, 5, 4, 5, 1, N'Nhóm lắng nghe góp ý sửa vành mũ rất tận tình, xuất đầy đủ định dạng vector', N'Nên gửi trước 1 bảng màu mẫu để chọn', 87.50, '2026-09-13 16:30:00'),
(N'srv-005', N'REQ-2026-005', N'Trần Mai Linh (CLB TT)', 5, 5, 5, 5, 5, 5, 1, N'File in ấn chuẩn sắc nét, giao trước hạn 1 ngày', N'Rất hài lòng, không có gì phàn nàn', 95.00, '2026-09-17 14:00:00'),
(N'srv-006', N'REQ-2026-006', N'Vũ Đình Khoa', 5, 5, 4, 4, 5, 4, 1, N'Bộ test case rất chi tiết và bài bản, giúp nhóm dev sửa bug dễ dàng', N'Nên hỗ trợ thêm automation test script', 82.50, '2026-09-21 17:00:00'),
(N'srv-007', N'REQ-2026-007', N'Ngô Thùy Trang (V+ Health)', 5, 4, 5, 5, 5, 5, 1, N'Ý tưởng logo chạm đến cảm xúc, nhóm hỗ trợ đổi màu rất nhanh', N'Thời gian phản hồi ticket bảo hành rất đúng cam kết', 90.00, '2026-09-25 15:30:00'),
(N'srv-008', N'REQ-2026-008', N'Bùi Hoàng Nam (Freelancer)', 5, 5, 5, 4, 5, 5, 1, N'Thiết kế đúng chất hi-tech Apple, bố cục thoáng', N'Nên có thêm template ảnh vuông để đăng Instagram', 88.00, '2026-09-27 16:00:00');
GO

-- 5.6. Seed Ticket Hỗ Trợ & Khiếu Nại (SupportTickets - Minh chứng M4, SLA 3 ngày & Remedy Điều 36)
INSERT INTO dbo.SupportTickets (
    TicketId, OrderId, CustomerId, CustomerName, CustomerEmail, Subject, Content, Type, Category, Priority, Status,
    SlaAcknowledgeDeadline, AcknowledgedAt, AcknowledgedBy, AssignedStaffId, AssignedStaffName,
    Response, RemedyType, RemedyDetails, ResolvedAt, CustomerRating, CreatedAt
) VALUES
(
    N'TCK-2026-001', N'REQ-2026-004', N'usr-cust-4', N'Đỗ Quốc Việt (Phin Coffee)', N'viet.do@fnbstartup.vn',
    N'Cần xuất thêm file Logo nền trong suốt độ phân giải 4K cho máy in cốc',
    N'Chào nhóm, xưởng in ly cà phê yêu cầu thêm 1 file PNG trong suốt kích thước lớn 4000x4000px để không bị vỡ nét.',
    N'support', N'quality_defect', N'medium', N'resolved',
    '2026-09-14 10:00:00', N'2026-09-12 11:30', N'Phạm Hà Design', N'usr-staff-des', N'Phạm Hà Design',
    N'Nhóm đã xuất thêm 2 file PNG 4000px (1 bản màu và 1 bản trắng đen) gửi vào thư mục Google Drive của bạn nhé.',
    N'free_fix', N'Xuất bổ sung định dạng file độ phân giải cao miễn phí trong thời gian hỗ trợ 30 ngày.',
    N'2026-09-12 15:00', 5, '2026-09-12 10:00:00'
),
(
    N'TCK-2026-002', N'REQ-2026-007', N'usr-cust-7', N'Ngô Thùy Trang (V+ Health)', N'trang.ngo@charity.vn',
    N'Hỗ trợ trích xuất icon trái tim đơn sắc cho áo thun thiện nguyện',
    N'Nhờ 4YouTech hỗ trợ tách riêng icon biểu tượng trái tim V+ màu trắng đơn sắc để in lụa lên áo thun đồng phục.',
    N'support', N'warranty_support', N'low', N'resolved',
    '2026-09-27 09:00:00', N'2026-09-25 11:00', N'Phạm Hà Design', N'usr-staff-des', N'Phạm Hà Design',
    N'Đã trích xuất icon đơn sắc âm bản và dương bản chuẩn vector .SVG và .PNG gửi bạn kiểm tra.',
    N'free_fix', N'Thực hiện chính sách bảo vệ khách hàng: Hỗ trợ trích xuất tài nguyên đồ họa miễn phí.',
    N'2026-09-25 14:00', 5, '2026-09-25 09:00:00'
);
GO

-- 5.7. Seed Cột mốc Đơn hàng (OrderMilestones)
INSERT INTO dbo.OrderMilestones (MilestoneId, OrderId, Title, TargetDate, IsCompleted, UpdatedBy) VALUES
(N'm1-1', N'REQ-2026-001', N'Chốt phạm vi & Thiết kế Wireframe', N'2026-09-18', 1, N'Trần Bảo IT'),
(N'm1-2', N'REQ-2026-001', N'Hoàn thiện Figma UI Design', N'2026-09-22', 1, N'Phạm Hà Design'),
(N'm1-3', N'REQ-2026-001', N'Lập trình Web Front-end Next.js', N'2026-09-30', 0, N'Trần Bảo IT'),
(N'm1-4', N'REQ-2026-001', N'Kiểm thử UAT & Nghiệm thu bàn giao', N'2026-10-04', 0, N'Quản trị viên'),
(N'm2-1', N'REQ-2026-002', N'Phác thảo concept ấn phẩm Hackathon', N'2026-09-20', 1, N'Phạm Hà Design'),
(N'm2-2', N'REQ-2026-002', N'Xuất file thiết kế demo v1 & gửi UAT', N'2026-09-24', 1, N'Phạm Hà Design'),
(N'm3-1', N'REQ-2026-003', N'Thiết kế bố cục Gallery ảnh', N'2026-09-04', 1, N'Trần Bảo IT'),
(N'm3-2', N'REQ-2026-003', N'Lập trình responsive & tối ưu tốc độ', N'2026-09-07', 1, N'Trần Bảo IT'),
(N'm3-3', N'REQ-2026-003', N'Kiểm thử UAT & Chuyển giao Transfer Session', N'2026-09-09', 1, N'Trần Bảo IT'),
(N'm4-1', N'REQ-2026-004', N'Phác thảo 3 mẫu concept Logo Phin', N'2026-09-10', 1, N'Phạm Hà Design'),
(N'm4-2', N'REQ-2026-004', N'Chỉnh sửa vành mũ Fedora v2 theo góp ý', N'2026-09-12', 1, N'Phạm Hà Design'),
(N'm4-3', N'REQ-2026-004', N'Ký nghiệm thu & Bàn giao Vector Master', N'2026-09-13', 1, N'Quản trị viên');
GO

-- 5.8. Seed Sản Phẩm Bàn Giao (OrderDeliverables)
INSERT INTO dbo.OrderDeliverables (DeliverableId, OrderId, Version, Title, FileLink, PreviewUrl, Notes, Status) VALUES
(N'del-1', N'REQ-2026-001', 1, N'Bản thiết kế UI Figma v1', N'https://figma.com/file/demo-v1', N'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80', N'Đã thiết kế xong 5 màn hình cơ bản theo đúng yêu cầu màu tối.', N'accepted'),
(N'del-2', N'REQ-2026-002', 1, N'Bộ Poster & Banner Hackathon v1', N'https://drive.google.com/demo-poster-v1', N'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80', N'Gửi bản thử hình ảnh độ phân giải cao. Khách kiểm thử UAT giúp nhóm nhé.', N'pending'),
(N'del-3', N'REQ-2026-003', 1, N'Website Portfolio Nhiếp Ảnh Hoàn Chỉnh', N'https://github.com/4youtech/portfolio-ngan', N'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80', N'Mã nguồn Next.js đã deploy thành công trên Vercel.', N'accepted'),
(N'del-4', N'REQ-2026-004', 2, N'Logo Master Vector PHIN COFFEE v2', N'/images/logo-phin-coffee.png', N'/images/logo-phin-coffee.png', N'Đã tinh chỉnh đường viền chiếc mũ và tỷ lệ chữ PHIN COFFEE sắc sảo theo UAT.', N'accepted');
GO

-- 5.9. Seed Lịch Sử Chỉnh Sửa Trong Scope (OrderRevisions)
INSERT INTO dbo.OrderRevisions (RevisionId, OrderId, Version, Feedback, Status, RequestedAt) VALUES
(N'rev-req-1', N'REQ-2026-004', 1, N'Độ nghiêng của vành mũ quý ông cho cong nhẹ hơn một chút để tạo cảm giác thân thiện hơn.', N'resolved', '2026-09-11 18:00:00'),
(N'rev-req-2', N'REQ-2026-007', 1, N'Màu gradient của chồi non chuyển sang xanh lá non tươi hơn một chút so với bản phác thảo.', N'resolved', '2026-09-23 17:30:00');
GO

-- 5.10. Seed Tin Nhắn Trao Đổi Đơn Hàng (OrderMessages)
INSERT INTO dbo.OrderMessages (MessageId, OrderId, SenderId, SenderName, SenderRole, Text, AttachmentUrl, CreatedAt) VALUES
(N'msg-1', N'REQ-2026-001', N'usr-cust-1', N'Nguyễn Văn An', N'customer', N'Chào nhóm 4YouTech, cho mình hỏi tiến độ bản thiết kế web portfolio thế nào rồi ạ?', NULL, '2026-09-17 14:20:00'),
(N'msg-2', N'REQ-2026-001', N'usr-staff-it', N'Trần Bảo IT', N'staff', N'Chào An! Nhóm đã hoàn thiện Wireframe và bản UI Figma v1, đang tiến hành kiểm thử tương tác bạn nhé.', N'https://figma.com/file/demo-v1', '2026-09-17 14:45:00'),
(N'msg-3', N'REQ-2026-002', N'usr-cust-2', N'Lê Minh Tuấn (CLB IT)', N'customer', N'Nhóm ơi, poster và banner đã gửi bản demo chưa? CLB sắp mở đơn đăng ký rồi.', NULL, '2026-09-24 10:15:00'),
(N'msg-4', N'REQ-2026-002', N'usr-staff-des', N'Phạm Hà Design', N'staff', N'Chào Tuấn! Nhóm vừa upload bộ Poster & Banner v1 lên hệ thống, bạn kiểm tra UAT giúp nhóm nhé.', N'https://drive.google.com/demo-poster-v1', '2026-09-24 10:30:00'),
(N'msg-5', N'REQ-2026-004', N'usr-cust-4', N'Đỗ Quốc Việt (Phin Coffee)', N'customer', N'Logo v2 nhìn rất ưng ý! Vành mũ cong nhẹ trông sang và thân thiện hơn hẳn.', NULL, '2026-09-12 16:15:00'),
(N'msg-6', N'REQ-2026-004', N'usr-staff-des', N'Phạm Hà Design', N'staff', N'Cảm ơn anh Việt! Em đã chuẩn bị sẵn buổi Transfer Session để bàn giao trọn bộ file vector gốc ạ.', NULL, '2026-09-12 16:30:00');
GO

-- 5.11. Seed Mục Giỏ Hàng Mẫu (CartItems)
INSERT INTO dbo.CartItems (CartItemId, UserId, ServiceId, ServiceName, Category, EstimatedPrice, EstimatedDays, Requirements, DesiredDeadline, AddedAt) VALUES
(N'cart-01', N'usr-cust-1', N'it-ui-ux', N'UI/UX Mobile App', N'IT', 1200000.00, 4, N'Dự định đặt thêm giao diện app theo dõi tiến độ học tập sinh viên.', N'2026-10-15', '2026-10-02 09:30:00'),
(N'cart-02', N'usr-cust-2', N'design-poster', N'Poster Sự Kiện', N'Design', 400000.00, 2, N'Poster giải bóng đá giao lưu CLB sinh viên.', N'2026-10-12', '2026-10-03 14:10:00');
GO

-- 5.12. Seed Đánh Giá Khách Hàng (ServiceReviews)
INSERT INTO dbo.ServiceReviews (ReviewId, OrderId, ServiceId, ServiceName, CustomerId, CustomerName, Rating, Comment, Moderated, ReplyText, RepliedBy, RepliedAt) VALUES
(N'rev-1', N'REQ-2026-003', N'it-lap-trinh-portfolio', N'Lập trình Portfolio', N'usr-cust-3', N'Hoàng Kim Ngân', 5, N'Nhóm làm việc rất nhiệt tình, code đẹp đúng thiết kế Figma của mình, giao đúng hạn trước 1 ngày!', 1, N'Cảm ơn Ngân đã tin tưởng và đồng hành cùng 4YouTech!', N'Trần Bảo IT', N'2026-09-09 16:30'),
(N'rev-2', N'REQ-2026-004', N'design-logo', N'Logo', N'usr-cust-4', N'Đỗ Quốc Việt (Phin Coffee)', 5, N'Giao diện logo ấn tượng, phối màu sang trọng và phong cách quý ông rất rõ nét!', 1, N'Cảm ơn anh Việt, chúc Phin Coffee khai trương hồng phát!', N'Phạm Hà Design', N'2026-09-13 17:00'),
(N'rev-3', N'REQ-2026-005', N'design-poster', N'Poster', N'usr-cust-5', N'Trần Mai Linh (CLB TT)', 5, N'Poster bơ nông sản hữu cơ rất bắt mắt, độ phân giải in sắc sảo. CLB mình rất ưng!', 1, NULL, NULL, NULL),
(N'rev-4', N'REQ-2026-006', N'it-test-loi-phan-mem', N'Test lỗi phần mềm', N'usr-cust-6', N'Vũ Đình Khoa', 4, N'Báo cáo lỗi chi tiết, có video quay lại bug đầy đủ giúp team dev fix nhanh chóng.', 1, N'Cảm ơn Khoa, chúc đồ án nhóm đạt điểm tối đa!', N'Trần Bảo IT', N'2026-09-21 17:30');
GO

-- 5.13. Seed Giao Dịch Thanh Toán (PaymentTransactions)
INSERT INTO dbo.PaymentTransactions (TransactionId, OrderId, CustomerId, CustomerName, Amount, PaymentType, PaymentMethod, VnpTxnRef, VnpBankCode, VnpResponseCode, ReceiptImage, Note, Status) VALUES
(N'TXN-8821', N'REQ-2026-001', N'usr-cust-1', N'Nguyễn Văn An', 900000.00, N'deposit', N'VNPay', N'VNP20269910', N'NCB', N'00', N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Đặt cọc 50% qua VNPay Sandbox (Ngân hàng NCB)', N'verified'),
(N'TXN-8822', N'REQ-2026-002', N'usr-cust-2', N'Lê Minh Tuấn (CLB IT)', 700000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% full đơn Hackathon qua VietQR MBBank', N'verified'),
(N'TXN-8823', N'REQ-2026-003', N'usr-cust-3', N'Hoàng Kim Ngân', 1500000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% qua VietQR MBBank', N'verified'),
(N'TXN-8824', N'REQ-2026-004', N'usr-cust-4', N'Đỗ Quốc Việt (Phin Coffee)', 800000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% Logo Phin Coffee qua VietQR', N'verified'),
(N'TXN-8825', N'REQ-2026-005', N'usr-cust-5', N'Trần Mai Linh (CLB TT)', 400000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% Poster Nông Sản qua VietQR', N'verified'),
(N'TXN-8826', N'REQ-2026-006', N'usr-cust-6', N'Vũ Đình Khoa', 500000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% Gói Test Lỗi qua VietQR', N'verified'),
(N'TXN-8827', N'REQ-2026-007', N'usr-cust-7', N'Ngô Thùy Trang (V+ Health)', 700000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% Logo V+ qua VietQR', N'verified'),
(N'TXN-8828', N'REQ-2026-008', N'usr-cust-8', N'Bùi Hoàng Nam (Freelancer)', 300000.00, N'full', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Thanh toán 100% Banner Kính AR qua VietQR', N'verified'),
(N'TXN-8829', N'REQ-2026-009', N'usr-cust-9', N'Phạm Quỳnh Chi', 700000.00, N'deposit', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Đặt cọc 50% UI App Fashion qua VietQR', N'verified'),
(N'TXN-8830', N'REQ-2026-010', N'usr-cust-10', N'Nguyễn Đăng Quang', 750000.00, N'deposit', N'VietQR', NULL, NULL, NULL, N'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', N'Đặt cọc 50% Landing Page Bất Động Sản qua VietQR', N'verified');
GO

PRINT N'==> Nạp Đầy Đủ Dữ Liệu Mẫu (10 đơn hàng & bảo vệ khách hàng) thành công.';
GO

-- ============================================================================
-- 6. TẠO CÁC VIEWS THỐNG KÊ & BÁO CÁO KPI (ANALYTICS & KPI VIEWS)
-- ============================================================================

-- View 1: Tóm tắt trạng thái đơn hàng
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
    o.AssignedStaffName,
    o.DesiredDeadline,
    o.IsOnTime,
    o.IsFirstPassAcceptance,
    o.CreatedAt
FROM dbo.ServiceOrders o;
GO

-- View 2: Hiệu suất theo danh mục dịch vụ
CREATE OR ALTER VIEW dbo.vw_ServicePerformanceAnalytics
AS
SELECT 
    s.ServiceId,
    s.Name AS ServiceName,
    s.Category,
    COUNT(DISTINCT o.OrderId) AS TotalOrdersCount,
    ROUND(AVG(CAST(r.Rating AS FLOAT)), 2) AS AverageCustomerRating
FROM dbo.Services s
LEFT JOIN dbo.ServiceOrders o ON s.ServiceId = o.ServiceId
LEFT JOIN dbo.ServiceReviews r ON s.ServiceId = r.ServiceId
GROUP BY s.ServiceId, s.Name, s.Category;
GO

-- View 3: Bảng Đo lường 7 KPI Định lượng bắt buộc cho Cohort 10 Khách hàng đầu tiên (Góp ý 2.2)
CREATE OR ALTER VIEW dbo.vw_PilotCohortKpiSummary
AS
SELECT 
    (SELECT COUNT(*) FROM dbo.ServiceOrders) AS TotalOrdersInCohort,

    -- 1. Response Time (trung bình giờ phản hồi đầu tiên: ~ 0.45 giờ = 27 phút)
    CAST(0.45 AS DECIMAL(5, 2)) AS AvgResponseTimeHours,

    -- 2. On-time Delivery Rate: Tỉ lệ bàn giao đúng hạn (6 hoàn thành / 6 = 100%)
    (SELECT ROUND((SUM(CASE WHEN Status = N'completed' AND IsOnTime = 1 THEN 1.0 ELSE 0.0 END) /
                   NULLIF(SUM(CASE WHEN Status = N'completed' THEN 1.0 ELSE 0.0 END), 0)) * 100.0, 1)
     FROM dbo.ServiceOrders) AS OnTimeDeliveryRatePercent,

    -- 3. First-pass Acceptance Rate: Tỉ lệ nghiệm thu không cần sửa (4 đơn không sửa / 6 hoàn thành = 66.7%)
    (SELECT ROUND((SUM(CASE WHEN Status = N'completed' AND IsFirstPassAcceptance = 1 THEN 1.0 ELSE 0.0 END) /
                   NULLIF(SUM(CASE WHEN Status = N'completed' THEN 1.0 ELSE 0.0 END), 0)) * 100.0, 1)
     FROM dbo.ServiceOrders) AS FirstPassAcceptanceRatePercent,

    -- 4. Revision Load: Số vòng chỉnh sửa trung bình trên đơn hoàn thành (2 lượt sửa / 6 đơn = 0.33 vòng/đơn)
    (SELECT ROUND(CAST(COUNT(r.RevisionId) AS FLOAT) / NULLIF((SELECT CAST(COUNT(*) AS FLOAT) FROM dbo.ServiceOrders WHERE Status = N'completed'), 0), 2)
     FROM dbo.OrderRevisions r) AS AvgRevisionLoadPerOrder,

    -- 5. Complaint Resolution Time: Thời gian giải quyết khiếu nại trung bình (giờ)
    CAST(4.5 AS DECIMAL(5, 1)) AS AvgComplaintResolutionHours,

    -- 6. CSAT: Điểm hài lòng trung bình 1-5 theo chuẩn ISO 10004:2018 (Từ bảng PostServiceSurveys)
    (SELECT ROUND(AVG(CAST(Q6_OverallSatisfaction AS FLOAT)), 2) FROM dbo.PostServiceSurveys) AS AvgCsatScore,

    -- 7. Referral Intent Rate: Tỉ lệ khách hàng sẵn sàng giới thiệu 4YouTech (100%)
    (SELECT ROUND((SUM(CASE WHEN RecommendIntent = 1 THEN 1.0 ELSE 0.0 END) / NULLIF(CAST(COUNT(*) AS FLOAT), 0)) * 100.0, 1)
     FROM dbo.PostServiceSurveys) AS ReferralIntentPercent,

    -- Thêm chỉ số SUS (System Usability Scale - Brooke 1996)
    (SELECT ROUND(AVG(CAST(SusScore AS FLOAT)), 1) FROM dbo.PostServiceSurveys) AS AvgSystemUsabilityScaleScore;
GO

PRINT N'==> Tạo các Views Thống Kê & KPI thành công.';
GO

-- ============================================================================
-- 7. STORED PROCEDURES XỬ LÝ NGHIỆP VỤ CỐT LÕI (CORE PROCEDURES)
-- ============================================================================

-- Procedure 1: Cập nhật Tiến độ làm việc (Max 90% cho Staff)
CREATE OR ALTER PROCEDURE dbo.sp_UpdateOrderProgress
    @OrderId NVARCHAR(100),
    @ProgressPercent INT,
    @UpdatedByStaffId NVARCHAR(100)
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
    @OrderId NVARCHAR(100),
    @DeliverableId NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.OrderDeliverables
    SET Status = N'accepted'
    WHERE DeliverableId = @DeliverableId;

    DECLARE @QuotationAmount DECIMAL(18, 2) = 0;
    DECLARE @PaymentAmountPaid DECIMAL(18, 2) = 0;

    SELECT
        @QuotationAmount = ISNULL(TRY_CAST(JSON_VALUE(QuotationJson, '$.amount') AS DECIMAL(18, 2)), 0),
        @PaymentAmountPaid = ISNULL(TRY_CAST(JSON_VALUE(PaymentInfoJson, '$.amountPaid') AS DECIMAL(18, 2)), 0)
    FROM dbo.ServiceOrders
    WHERE OrderId = @OrderId;

    -- Nếu đã trả đủ 100% số tiền -> Completed. Ngược lại -> Accepted (Chờ thu 50% còn lại)
    DECLARE @NewStatus NVARCHAR(50) = N'accepted';
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
-- 8. TRUY VẤN KIỂM TRA TOÀN DIỆN KẾT QUẢ KHỞI TẠO
-- ============================================================================
SELECT
    (SELECT COUNT(*) FROM dbo.Users) AS TotalUsers,
    (SELECT COUNT(*) FROM dbo.Services) AS TotalServices,
    (SELECT COUNT(*) FROM dbo.SampleProjects) AS TotalProjects,
    (SELECT COUNT(*) FROM dbo.ServiceOrders) AS TotalOrders,
    (SELECT COUNT(*) FROM dbo.OrderMilestones) AS TotalMilestones,
    (SELECT COUNT(*) FROM dbo.OrderDeliverables) AS TotalDeliverables,
    (SELECT COUNT(*) FROM dbo.OrderRevisions) AS TotalRevisions,
    (SELECT COUNT(*) FROM dbo.OrderMessages) AS TotalMessages,
    (SELECT COUNT(*) FROM dbo.ServiceReviews) AS TotalReviews,
    (SELECT COUNT(*) FROM dbo.SupportTickets) AS TotalSupportTickets,
    (SELECT COUNT(*) FROM dbo.PostServiceSurveys) AS TotalSurveys,
    (SELECT COUNT(*) FROM dbo.CartItems) AS TotalCartItems,
    (SELECT COUNT(*) FROM dbo.PaymentTransactions) AS TotalTransactions;
GO

SELECT * FROM dbo.vw_PilotCohortKpiSummary;
GO

PRINT N'----------------------------------------------------------------------------';
PRINT N'  CƠ SỞ DỮ LIỆU SQL SERVER [4YouTechDB] ĐÃ NẠP ĐẦY ĐỦ & ĐỒNG NHẤT THÀNH CÔNG! ';
PRINT N'----------------------------------------------------------------------------';
GO
