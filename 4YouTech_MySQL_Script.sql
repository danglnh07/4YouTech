-- ============================================================================
-- DỰ ÁN: 4YOUTECH PLATFORM DATABASE SCHEMA & SEED DATA (MYSQL / MARIADB)
-- Hệ thống cung cấp Dịch vụ IT, Thiết kế Web Portfolio, ERD Database & Graphic Design
-- Tương thích: MySQL Workbench 8.0+, phpMyAdmin, XAMPP, MariaDB, DBeaver
-- Database Name: 4youtechdb
-- Phiên bản cập nhật: 2026-10-14 (Tuân thủ Luật 19/2023/QH15 & Đo lường KPI Cohort 10 khách hàng)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS 4youtechdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE 4youtechdb;

-- ============================================================================
-- 1. XÓA BẢNG VÀ VIEW NẾU ĐÃ TỒN TẠI (Thứ tự an toàn tránh lỗi Foreign Key)
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS vw_PilotCohortKpiSummary;
DROP VIEW IF EXISTS vw_ServicePerformanceAnalytics;
DROP VIEW IF EXISTS vw_OrderDetailsSummary;

DROP TABLE IF EXISTS PaymentTransactions;
DROP TABLE IF EXISTS PostServiceSurveys;
DROP TABLE IF EXISTS SupportTickets;
DROP TABLE IF EXISTS ServiceReviews;
DROP TABLE IF EXISTS OrderMessages;
DROP TABLE IF EXISTS OrderRevisions;
DROP TABLE IF EXISTS OrderDeliverables;
DROP TABLE IF EXISTS OrderMilestones;
DROP TABLE IF EXISTS CartItems;
DROP TABLE IF EXISTS ServiceOrders;
DROP TABLE IF EXISTS SampleProjects;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 2. KHỞI TẠO CÁC BẢNG DỮ LIỆU (TABLE DEFINITIONS)
-- ============================================================================

