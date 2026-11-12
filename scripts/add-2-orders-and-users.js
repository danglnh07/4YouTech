const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "090504",
    database: "4youtechdb"
  });

  const passwordHash = "hash_3650c942"; // hashPassword("090504@Th")

  // 1. Insert 2 Users
  console.log("--> Inserting 2 Users (Trần Hoàng Phúc & Nguyễn Thanh Nhã)...");
  await conn.query(`
    INSERT INTO users (UserId, Name, Email, PasswordHash, Role, Phone, AvatarUrl, Status)
    VALUES 
    (?, ?, ?, ?, 'customer', ?, ?, 'active'),
    (?, ?, ?, ?, 'customer', ?, ?, 'active')
    ON DUPLICATE KEY UPDATE 
      Name = VALUES(Name),
      Email = VALUES(Email),
      PasswordHash = VALUES(PasswordHash),
      Phone = VALUES(Phone),
      Status = VALUES(Status)
  `, [
    'usr-cust-phuc', 'Trần Hoàng Phúc', 'tranhoangphuc.dev@gmail.com', passwordHash, '0987908471', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'usr-cust-nha', 'Nguyễn Thanh Nhã', 'NhaNTCE181298@fpt.edu.vn', passwordHash, '0815479963', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  ]);

  // 2. Prepare JSONs
  const qJson1 = JSON.stringify({
    amount: 1500000,
    finalDeadline: "2026-11-25",
    maxRevisions: 3,
    scopeDetails: "Lập trình hoàn thiện website portfolio cá nhân từ giao diện tùy chỉnh, responsive hoàn hảo trên di động, deploy trực tiếp lên Netlify domain portfolio-hoangphuc.netlify.app.",
    issuedAt: "2026-11-18 09:30",
    deliverables: ["Full Source Code Next.js/React", "Deploy Netlify Production (portfolio-hoangphuc.netlify.app)", "Tài liệu bàn giao & Hướng dẫn cập nhật CV"],
    exclusions: ["Không bao gồm mua tên miền .com riêng"],
    acceptanceCriteria: ["Load dưới 1s", "Chuẩn SEO & Lighthouse 95+", "Đầy đủ 5 mục chính"],
    assignedLead: "Trần Bảo IT",
    supportPeriodDays: 30,
    remedyTerms: "Bảo hành code 30 ngày, fix bug kỹ thuật trong 24h."
  });

  const pInfoJson1 = JSON.stringify({
    amountPaid: 1500000,
    paymentMethod: "VietQR",
    paymentStatus: "verified",
    note: "Đã thanh toán 100% chi phí lập trình Portfolio (50% cọc + 50% nghiệm thu ngày 25/11/2026)"
  });

  const delivJson1 = JSON.stringify([{
    id: "del-11",
    version: 1,
    title: "Sản phẩm Portfolio hoàn thiện & Link Production Netlify",
    fileLink: "https://portfolio-hoangphuc.netlify.app",
    previewUrl: "/images/portfolio-trunghieu.jpg",
    notes: "Website đã deploy hoàn tất trên Netlify với link chính thức: https://portfolio-hoangphuc.netlify.app. Tối ưu SEO, tốc độ load siêu nhanh.",
    timestamp: "2026-11-24 16:30",
    status: "accepted"
  }]);

  const milesJson1 = JSON.stringify([
    { id: "m1", title: "Khảo sát yêu cầu & Lên Wireframe", completed: true, targetDate: "2026-11-19", updatedBy: "Trần Bảo IT" },
    { id: "m2", title: "Lập trình Front-end & Tích hợp Showcase", completed: true, targetDate: "2026-11-23", updatedBy: "Trần Bảo IT" },
    { id: "m3", title: "Nghiệm thu UAT & Deploy Netlify", completed: true, targetDate: "2026-11-25", updatedBy: "Quản trị viên 4YouTech" }
  ]);

  const uatJson1 = JSON.stringify({
    status: "passed",
    items: [
      { id: "u1", category: "functional", criteria: "Các hiệu ứng cuộn và showcase dự án mượt mà", passed: true },
      { id: "u2", category: "visual", criteria: "Màu sắc Dark Tech chuẩn theo yêu cầu cá nhân", passed: true },
      { id: "u3", category: "compatibility", criteria: "Tương thích tốt trên Chrome, Safari, mobile", passed: true },
      { id: "u4", category: "documentation", criteria: "Bàn giao mã nguồn sạch và link live Netlify", passed: true }
    ],
    testerName: "Trần Hoàng Phúc",
    submittedAt: "2026-11-25 10:00",
    feedbackNotes: "Sản phẩm quá đẹp, mượt mà và chuẩn theo đúng phong cách mình mong muốn! Link Netlify https://portfolio-hoangphuc.netlify.app chạy rất ổn định.",
    acceptanceSignoff: {
      confirmed: true,
      signedName: "Trần Hoàng Phúc",
      signedAt: "2026-11-25 10:00",
      ratingSatisfaction: 5,
      comment: "Biên bản nghiệm thu chính thức đã được ký xác nhận."
    }
  });

  const transferJson1 = JSON.stringify({
    isCompleted: true,
    sessionDate: "2026-11-25 14:00",
    meetLink: "https://meet.google.com/phuc-4youtech-transfer",
    videoRecordingUrl: "https://drive.google.com/transfer-recording-hoangphuc",
    docsUrl: "https://docs.4youtech.com/portfolio-handover",
    completedAt: "2026-11-25 15:00",
    customerConfirmed: true
  });

  const surveyJson1 = JSON.stringify({
    id: "srv-11",
    orderId: "REQ-2026-011",
    customerName: "Trần Hoàng Phúc",
    submittedAt: "2026-11-25 14:15",
    q1_scopeClarity: 5,
    q2_progressUpdate: 5,
    q3_deliverableQuality: 5,
    q4_revisionHandling: 5,
    q5_transferSession: 5,
    q6_overallSatisfaction: 5,
    recommendIntent: true,
    bestPoint: "Nhóm 4YouTech hỗ trợ rất nhiệt tình, code sạch, bàn giao link Netlify https://portfolio-hoangphuc.netlify.app chạy rất mượt và nhanh!",
    improvePoint: "Dịch vụ quá tốt, không có gì để chê!",
    susScore: 98.0
  });

  // Order 2 Data
  const qJson2 = JSON.stringify({
    amount: 1400000,
    finalDeadline: "2026-11-25",
    maxRevisions: 3,
    scopeDetails: "Lập trình website portfolio cá nhân chuẩn responsive, tối ưu điểm tuyển dụng CV, deploy hoàn thiện trên Netlify (https://portfolio-thanhnha.netlify.app).",
    issuedAt: "2026-11-19 10:30",
    deliverables: ["Full Source Code Next.js & Tailwind CSS", "Link website hoàn chỉnh (https://portfolio-thanhnha.netlify.app)", "Tài liệu HDSD & File nén Source code"],
    exclusions: ["Không mua domain riêng"],
    acceptanceCriteria: ["Responsive 100%", "Chuẩn CV tuyển dụng IT", "Tốc độ tải trang cao"],
    assignedLead: "Trần Bảo IT",
    supportPeriodDays: 30,
    remedyTerms: "Bảo hành mã nguồn 30 ngày."
  });

  const pInfoJson2 = JSON.stringify({
    amountPaid: 1400000,
    paymentMethod: "VietQR",
    paymentStatus: "verified",
    note: "Đã thanh toán 100% chi phí nghiệm thu ngày 25/11/2026"
  });

  const delivJson2 = JSON.stringify([{
    id: "del-12",
    version: 1,
    title: "Bàn giao Website Portfolio SV & Link Production",
    fileLink: "https://portfolio-thanhnha.netlify.app",
    previewUrl: "/images/portfolio-camly.png",
    notes: "Đã hoàn thành toàn bộ website portfolio cá nhân cho bạn Nhã. Link live chính thức: https://portfolio-thanhnha.netlify.app.",
    timestamp: "2026-11-24 17:00",
    status: "accepted"
  }]);

  const milesJson2 = JSON.stringify([
    { id: "m1", title: "Phân tích yêu cầu & Cấu trúc CV", completed: true, targetDate: "2026-11-20", updatedBy: "Trần Bảo IT" },
    { id: "m2", title: "Lập trình giao diện Modern Tech", completed: true, targetDate: "2026-11-23", updatedBy: "Trần Bảo IT" },
    { id: "m3", title: "Nghiệm thu UAT & Bàn giao Netlify", completed: true, targetDate: "2026-11-25", updatedBy: "Quản trị viên 4YouTech" }
  ]);

  const uatJson2 = JSON.stringify({
    status: "passed",
    items: [
      { id: "u1", category: "functional", criteria: "Các liên kết Github và Demo dự án hoạt động chính xác", passed: true },
      { id: "u2", category: "visual", criteria: "Giao diện hiện đại, bố cục CV ấn tượng", passed: true },
      { id: "u3", category: "compatibility", criteria: "Hiển thị tốt trên laptop và điện thoại", passed: true }
    ],
    testerName: "Nguyễn Thanh Nhã",
    submittedAt: "2026-11-25 10:30",
    feedbackNotes: "Web xịn xò, các hiệu ứng animation rất ấn tượng. Nhà tuyển dụng xem qua đều khen chuyên nghiệp!",
    acceptanceSignoff: {
      confirmed: true,
      signedName: "Nguyễn Thanh Nhã",
      signedAt: "2026-11-25 10:30",
      ratingSatisfaction: 5,
      comment: "Đã kiểm tra kỹ trên điện thoại và laptop, nghiệm thu xuất sắc."
    }
  });

  const transferJson2 = JSON.stringify({
    isCompleted: true,
    sessionDate: "2026-11-25 15:30",
    meetLink: "https://meet.google.com/nha-4youtech-transfer",
    videoRecordingUrl: "https://drive.google.com/transfer-recording-thanhnha",
    docsUrl: "https://docs.4youtech.com/portfolio-guide-nha",
    completedAt: "2026-11-25 16:30",
    customerConfirmed: true
  });

  const surveyJson2 = JSON.stringify({
    id: "srv-12",
    orderId: "REQ-2026-012",
    customerName: "Nguyễn Thanh Nhã",
    submittedAt: "2026-11-25 15:45",
    q1_scopeClarity: 5,
    q2_progressUpdate: 5,
    q3_deliverableQuality: 5,
    q4_revisionHandling: 5,
    q5_transferSession: 5,
    q6_overallSatisfaction: 5,
    recommendIntent: true,
    bestPoint: "Tiến độ bàn giao đúng ngày 25/11, hỗ trợ kết nối domain Netlify https://portfolio-thanhnha.netlify.app cực kỳ nhanh gọn!",
    improvePoint: "Tiếp tục phát huy chất lượng!",
    susScore: 97.5
  });

  // 2. Insert 2 Service Orders
  console.log("--> Inserting 2 Service Orders (REQ-2026-011 & REQ-2026-012)...");
  await conn.query(`
    INSERT INTO serviceorders (
      OrderId, ServiceId, ServiceName, Category, 
      CustomerId, CustomerName, CustomerEmail, CustomerPhone, 
      Requirements, AttachmentsJson, DesiredDeadline, Status, ProgressPercent, 
      AssignedStaffId, AssignedStaffName, CollaboratorsJson, 
      FirstResponseAt, DeliverableSentAt, AcceptedAt, CompletedAt, 
      IsOnTime, IsFirstPassAcceptance, SupportPeriodEndAt,
      QuotationJson, PaymentInfoJson, TransferSessionJson,
      DeliverablesJson, MilestonesJson, UatSubmissionJson, PostServiceSurveyJson, CreatedAt
    ) VALUES 
    (
      'REQ-2026-011', 'it-lap-trinh-portfolio', 'Lập trình Portfolio', 'IT',
      'usr-cust-phuc', 'Trần Hoàng Phúc', 'tranhoangphuc.dev@gmail.com', '0987908471',
      'Cần thiết kế và lập trình website portfolio cá nhân cho lập trình viên full-stack, tích hợp showcase dự án, blog kỹ thuật và form liên hệ. Host chạy trên Netlify: https://portfolio-hoangphuc.netlify.app',
      '["https://portfolio-hoangphuc.netlify.app"]', '2026-11-25', 'completed', 100,
      'usr-staff-it', 'Trần Bảo IT', '["Phạm Hà Design"]',
      '2026-11-18 09:15', '2026-11-24 16:30', '2026-11-25 10:00', '2026-11-25 14:00',
      1, 1, '2026-12-25',
      ?, ?, ?, ?, ?, ?, ?, '2026-11-18 09:00:00'
    ),
    (
      'REQ-2026-012', 'it-lap-trinh-portfolio', 'Lập trình Portfolio', 'IT',
      'usr-cust-nha', 'Nguyễn Thanh Nhã', 'NhaNTCE181298@fpt.edu.vn', '0815479963',
      'Xây dựng website portfolio cá nhân phục vụ ứng tuyển thực tập sinh ngành Kỹ thuật Phần mềm (Software Engineering). Thiết kế phong cách Modern Tech, trình bày các đồ án môn học và chứng chỉ. Link bàn giao: https://portfolio-thanhnha.netlify.app',
      '["https://portfolio-thanhnha.netlify.app"]', '2026-11-25', 'completed', 100,
      'usr-staff-it', 'Trần Bảo IT', NULL,
      '2026-11-19 10:10', '2026-11-24 17:00', '2026-11-25 10:30', '2026-11-25 15:30',
      1, 1, '2026-12-25',
      ?, ?, ?, ?, ?, ?, ?, '2026-11-19 09:45:00'
    )
    ON DUPLICATE KEY UPDATE 
      ServiceName = VALUES(ServiceName),
      Requirements = VALUES(Requirements),
      Status = VALUES(Status),
      ProgressPercent = VALUES(ProgressPercent),
      DeliverableSentAt = VALUES(DeliverableSentAt),
      AcceptedAt = VALUES(AcceptedAt),
      CompletedAt = VALUES(CompletedAt),
      QuotationJson = VALUES(QuotationJson),
      PaymentInfoJson = VALUES(PaymentInfoJson),
      TransferSessionJson = VALUES(TransferSessionJson),
      DeliverablesJson = VALUES(DeliverablesJson),
      MilestonesJson = VALUES(MilestonesJson),
      UatSubmissionJson = VALUES(UatSubmissionJson),
      PostServiceSurveyJson = VALUES(PostServiceSurveyJson)
  `, [
    qJson1, pInfoJson1, transferJson1, delivJson1, milesJson1, uatJson1, surveyJson1,
    qJson2, pInfoJson2, transferJson2, delivJson2, milesJson2, uatJson2, surveyJson2
  ]);

  // 3. Insert into OrderDeliverables table
  console.log("--> Inserting into orderdeliverables...");
  await conn.query(`
    INSERT INTO orderdeliverables (DeliverableId, OrderId, Version, Title, FileLink, PreviewUrl, Notes, Timestamp, Status)
    VALUES 
    ('del-11', 'REQ-2026-011', 1, 'Sản phẩm Portfolio hoàn thiện & Link Production Netlify', 'https://portfolio-hoangphuc.netlify.app', '/images/portfolio-trunghieu.jpg', 'Website đã deploy hoàn tất trên Netlify: https://portfolio-hoangphuc.netlify.app', '2026-11-24 16:30:00', 'accepted'),
    ('del-12', 'REQ-2026-012', 1, 'Bàn giao Website Portfolio SV & Link Production', 'https://portfolio-thanhnha.netlify.app', '/images/portfolio-camly.png', 'Đã hoàn thành toàn bộ website portfolio cá nhân cho bạn Nhã: https://portfolio-thanhnha.netlify.app', '2026-11-24 17:00:00', 'accepted')
    ON DUPLICATE KEY UPDATE 
      FileLink = VALUES(FileLink),
      Status = VALUES(Status)
  `);

  // 4. Insert into PaymentTransactions table
  console.log("--> Inserting into paymenttransactions...");
  await conn.query(`
    INSERT INTO paymenttransactions (TransactionId, OrderId, CustomerId, CustomerName, Amount, PaymentType, PaymentMethod, VnpTxnRef, VnpBankCode, VnpResponseCode, ReceiptImage, Note, Status, CreatedAt)
    VALUES 
    ('TXN-8831', 'REQ-2026-011', 'usr-cust-phuc', 'Trần Hoàng Phúc', 1500000.00, 'full', 'VietQR', 'QR2026112501', 'MBBANK', '00', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% full đơn Lập trình Portfolio - Trần Hoàng Phúc ngày 25/11/2026', 'verified', '2026-11-25 10:15:00'),
    ('TXN-8832', 'REQ-2026-012', 'usr-cust-nha', 'Nguyễn Thanh Nhã', 1400000.00, 'full', 'VietQR', 'QR2026112502', 'VIETCOMBANK', '00', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 'Thanh toán 100% full đơn Lập trình Portfolio - Nguyễn Thanh Nhã ngày 25/11/2026', 'verified', '2026-11-25 10:45:00')
    ON DUPLICATE KEY UPDATE 
      Amount = VALUES(Amount),
      Status = VALUES(Status)
  `);

  // 5. Insert into ServiceReviews table
  console.log("--> Inserting 2 5-star reviews into servicereviews...");
  await conn.query(`
    INSERT INTO servicereviews (ReviewId, OrderId, ServiceId, ServiceName, CustomerName, Rating, Comment, Moderated, ReplyText, RepliedBy, RepliedAt, CreatedAt)
    VALUES 
    (
      'rev-11', 'REQ-2026-011', 'it-lap-trinh-portfolio', 'Lập trình Portfolio', 'Trần Hoàng Phúc', 5,
      'Team 4YouTech làm việc chuyên nghiệp, trang portfolio https://portfolio-hoangphuc.netlify.app của mình load cực nhanh và chuẩn responsive. Bàn giao đúng hẹn 25/11, nghiệm thu đạt 100% đánh giá 5 sao!',
      1, 'Cảm ơn bạn Hoàng Phúc đã tin tưởng ủng hộ 4YouTech! Chúc website portfolio mang lại nhiều cơ hội nghề nghiệp lớn cho bạn nhé.',
      'Quản trị viên 4YouTech', '2026-11-25 15:00:00', '2026-11-25 14:30:00'
    ),
    (
      'rev-12', 'REQ-2026-012', 'it-lap-trinh-portfolio', 'Lập trình Portfolio', 'Nguyễn Thanh Nhã', 5,
      'Website portfolio https://portfolio-thanhnha.netlify.app được các anh chị làm rất chỉn chu, giao diện hiện đại, nghiệm thu nhanh gọn trong ngày 25/11. Rất hài lòng!',
      1, 'Cảm ơn Thanh Nhã nhiều nhé! Chúc bạn pass kỳ thực tập và đạt kết quả xuất sắc!',
      'Quản trị viên 4YouTech', '2026-11-25 16:30:00', '2026-11-25 16:00:00'
    )
    ON DUPLICATE KEY UPDATE 
      Rating = VALUES(Rating),
      Comment = VALUES(Comment),
      Moderated = VALUES(Moderated)
  `);

  // 6. Insert PostServiceSurveys
  console.log("--> Inserting into postservicesurveys...");
  await conn.query(`
    INSERT INTO postservicesurveys (SurveyId, OrderId, CustomerName, SubmittedAt, Q1_ScopeClarity, Q2_ProgressUpdate, Q3_DeliverableQuality, Q4_RevisionHandling, Q5_TransferSession, Q6_OverallSatisfaction, RecommendIntent, BestPoint, ImprovePoint, SusScore)
    VALUES 
    ('srv-11', 'REQ-2026-011', 'Trần Hoàng Phúc', '2026-11-25 14:15:00', 5, 5, 5, 5, 5, 5, 1, 'Nhóm 4YouTech hỗ trợ rất nhiệt tình, code sạch, bàn giao link Netlify https://portfolio-hoangphuc.netlify.app chạy rất mượt và nhanh!', 'Dịch vụ quá tốt!', 98.00),
    ('srv-12', 'REQ-2026-012', 'Nguyễn Thanh Nhã', '2026-11-25 15:45:00', 5, 5, 5, 5, 5, 5, 1, 'Tiến độ bàn giao đúng ngày 25/11, hỗ trợ kết nối domain Netlify https://portfolio-thanhnha.netlify.app cực kỳ nhanh gọn!', 'Tiếp tục phát huy chất lượng!', 97.50)
    ON DUPLICATE KEY UPDATE 
      Q6_OverallSatisfaction = VALUES(Q6_OverallSatisfaction),
      SusScore = VALUES(SusScore)
  `);

  console.log("✅ HOÀN TẤT THÊM 2 ĐƠN HÀNG VÀ 2 TÀI KHOẢN VÀO MYSQL!");

  const [users] = await conn.query("SELECT UserId, Name, Email, PasswordHash FROM users WHERE UserId IN ('usr-cust-phuc', 'usr-cust-nha')");
  console.table(users);

  const [orders] = await conn.query("SELECT OrderId, CustomerName, ServiceName, Status, CompletedAt FROM serviceorders WHERE OrderId IN ('REQ-2026-011', 'REQ-2026-012')");
  console.table(orders);

  await conn.end();
}

main().catch((err) => {
  console.error("Lỗi:", err);
  process.exit(1);
});
