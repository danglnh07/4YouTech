-- ============================================================================
-- DỰ ÁN: 4YOUTECH PLATFORM DATABASE SCHEMA & SEED DATA (MYSQL / MYSQL WORKBENCH)
-- Hệ thống cung cấp Dịch vụ IT, Thiết kế Web Portfolio, ERD Database & Graphic Design
-- Sử dụng cho: MySQL Workbench, phpMyAdmin, XAMPP, MariaDB
-- Database Name: 4youtechdb
-- ============================================================================

CREATE DATABASE IF NOT EXISTS 4youtechdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE 4youtechdb;

-- 1. XÓA BẢNG NẾU ĐÃ TỒN TẠI (Theo thứ tự ngược lại của khóa ngoại)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS PaymentTransactions;
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
DROP VIEW IF EXISTS vw_OrderDetailsSummary;
DROP VIEW IF EXISTS vw_ServicePerformanceAnalytics;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 2. KHỞI TẠO CÁC BẢNG DỮ LIỆU (TABLES CREATION)
-- ============================================================================

-- Bảng 1: Người dùng (Users - Khách hàng, Nhân viên, Admin)
CREATE TABLE IF NOT EXISTS Users (
    UserId          VARCHAR(100) PRIMARY KEY,
    Name            VARCHAR(255) NOT NULL,
    Email           VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash    VARCHAR(255) NULL,
    Role            VARCHAR(50) NOT NULL DEFAULT 'customer',
    Phone           VARCHAR(50) NULL,
    SkillsJson      TEXT NULL, -- Lưu danh sách kỹ năng của Staff dưới dạng JSON Array
    AvatarUrl       TEXT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'active',
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng 2: Catalog Dịch vụ (Services)
CREATE TABLE IF NOT EXISTS Services (
    ServiceId       VARCHAR(100) PRIMARY KEY,
    Name            VARCHAR(255) NOT NULL,
    Description     TEXT NOT NULL,
    Category        VARCHAR(50) NOT NULL DEFAULT 'IT',
    EstimatedDays   INT NULL,
    MaxDays         INT NULL,
    EstimatedPrice  DECIMAL(18, 2) NULL,
    MaxPrice        DECIMAL(18, 2) NULL,
    MaxRevisions    INT NOT NULL DEFAULT 3,
    ScopeOutput     TEXT NOT NULL,
    SupportType     VARCHAR(50) NOT NULL DEFAULT 'Online',
    DemoImagesJson  TEXT NULL, -- JSON Array hình ảnh sản phẩm mẫu
    IsHidden        TINYINT(1) NOT NULL DEFAULT 0, -- 1: Ẩn dịch vụ khỏi Catalog
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
);

-- Bảng 4: Đơn hàng & Yêu cầu Dịch vụ (ServiceOrders)
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
    WorkEstimateJson        TEXT NULL,
    QuotationJson           TEXT NULL,
    PaymentInfoJson         TEXT NULL,
    AssignedStaffId         VARCHAR(100) NULL,
    AssignedStaffName       VARCHAR(255) NULL,
    CollaboratorsJson       TEXT NULL,
    MilestonesJson          TEXT NULL,
    DeliverablesJson        TEXT NULL,
    RevisionsJson           TEXT NULL,
    SupportTicketsJson      TEXT NULL,
    CancellationJson        TEXT NULL,
    IsBeingEdited           TINYINT(1) NOT NULL DEFAULT 0,
    EditingNote             TEXT NULL,
    CreatedAt               DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt               DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerId) REFERENCES Users(UserId) ON DELETE CASCADE
);

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
);

-- Bảng 6: Sản phẩm Bàn giao (OrderDeliverables)
CREATE TABLE IF NOT EXISTS OrderDeliverables (
    DeliverableId   VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    Version         INT NOT NULL DEFAULT 1,
    Title           VARCHAR(255) NOT NULL,
    FileLink        TEXT NOT NULL,
    PreviewUrl      TEXT NULL,
    Notes           TEXT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'pending',
    Timestamp       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

-- Bảng 7: Yêu cầu Chỉnh sửa (OrderRevisions)
CREATE TABLE IF NOT EXISTS OrderRevisions (
    RevisionId      VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    Version         INT NOT NULL,
    Feedback        TEXT NOT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'pending',
    RequestedAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

-- Bảng 8: Tin nhắn Trực tiếp (OrderMessages)
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
);

-- Bảng 9: Đánh giá Dịch vụ từ Khách hàng (ServiceReviews)
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
);