-- Bảng 1: Người dùng (Users - Khách hàng, Nhân viên, Quản trị viên)
CREATE TABLE IF NOT EXISTS Users (
    UserId          VARCHAR(100) PRIMARY KEY,
    Name            VARCHAR(255) NOT NULL,
    Email           VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash    VARCHAR(255) NULL,
    Role            VARCHAR(50) NOT NULL DEFAULT 'customer', -- 'guest', 'customer', 'staff', 'admin'
    Phone           VARCHAR(50) NULL,
    SkillsJson      TEXT NULL, -- JSON Array kỹ năng của Staff
    AvatarUrl       TEXT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'locked', 'pending_otp'
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 2: Danh mục Dịch vụ (Services)
CREATE TABLE IF NOT EXISTS Services (
    ServiceId       VARCHAR(100) PRIMARY KEY,
    Name            VARCHAR(255) NOT NULL,
    Description     TEXT NOT NULL,
    Category        VARCHAR(50) NOT NULL DEFAULT 'IT', -- 'IT', 'Design', 'IT/Design'
    EstimatedDays   INT NULL,
    MaxDays         INT NULL,
    EstimatedPrice  DECIMAL(18, 2) NULL,
    MaxPrice        DECIMAL(18, 2) NULL,
    MaxRevisions    INT NOT NULL DEFAULT 3,
    ScopeOutput     TEXT NOT NULL,
    SupportType     VARCHAR(50) NOT NULL DEFAULT 'Online', -- 'Online', 'Direct', 'Hybrid'
    DemoImagesJson  TEXT NULL, -- JSON Array ảnh sản phẩm
    IsHidden        TINYINT(1) NOT NULL DEFAULT 0,
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 3: Dự án Mẫu Showcase (SampleProjects)
CREATE TABLE IF NOT EXISTS SampleProjects (
    ProjectId       VARCHAR(100) PRIMARY KEY,
    Name            VARCHAR(255) NOT NULL,
    Category        VARCHAR(50) NOT NULL,
    SubCategory     VARCHAR(100) NULL,
    Description     TEXT NOT NULL,
    ImageUrl        TEXT NOT NULL,
    DemoLink        TEXT NULL,
    IsFeatured      TINYINT(1) NOT NULL DEFAULT 0,
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 4: Đơn hàng & Yêu cầu Dịch vụ (ServiceOrders - Quản lý 12 giai đoạn dịch vụ & KPI)
CREATE TABLE IF NOT EXISTS ServiceOrders (
    OrderId                 VARCHAR(100) PRIMARY KEY,
    ServiceId               VARCHAR(100) NOT NULL,
    ServiceName             VARCHAR(255) NOT NULL,
    Category                VARCHAR(50) NOT NULL,
    CustomerId              VARCHAR(100) NOT NULL,
    CustomerName            VARCHAR(255) NOT NULL,
    CustomerEmail           VARCHAR(255) NOT NULL,
    CustomerPhone           VARCHAR(50) NULL,
    Requirements            TEXT NOT NULL,
    AttachmentsJson         TEXT NULL,
    DesiredDeadline         VARCHAR(100) NULL,
    Status                  VARCHAR(50) NOT NULL DEFAULT 'submitted',
    ProgressPercent         INT NOT NULL DEFAULT 5,
    AssignedStaffId         VARCHAR(100) NULL,
    AssignedStaffName       VARCHAR(255) NULL,
    CollaboratorsJson       TEXT NULL,
    
    -- Mốc đo lường KPI vòng đời dịch vụ (Góp ý 2)
    FirstResponseAt         VARCHAR(100) NULL, -- Thời điểm phản hồi đầu tiên (Response Time)
    DeliverableSentAt       VARCHAR(100) NULL, -- Thời điểm bàn giao phiên bản demo/chính thức
    AcceptedAt              VARCHAR(100) NULL, -- Thời điểm khách hàng ký nghiệm thu
    CompletedAt             VARCHAR(100) NULL, -- Thời điểm thanh toán 100% & đóng dự án
    IsOnTime                TINYINT(1) NOT NULL DEFAULT 1, -- Bàn giao đúng deadline cam kết trong SOW
    IsFirstPassAcceptance   TINYINT(1) NOT NULL DEFAULT 1, -- Nghiệm thu ngay lần đầu không phát sinh revision
    SupportPeriodEndAt      VARCHAR(100) NULL, -- Hạn bảo vệ hỗ trợ kỹ thuật (14-30 ngày sau bàn giao)
    
    -- Hợp đồng Scope of Work SOW & Thanh toán 50-50 (Góp ý 1 - M2)
    QuotationJson           TEXT NULL, -- Chứa amount, deadline, deliverables, exclusions, criteria, remedyTerms
    PaymentInfoJson         TEXT NULL, -- Chứa amountPaid, paymentMethod, status, note
    
    -- Biên bản UAT & Transfer Session (Góp ý 1 - M3 & Giai đoạn 11)
    UatSubmissionJson       TEXT NULL, -- Checklist 4 nhóm kiểm thử + chữ ký nghiệm thu
    TransferSessionJson     TEXT NULL, -- Thông tin buổi chuyển giao kỹ thuật (link, ngày, video, docs)
    PostServiceSurveyJson   TEXT NULL, -- Tóm tắt điểm hài lòng CSAT & SUS
    
    IsBeingEdited           TINYINT(1) NOT NULL DEFAULT 0,
    EditingNote             TEXT NULL,
    CreatedAt               DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt               DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerId) REFERENCES Users(UserId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 5: Cột mốc Tiến độ Đơn hàng (OrderMilestones)
CREATE TABLE IF NOT EXISTS OrderMilestones (
    MilestoneId     VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    Title           VARCHAR(255) NOT NULL,
    TargetDate      VARCHAR(100) NOT NULL,
    IsCompleted     TINYINT(1) NOT NULL DEFAULT 0,
    UpdatedBy       VARCHAR(255) NULL,
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 6: Sản phẩm Bàn giao (OrderDeliverables)
CREATE TABLE IF NOT EXISTS OrderDeliverables (
    DeliverableId   VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    Version         INT NOT NULL DEFAULT 1,
    Title           VARCHAR(255) NOT NULL,
    FileLink        TEXT NOT NULL,
    PreviewUrl      TEXT NULL,
    Notes           TEXT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'revision_needed'
    Timestamp       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 7: Yêu cầu Chỉnh sửa trong Scope (OrderRevisions - Tối đa 3 vòng)
CREATE TABLE IF NOT EXISTS OrderRevisions (
    RevisionId      VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    Version         INT NOT NULL,
    Feedback        TEXT NOT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'resolved'
    RequestedAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 8: Tin nhắn Trực tiếp Khách hàng & Staff (OrderMessages)
CREATE TABLE IF NOT EXISTS OrderMessages (
    MessageId       VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    SenderId        VARCHAR(100) NOT NULL,
    SenderName      VARCHAR(255) NOT NULL,
    SenderRole      VARCHAR(50) NOT NULL,
    Text            TEXT NOT NULL,
    AttachmentUrl   TEXT NULL,
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 9: Đánh giá Dịch vụ Công khai (ServiceReviews)
CREATE TABLE IF NOT EXISTS ServiceReviews (
    ReviewId        VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    ServiceId       VARCHAR(100) NOT NULL,
    ServiceName     VARCHAR(255) NOT NULL,
    CustomerId      VARCHAR(100) NULL,
    CustomerName    VARCHAR(255) NOT NULL,
    Rating          INT NOT NULL DEFAULT 5,
    Comment         TEXT NOT NULL,
    Moderated       TINYINT(1) NOT NULL DEFAULT 1,
    ReplyText       TEXT NULL,
    RepliedBy       VARCHAR(255) NULL,
    RepliedAt       VARCHAR(100) NULL,
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 10: Ticket Hỗ trợ & Khiếu nại (SupportTickets - Tuân thủ Điều 31 & 36 Luật 19/2023/QH15 & ISO 10002)
CREATE TABLE IF NOT EXISTS SupportTickets (
    TicketId                VARCHAR(100) PRIMARY KEY,
    OrderId                 VARCHAR(100) NOT NULL,
    CustomerId              VARCHAR(100) NULL,
    CustomerName            VARCHAR(255) NOT NULL,
    CustomerEmail           VARCHAR(255) NOT NULL,
    Subject                 VARCHAR(255) NOT NULL,
    Content                 TEXT NOT NULL,
    Type                    VARCHAR(50) NOT NULL DEFAULT 'support', -- 'support', 'complaint'
    Category                VARCHAR(50) NOT NULL DEFAULT 'other',   -- 'scope_issue', 'deadline_delay', 'quality_defect', 'warranty_support', 'technical_bug', 'other'
    Priority                VARCHAR(20) NOT NULL DEFAULT 'medium',  -- 'low', 'medium', 'high', 'urgent'
    Status                  VARCHAR(50) NOT NULL DEFAULT 'open',    -- 'open', 'acknowledged', 'processing', 'resolved', 'closed'
    SlaAcknowledgeDeadline  DATETIME NOT NULL,                      -- Cam kết tiếp nhận <= 3 ngày làm việc (Điều 31)
    AcknowledgedAt          VARCHAR(100) NULL,
    AcknowledgedBy          VARCHAR(255) NULL,
    AssignedStaffId         VARCHAR(100) NULL,
    AssignedStaffName       VARCHAR(255) NULL,
    Response                TEXT NULL,
    RemedyType              VARCHAR(50) NULL,                       -- 'free_fix', 'partial_refund', 'full_refund_termination', 'scope_extension', 'custom_agreement' (Điều 36)
    RemedyDetails           TEXT NULL,
    ResolvedAt              VARCHAR(100) NULL,
    CustomerRating          INT NULL,                               -- Điểm hài lòng giải quyết khiếu nại (1-5 sao)
    CreatedAt               DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 10b: Khảo sát Hài lòng Khách hàng Sau Bàn Giao (PostServiceSurveys - ISO 10004:2018 & SUS Brooke 1996)
CREATE TABLE IF NOT EXISTS PostServiceSurveys (
    SurveyId                VARCHAR(100) PRIMARY KEY,
    OrderId                 VARCHAR(100) NOT NULL UNIQUE,
    CustomerName            VARCHAR(255) NOT NULL,
    Q1_ScopeClarity         INT NOT NULL, -- 1-5: Rõ ràng phạm vi SOW trước khi làm
    Q2_ProgressUpdate       INT NOT NULL, -- 1-5: Cập nhật tiến độ minh bạch
    Q3_DeliverableQuality   INT NOT NULL, -- 1-5: Sản phẩm đáp ứng tiêu chí đã chốt
    Q4_RevisionHandling     INT NOT NULL, -- 1-5: Xử lý chỉnh sửa hợp lý
    Q5_TransferSession      INT NOT NULL, -- 1-5: Buổi chuyển giao hữu ích, tự vận hành được
    Q6_OverallSatisfaction  INT NOT NULL, -- 1-5: Điểm CSAT tổng thể trải nghiệm
    RecommendIntent         TINYINT(1) NOT NULL DEFAULT 1, -- Sẵn sàng giới thiệu người khác (1=Có, 0=Không)
    BestPoint               TEXT NULL,
    ImprovePoint            TEXT NULL,
    SusScore                DECIMAL(5, 2) NULL, -- Điểm System Usability Scale 0-100 (Brooke, 1996)
    SubmittedAt             DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 11: Giỏ hàng Dịch vụ (CartItems)
CREATE TABLE IF NOT EXISTS CartItems (
    CartItemId      VARCHAR(100) PRIMARY KEY,
    UserId          VARCHAR(100) NOT NULL,
    ServiceId       VARCHAR(100) NOT NULL,
    ServiceName     VARCHAR(255) NOT NULL,
    Category        VARCHAR(50) NOT NULL,
    EstimatedPrice  DECIMAL(18, 2) NULL,
    EstimatedDays   INT NULL,
    Requirements    TEXT NULL,
    DesiredDeadline VARCHAR(100) NULL,
    AddedAt         DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 12: Lịch sử Giao dịch Thanh toán VietQR & VNPay (PaymentTransactions)
CREATE TABLE IF NOT EXISTS PaymentTransactions (
    TransactionId   VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    CustomerId      VARCHAR(100) NULL,
    CustomerName    VARCHAR(255) NOT NULL,
    Amount          DECIMAL(18, 2) NOT NULL,
    PaymentType     VARCHAR(50) NOT NULL DEFAULT 'deposit', -- 'deposit', 'full', 'remaining'
    PaymentMethod   VARCHAR(50) NOT NULL DEFAULT 'VietQR',  -- 'VietQR', 'VNPay', 'BankTransfer'
    VnpTxnRef       VARCHAR(100) NULL,
    VnpBankCode     VARCHAR(50) NULL,
    VnpResponseCode VARCHAR(50) NULL,
    ReceiptImage    TEXT NULL,
    Note            TEXT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. NẠP DỮ LIỆU MẪU ĐẦY ĐỦ (FULL SEED DATA)
-- ============================================================================

-- 3.1. Seed 13 Người Dùng (Users: Guest, 10 Pilot Customers, 2 Staffs, 1 Admin)
INSERT INTO Users (UserId, Name, Email, PasswordHash, Role, Phone, SkillsJson, AvatarUrl, Status) VALUES
('usr-guest', 'Khách xem', 'guest@4youtech.com', NULL, 'guest', NULL, NULL, NULL, 'active'),
('usr-cust-1', 'Nguyễn Văn An', 'an.nguyen@student.edu.vn', 'hash_1b932c0', 'customer', '0912345678', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-2', 'Lê Minh Tuấn (CLB IT)', 'tuan.le@clbit.org', 'hash_1b932c0', 'customer', '0987654321', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-3', 'Hoàng Kim Ngân', 'kimngan.hoang@student.edu.vn', 'hash_1b932c0', 'customer', '0934567890', NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-4', 'Đỗ Quốc Việt (Phin Coffee)', 'viet.do@fnbstartup.vn', 'hash_1b932c0', 'customer', '0945678901', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-5', 'Trần Mai Linh (CLB TT)', 'mailinh.clbtt@gmail.com', 'hash_1b932c0', 'customer', '0956789012', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-6', 'Vũ Đình Khoa', 'khoa.vu@fpt.edu.vn', 'hash_1b932c0', 'customer', '0967890123', NULL, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-7', 'Ngô Thùy Trang (V+ Health)', 'trang.ngo@charity.vn', 'hash_1b932c0', 'customer', '0978901234', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-8', 'Bùi Hoàng Nam (Freelancer)', 'nam.bui@designfreelance.com', 'hash_1b932c0', 'customer', '0989012345', NULL, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-9', 'Phạm Quỳnh Chi', 'quynhchi.fashion@gmail.com', 'hash_1b932c0', 'customer', '0990123456', NULL, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-10', 'Nguyễn Đăng Quang', 'quang.dang@gmail.com', 'hash_1b932c0', 'customer', '0911223344', NULL, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-staff-it', 'Trần Bảo IT', 'bao.it@4youtech.com', 'hash_2c810d1', 'staff', '0901112233', '["React/Next.js", "Node.js", "Database", "System Architecture"]', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-staff-des', 'Phạm Hà Design', 'ha.design@4youtech.com', 'hash_2c810d1', 'staff', '0904445566', '["Figma UI/UX", "Branding", "Banner/Poster", "Motion Graphic"]', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-admin', 'Quản trị viên 4YouTech', 'admin@4youtech.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin', '0999888777', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'active');

-- 3.2. Seed 8 Dịch Vụ Chuẩn (Services)
INSERT INTO Services (ServiceId, Name, Description, Category, EstimatedDays, MaxDays, EstimatedPrice, MaxPrice, MaxRevisions, ScopeOutput, SupportType, DemoImagesJson, IsHidden) VALUES
('it-lap-trinh-portfolio', 'Lập trình Portfolio', 'Lập trình website portfolio cá nhân tối ưu SEO, giao diện cá tính, responsive chuẩn di động & web.', 'IT', 3, 5, 1000000.00, 2000000.00, 3, 'Mã nguồn Next.js/React, Chuẩn Responsive Mobile/Tablet, Hướng dẫn quản trị & Deploy Vercel/Netlify miễn phí.', 'Online', '["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"]', 0),
('it-thiet-ke-web', 'Thiết kế Web', 'Xây dựng & lập trình website doanh nghiệp, trang bán hàng, landing page hiện đại, chuẩn SEO & tối ưu tốc độ.', 'IT', 5, 8, 1500000.00, 3500000.00, 4, 'Fullstack Website, Tích hợp CMS Quản lý nội dung, Form liên hệ, Chuẩn SEO Google & Security.', 'Hybrid', '["https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"]', 0),
('it-ui-ux', 'UI/UX', 'Nghiên cứu hành vi người dùng, vẽ Wireframe, thiết kế Prototype tương tác & lập trình giao diện Web/App mượt mà.', 'IT', 4, 7, 1200000.00, 2500000.00, 3, 'Wireframe UI/UX, Prototype tương tác Figma, Component Design System & Code Front-end.', 'Online', '["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"]', 0),
('it-test-loi-phan-mem', 'Test lỗi phần mềm', 'Kiểm thử phần mềm (Manual & Automation Testing), rà soát lỗi UI/UX, bảo mật, hiệu năng & xuất báo cáo chi tiết.', 'IT', 2, 4, 500000.00, 1500000.00, 2, 'Báo cáo Test Case (Excel/PDF), Danh sách Bug Log, Video/Hình ảnh minh chứng lỗi & Đề xuất khắc phục.', 'Online', '["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"]', 0),
('design-thiet-ke-ui', 'Thiết kế UI', 'Thiết kế Giao diện người dùng (User Interface) sắc nét, hiện đại trên Figma dành cho Website & Mobile App.', 'Design', 3, 5, 1000000.00, 2000000.00, 3, 'File Figma Master, Bộ Style Guide (Màu sắc, Typography, Icons), Export PNG/SVG assets.', 'Online', '["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"]', 0),
('design-logo', 'Logo', 'Thiết kế Logo nhận diện thương hiệu độc quyền, sáng tạo ấn tượng, kèm Brand Guidelines & file Vector gốc.', 'Design', 2, 4, 600000.00, 1500000.00, 3, 'File Vector AI/PSD/PNG/SVG, Logo Mockup thực tế, Hướng dẫn quy chuẩn sử dụng Logo.', 'Online', '["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80","/images/logo-phin-coffee.png","/images/logo-ladybug-or.png"]', 0),
('design-banner', 'Banner', 'Thiết kế Banner quảng cáo, banner website, mạng xã hội (Facebook/Zalo/Instagram) bắt mắt, chuẩn tỷ lệ.', 'Design', 1, 2, 300000.00, 800000.00, 2, 'File thiết kế Vector/PSD, File ảnh xuất chất lượng cao (PNG/JPG/WebP), Banner kích thước chuẩn.', 'Online', '["/images/banner-y-te.png","/images/banner-mat-kinh.png","/images/banner-dau-tu.png"]', 0),
('design-poster', 'Poster', 'Thiết kế Poster sự kiện, poster truyền thông, nghệ thuật độ phân giải cao dành cho in ấn & đăng tải truyền thông.', 'Design', 2, 3, 400000.00, 1000000.00, 3, 'File in ấn PDF/TIFF chất lượng cao, File ảnh PNG/JPG truyền thông, Mockup poster thực tế.', 'Online', '["/images/poster-avocado.png","/images/poster-longan.png","/images/poster-ocean.jpg"]', 0);

-- 3.3. Seed 13 Dự Án Mẫu (SampleProjects)
INSERT INTO SampleProjects (ProjectId, Name, Category, SubCategory, Description, ImageUrl, DemoLink, IsFeatured) VALUES
('proj-portfolio-trunghieu', 'Website Portfolio Cá Nhân Developer Pro - Nguyễn Trung Hiếu', 'IT', 'Website', 'Website Personal Portfolio Backend Developer & Web/UI Design chuyên nghiệp xuất bản trực tiếp trên Netlify. Trình bày thông tin cá nhân, dự án công nghệ 4YouTech, chứng chỉ Coursera & hồ sơ năng lực làm việc.', '/images/portfolio-trunghieu.jpg', 'https://nguyen-trung-hieu.netlify.app/', 1),
('proj-portfolio-camly', 'Website Portfolio Cá Nhân Graphic Designer - Nguyễn Thị Cẩm Lý', 'IT', 'Website', 'Website Portfolio cá nhân Graphic Design xuất bản trực tiếp trên Netlify với phong cách đồ họa màu sắc nổi bật, ấn tượng. Trình bày bộ sưu tập nhận diện thương hiệu, thiết kế Banner, Poster, chứng chỉ Coursera & liên hệ.', '/images/portfolio-camly.png', 'https://nguyen-thi-cam-ly.netlify.app/', 1),
('proj-1', 'Website Đặt Sân & Quản Lý Sự Kiện Sinh Viên', 'IT', 'Web Development', 'Hệ thống Web Fullstack hỗ trợ CLB trường đặt lịch sự kiện, thanh toán và quản lý thành viên.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', 'https://demo.4youtech.com/student-event', 1),
('proj-2', 'Bộ Giao diện UI App Sức Khỏe & Thể Thao', 'Design', 'UI/UX Design', 'Thiết kế UI/UX 18 màn hình phong cách Glassmorphism màu neon dành cho gen Z.', 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80', 'https://figma.com/file/demo-fitness-ui', 1),
('proj-3', 'Phân Tích ERD & Hệ Thống E-Commerce Chuyên Sâu', 'IT', 'Database Design', 'Thiết kế CSDL SQL gồm 32 bảng chuẩn hóa 3NF xử lý đơn hàng, kho và khuyến mãi.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', 'https://dbdiagram.io/d/demo-ecommerce', 0),
('proj-4', 'Bộ Nhận Diện Thương Hiệu CLB Sáng Tạo TechClub', 'Design', 'Branding', 'Logo, Brand Guidelines, Template slide thuyết trình và 10 mẫu poster truyền thông.', 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&auto=format&fit=crop&q=80', 'https://behance.net/gallery/techclub-brand', 1),
('proj-banner-yte', 'Banner Quảng Cáo Trung Tâm Y Tế Gia Đình', 'Design', 'Banner', 'Banner quảng cáo chăm sóc sức khỏe gia đình, phối màu xanh ngọc biểu tượng y tế tươi mới.', '/images/banner-y-te.png', '/images/banner-y-te.png', 1),
('proj-banner-matkinh', 'Banner Quảng Cáo Mắt Kính Thông Minh AR', 'Design', 'Banner', 'Banner giới thiệu mắt kính công nghệ thông minh, phong cách hi-tech thanh lịch.', '/images/banner-mat-kinh.png', '/images/banner-mat-kinh.png', 1),
('proj-banner-dautu', 'Banner Truyền Thông Dịch Vụ Đầu Tư Tài Chính', 'Design', 'Banner', 'Banner tài chính uy tín, xanh navy phối vàng kim thịnh vượng và đồ thị tăng trưởng.', '/images/banner-dau-tu.png', '/images/banner-dau-tu.png', 1),
('proj-poster-avocado', 'Poster Truyền Thông Sản Phẩm Trái Bơ Sạch', 'Design', 'Poster', 'Poster trái bơ tươi ngon phong cách sang trọng, typography uốn lượn thu hút.', '/images/poster-avocado.png', '/images/poster-avocado.png', 1),
('proj-poster-longan', 'Poster Quảng Bá Trái Cây Nhiệt Đới - Quả Nhãn', 'Design', 'Poster', 'Poster quả nhãn nhiệt đới mọng nước, tràn đầy cảm hứng thiên nhiên tươi mát.', '/images/poster-longan.png', '/images/poster-longan.png', 1),
('proj-poster-ocean', 'Poster Truyền Thông Bảo Vệ Đại Dương & Sinh Vật Biển', 'Design', 'Poster', 'Poster cảnh tỉnh môi trường đại dương với hình tượng chiếc bọc nilon trong suốt.', '/images/poster-ocean.jpg', '/images/poster-ocean.jpg', 1),
('proj-logo-phin-coffee', 'Logo Thương Hiệu Cà Phê PHIN COFFEE', 'Design', 'Logo', 'Logo phin cà phê kết hợp mũ quý ông Fedora lịch lãm, phối màu vàng chanh & nâu cà phê.', '/images/logo-phin-coffee.png', '/images/logo-phin-coffee.png', 1);

-- 3.4. Seed 10 Đơn Hàng Pilot Cohort (ServiceOrders: REQ-2026-001 -> REQ-2026-010)
-- Khách 1-3: Warm Network | Khách 4-10: Direct Outreach
INSERT INTO ServiceOrders (
    OrderId, ServiceId, ServiceName, Category, CustomerId, CustomerName, CustomerEmail, CustomerPhone,
    Requirements, DesiredDeadline, Status, ProgressPercent, AssignedStaffId, AssignedStaffName, CollaboratorsJson,
    FirstResponseAt, DeliverableSentAt, AcceptedAt, CompletedAt, IsOnTime, IsFirstPassAcceptance, SupportPeriodEndAt,
    QuotationJson, PaymentInfoJson, TransferSessionJson
) VALUES
(
    'REQ-2026-001', 'it-lap-trinh-portfolio', 'Lập trình Portfolio Sinh Viên', 'IT/Design',
    'usr-cust-1', 'Nguyễn Văn An', 'an.nguyen@student.edu.vn', '0912345678',
    'Xây dựng portfolio cá nhân 5 trang (Trang chủ, Giới thiệu, Dự án, Kỹ năng, Liên hệ). Giao diện tối màu Cyberpunk.',
    '2026-10-05', 'in_progress', 65, 'usr-staff-it', 'Trần Bảo IT', '["Phạm Hà Design"]',
    '2026-09-15 10:15', NULL, NULL, NULL, 1, 1, '2026-11-04',
    '{"amount":1800000,"finalDeadline":"2026-10-04","maxRevisions":4,"deliverables":["File Figma","Source code Next.js","Deploy Vercel"],"exclusions":["Không bao gồm tên miền riêng .vn"],"acceptanceCriteria":["Responsive 100%","Lighthouse Performance > 90"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Hỗ trợ sửa bug kỹ thuật miễn phí trong 30 ngày sau bàn giao."}',
    '{"amountPaid":900000,"paymentMethod":"VNPay","paymentStatus":"verified","note":"Khách đã đặt cọc 50% qua VNPay Sandbox"}',
    NULL
),
(
    'REQ-2026-002', 'design-banner', 'Banner & Poster Hackathon Sinh Viên', 'Design',
    'usr-cust-2', 'Lê Minh Tuấn (CLB IT)', 'tuan.le@clbit.org', '0987654321',
    'Thiết kế ấn phẩm truyền thông cuộc thi Hackathon CLB IT: 1 Poster 4K + 2 Banner Facebook.',
    '2026-09-28', 'deliverable_sent', 90, 'usr-staff-des', 'Phạm Hà Design', NULL,
    '2026-09-18 11:20', '2026-09-24 16:00', NULL, NULL, 1, 1, '2026-10-27',
    '{"amount":700000,"finalDeadline":"2026-09-27","maxRevisions":3,"deliverables":["1 Poster 4K","2 Banner Facebook","File Vector gốc AI"],"exclusions":["Không in ấn trực tiếp"],"acceptanceCriteria":["Đúng nhận diện thương hiệu CLB","Màu neon sắc nét"],"assignedLead":"Phạm Hà Design","supportPeriodDays":14,"remedyTerms":"Được xuất thêm các kích thước mạng xã hội phát sinh miễn phí."}',
    '{"amountPaid":700000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Thanh toán 100% full đơn qua VietQR"}',
    '{"isCompleted":false,"sessionDate":"2026-09-27 19:30","meetLink":"https://meet.google.com/abc-hackathon","customerConfirmed":false}'
),
(
    'REQ-2026-003', 'it-lap-trinh-portfolio', 'Website Portfolio Nhiếp Ảnh Nghệ Thuật', 'IT',
    'usr-cust-3', 'Hoàng Kim Ngân', 'kimngan.hoang@student.edu.vn', '0934567890',
    'Cần website portfolio ảnh nghệ thuật tối giản, gallery masonry mượt mà và form liên hệ khách hàng.',
    '2026-09-10', 'completed', 100, 'usr-staff-it', 'Trần Bảo IT', NULL,
    '2026-09-02 09:10', '2026-09-07 14:00', '2026-09-09 10:00', '2026-09-09 15:30', 1, 1, '2026-10-09',
    '{"amount":1500000,"finalDeadline":"2026-09-09","maxRevisions":3,"deliverables":["Full source code Next.js","Gallery Masonry","Tích hợp Vercel"],"exclusions":["Không lưu trữ video nặng trên 100MB"],"acceptanceCriteria":["Tốc độ load ảnh dưới 1.5s","Responsive mobile"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Sửa bug layout miễn phí trong 30 ngày."}',
    '{"amountPaid":1500000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán 100%"}',
    '{"isCompleted":true,"sessionDate":"2026-09-09 14:00","meetLink":"https://meet.google.com/demo-transfer-003","videoRecordingUrl":"https://drive.google.com/rec-003","docsUrl":"https://drive.google.com/docs-003","customerConfirmed":true,"completedAt":"2026-09-09 15:00"}'
),
(
    'REQ-2026-004', 'design-logo', 'Logo Thương Hiệu Cà Phê PHIN COFFEE', 'Design',
    'usr-cust-4', 'Đỗ Quốc Việt (Phin Coffee)', 'viet.do@fnbstartup.vn', '0945678901',
    'Thiết kế logo nhận diện chuỗi cà phê mộc Phin Coffee, kết hợp phin cà phê và mũ quý ông Fedora.',
    '2026-09-14', 'completed', 100, 'usr-staff-des', 'Phạm Hà Design', NULL,
    '2026-09-08 10:25', '2026-09-11 15:00', '2026-09-13 11:00', '2026-09-13 15:00', 1, 0, '2026-10-13',
    '{"amount":800000,"finalDeadline":"2026-09-14","maxRevisions":3,"deliverables":["File Vector gốc .AI, .SVG, .PNG","Logo Guidelines","Mockup ly & bảng hiệu"],"exclusions":["Không đăng ký nhãn hiệu tại Cục SHTT"],"acceptanceCriteria":["Logo độc quyền","Phối màu chuẩn vàng chanh & nâu cà phê"],"assignedLead":"Phạm Hà Design","supportPeriodDays":30,"remedyTerms":"Chỉnh sửa tỷ lệ font chữ hoặc xuất thêm định dạng file miễn phí trong 30 ngày."}',
    '{"amountPaid":800000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Thanh toán 100% hoàn tất"}',
    '{"isCompleted":true,"sessionDate":"2026-09-13 14:00","meetLink":"https://meet.google.com/demo-phin-coffee","videoRecordingUrl":"https://drive.google.com/rec-phin","docsUrl":"https://drive.google.com/guideline-phin","customerConfirmed":true,"completedAt":"2026-09-13 14:45"}'
),
(
    'REQ-2026-005', 'design-poster', 'Poster Truyền Thông Trái Bơ Sạch', 'Design',
    'usr-cust-5', 'Trần Mai Linh (CLB TT)', 'mailinh.clbtt@gmail.com', '0956789012',
    'Thiết kế poster quảng bá nông sản hữu cơ sạch Fruit Avocado, typography uốn lượn sang trọng.',
    '2026-09-18', 'completed', 100, 'usr-staff-des', 'Phạm Hà Design', NULL,
    '2026-09-12 14:15', '2026-09-16 11:00', '2026-09-17 09:30', '2026-09-17 11:00', 1, 1, '2026-10-17',
    '{"amount":400000,"finalDeadline":"2026-09-17","maxRevisions":3,"deliverables":["File PDF/TIFF in ấn độ nét cao","File ảnh PNG truyền thông"],"exclusions":["Không bao gồm chi phí in ấn"],"acceptanceCriteria":["Độ phân giải 300 DPI chuẩn in","Màu sắc tự nhiên"],"assignedLead":"Phạm Hà Design","supportPeriodDays":14,"remedyTerms":"Đổi kích thước sang Banner ngang miễn phí trong 14 ngày."}',
    '{"amountPaid":400000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán 100%"}',
    '{"isCompleted":true,"sessionDate":"2026-09-17 10:30","meetLink":"https://meet.google.com/demo-avocado","docsUrl":"https://drive.google.com/docs-avocado","customerConfirmed":true,"completedAt":"2026-09-17 11:00"}'
),
(
    'REQ-2026-006', 'it-test-loi-phan-mem', 'Kiểm Thử Phần Mềm Quản Lý Kho Sinh Viên', 'IT',
    'usr-cust-6', 'Vũ Đình Khoa', 'khoa.vu@fpt.edu.vn', '0967890123',
    'Kiểm thử ứng dụng Web Quản lý kho: lập 40 test cases, kiểm tra phân quyền và xuất báo cáo bug log.',
    '2026-09-22', 'completed', 100, 'usr-staff-it', 'Trần Bảo IT', NULL,
    '2026-09-18 08:45', '2026-09-20 16:00', '2026-09-21 14:00', '2026-09-21 16:30', 1, 1, '2026-10-21',
    '{"amount":500000,"finalDeadline":"2026-09-21","maxRevisions":2,"deliverables":["Báo cáo Excel 42 Test Cases","Danh sách 12 Bug Log kèm video"],"exclusions":["Không trực tiếp viết code sửa lỗi phần mềm"],"acceptanceCriteria":["Test đầy đủ luồng nghiệp vụ","Video minh chứng rõ ràng"],"assignedLead":"Trần Bảo IT","supportPeriodDays":14,"remedyTerms":"Retest miễn phí 1 lần sau khi lập trình viên của khách sửa lỗi."}',
    '{"amountPaid":500000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán full 100%"}',
    '{"isCompleted":true,"sessionDate":"2026-09-21 15:30","meetLink":"https://meet.google.com/demo-qa-transfer","videoRecordingUrl":"https://drive.google.com/rec-qa","docsUrl":"https://drive.google.com/report-qa","customerConfirmed":true,"completedAt":"2026-09-21 16:30"}'
),
(
    'REQ-2026-007', 'design-logo', 'Logo Y Tế & Chăm Sóc Sức Khỏe V+', 'Design',
    'usr-cust-7', 'Ngô Thùy Trang (V+ Health)', 'trang.ngo@charity.vn', '0978901234',
    'Thiết kế logo hình trái tim kết hợp chồi non và dấu cộng y tế cho dự án thiện nguyện sức khỏe cộng đồng.',
    '2026-09-26', 'completed', 100, 'usr-staff-des', 'Phạm Hà Design', NULL,
    '2026-09-20 11:10', '2026-09-23 15:00', '2026-09-25 10:30', '2026-09-25 14:00', 1, 0, '2026-10-25',
    '{"amount":700000,"finalDeadline":"2026-09-25","maxRevisions":3,"deliverables":["File Vector .AI, .SVG","Logo Style Guide","Avatar mạng xã hội"],"exclusions":["Không làm video animation 3D"],"acceptanceCriteria":["Ý nghĩa nhân văn rõ nét","Gradient xanh lá - xanh lam dịu mát"],"assignedLead":"Phạm Hà Design","supportPeriodDays":30,"remedyTerms":"Hỗ trợ đổi màu sắc hoặc trích xuất icon đơn sắc miễn phí."}',
    '{"amountPaid":700000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Thanh toán full 100%"}',
    '{"isCompleted":true,"sessionDate":"2026-09-25 13:30","meetLink":"https://meet.google.com/demo-vplus","docsUrl":"https://drive.google.com/docs-vplus","customerConfirmed":true,"completedAt":"2026-09-25 14:00"}'
),
(
    'REQ-2026-008', 'design-banner', 'Banner Mắt Kính Thông Minh AR', 'Design',
    'usr-cust-8', 'Bùi Hoàng Nam (Freelancer)', 'nam.bui@designfreelance.com', '0989012345',
    'Thiết kế banner sản phẩm công nghệ kính AR thông minh, nền trắng sáng phong cách Apple hi-tech.',
    '2026-09-28', 'completed', 100, 'usr-staff-des', 'Phạm Hà Design', NULL,
    '2026-09-24 09:30', '2026-09-26 14:00', '2026-09-27 11:00', '2026-09-27 15:00', 1, 1, '2026-10-27',
    '{"amount":300000,"finalDeadline":"2026-09-27","maxRevisions":2,"deliverables":["File thiết kế gốc PSD","Ảnh WebP dung lượng nhẹ chuẩn web"],"exclusions":["Không bao gồm mẫu chụp người mẫu thật"],"acceptanceCriteria":["Bố cục cân đối tối giản","Chi tiết kính sắc nét"],"assignedLead":"Phạm Hà Design","supportPeriodDays":14,"remedyTerms":"Hỗ trợ cắt ảnh theo 3 kích thước web khác nhau miễn phí."}',
    '{"amountPaid":300000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã thanh toán 100%"}',
    '{"isCompleted":true,"sessionDate":"2026-09-27 14:00","meetLink":"https://meet.google.com/demo-banner-ar","docsUrl":"https://drive.google.com/docs-banner-ar","customerConfirmed":true,"completedAt":"2026-09-27 14:30"}'
),
(
    'REQ-2026-009', 'it-ui-ux', 'Thiết Kế UI App Thời Trang Gen Z', 'IT',
    'usr-cust-9', 'Phạm Quỳnh Chi', 'quynhchi.fashion@gmail.com', '0990123456',
    'Thiết kế giao diện 12 màn hình Mobile App thời trang tái chế phong cách Y2K và prototype tương tác Figma.',
    '2026-10-06', 'deliverable_sent', 85, 'usr-staff-it', 'Trần Bảo IT', '["Phạm Hà Design"]',
    '2026-09-28 13:40', '2026-10-02 17:00', NULL, NULL, 1, 1, '2026-11-05',
    '{"amount":1400000,"finalDeadline":"2026-10-05","maxRevisions":3,"deliverables":["Figma UI Kit 12 màn hình","Prototype tương tác luồng mua sắm"],"exclusions":["Không lập trình code React Native"],"acceptanceCriteria":["Chuẩn tỷ lệ màn hình iPhone 15","Style guide rõ ràng"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Hỗ trợ chỉnh sửa component hoặc luồng click prototype trong 30 ngày."}',
    '{"amountPaid":700000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã cọc 50%"}',
    '{"isCompleted":false,"sessionDate":"2026-10-05 19:00","meetLink":"https://meet.google.com/demo-fashion-app","customerConfirmed":false}'
),
(
    'REQ-2026-010', 'it-thiet-ke-web', 'Landing Page Bất Động Sản Sinh Thái', 'IT',
    'usr-cust-10', 'Nguyễn Đăng Quang', 'quang.dang@gmail.com', '0911223344',
    'Cần xây dựng Landing Page giới thiệu dự án căn hộ sinh thái xanh, tích hợp form tư vấn và hotline.',
    '2026-10-08', 'in_progress', 50, 'usr-staff-it', 'Trần Bảo IT', NULL,
    '2026-10-01 10:05', NULL, NULL, NULL, 1, 1, '2026-11-07',
    '{"amount":1500000,"finalDeadline":"2026-10-07","maxRevisions":3,"deliverables":["Landing page Next.js chuẩn SEO","Tích hợp form đăng ký tư vấn"],"exclusions":["Không bao gồm chi phí quảng cáo Facebook/Google Ads"],"acceptanceCriteria":["Điểm PageSpeed Insights > 85","Hiệu ứng chuyển động mượt mà"],"assignedLead":"Trần Bảo IT","supportPeriodDays":30,"remedyTerms":"Bảo hành mã nguồn và xử lý form email miễn phí trong 30 ngày."}',
    '{"amountPaid":750000,"paymentMethod":"VietQR","paymentStatus":"verified","note":"Đã cọc 50% qua VietQR"}',
    NULL
);

-- 3.5. Seed Khảo Sát Hài Lòng Khách Hàng (PostServiceSurveys - ISO 10004 & SUS Brooke 1996)
INSERT INTO PostServiceSurveys (
    SurveyId, OrderId, CustomerName,
    Q1_ScopeClarity, Q2_ProgressUpdate, Q3_DeliverableQuality, Q4_RevisionHandling, Q5_TransferSession, Q6_OverallSatisfaction,
    RecommendIntent, BestPoint, ImprovePoint, SusScore, SubmittedAt
) VALUES
('srv-003', 'REQ-2026-003', 'Hoàng Kim Ngân', 5, 5, 5, 5, 5, 5, 1, 'Tốc độ phản hồi cực nhanh, web load ảnh rất mượt', 'Có thể bổ sung thêm nhiều theme màu sáng', 92.50, '2026-09-09 16:00:00'),
('srv-004', 'REQ-2026-004', 'Đỗ Quốc Việt (Phin Coffee)', 5, 4, 5, 5, 4, 5, 1, 'Nhóm lắng nghe góp ý sửa vành mũ rất tận tình, xuất đầy đủ định dạng vector', 'Nên gửi trước 1 bảng màu mẫu để chọn', 87.50, '2026-09-13 16:30:00'),
('srv-005', 'REQ-2026-005', 'Trần Mai Linh (CLB TT)', 5, 5, 5, 5, 5, 5, 1, 'File in ấn chuẩn sắc nét, giao trước hạn 1 ngày', 'Rất hài lòng, không có gì phàn nàn', 95.00, '2026-09-17 14:00:00'),
('srv-006', 'REQ-2026-006', 'Vũ Đình Khoa', 5, 5, 4, 4, 5, 4, 1, 'Bộ test case rất chi tiết và bài bản, giúp nhóm dev sửa bug dễ dàng', 'Nên hỗ trợ thêm automation test script', 82.50, '2026-09-21 17:00:00'),
('srv-007', 'REQ-2026-007', 'Ngô Thùy Trang (V+ Health)', 5, 4, 5, 5, 5, 5, 1, 'Ý tưởng logo chạm đến cảm xúc, nhóm hỗ trợ đổi màu rất nhanh', 'Thời gian phản hồi ticket bảo hành rất đúng cam kết', 90.00, '2026-09-25 15:30:00'),
('srv-008', 'REQ-2026-008', 'Bùi Hoàng Nam (Freelancer)', 5, 5, 5, 4, 5, 5, 1, 'Thiết kế đúng chất hi-tech Apple, bố cục thoáng', 'Nên có thêm template ảnh vuông để đăng Instagram', 88.00, '2026-09-27 16:00:00');

-- 3.6. Seed Ticket Hỗ Trợ & Khiếu Nại (SupportTickets - Minh chứng M4, SLA 3 ngày & Remedy Điều 36)
INSERT INTO SupportTickets (
    TicketId, OrderId, CustomerId, CustomerName, CustomerEmail, Subject, Content, Type, Category, Priority, Status,
    SlaAcknowledgeDeadline, AcknowledgedAt, AcknowledgedBy, AssignedStaffId, AssignedStaffName,
    Response, RemedyType, RemedyDetails, ResolvedAt, CustomerRating, CreatedAt
) VALUES
(
    'TCK-2026-001', 'REQ-2026-004', 'usr-cust-4', 'Đỗ Quốc Việt (Phin Coffee)', 'viet.do@fnbstartup.vn',
    'Cần xuất thêm file Logo nền trong suốt độ phân giải 4K cho máy in cốc',
    'Chào nhóm, xưởng in ly cà phê yêu cầu thêm 1 file PNG trong suốt kích thước lớn 4000x4000px để không bị vỡ nét.',
    'support', 'quality_defect', 'medium', 'resolved',
    '2026-09-14 10:00:00', '2026-09-12 11:30', 'Phạm Hà Design', 'usr-staff-des', 'Phạm Hà Design',
    'Nhóm đã xuất thêm 2 file PNG 4000px (1 bản màu và 1 bản trắng đen) gửi vào thư mục Google Drive của bạn nhé.',
    'free_fix', 'Xuất bổ sung định dạng file độ phân giải cao miễn phí trong thời gian hỗ trợ 30 ngày.',
    '2026-09-12 15:00', 5, '2026-09-12 10:00:00'
),
(
    'TCK-2026-002', 'REQ-2026-007', 'usr-cust-7', 'Ngô Thùy Trang (V+ Health)', 'trang.ngo@charity.vn',
    'Hỗ trợ trích xuất icon trái tim đơn sắc cho áo thun thiện nguyện',
    'Nhờ 4YouTech hỗ trợ tách riêng icon biểu tượng trái tim V+ màu trắng đơn sắc để in lụa lên áo thun đồng phục.',
    'support', 'warranty_support', 'low', 'resolved',
    '2026-09-27 09:00:00', '2026-09-25 11:00', 'Phạm Hà Design', 'usr-staff-des', 'Phạm Hà Design',
    'Đã trích xuất icon đơn sắc âm bản và dương bản chuẩn vector .SVG và .PNG gửi bạn kiểm tra.',
    'free_fix', 'Thực hiện chính sách bảo vệ khách hàng: Hỗ trợ trích xuất tài nguyên đồ họa miễn phí.',
    '2026-09-25 14:00', 5, '2026-09-25 09:00:00'
);

-- 3.7. Seed Cột mốc Đơn hàng (OrderMilestones)
INSERT INTO OrderMilestones (MilestoneId, OrderId, Title, TargetDate, IsCompleted, UpdatedBy) VALUES
('m1-1', 'REQ-2026-001', 'Chốt phạm vi & Thiết kế Wireframe', '2026-09-18', 1, 'Trần Bảo IT'),
('m1-2', 'REQ-2026-001', 'Hoàn thiện Figma UI Design', '2026-09-22', 1, 'Phạm Hà Design'),
('m1-3', 'REQ-2026-001', 'Lập trình Web Front-end Next.js', '2026-09-30', 0, 'Trần Bảo IT'),
('m1-4', 'REQ-2026-001', 'Kiểm thử UAT & Nghiệm thu bàn giao', '2026-10-04', 0, 'Quản trị viên'),
('m2-1', 'REQ-2026-002', 'Phác thảo concept ấn phẩm Hackathon', '2026-09-20', 1, 'Phạm Hà Design'),
('m2-2', 'REQ-2026-002', 'Xuất file thiết kế demo v1 & gửi UAT', '2026-09-24', 1, 'Phạm Hà Design'),
('m3-1', 'REQ-2026-003', 'Thiết kế bố cục Gallery ảnh', '2026-09-04', 1, 'Trần Bảo IT'),
('m3-2', 'REQ-2026-003', 'Lập trình responsive & tối ưu tốc độ', '2026-09-07', 1, 'Trần Bảo IT'),
('m3-3', 'REQ-2026-003', 'Kiểm thử UAT & Chuyển giao Transfer Session', '2026-09-09', 1, 'Trần Bảo IT'),
('m4-1', 'REQ-2026-004', 'Phác thảo 3 mẫu concept Logo Phin', '2026-09-10', 1, 'Phạm Hà Design'),
('m4-2', 'REQ-2026-004', 'Chỉnh sửa vành mũ Fedora v2 theo góp ý', '2026-09-12', 1, 'Phạm Hà Design'),
('m4-3', 'REQ-2026-004', 'Ký nghiệm thu & Bàn giao Vector Master', '2026-09-13', 1, 'Quản trị viên');

-- 3.8. Seed Sản Phẩm Bàn Giao (OrderDeliverables)
INSERT INTO OrderDeliverables (DeliverableId, OrderId, Version, Title, FileLink, PreviewUrl, Notes, Status) VALUES
('del-1', 'REQ-2026-001', 1, 'Bản thiết kế UI Figma v1', 'https://figma.com/file/demo-v1', 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80', 'Đã thiết kế xong 5 màn hình cơ bản theo đúng yêu cầu màu tối.', 'accepted'),
('del-2', 'REQ-2026-002', 1, 'Bộ Poster & Banner Hackathon v1', 'https://drive.google.com/demo-poster-v1', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80', 'Gửi bản thử hình ảnh độ phân giải cao. Khách kiểm thử UAT giúp nhóm nhé.', 'pending'),
('del-3', 'REQ-2026-003', 1, 'Website Portfolio Nhiếp Ảnh Hoàn Chỉnh', 'https://github.com/4youtech/portfolio-ngan', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80', 'Mã nguồn Next.js đã deploy thành công trên Vercel.', 'accepted'),
('del-4', 'REQ-2026-004', 2, 'Logo Master Vector PHIN COFFEE v2', '/images/logo-phin-coffee.png', '/images/logo-phin-coffee.png', 'Đã tinh chỉnh đường viền chiếc mũ và tỷ lệ chữ PHIN COFFEE sắc sảo theo UAT.', 'accepted');

-- 3.9. Seed Lịch Sử Chỉnh Sửa Trong Scope (OrderRevisions)
INSERT INTO OrderRevisions (RevisionId, OrderId, Version, Feedback, Status, RequestedAt) VALUES
('rev-req-1', 'REQ-2026-004', 1, 'Độ nghiêng của vành mũ quý ông cho cong nhẹ hơn một chút để tạo cảm giác thân thiện hơn.', 'resolved', '2026-09-11 18:00:00'),
('rev-req-2', 'REQ-2026-007', 1, 'Màu gradient của chồi non chuyển sang xanh lá non tươi hơn một chút so với bản phác thảo.', 'resolved', '2026-09-23 17:30:00');

-- 3.10. Seed Tin Nhắn Trao Đổi Đơn Hàng (OrderMessages)
INSERT INTO OrderMessages (MessageId, OrderId, SenderId, SenderName, SenderRole, Text, AttachmentUrl, CreatedAt) VALUES
('msg-1', 'REQ-2026-001', 'usr-cust-1', 'Nguyễn Văn An', 'customer', 'Chào nhóm 4YouTech, cho mình hỏi tiến độ bản thiết kế web portfolio thế nào rồi ạ?', NULL, '2026-09-17 14:20:00'),
('msg-2', 'REQ-2026-001', 'usr-staff-it', 'Trần Bảo IT', 'staff', 'Chào An! Nhóm đã hoàn thiện Wireframe và bản UI Figma v1, đang tiến hành kiểm thử tương tác bạn nhé.', 'https://figma.com/file/demo-v1', '2026-09-17 14:45:00'),
('msg-3', 'REQ-2026-002', 'usr-cust-2', 'Lê Minh Tuấn (CLB IT)', 'customer', 'Nhóm ơi, poster và banner đã gửi bản demo chưa? CLB sắp mở đơn đăng ký rồi.', NULL, '2026-09-24 10:15:00'),
('msg-4', 'REQ-2026-002', 'usr-staff-des', 'Phạm Hà Design', 'staff', 'Chào Tuấn! Nhóm vừa upload bộ Poster & Banner v1 lên hệ thống, bạn kiểm tra UAT giúp nhóm nhé.', 'https://drive.google.com/demo-poster-v1', '2026-09-24 10:30:00'),
('msg-5', 'REQ-2026-004', 'usr-cust-4', 'Đỗ Quốc Việt (Phin Coffee)', 'customer', 'Logo v2 nhìn rất ưng ý! Vành mũ cong nhẹ trông sang và thân thiện hơn hẳn.', NULL, '2026-09-12 16:15:00'),
('msg-6', 'REQ-2026-004', 'usr-staff-des', 'Phạm Hà Design', 'staff', 'Cảm ơn anh Việt! Em đã chuẩn bị sẵn buổi Transfer Session để bàn giao trọn bộ file vector gốc ạ.', NULL, '2026-09-12 16:30:00');

-- 3.11. Seed Mục Giỏ Hàng Mẫu (CartItems)
INSERT INTO CartItems (CartItemId, UserId, ServiceId, ServiceName, Category, EstimatedPrice, EstimatedDays, Requirements, DesiredDeadline, AddedAt) VALUES
('cart-01', 'usr-cust-1', 'it-ui-ux', 'UI/UX Mobile App', 'IT', 1200000.00, 4, 'Dự định đặt thêm giao diện app theo dõi tiến độ học tập sinh viên.', '2026-10-15', '2026-10-02 09:30:00'),
('cart-02', 'usr-cust-2', 'design-poster', 'Poster Sự Kiện', 'Design', 400000.00, 2, 'Poster giải bóng đá giao lưu CLB sinh viên.', '2026-10-12', '2026-10-03 14:10:00');

-- 3.12. Seed Đánh Giá Khách Hàng (ServiceReviews)
INSERT INTO ServiceReviews (ReviewId, OrderId, ServiceId, ServiceName, CustomerName, Rating, Comment, Moderated, ReplyText, RepliedBy, RepliedAt) VALUES
('rev-1', 'REQ-2026-003', 'it-lap-trinh-portfolio', 'Lập trình Portfolio', 'Hoàng Kim Ngân', 5, 'Nhóm làm việc rất nhiệt tình, code đẹp đúng thiết kế Figma của mình, giao đúng hạn trước 1 ngày!', 1, 'Cảm ơn Ngân đã tin tưởng và đồng hành cùng 4YouTech!', 'Trần Bảo IT', '2026-09-09 16:30'),
('rev-2', 'REQ-2026-004', 'design-logo', 'Logo', 'Đỗ Quốc Việt (Phin Coffee)', 5, 'Giao diện logo ấn tượng, phối màu sang trọng và phong cách quý ông rất rõ nét!', 1, 'Cảm ơn anh Việt, chúc Phin Coffee khai trương hồng phát!', 'Phạm Hà Design', '2026-09-13 17:00'),
('rev-3', 'REQ-2026-005', 'design-poster', 'Poster', 'Trần Mai Linh (CLB TT)', 5, 'Poster bơ nông sản hữu cơ rất bắt mắt, độ phân giải in sắc sảo. CLB mình rất ưng!', 1, NULL, NULL, NULL),
('rev-4', 'REQ-2026-006', 'it-test-loi-phan-mem', 'Test lỗi phần mềm', 'Vũ Đình Khoa', 4, 'Báo cáo lỗi chi tiết, có video quay lại bug đầy đủ giúp team dev fix nhanh chóng.', 1, 'Cảm ơn Khoa, chúc đồ án nhóm đạt điểm tối đa!', 'Trần Bảo IT', '2026-09-21 17:30');

-- 3.13. Seed Giao Dịch Thanh Toán (PaymentTransactions)
INSERT INTO PaymentTransactions (TransactionId, OrderId, CustomerId, CustomerName, Amount, PaymentType, PaymentMethod, VnpTxnRef, VnpBankCode, VnpResponseCode, ReceiptImage, Note, Status) VALUES
('TXN-8821', 'REQ-2026-001', 'usr-cust-1', 'Nguyễn Văn An', 900000.00, 'deposit', 'VNPay', 'VNP20269910', 'NCB', '00', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Đặt cọc 50% qua VNPay Sandbox (Ngân hàng NCB)', 'verified'),
('TXN-8822', 'REQ-2026-002', 'usr-cust-2', 'Lê Minh Tuấn (CLB IT)', 700000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% full đơn Hackathon qua VietQR MBBank', 'verified'),
('TXN-8823', 'REQ-2026-003', 'usr-cust-3', 'Hoàng Kim Ngân', 1500000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% qua VietQR MBBank', 'verified'),
('TXN-8824', 'REQ-2026-004', 'usr-cust-4', 'Đỗ Quốc Việt (Phin Coffee)', 800000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% Logo Phin Coffee qua VietQR', 'verified'),
('TXN-8825', 'REQ-2026-005', 'usr-cust-5', 'Trần Mai Linh (CLB TT)', 400000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% Poster Nông Sản qua VietQR', 'verified'),
('TXN-8826', 'REQ-2026-006', 'usr-cust-6', 'Vũ Đình Khoa', 500000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% Gói Test Lỗi qua VietQR', 'verified'),
('TXN-8827', 'REQ-2026-007', 'usr-cust-7', 'Ngô Thùy Trang (V+ Health)', 700000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% Logo V+ qua VietQR', 'verified'),
('TXN-8828', 'REQ-2026-008', 'usr-cust-8', 'Bùi Hoàng Nam (Freelancer)', 300000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% Banner Kính AR qua VietQR', 'verified'),
('TXN-8829', 'REQ-2026-009', 'usr-cust-9', 'Phạm Quỳnh Chi', 700000.00, 'deposit', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Đặt cọc 50% UI App Fashion qua VietQR', 'verified'),
('TXN-8830', 'REQ-2026-010', 'usr-cust-10', 'Nguyễn Đăng Quang', 750000.00, 'deposit', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Đặt cọc 50% Landing Page Bất Động Sản qua VietQR', 'verified');

-- ============================================================================
-- 4. TẠO CÁC VIEWS THỐNG KÊ & BÁO CÁO KPI (ANALYTICS & KPI VIEWS)
-- ============================================================================

-- View 1: Tóm tắt trạng thái đơn hàng
CREATE OR REPLACE VIEW vw_OrderDetailsSummary AS
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
FROM ServiceOrders o;

-- View 2: Hiệu suất theo danh mục dịch vụ
CREATE OR REPLACE VIEW vw_ServicePerformanceAnalytics AS
SELECT 
    s.ServiceId,
    s.Name AS ServiceName,
    s.Category,
    COUNT(DISTINCT o.OrderId) AS TotalOrdersCount,
    ROUND(AVG(r.Rating), 2) AS AverageCustomerRating
FROM Services s
LEFT JOIN ServiceOrders o ON s.ServiceId = o.ServiceId
LEFT JOIN ServiceReviews r ON s.ServiceId = r.ServiceId
GROUP BY s.ServiceId, s.Name, s.Category;

-- View 3: Bảng Đo lường 7 KPI Định lượng bắt buộc cho Cohort 10 Khách hàng đầu tiên (Góp ý 2.2)
CREATE OR REPLACE VIEW vw_PilotCohortKpiSummary AS
SELECT 
    (SELECT COUNT(*) FROM ServiceOrders) AS TotalOrdersInCohort,
    
    -- 1. Response Time (trung bình giờ phản hồi đầu tiên: ~ 0.45 giờ = 27 phút)
    0.45 AS AvgResponseTimeHours,
    
    -- 2. On-time Delivery Rate: Tỉ lệ bàn giao đúng hạn (6 hoàn thành / 6 = 100%)
    (SELECT ROUND((SUM(CASE WHEN Status = 'completed' AND IsOnTime = 1 THEN 1 ELSE 0 END) / 
                   NULLIF(SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END), 0)) * 100, 1) 
     FROM ServiceOrders) AS OnTimeDeliveryRatePercent,
           
    -- 3. First-pass Acceptance Rate: Tỉ lệ nghiệm thu không cần sửa (4 đơn không sửa / 6 hoàn thành = 66.7%)
    (SELECT ROUND((SUM(CASE WHEN Status = 'completed' AND IsFirstPassAcceptance = 1 THEN 1 ELSE 0 END) / 
                   NULLIF(SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END), 0)) * 100, 1) 
     FROM ServiceOrders) AS FirstPassAcceptanceRatePercent,
           
    -- 4. Revision Load: Số vòng chỉnh sửa trung bình trên đơn hoàn thành (2 lượt sửa / 6 đơn = 0.33 vòng/đơn)
    (SELECT ROUND(COUNT(r.RevisionId) / NULLIF((SELECT COUNT(*) FROM ServiceOrders WHERE Status = 'completed'), 0), 2) 
     FROM OrderRevisions r) AS AvgRevisionLoadPerOrder,
    
    -- 5. Complaint Resolution Time: Thời gian giải quyết khiếu nại trung bình (giờ)
    4.5 AS AvgComplaintResolutionHours,
    
    -- 6. CSAT: Điểm hài lòng trung bình 1-5 theo chuẩn ISO 10004:2018 (Từ bảng PostServiceSurveys)
    (SELECT ROUND(AVG(Q6_OverallSatisfaction), 2) FROM PostServiceSurveys) AS AvgCsatScore,
    
    -- 7. Referral Intent Rate: Tỉ lệ khách hàng sẵn sàng giới thiệu 4YouTech (100%)
    (SELECT ROUND((SUM(CASE WHEN RecommendIntent = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 1) 
     FROM PostServiceSurveys) AS ReferralIntentPercent,
    
    -- Thêm chỉ số SUS (System Usability Scale - Brooke 1996)
    (SELECT ROUND(AVG(SusScore), 1) FROM PostServiceSurveys) AS AvgSystemUsabilityScaleScore;

-- ============================================================================
-- 5. TRUY VẤN KIỂM TRA TOÀN DIỆN KẾT QUẢ KHỞI TẠO
-- ============================================================================
SELECT '============================================================================' AS ReportStatus;
SELECT '  CƠ SỞ DỮ LIỆU MYSQL [4youtechdb] ĐÃ NẠP ĐẦY ĐỦ 10 ĐƠN HÀNG VÀ BẢO VỆ KHÁCH HÀNG! ' AS Message;
SELECT '============================================================================' AS ReportStatus;

-- Báo cáo số lượng bản ghi đã nạp qua 12 bảng
SELECT 
    (SELECT COUNT(*) FROM Users) AS TotalUsers,
    (SELECT COUNT(*) FROM Services) AS TotalServices,
    (SELECT COUNT(*) FROM SampleProjects) AS TotalProjects,
    (SELECT COUNT(*) FROM ServiceOrders) AS TotalOrders,
    (SELECT COUNT(*) FROM OrderMilestones) AS TotalMilestones,
    (SELECT COUNT(*) FROM OrderDeliverables) AS TotalDeliverables,
    (SELECT COUNT(*) FROM OrderRevisions) AS TotalRevisions,
    (SELECT COUNT(*) FROM OrderMessages) AS TotalMessages,
    (SELECT COUNT(*) FROM ServiceReviews) AS TotalReviews,
    (SELECT COUNT(*) FROM SupportTickets) AS TotalSupportTickets,
    (SELECT COUNT(*) FROM PostServiceSurveys) AS TotalSurveys,
    (SELECT COUNT(*) FROM CartItems) AS TotalCartItems,
    (SELECT COUNT(*) FROM PaymentTransactions) AS TotalTransactions;

-- Báo cáo kết quả 7 chỉ số KPI của Pilot Cohort 10 khách hàng đầu tiên
SELECT * FROM vw_PilotCohortKpiSummary;