-- Bảng 10: Ticket Hỗ trợ & Khiếu nại (SupportTickets)
CREATE TABLE IF NOT EXISTS SupportTickets (
    TicketId            VARCHAR(100) PRIMARY KEY,
    OrderId             VARCHAR(100) NOT NULL,
    CustomerId          VARCHAR(100) NULL,
    CustomerName        VARCHAR(255) NOT NULL,
    CustomerEmail       VARCHAR(255) NOT NULL,
    Subject             VARCHAR(255) NOT NULL,
    Content             TEXT NOT NULL,
    Type                VARCHAR(50) NOT NULL DEFAULT 'support',
    Status              VARCHAR(50) NOT NULL DEFAULT 'open',
    AssignedStaffId     VARCHAR(100) NULL,
    AssignedStaffName   VARCHAR(255) NULL,
    Response            TEXT NULL,
    CreatedAt           DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

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
);

-- Bảng 12: Lịch sử Giao dịch Thanh toán VietQR & VNPay (PaymentTransactions)
CREATE TABLE IF NOT EXISTS PaymentTransactions (
    TransactionId   VARCHAR(100) PRIMARY KEY,
    OrderId         VARCHAR(100) NOT NULL,
    CustomerId      VARCHAR(100) NULL,
    CustomerName    VARCHAR(255) NOT NULL,
    Amount          DECIMAL(18, 2) NOT NULL,
    PaymentType     VARCHAR(50) NOT NULL DEFAULT 'deposit',
    PaymentMethod   VARCHAR(50) NOT NULL DEFAULT 'VietQR',
    VnpTxnRef       VARCHAR(100) NULL,
    VnpBankCode     VARCHAR(50) NULL,
    VnpResponseCode VARCHAR(50) NULL,
    ReceiptImage    TEXT NULL,
    Note            TEXT NULL,
    Status          VARCHAR(50) NOT NULL DEFAULT 'pending',
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

-- ============================================================================
-- 3. NẠP DỮ LIỆU MẪU BAN ĐẦU (SEED DATA INSERTIONS)
-- ============================================================================

-- Seed Người Dùng (Users)
INSERT INTO Users (UserId, Name, Email, PasswordHash, Role, Phone, SkillsJson, AvatarUrl, Status) VALUES
('usr-guest', 'Khách xem', 'guest@4youtech.com', NULL, 'guest', NULL, NULL, NULL, 'active'),
('usr-cust-1', 'Nguyễn Văn An', 'an.nguyen@student.edu.vn', 'hash_1b932c0', 'customer', '0912345678', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-cust-2', 'Lê Minh Tuấn (CLB IT)', 'tuan.le@clbit.org', 'hash_1b932c0', 'customer', '0987654321', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-staff-it', 'Trần Bảo IT', 'bao.it@4youtech.com', 'hash_2c810d1', 'staff', '0901112233', '["Next.js", "Node.js", "Database", "System Architecture"]', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-staff-des', 'Phạm Hà Design', 'ha.design@4youtech.com', 'hash_2c810d1', 'staff', '0904445566', '["Figma UI/UX", "Branding", "Banner/Poster", "Motion Graphic"]', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'active'),
('usr-admin', 'Quản trị viên 4YouTech', 'admin@4youtech.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin', '0999888777', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'active');

-- Seed Catalog Dịch Vụ (Services)
INSERT INTO Services (ServiceId, Name, Description, Category, EstimatedDays, EstimatedPrice, MaxRevisions, ScopeOutput, SupportType, DemoImagesJson, IsHidden) VALUES
('it-lap-trinh-portfolio', 'Lập trình Portfolio', 'Lập trình website portfolio cá nhân tối ưu SEO, giao diện cá tính, responsive chuẩn di động & web.', 'IT', 3, 1000000.00, 3, 'Mã nguồn Next.js/React, Chuẩn Responsive Mobile/Tablet, Hướng dẫn quản trị & Deploy Vercel/Netlify miễn phí.', 'Online', '["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"]', 0),
('it-thiet-ke-web', 'Thiết kế Web', 'Xây dựng & lập trình website doanh nghiệp, trang bán hàng, landing page hiện đại, chuẩn SEO & tối ưu tốc độ.', 'IT', 5, 1500000.00, 4, 'Fullstack Website, Tích hợp CMS Quản lý nội dung, Form liên hệ, Chuẩn SEO Google & Security.', 'Hybrid', '["https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"]', 0),
('it-ui-ux', 'UI/UX', 'Nghiên cứu hành vi người dùng, vẽ Wireframe, thiết kế Prototype tương tác & lập trình giao diện Web/App mượt mà.', 'IT', 4, 1200000.00, 3, 'Wireframe UI/UX, Prototype tương tác Figma, Component Design System & Code Front-end.', 'Online', '["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"]', 0),
('it-test-loi-phan-mem', 'Test lỗi phần mềm', 'Kiểm thử phần mềm (Manual & Automation Testing), rà soát lỗi UI/UX, bảo mật, hiệu năng & xuất báo cáo chi tiết.', 'IT', 2, 500000.00, 2, 'Báo cáo Test Case (Excel/PDF), Danh sách Bug Log, Video/Hình ảnh minh chứng lỗi & Đề xuất khắc phục.', 'Online', '["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"]', 0),
('design-thiet-ke-ui', 'Thiết kế UI', 'Thiết kế Giao diện người dùng (User Interface) sắc nét, hiện đại trên Figma dành cho Website & Mobile App.', 'Design', 3, 1000000.00, 3, 'File Figma Master, Bộ Style Guide (Màu sắc, Typography, Icons), Export PNG/SVG assets.', 'Online', '["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"]', 0),
('design-logo', 'Logo', 'Thiết kế Logo nhận diện thương hiệu độc quyền, sáng tạo ấn tượng, kèm Brand Guidelines & file Vector gốc.', 'Design', 2, 600000.00, 3, 'File Vector AI/PSD/PNG/SVG, Logo Mockup thực tế, Hướng dẫn quy chuẩn sử dụng Logo.', 'Online', '["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80","/images/logo-phin-coffee.png","/images/logo-ladybug-or.png"]', 0),
('design-banner', 'Banner', 'Thiết kế Banner quảng cáo, banner website, mạng xã hội (Facebook/Zalo/Instagram) bắt mắt, chuẩn tỷ lệ.', 'Design', 1, 300000.00, 2, 'File thiết kế Vector/PSD, File ảnh xuất chất lượng cao (PNG/JPG/WebP), Banner kích thước chuẩn.', 'Online', '["/images/banner-y-te.png","/images/banner-mat-kinh.png","/images/banner-dau-tu.png"]', 0),
('design-poster', 'Poster', 'Thiết kế Poster sự kiện, poster truyền thông, nghệ thuật độ phân giải cao dành cho in ấn & đăng tải truyền thông.', 'Design', 2, 400000.00, 3, 'File in ấn PDF/TIFF chất lượng cao, File ảnh PNG/JPG truyền thông, Mockup poster thực tế.', 'Online', '["/images/poster-avocado.png","/images/poster-longan.png","/images/poster-ocean.jpg"]', 0);

-- Seed Dự Án Mẫu Showcase (SampleProjects)
INSERT INTO SampleProjects (ProjectId, Name, Category, SubCategory, Description, ImageUrl, DemoLink, IsFeatured) VALUES
('proj-1', 'Website Đặt Sân & Quản Lý Sự Kiện Sinh Viên', 'IT', 'Web Development', 'Hệ thống Web Fullstack hỗ trợ CLB trường đặt lịch sự kiện, thanh toán và quản lý thành viên.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', 'https://demo.4youtech.com/student-event', 1),
('proj-2', 'Bộ Giao diện UI App Sức Khỏe & Thể Thao', 'Design', 'UI/UX Design', 'Thiết kế UI/UX 18 màn hình phong cách Glassmorphism màu neon dành cho gen Z.', 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80', 'https://figma.com/file/demo-fitness-ui', 1),
('proj-3', 'Phân Tích ERD & Hệ Thống E-Commerce Chuyên Sâu', 'IT', 'Database Design', 'Thiết kế CSDL SQL gồm 32 bảng chuẩn hóa 3NF xử lý đơn hàng, kho và khuyến mãi.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', 'https://dbdiagram.io/d/demo-ecommerce', 0),
('proj-4', 'Bộ Nhận Diện Thương Hiệu CLB Sáng Tạo TechClub', 'Design', 'Branding', 'Logo, Brand Guidelines, Template slide thuyết trình và 10 mẫu poster truyền thông.', 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&auto=format&fit=crop&q=80', 'https://behance.net/gallery/techclub-brand', 1),
('proj-banner-yte', 'Banner Quảng Cáo Trung Tâm Y Tế & Chăm Sóc Sức Khỏe Gia Đình', 'Design', 'Banner', 'Banner quảng cáo cho chủ đề chăm sóc sức khỏe gia đình và lối sống lành mạnh, năng động, mang lại cảm giác tươi mới và giàu sức sống ngay từ cái nhìn đầu tiên. Nhờ sự kết hợp giữa màu xanh ngọc cùng với hình ảnh lá cây, biểu tượng dấu cộng y tế cùng hình ảnh các nhân vật hoạt hình đang tích cực vận động, banner truyền tải tinh thần tích cực, sự tận tâm và cảm giác được bảo vệ, đồng hành toàn diện cho sức khỏe của cả gia đình.', '/images/banner-y-te.png', '/images/banner-y-te.png', 1),
('proj-banner-matkinh', 'Banner Quảng Cáo Mắt Kính Thông Minh AR & Bluetooth', 'Design', 'Banner', 'Banner mang chủ đề giới thiệu sản phẩm công nghệ đeo thông minh thế hệ mới, tập trung vào khả năng kết nối và hỗ trợ tiện ích rảnh tay cho người dùng. Tổng thể thiết kế tỏa ra cảm giác hiện đại, tối giản và tinh tế. Nền trắng sáng kết hợp với xanh lam nhạt và gọng kính đen sắc nét tạo nên một không gian thị giác sạch sẽ và hi-tech, mang lại cho người xem sự tin tưởng vào tính sáng tạo, tiện nghi và đột phá của sản phẩm.', '/images/banner-mat-kinh.png', '/images/banner-mat-kinh.png', 1),
('proj-banner-dautu', 'Banner Truyền Thông Dịch Vụ Đầu Tư Tài Chính & Bất Động Sản', 'Design', 'Banner', 'Banner hướng đến chủ đề giải pháp tài chính và dịch vụ tư vấn đầu tư sinh lời bền vững. Banner này mang đến sự uy tín và chuyên nghiệp. Phông nền xanh navy trầm kết hợp cùng các gam màu tương phản mạnh như vàng kim của tiền tài và xanh lá của sự tăng trưởng tạo nên một cảm giác đáng tin. Sự xuất hiện của các biểu tượng đồ thị stock và đồng vàng làm tăng thêm cảm giác tài sản và thịnh vượng về một tương lai tài chính vững vàng.', '/images/banner-dau-tu.png', '/images/banner-dau-tu.png', 1),
('proj-poster-avocado', 'Poster Truyền Thông Sản Phẩm Trái Bơ Nông Sản Sạch (Avocado)', 'Design', 'Poster', 'Poster quảng cáo trái bơ "FRUIT AVOCADO" được thiết kế theo phong cách hiện đại, tối giản và vô cùng sang trọng. Cận cảnh nửa quả bơ tươi ngon với phần thịt quả xanh bơ mịn màng, hạt bơ tròn màu nâu bóng ở chính giữa và lớp vỏ xanh đậm tự nhiên, gợi cảm giác béo ngậy và giàu dinh dưỡng. Chữ "FRUIT" màu đen thanh lịch nằm phía trên. Tên sản phẩm "AVOCADO" được in hoa, nét chữ nghệ thuật uốn lượn màu vàng rực rỡ, chiếm vị trí trung tâm vô cùng thu hút. Sử dụng tông màu vàng mù tạt / vàng đất làm chủ đạo ở nửa trên, kết hợp cùng sắc đen xám ở giữa và nền xanh lá / nâu tự nhiên ở nửa dưới.', '/images/poster-avocado.png', '/images/poster-avocado.png', 1),
('proj-poster-longan', 'Poster Quảng Báo Trái Cây Nhiệt Đới Việt Nam - Quả Nhãn (Longan)', 'Design', 'Poster', 'Poster quảng cáo trái nhãn "tropical fruit LONGAN" được thiết kế vô cùng bắt mắt, hiện đại và tràn đầy cảm hứng tự nhiên. Sử dụng hình ảnh tán cây nhãn sai trĩu quả dưới ánh nắng vàng nhẹ, tạo cảm giác xanh tươi, tự nhiên và ngập tràn không khí nhiệt đới. Cận cảnh một quả nhãn đã bóc vỏ, để lộ phần cơm nhãn trắng trong, mọng nước cùng hạt đen bên trong, tạo ấn tượng thị giác vô cùng kích thích vị giác.', '/images/poster-longan.png', '/images/poster-longan.png', 1),
('proj-poster-ocean', 'Poster Truyền Thông Bảo Vệ Đại Dương & Sinh Vật Biển (Adaptation)', 'Design', 'Poster', 'Poster với thông điệp cảnh tỉnh về môi trường được thể hiện với phong cách như hình chụp. Trung tâm bức ảnh là một con cá đang bơi lội giữa lòng đại dương xanh nhưng phần đuôi tự nhiên của nó đã bị biến đổi, xoắn lại và chuyển dần thành một chiếc bọc nilon trong suốt với các xác cá chết trôi nổi xung quanh. Tone màu xanh lam đậm bao trùm không gian mang lại chiều sâu lặng lẽ.', '/images/poster-ocean.jpg', '/images/poster-ocean.jpg', 1),
('proj-logo-ladybug', 'Logo Monogram Chú Bọ Rùa Đỏ Cách Điệu (OR Monogram Ladybug Logo)', 'Design', 'Logo', 'Thiết kế Logo Monogram sáng tạo hình chú bọ rùa (Ladybug) sắc đỏ nổi bật, lồng ghép khéo léo 2 chữ cái OR. Phong cách đồ họa Vector hiện đại, đường nét mềm mại tinh tế, tượng trưng cho sự may mắn, tràn đầy sức sống và tinh thần sáng tạo đột phá.', '/images/logo-ladybug-or.png', '/images/logo-ladybug-or.png', 1),
('proj-logo-phin-coffee', 'Logo Thương Hiệu Cà Phê Quý Ông PHIN COFFEE', 'Design', 'Logo', 'Thiết kế Logo nhận diện thương hiệu PHIN COFFEE độc đáo, phối màu vàng chanh nổi bật kết hợp sắc nâu sẫm cà phê rang xay. Ý tưởng tạo hình phin cà phê truyền thống kết hợp chiếc mũ Fedora quý ông lịch lãm, tạo nên dấu ấn thương hiệu cà phê mộc đậm đà, sang trọng và cá tính.', '/images/logo-phin-coffee.png', '/images/logo-phin-coffee.png', 1),
('proj-logo-vplus-health', 'Logo Y Tế & Chăm Sóc Sức Khỏe Trái Tim V+ (V+ Medical & Health Logo)', 'Design', 'Logo', 'Thiết kế Logo thương hiệu trung tâm y tế & chăm sóc sức khỏe V+ biểu tượng hình trái tim kết hợp chiếc lá mầm xanh và dấu cộng y tế. Phối màu gradient chuyển sắc xanh lam - xanh lá dịu mát, truyền tải thông điệp về sự an tâm, yêu thương, tận tụy và sức sống vươn lên.', '/images/logo-vplus-health.png', '/images/logo-vplus-health.png', 1);

-- Seed Đơn Hàng (ServiceOrders)
INSERT INTO ServiceOrders (
    OrderId, ServiceId, ServiceName, Category, CustomerId, CustomerName, CustomerEmail, CustomerPhone,
    Requirements, AttachmentsJson, DesiredDeadline, Status, ProgressPercent, AssignedStaffId, AssignedStaffName,
    CollaboratorsJson, QuotationJson, PaymentInfoJson
) VALUES
(
    'REQ-2026-001', 'it-lap-trinh-portfolio', 'Lập trình Portfolio', 'IT/Design',
    'usr-cust-1', 'Nguyễn Văn An', 'an.nguyen@student.edu.vn', '0912345678',
    'Cần xây dựng website portfolio cá nhân 5 trang (Trang chủ, Giới thiệu, Dự án, Kỹ năng, Liên hệ). Giao diện tối màu hiện đại, responsive tốt.',
    '["https://dribbble.com/shots/example-portfolio-ref"]', '2026-10-05', 'in_progress', 65,
    'usr-staff-it', 'Trần Bảo IT', '["Phạm Hà Design"]',
    '{"amount":1800000,"finalDeadline":"2026-10-04","maxRevisions":4,"scopeDetails":"Gồm file thiết kế Figma + Source code Next.js + Deploy Vercel.","issuedAt":"2026-09-15 10:00"}',
    '{"amountPaid":900000,"paymentMethod":"VNPay","paymentStatus":"verified","receiptImage":"https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80","note":"Khách đã đặt cọc 50% qua VNPay Sandbox"}'
),
(
    'REQ-2026-002', 'design-banner', 'Banner Quảng Cáo', 'Design',
    'usr-cust-2', 'Lê Minh Tuấn (CLB IT)', 'tuan.le@clbit.org', '0987654321',
    'Cần thiết kế Banner và Poster cho cuộc thi Hackathon Sinh viên 2026. Màu sắc chủ đạo: Xanh Neon + Tím.',
    NULL, '2026-09-28', 'deliverable_sent', 90,
    'usr-staff-des', 'Phạm Hà Design', NULL,
    '{"amount":700000,"finalDeadline":"2026-09-27","maxRevisions":3,"scopeDetails":"Gồm 1 Poster 4k + 2 Banner Facebook + File vector thiết kế gốc.","issuedAt":"2026-09-18 11:00"}',
    '{"amountPaid":700000,"paymentMethod":"VietQR","paymentStatus":"verified","receiptImage":"https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80","note":"Đã thanh toán full 100%"}'
),
(
    'REQ-2026-003', 'it-ui-ux', 'Hỗ trợ Thiết kế Cơ sở dữ liệu & ERD', 'IT',
    'usr-cust-1', 'Nguyễn Văn An', 'an.nguyen@student.edu.vn', '0912345678',
    'Cần hỗ trợ vẽ sơ đồ ERD và chuẩn hóa CSDL cho ứng dụng quản lý thư viện sách trực tuyến.',
    NULL, '2026-10-10', 'submitted', 10,
    NULL, NULL, NULL,
    NULL, NULL
);

-- Seed Cột mốc Đơn hàng (OrderMilestones)
INSERT INTO OrderMilestones (MilestoneId, OrderId, Title, TargetDate, IsCompleted, UpdatedBy) VALUES
('m1-1', 'REQ-2026-001', 'Chốt phạm vi & Thiết kế Wireframe', '2026-09-18', 1, 'Trần Bảo IT'),
('m1-2', 'REQ-2026-001', 'Hoàn thiện Figma UI Design', '2026-09-22', 1, 'Phạm Hà Design'),
('m1-3', 'REQ-2026-001', 'Lập trình Web Front-end', '2026-09-30', 0, 'Trần Bảo IT'),
('m1-4', 'REQ-2026-001', 'Nghiệm thu & Bàn giao source code', '2026-10-04', 0, 'Admin'),
('m2-1', 'REQ-2026-002', 'Phác thảo concept ấn phẩm', '2026-09-20', 1, 'Phạm Hà Design'),
('m2-2', 'REQ-2026-002', 'Xuất file thiết kế demo v1', '2026-09-24', 1, 'Phạm Hà Design');

-- Seed Sản Phẩm Bàn Giao (OrderDeliverables)
INSERT INTO OrderDeliverables (DeliverableId, OrderId, Version, Title, FileLink, PreviewUrl, Notes, Status) VALUES
('del-1', 'REQ-2026-001', 1, 'Bản thiết kế UI Figma v1', 'https://figma.com/file/demo-v1', 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80', 'Đã thiết kế xong 5 màn hình cơ bản theo đúng yêu cầu màu tối.', 'accepted'),
('del-2', 'REQ-2026-002', 1, 'Bộ Poster & Banner Hackathon v1', 'https://drive.google.com/demo-poster-v1', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80', 'Gửi bản thử hình ảnh độ phân giải cao. Khách kiểm tra thông tin sự kiện giúp nhóm nhé.', 'pending');

-- Seed Chat Messages
INSERT INTO OrderMessages (MessageId, OrderId, SenderId, SenderName, SenderRole, Text) VALUES
('msg-1', 'REQ-2026-001', 'usr-cust-1', 'Nguyễn Văn An', 'customer', 'Chào nhóm 4YouTech, cho mình hỏi tiến độ làm web thế nào rồi ạ?'),
('msg-2', 'REQ-2026-001', 'usr-staff-it', 'Trần Bảo IT', 'staff', 'Chào An! Nhóm đã hoàn thành xong bản UI Figma v1 và đang tiến hành code phần Front-end bạn nhé.');

-- Seed Đánh Giá (ServiceReviews)
INSERT INTO ServiceReviews (ReviewId, OrderId, ServiceId, ServiceName, CustomerName, Rating, Comment, Moderated) VALUES
('rev-1', 'REQ-2026-001', 'it-lap-trinh-portfolio', 'Lập trình Portfolio', 'Hoàng Kim Ngân', 5, 'Nhóm làm việc rất nhiệt tình, code đẹp đúng thiết kế Figma của mình, giao đúng hạn trước 1 ngày!', 1),
('rev-2', 'REQ-2026-002', 'design-banner', 'Banner Quảng Cáo', 'Đỗ Quốc Việt', 5, 'Giao diện hiện đại, phối màu sinh động. Sẽ ủng hộ 4YouTech trong các đồ án tiếp theo!', 1);

-- Seed Giao Dịch Thanh Toán (PaymentTransactions)
INSERT INTO PaymentTransactions (TransactionId, OrderId, CustomerId, CustomerName, Amount, PaymentType, PaymentMethod, VnpTxnRef, VnpBankCode, VnpResponseCode, ReceiptImage, Note, Status) VALUES
('TXN-8821', 'REQ-2026-001', 'usr-cust-1', 'Nguyễn Văn An', 900000.00, 'deposit', 'VNPay', 'VNP20269910', 'NCB', '00', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Đặt cọc 50% qua VNPay Sandbox (Ngân hàng NCB)', 'verified'),
('TXN-8822', 'REQ-2026-002', 'usr-cust-2', 'Lê Minh Tuấn (CLB IT)', 700000.00, 'full', 'VietQR', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% full đơn Hackathon qua VietQR MBBank', 'verified');

-- ============================================================================
-- 4. TẠO CÁC VIEWS BÁO CÁO THỐNG KÊ (ANALYTICS VIEWS)
-- ============================================================================

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
    o.CreatedAt,
    o.DesiredDeadline
FROM ServiceOrders o;

CREATE OR REPLACE VIEW vw_ServicePerformanceAnalytics AS
SELECT 
    s.ServiceId,
    s.Name AS ServiceName,
    s.Category,
    COUNT(o.OrderId) AS TotalOrdersCount,
    AVG(r.Rating) AS AverageCustomerRating
FROM Services s
LEFT JOIN ServiceOrders o ON s.ServiceId = o.ServiceId
LEFT JOIN ServiceReviews r ON s.ServiceId = r.ServiceId
GROUP BY s.ServiceId, s.Name, s.Category;

-- ============================================================================
-- XÁC NHẬN HOÀN TẤT
-- ============================================================================
SELECT '================================================----------------------------' AS Message;
SELECT '  CƠ SỞ DỮ LIỆU MYSQL [4youtechdb] ĐÃ ĐƯỢC THIẾT KẾ VÀ NẠP DỮ LIỆU MẪU THÀNH CÔNG!   ' AS Status;
SELECT '================================================----------------------------' AS Message;
