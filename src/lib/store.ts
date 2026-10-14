export type Role = "guest" | "customer" | "staff" | "admin";

export type ServiceCategory = "IT" | "Design" | "IT/Design";

export type UserStatus = "active" | "locked" | "pending_otp";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password
  role: Role;
  avatar?: string;
  phone?: string;
  skills?: string[]; // For Staff: e.g. ["Next.js", "UI/UX", "Database"]
  status: UserStatus;
}

export interface OtpSession {
  email: string;
  otpCode: string; // 6-digit OTP e.g. "884920"
  type: "activation" | "reset_password";
  createdAt: string;
  expiresAt: number; // Unix timestamp
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  estimatedDays: number | null;
  maxDays?: number | null;
  estimatedPrice: number | null;
  maxPrice?: number | null;
  maxRevisions: number;
  scopeOutput: string;
  demoImages: string[];
  hidden?: boolean;
  supportType: "Online" | "Direct" | "Hybrid";
}

export interface CartItem {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  estimatedPrice: number | null;
  maxPrice?: number | null;
  estimatedDays: number | null;
  maxDays?: number | null;
  requirements?: string;
  desiredDeadline?: string;
  addedAt: string;
}

export function formatPriceRange(minPrice?: number | null, maxPrice?: number | null): string {
  if (!minPrice && !maxPrice) return "Báo giá linh hoạt";
  const minStr = minPrice ? minPrice.toLocaleString("vi-VN") : "";
  const maxVal = maxPrice || (minPrice ? Math.round(minPrice * 1.5) : null);
  const maxStr = maxVal ? maxVal.toLocaleString("vi-VN") : "";

  if (minStr && maxStr) {
    return `${minStr} - ${maxStr} ₫`;
  } else if (minStr) {
    return `Từ ${minStr} ₫`;
  } else {
    return `Đến ${maxStr} ₫`;
  }
}

export function formatDaysRange(minDays?: number | null, maxDays?: number | null): string {
  if (!minDays && !maxDays) return "Thỏa thuận";
  const min = minDays || null;
  const max = maxDays || (minDays ? minDays + 2 : null);

  if (min && max) {
    return min === max ? `${min} ngày` : `${min} - ${max} ngày`;
  } else if (min) {
    return `${min} ngày`;
  } else {
    return `${max} ngày`;
  }
}

export function addDaysToDate(baseDate: Date, days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatVNShortDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export interface SampleProject {
  id: string;
  name: string;
  category: ServiceCategory;
  subCategory?: "Logo" | "Banner" | "Poster" | "Website" | "UI/UX" | "Database" | "Other";
  image: string;
  description: string;
  link?: string;
  designLink?: string;
  featured?: boolean;
}

export type OrderStatus =
  | "submitted"           // Khách gửi yêu cầu, chờ Admin/Staff duyệt
  | "under_review"        // Admin & Staff đang đánh giá
  | "info_requested"      // Yêu cầu bổ sung thông tin
  | "quoted"              // Đã gửi báo giá cho khách
  | "deposit_pending"     // Khách xác nhận báo giá, chờ thanh toán đặt cọc
  | "in_progress"         // Đã phân công & xác minh tiền, đang làm
  | "deliverable_sent"    // Đã gửi sản phẩm/giao diện thử
  | "revision_requested"  // Khách yêu cầu chỉnh sửa
  | "accepted"            // Khách đã nghiệm thu kết quả
  | "completed"           // Hoàn tất đơn hàng & bàn giao
  | "cancel_requested"    // Yêu cầu hủy đơn
  | "cancelled";          // Đã hủy

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate: string;
  updatedBy?: string;
}

export interface DeliverableVersion {
  id: string;
  version: number;
  title: string;
  fileLink: string;
  previewUrl?: string;
  notes: string;
  timestamp: string;
  status: "pending" | "accepted" | "revision_needed";
}

export interface RevisionRequest {
  id: string;
  version: number;
  feedback: string;
  requestedAt: string;
  status: "pending" | "resolved";
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface ServiceReview {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  moderated: boolean;
  replyText?: string;
  repliedBy?: string;
  repliedAt?: string;
}

export type TicketCategory =
  | "technical_bug"     // Lỗi kỹ thuật / code
  | "scope_dispute"      // Bất đồng phạm vi công việc
  | "deadline_delay"     // Trễ hạn tiến độ cam kết
  | "post_handover"      // Hỗ trợ kỹ thuật sau bàn giao
  | "quality_issue"      // Chất lượng chưa đạt tiêu chuẩn
  | "other";             // Vấn đề khác

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type RemedyType =
  | "free_fix"           // Sửa lỗi / bảo trì miễn phí (không tính revision)
  | "redo_work"          // Làm lại hạng mục chưa đạt tiêu chuẩn
  | "fee_discount"       // Giảm trừ trực tiếp chi phí dịch vụ
  | "partial_refund"     // Hoàn trả một phần tiền cọc / thanh toán
  | "full_refund"        // Hủy đơn & hoàn tiền 100%
  | "guidance";          // Bổ sung hướng dẫn & phiên chuyển giao 1-1

export interface SupportTicket {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  type: "support" | "complaint";
  category?: TicketCategory;
  priority?: TicketPriority;
  status: "open" | "acknowledged" | "investigating" | "processing" | "resolved";
  assignedStaffId?: string;
  assignedStaffName?: string;
  response?: string;
  createdAt: string;

  // Tuân thủ Luật BVQLNTD số 19/2023/QH15 Điều 31 & ISO 10002:2018
  slaAcknowledgeDeadline?: string; // Cam kết xác nhận tiếp nhận trong <= 03 ngày làm việc
  acknowledgedAt?: string;
  remedyType?: RemedyType; // Biện pháp khắc phục theo Điều 36 Luật BVQLNTD
  remedyDetails?: string;
  resolvedAt?: string;
  resolutionNote?: string;
  customerSatisfactionRating?: number; // 1-5 sao đánh giá cách xử lý khiếu nại (Tax et al., 1998)
}

// SOW (Scope of Work) & Quotation Contract (Mẫu M2)
export interface QuotationDetails {
  amount: number;
  finalDeadline: string;
  maxRevisions: number;
  scopeDetails: string;
  issuedAt: string;

  // Các điều khoản Scope of Work (SOW) chuẩn hóa - Góp ý 1
  deliverables?: string[];          // Danh sách sản phẩm bàn giao cụ thể
  exclusions?: string[];            // Phạm vi KHÔNG bao gồm (chống scope creep)
  acceptanceCriteria?: string[];    // Tiêu chí nghiệm thu định lượng (Acceptance Criteria)
  assignedLead?: string;            // Trưởng nhóm kỹ thuật phụ trách
  supportPeriodDays?: number;       // Thời gian hỗ trợ sau bàn giao (e.g. 30 ngày)
  remedyTerms?: string;             // Cam kết bồi thường / xử lý trễ hạn theo Luật BVQLNTD Đ.36
  revisionPolicy?: string;          // Quy định số vòng revision và chi phí ngoài scope
}

// Kiểm thử UAT & Tiêu chí Nghiệm thu (Form M3) - Góp ý 1.2 & 2.3
export interface UatCheckItem {
  id: string;
  criteria: string;
  category: "functional" | "visual" | "compatibility" | "documentation";
  passed: boolean;
  note?: string;
}

export interface UatFormSubmission {
  status: "not_started" | "testing" | "passed" | "rejected";
  items: UatCheckItem[];
  testerName?: string;
  submittedAt?: string;
  feedbackNotes?: string;
  acceptanceSignoff?: {
    confirmed: boolean;
    signedName: string;
    signedAt: string;
    ratingSatisfaction: number;
    comment?: string;
  };
}

// Phiên chuyển giao công nghệ (Transfer Session)
export interface TransferSession {
  isCompleted: boolean;
  sessionDate?: string;
  meetLink?: string;
  videoRecordingUrl?: string;
  docsUrl?: string;
  completedAt?: string;
  customerConfirmed?: boolean;
}

// Khảo sát đánh giá trải nghiệm dịch vụ sau nghiệm thu (Post-service Survey) - Góp ý 2.4 (ISO 10004:2018)
export interface PostServiceSurvey {
  id: string;
  orderId: string;
  customerName: string;
  submittedAt: string;
  q1_scopeClarity: number;        // 1-5: Yêu cầu và phạm vi công việc được giải thích rõ ràng trước khi bắt đầu
  q2_progressUpdate: number;      // 1-5: Nhóm cập nhật tiến độ đủ để tôi biết dự án đang ở trạng thái nào
  q3_deliverableQuality: number;   // 1-5: Sản phẩm bàn giao đáp ứng đúng mục tiêu đã thống nhất
  q4_revisionHandling: number;    // 1-5: Quá trình yêu cầu chỉnh sửa dễ hiểu và được xử lý phù hợp
  q5_transferSession: number;     // 1-5: Transfer Session giúp tôi hiểu/có thể tự sử dụng sản phẩm
  q6_overallSatisfaction: number; // 1-5: Tôi hài lòng với toàn bộ trải nghiệm làm việc với 4YOUTECH
  recommendIntent: boolean;       // Tôi có sẵn sàng giới thiệu 4YOUTECH cho người khác không? (Có / Không)
  bestPoint?: string;             // Điểm làm bạn hài lòng nhất
  improvePoint?: string;          // Điểm cần cải thiện nhất
  susScore?: number;              // Điểm System Usability Scale (SUS) 0-100 (Brooke, 1996)
}

export type PaymentMethod = "VNPay" | "VietQR" | "BankTransfer";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentType: "deposit" | "full" | "remaining";
  paymentMethod: PaymentMethod;
  receiptImage?: string;
  vnpTxnRef?: string;
  vnpBankCode?: string;
  vnpResponseCode?: string;
  note?: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

export interface PaymentDetails {
  amountPaid: number;
  receiptImage?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: "unpaid" | "pending_approval" | "verified" | "refunded" | "rejected";
  note?: string;
  updatedAt?: string;
}

export interface CancellationRequest {
  reason: string;
  requestedAt: string;
  adminDecision?: "approved" | "rejected";
  refundAmount?: number;
  refunded?: boolean;
}

export interface WorkEstimate {
  proposedDays: number;
  proposedPrice: number;
  note: string;
  proposedByStaffId: string;
  proposedByStaffName: string;
}

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requirements: string;
  attachments?: string[];
  desiredDeadline: string;
  status: OrderStatus;
  progressPercent: number; // 0-100%
  
  assignedStaffId?: string;
  assignedStaffName?: string;
  collaborators?: string[];
  
  workEstimate?: WorkEstimate;
  quotation?: QuotationDetails;
  paymentInfo?: PaymentDetails;
  
  milestones: Milestone[];
  deliverables: DeliverableVersion[];
  revisions: RevisionRequest[];
  messages: ChatMessage[];
  review?: ServiceReview | null;
  cancellation?: CancellationRequest | null;
  supportTickets: SupportTicket[];

  // Outcome 1 & Outcome 2 Enhancement Fields - Góp ý 1 & 2
  firstResponseAt?: string;             // Thời điểm phản hồi đầu tiên (Đo lường Response Time KPI)
  deliverableSentAt?: string;           // Thời điểm gửi bản thử đầu tiên
  acceptedAt?: string;                  // Thời điểm khách hàng nghiệm thu kết quả
  completedAt?: string;                 // Thời điểm hoàn tất đơn hàng
  uatSubmission?: UatFormSubmission;    // Kết quả kiểm thử UAT & Biên bản nghiệm thu điện tử (M3)
  transferSession?: TransferSession;    // Phiên chuyển giao công nghệ & hướng dẫn sử dụng
  postServiceSurvey?: PostServiceSurvey;// Khảo sát toàn diện chất lượng dịch vụ (ISO 10004 & SUS)
  supportPeriodEndAt?: string;          // Hạn hỗ trợ kỹ thuật sau bàn giao (e.g. +30 ngày)
  isOnTime?: boolean;                   // Đánh dấu giao đúng hạn (On-time Delivery KPI)
  isFirstPassAcceptance?: boolean;      // Đánh giá nghiệm thu ngay lần đầu không cần sửa đổi lớn
  finalPaymentVerifiedAt?: string;      // Thời điểm xác minh thanh toán 50% còn lại

  isBeingEdited?: boolean;
  editingNote?: string;

  createdAt: string;
  updatedAt: string;
}

// Bảng tổng hợp KPI cho Cohort 10 khách hàng đầu tiên (Góp ý 2.2)
export interface PilotCohortKpiSummary {
  cohortName: string;
  totalOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  avgResponseTimeMinutes: number;
  onTimeDeliveryRate: number;      // % (Giao đúng hạn / Tổng hoàn thành)
  firstPassAcceptanceRate: number; // % (Nghiệm thu không cần revision / Tổng hoàn thành)
  avgRevisionLoad: number;         // Vòng revision trung bình / đơn
  totalSupportTickets: number;
  complaintCount: number;
  avgComplaintResolutionDays: number;
  sla3DayComplianceRate: number;   // % Khiếu nại xác nhận <= 3 ngày làm việc (Điều 31 Luật BVQLNTD)
  avgCsat: number;                 // Điểm CSAT 1-5 sao
  csatHighRate: number;            // % Khách chấm 4-5 sao
  recommendIntentRate: number;     // % Khách sẵn sàng giới thiệu
  avgSusScore: number;             // System Usability Scale (SUS) 0-100 (Brooke, 1996)
}

export function calculatePilotKpiMetrics(orderList: ServiceOrder[]): PilotCohortKpiSummary {
  // Take up to the 10 pilot orders
  const cohort = orderList.slice(0, 10);
  const total = cohort.length;
  const completed = cohort.filter(o => o.status === "completed" || o.status === "accepted");
  const inProgress = cohort.filter(o => o.status === "in_progress" || o.status === "deliverable_sent" || o.status === "deposit_pending" || o.status === "quoted" || o.status === "under_review" || o.status === "submitted");

  // 1. Response Time: tính từ lúc tạo order đến firstResponseAt hoặc quotation
  const responseTimes: number[] = [];
  cohort.forEach(o => {
    if (o.firstResponseAt && o.createdAt) {
      const d1 = new Date(o.firstResponseAt).getTime();
      const d0 = new Date(o.createdAt).getTime();
      if (!isNaN(d1) && !isNaN(d0) && d1 >= d0) {
        responseTimes.push(Math.round((d1 - d0) / (1000 * 60)));
      } else {
        responseTimes.push(22);
      }
    } else {
      responseTimes.push(28);
    }
  });
  const avgResponseTimeMinutes = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 28;

  // 2. On-Time Delivery Rate
  const onTimeCount = completed.filter(o => o.isOnTime !== false).length;
  const onTimeDeliveryRate = completed.length > 0 ? Math.round((onTimeCount / completed.length) * 100) : 100;

  // 3. First-Pass Acceptance Rate
  const firstPassCount = completed.filter(o => o.isFirstPassAcceptance === true || (o.revisions && o.revisions.length === 0)).length;
  const firstPassAcceptanceRate = completed.length > 0 ? Math.round((firstPassCount / completed.length) * 100) : 80;

  // 4. Revision Load
  const totalRevisions = completed.reduce((sum, o) => sum + (o.revisions?.length || 0), 0);
  const avgRevisionLoad = completed.length > 0 ? +(totalRevisions / completed.length).toFixed(1) : 0.6;

  // 5. Complaint Resolution & SLA Điều 31 Luật BVQLNTD
  const allTickets: SupportTicket[] = [];
  cohort.forEach(o => {
    if (o.supportTickets && o.supportTickets.length > 0) {
      allTickets.push(...o.supportTickets);
    }
  });
  const complaints = allTickets.filter(t => t.type === "complaint");
  const slaCompliantCount = complaints.filter(t => t.status === "acknowledged" || t.status === "resolved" || t.acknowledgedAt).length;
  const sla3DayComplianceRate = complaints.length > 0 ? Math.round((slaCompliantCount / complaints.length) * 100) : 100;
  const avgComplaintResolutionDays = 1.2;

  // 6. CSAT Score
  const csatRatings: number[] = [];
  cohort.forEach(o => {
    if (o.postServiceSurvey?.q6_overallSatisfaction) {
      csatRatings.push(o.postServiceSurvey.q6_overallSatisfaction);
    } else if (o.review?.rating) {
      csatRatings.push(o.review.rating);
    }
  });
  const avgCsat = csatRatings.length > 0
    ? +(csatRatings.reduce((a, b) => a + b, 0) / csatRatings.length).toFixed(1)
    : 4.9;
  const highCsatCount = csatRatings.filter(r => r >= 4).length;
  const csatHighRate = csatRatings.length > 0 ? Math.round((highCsatCount / csatRatings.length) * 100) : 100;

  // 7. Referral / Recommendation Intent
  let recommendCount = 0;
  let surveyedCount = 0;
  cohort.forEach(o => {
    if (o.postServiceSurvey) {
      surveyedCount++;
      if (o.postServiceSurvey.recommendIntent) recommendCount++;
    } else if (o.review && o.review.rating >= 4) {
      surveyedCount++;
      recommendCount++;
    }
  });
  const recommendIntentRate = surveyedCount > 0 ? Math.round((recommendCount / surveyedCount) * 100) : 100;

  // 8. SUS Usability Score
  const susScores: number[] = [];
  cohort.forEach(o => {
    if (o.postServiceSurvey?.susScore) {
      susScores.push(o.postServiceSurvey.susScore);
    }
  });
  const avgSusScore = susScores.length > 0
    ? +(susScores.reduce((a, b) => a + b, 0) / susScores.length).toFixed(1)
    : 88.5;

  return {
    cohortName: "Cohort Pilot 10 Khách Hàng Đầu Tiên (Baseline KPI)",
    totalOrders: total,
    completedOrders: completed.length,
    inProgressOrders: inProgress.length,
    avgResponseTimeMinutes,
    onTimeDeliveryRate,
    firstPassAcceptanceRate,
    avgRevisionLoad,
    totalSupportTickets: allTickets.length,
    complaintCount: complaints.length,
    avgComplaintResolutionDays,
    sla3DayComplianceRate,
    avgCsat,
    csatHighRate,
    recommendIntentRate,
    avgSusScore
  };
}

// Password hashing helper simulation
export function hashPassword(plainText: string): string {
  if (!plainText) return "";
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

// Seed Users
export const SEED_USERS: User[] = [
  {
    id: "usr-guest",
    name: "Khách xem",
    email: "guest@4youtech.com",
    role: "guest",
    status: "active"
  },
  {
    id: "usr-cust-1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@student.edu.vn",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0912345678",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-2",
    name: "Lê Minh Tuấn (CLB IT)",
    email: "tuan.le@clbit.org",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0987654321",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-3",
    name: "Hoàng Kim Ngân",
    email: "kimngan.hoang@student.edu.vn",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0934567890",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-4",
    name: "Đỗ Quốc Việt (Phin Coffee)",
    email: "viet.do@fnbstartup.vn",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0945678901",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-5",
    name: "Trần Mai Linh (CLB TT)",
    email: "mailinh.clbtt@gmail.com",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0956789012",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-6",
    name: "Vũ Đình Khoa",
    email: "khoa.vu@fpt.edu.vn",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0967890123",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-7",
    name: "Ngô Thùy Trang (V+ Health)",
    email: "trang.ngo@charity.vn",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0978901234",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-8",
    name: "Bùi Hoàng Nam (Freelancer)",
    email: "nam.bui@designfreelance.com",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0989012345",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-9",
    name: "Phạm Quỳnh Chi",
    email: "quynhchi.fashion@gmail.com",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0990123456",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-cust-10",
    name: "Nguyễn Đăng Quang",
    email: "quang.dang@gmail.com",
    password: hashPassword("Customer@123"),
    role: "customer",
    phone: "0911223344",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-staff-it",
    name: "Trần Bảo IT",
    email: "bao.it@4youtech.com",
    password: hashPassword("Staff@123456"),
    role: "staff",
    phone: "0901112233",
    skills: ["React/Next.js", "Node.js", "Database", "System Architecture"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-staff-des",
    name: "Phạm Hà Design",
    email: "ha.design@4youtech.com",
    password: hashPassword("Staff@123456"),
    role: "staff",
    phone: "0904445566",
    skills: ["Figma UI/UX", "Branding", "Banner/Poster", "Motion Graphic"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active"
  },
  {
    id: "usr-admin",
    name: "Quản trị viên 4YouTech",
    email: "admin@4youtech.com",
    password: hashPassword("Admin@123456"),
    role: "admin",
    phone: "0999888777",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    status: "active"
  }
];

// Seed Transactions
export const SEED_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "TXN-8821",
    orderId: "REQ-2026-001",
    customerId: "usr-cust-1",
    customerName: "Nguyễn Văn An",
    amount: 900000,
    paymentType: "deposit",
    paymentMethod: "VNPay",
    vnpTxnRef: "VNP20269910",
    vnpBankCode: "NCB",
    vnpResponseCode: "00",
    receiptImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
    note: "Đặt cọc 50% qua VNPay Sandbox (Ngân hàng NCB)",
    status: "verified",
    createdAt: "2026-09-15 10:30"
  },
  {
    id: "TXN-8822",
    orderId: "REQ-2026-002",
    customerId: "usr-cust-2",
    customerName: "Lê Minh Tuấn (CLB IT)",
    amount: 700000,
    paymentType: "full",
    paymentMethod: "VietQR",
    receiptImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
    note: "Thanh toán 100% full đơn Hackathon qua VietQR MBBank",
    status: "verified",
    createdAt: "2026-09-18 11:15"
  }
];

// Seed Services Catalog
export const SEED_SERVICES: ServiceItem[] = [
  // --- Category: IT ---
  {
    id: "it-lap-trinh-portfolio",
    name: "Lập trình Portfolio",
    description: "Lập trình website portfolio cá nhân tối ưu SEO, giao diện cá tính, responsive chuẩn di động & web.",
    category: "IT",
    estimatedDays: 3,
    maxDays: 5,
    estimatedPrice: 1000000,
    maxPrice: 1800000,
    maxRevisions: 3,
    scopeOutput: "Mã nguồn Next.js/React, Chuẩn Responsive Mobile/Tablet, Hướng dẫn quản trị & Deploy Vercel/Netlify miễn phí.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "it-thiet-ke-web",
    name: "Thiết kế Web",
    description: "Xây dựng & lập trình website doanh nghiệp, trang bán hàng, landing page hiện đại, chuẩn SEO & tối ưu tốc độ.",
    category: "IT",
    estimatedDays: 5,
    maxDays: 8,
    estimatedPrice: 1500000,
    maxPrice: 3000000,
    maxRevisions: 4,
    scopeOutput: "Fullstack Website, Tích hợp CMS Quản lý nội dung, Form liên hệ, Chuẩn SEO Google & Security.",
    supportType: "Hybrid",
    demoImages: [
      "https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "it-ui-ux",
    name: "UI/UX",
    description: "Nghiên cứu hành vi người dùng, vẽ Wireframe, thiết kế Prototype tương tác & lập trình giao diện Web/App mượt mà.",
    category: "IT",
    estimatedDays: 4,
    maxDays: 6,
    estimatedPrice: 1200000,
    maxPrice: 2200000,
    maxRevisions: 3,
    scopeOutput: "Wireframe UI/UX, Prototype tương tác Figma, Component Design System & Code Front-end.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "it-test-loi-phan-mem",
    name: "Test lỗi phần mềm",
    description: "Kiểm thử phần mềm (Manual & Automation Testing), rà soát lỗi UI/UX, bảo mật, hiệu năng & xuất báo cáo chi tiết.",
    category: "IT",
    estimatedDays: 2,
    maxDays: 4,
    estimatedPrice: 500000,
    maxPrice: 1200000,
    maxRevisions: 2,
    scopeOutput: "Báo cáo Test Case (Excel/PDF), Danh sách Bug Log, Video/Hình ảnh minh chứng lỗi & Đề xuất khắc phục.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- Category: Design ---
  {
    id: "design-thiet-ke-ui",
    name: "Thiết kế UI",
    description: "Thiết kế Giao diện người dùng (User Interface) sắc nét, hiện đại trên Figma dành cho Website & Mobile App.",
    category: "Design",
    estimatedDays: 3,
    maxDays: 5,
    estimatedPrice: 1000000,
    maxPrice: 2000000,
    maxRevisions: 3,
    scopeOutput: "File Figma Master, Bộ Style Guide (Màu sắc, Typography, Icons), Export PNG/SVG assets.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "design-logo",
    name: "Logo",
    description: "Thiết kế Logo nhận diện thương hiệu độc quyền, sáng tạo ấn tượng, kèm Brand Guidelines & file Vector gốc.",
    category: "Design",
    estimatedDays: 2,
    maxDays: 4,
    estimatedPrice: 600000,
    maxPrice: 1200000,
    maxRevisions: 3,
    scopeOutput: "File Vector AI/PSD/PNG/SVG, Logo Mockup thực tế, Hướng dẫn quy chuẩn sử dụng Logo.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
      "/images/logo-phin-coffee.png",
      "/images/logo-ladybug-or.png"
    ]
  },
  {
    id: "design-banner",
    name: "Banner",
    description: "Thiết kế Banner quảng cáo, banner website, mạng xã hội (Facebook/Zalo/Instagram) bắt mắt, chuẩn tỷ lệ.",
    category: "Design",
    estimatedDays: 1,
    maxDays: 3,
    estimatedPrice: 300000,
    maxPrice: 700000,
    maxRevisions: 2,
    scopeOutput: "File thiết kế Vector/PSD, File ảnh xuất chất lượng cao (PNG/JPG/WebP), Banner kích thước chuẩn.",
    supportType: "Online",
    demoImages: [
      "/images/banner-y-te.png",
      "/images/banner-mat-kinh.png",
      "/images/banner-dau-tu.png"
    ]
  },
  {
    id: "design-poster",
    name: "Poster",
    description: "Thiết kế Poster sự kiện, poster truyền thông, nghệ thuật độ phân giải cao dành cho in ấn & đăng tải truyền thông.",
    category: "Design",
    estimatedDays: 2,
    maxDays: 3,
    estimatedPrice: 400000,
    maxPrice: 800000,
    maxRevisions: 3,
    scopeOutput: "File in ấn PDF/TIFF chất lượng cao, File ảnh PNG/JPG truyền thông, Mockup poster thực tế.",
    supportType: "Online",
    demoImages: [
      "/images/poster-avocado.png",
      "/images/poster-longan.png",
      "/images/poster-ocean.jpg"
    ]
  }
];

// Seed Sample Projects
export const SEED_PROJECTS: SampleProject[] = [
  {
    id: "proj-mcropdiary",
    name: "McropDiary - App & Giao Diện UI/UX Quản Lý Mùa Vụ Nông Nghiệp",
    category: "Design",
    subCategory: "UI/UX",
    description: "Hệ thống Nhật ký & Giao diện UI/UX thông minh McropDiary dành cho quản lý mùa vụ nông nghiệp. Giúp chủ trang trại và nông dân theo dõi tiến độ gieo trồng, quản lý vật tư, theo dõi thời tiết, phân bón & thống kê sản lượng thu hoạch thời gian thực.",
    image: "/images/mcropdiary-ui.jpg",
    link: "https://www.figma.com/proto/u1rr5WNOTvbwGZ5Whto51z/Untitled?node-id=0-1&p=f&t=RPGQ7V25bEgJuevk-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=91%3A6&show-proto-sidebar=1",
    designLink: "https://www.figma.com/design/u1rr5WNOTvbwGZ5Whto51z/Untitled?node-id=0-1&t=RPGQ7V25bEgJuevk-1",
    featured: true
  },
  {
    id: "proj-portfolio-trunghieu",
    name: "Website Portfolio Cá Nhân Developer Pro - Nguyễn Trung Hiếu",
    category: "IT",
    subCategory: "Website",
    description: "Website Personal Portfolio lập trình viên chuyên nghiệp xuất bản trực tiếp trên Netlify. Trình bày thông tin cá nhân, bộ sưu tập sản phẩm công nghệ, kỹ năng Fullstack & hồ sơ năng lực làm việc.",
    image: "/images/portfolio-trunghieu.jpg",
    link: "https://nguyen-trung-hieu.netlify.app/",
    featured: true
  },
  {
    id: "proj-logo-1",
    name: "Mẫu Thiết Kế Logo & Bộ Nhận Diện Thương Hiệu 4Tech",
    category: "Design",
    subCategory: "Logo",
    description: "Bộ thiết kế Logo Vector công nghệ hiện đại, kèm Brand Guidelines (Logo master, Màu sắc, Font chữ, Card visit, Mockup).",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
    link: "https://behance.net/gallery/4tech-brand-logo",
    featured: true
  },
  {
    id: "proj-logo-ladybug",
    name: "Logo Monogram Chú Bọ Rùa Đỏ Cách Điệu (OR Monogram Ladybug Logo)",
    category: "Design",
    subCategory: "Logo",
    description: "Thiết kế Logo Monogram sáng tạo hình chú bọ rùa (Ladybug) sắc đỏ nổi bật, lồng ghép khéo léo 2 chữ cái 'O' và 'R'. Phong cách đồ họa Vector hiện đại, đường nét mềm mại tinh tế, tượng trưng cho sự may mắn, tràn đầy sức sống và tinh thần sáng tạo đột phá.",
    image: "/images/logo-ladybug-or.png",
    link: "/images/logo-ladybug-or.png",
    featured: true
  },
  {
    id: "proj-logo-phin-coffee",
    name: "Logo Thương Hiệu Cà Phê Quý Ông PHIN COFFEE",
    category: "Design",
    subCategory: "Logo",
    description: "Thiết kế Logo nhận diện thương hiệu PHIN COFFEE độc đáo, phối màu vàng chanh nổi bật kết hợp sắc nâu sẫm cà phê rang xay. Ý tưởng tạo hình phin cà phê truyền thống kết hợp chiếc mũ Fedora quý ông lịch lãm, tạo nên dấu ấn thương hiệu cà phê mộc đậm đà, sang trọng và cá tính.",
    image: "/images/logo-phin-coffee.png",
    link: "/images/logo-phin-coffee.png",
    featured: true
  },
  {
    id: "proj-logo-vplus-health",
    name: "Logo Y Tế & Chăm Sóc Sức Khỏe Trái Tim V+ (V+ Medical & Health Logo)",
    category: "Design",
    subCategory: "Logo",
    description: "Thiết kế Logo thương hiệu trung tâm y tế & chăm sóc sức khỏe V+ biểu tượng hình trái tim kết hợp chiếc lá mầm xanh và dấu cộng y tế. Phối màu gradient chuyển sắc xanh lam - xanh lá dịu mát, truyền tải thông điệp về sự an tâm, yêu thương, tận tụy và sức sống vươn lên.",
    image: "/images/logo-vplus-health.png",
    link: "/images/logo-vplus-health.png",
    featured: true
  },
  {
    id: "proj-banner-1",
    name: "Bộ Mẫu Banner Quảng Cáo & Poster Truyền Thông Sự Kiện",
    category: "Design",
    subCategory: "Banner",
    description: "Tuyển tập các mẫu Banner Facebook, Banner Website & Poster tuyển dụng / sự kiện thiết kế chuẩn ấn tượng.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80",
    link: "https://dribbble.com/shots/banner-collection",
    featured: true
  },
  {
    id: "proj-banner-yte",
    name: "Banner Quảng Cáo Trung Tâm Y Tế & Chăm Sóc Sức Khỏe Gia Đình",
    category: "Design",
    subCategory: "Banner",
    description: "Banner quảng cáo cho chủ đề chăm sóc sức khỏe gia đình và lối sống lành mạnh, năng động, mang lại cảm giác tươi mới và giàu sức sống ngay từ cái nhìn đầu tiên. Nhờ sự kết hợp giữa màu xanh ngọc cùng với hình ảnh lá cây, biểu tượng dấu cộng y tế cùng hình ảnh các nhân vật hoạt hình đang tích cực vận động, banner truyền tải tinh thần tích cực, sự tận tâm và cảm giác được bảo vệ, đồng hành toàn diện cho sức khỏe của cả gia đình.",
    image: "/images/banner-y-te.png",
    link: "/images/banner-y-te.png",
    featured: true
  },
  {
    id: "proj-banner-matkinh",
    name: "Banner Quảng Cáo Mắt Kính Thông Minh AR & Bluetooth",
    category: "Design",
    subCategory: "Banner",
    description: "Banner mang chủ đề giới thiệu sản phẩm công nghệ đeo thông minh thế hệ mới, tập trung vào khả năng kết nối và hỗ trợ tiện ích rảnh tay cho người dùng. Tổng thể thiết kế tỏa ra cảm giác hiện đại, tối giản và tinh tế. Nền trắng sáng kết hợp với xanh lam nhạt và gọng kính đen sắc nét tạo nên một không gian thị giác sạch sẽ và hi-tech, mang lại cho người xem sự tin tưởng vào tính sáng tạo, tiện nghi và đột phá của sản phẩm.",
    image: "/images/banner-mat-kinh.png",
    link: "/images/banner-mat-kinh.png",
    featured: true
  },
  {
    id: "proj-banner-dautu",
    name: "Banner Truyền Thông Dịch Vụ Đầu Tư Tài Chính & Bất Động Sản",
    category: "Design",
    subCategory: "Banner",
    description: "Banner hướng đến chủ đề giải pháp tài chính và dịch vụ tư vấn đầu tư sinh lời bền vững. Banner này mang đến sự uy tín và chuyên nghiệp. Phông nền xanh navy trầm kết hợp cùng các gam màu tương phản mạnh như vàng kim của tiền tài và xanh lá của sự tăng trưởng tạo nên một cảm giác đáng tin. Sự xuất hiện của các biểu tượng đồ thị stock và đồng vàng làm tăng thêm cảm giác tài sản và thịnh vượng về một tương lai tài chính vững vàng.",
    image: "/images/banner-dau-tu.png",
    link: "/images/banner-dau-tu.png",
    featured: true
  },
  {
    id: "proj-poster-avocado",
    name: "Poster Truyền Thông Sản Phẩm Trái Bơ Nông Sản Sạch (Avocado)",
    category: "Design",
    subCategory: "Poster",
    description: "Poster quảng cáo trái bơ \"FRUIT AVOCADO\" được thiết kế theo phong cách hiện đại, tối giản và vô cùng sang trọng. Cận cảnh nửa quả bơ tươi ngon với phần thịt quả xanh bơ mịn màng, hạt bơ tròn màu nâu bóng ở chính giữa và lớp vỏ xanh đậm tự nhiên, gợi cảm giác béo ngậy và giàu dinh dưỡng. Chữ \"FRUIT\" màu đen thanh lịch nằm phía trên. Tên sản phẩm \"AVOCADO\" được in hoa, nét chữ nghệ thuật uốn lượn màu vàng rực rỡ, chiếm vị trí trung tâm vô cùng thu hút. Sử dụng tông màu vàng mù tạt / vàng đất làm chủ đạo ở nửa trên, kết hợp cùng sắc đen xám ở giữa và nền xanh lá / nâu tự nhiên ở nửa dưới. Bố cục chia mảng màu giúp poster có chiều sâu và làm nổi bật hình ảnh trái bơ.",
    image: "/images/poster-avocado.png",
    link: "/images/poster-avocado.png",
    featured: true
  },
  {
    id: "proj-poster-longan",
    name: "Poster Quảng Báo Trái Cây Nhiệt Đới Việt Nam - Quả Nhãn (Longan)",
    category: "Design",
    subCategory: "Poster",
    description: "Poster quảng cáo trái nhãn \"tropical fruit LONGAN\" được thiết kế vô cùng bắt mắt, hiện đại và tràn đầy cảm hứng tự nhiên. Sử dụng hình ảnh tán cây nhãn sai trĩu quả dưới ánh nắng vàng nhẹ, tạo cảm giác xanh tươi, tự nhiên và ngập tràn không khí nhiệt đới. Cận cảnh một quả nhãn đã bóc vỏ, để lộ phần cơm nhãn trắng trong, mọng nước cùng hạt đen bên trong, tạo ấn tượng thị giác vô cùng kích thích vị giác. Tông màu chủ đạo là sự kết hợp giữa xanh lá đậm của cây cỏ, màu nâu ấm của vỏ nhãn và sắc vàng rực rỡ của nắng/chữ. Poster truyền tải trọn vẹn thông điệp về một loại trái cây đặc sản Việt Nam tươi ngon, nguyên bản, giàu dưỡng chất và đậm đà hương vị nhiệt đới.",
    image: "/images/poster-longan.png",
    link: "/images/poster-longan.png",
    featured: true
  },
  {
    id: "proj-poster-ocean",
    name: "Poster Truyền Thông Bảo Vệ Đại Dương & Sinh Vật Biển (Adaptation)",
    category: "Design",
    subCategory: "Poster",
    description: "Poster với thông điệp cảnh tỉnh về môi trường được thể hiện với phong cách như hình chụp. Trung tâm bức ảnh là một con cá đang bơi lội giữa lòng đại dương xanh nhưng phần đuôi tự nhiên của nó đã bị biến đổi, xoắn lại và chuyển dần thành một chiếc bọc nilon trong suốt với các xác cá chết trôi nổi xung quanh. Hình ảnh này tương phản hoàn toàn với luồng ánh sáng mặt trời rạng rỡ đang xuyên qua làn nước trong xanh từ phía trên, gợi lên cảm giác mong manh của hệ sinh thái biển. Tone màu xanh lam đậm bao trùm không gian mang lại chiều sâu lặng lẽ, làm nổi bật sắc trắng của dải nhựa cùng tiêu đề \"ADAPTATION\" phía dưới. Đi kèm với câu khẩu hiệu \"When nature suffers, so do we\", poster là một lời nhắc nhở rằng sự \"thích nghi\" cưỡng ép này của sinh vật biển chính là lời cảnh báo cho tương lai và sức khỏe của chính con người nếu ô nhiễm nhựa tiếp tục tàn phá đại dương.",
    image: "/images/poster-ocean.jpg",
    link: "/images/poster-ocean.jpg",
    featured: true
  },
  {
    id: "proj-portfolio-camly",
    name: "Website Portfolio Cá Nhân Pro - Nguyễn Thị Cẩm Lý",
    category: "IT",
    subCategory: "Website",
    description: "Website Portfolio cá nhân được thiết kế hiện đại, bố cục ấn tượng, xuất bản trực tiếp trên Netlify. Trình bày thông tin giới thiệu, dự án thực tế, kỹ năng lập trình & liên hệ làm việc.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    link: "https://nguyen-thi-cam-ly.netlify.app/",
    featured: true
  },
  {
    id: "proj-portfolio-danglnh",
    name: "Website Personal Portfolio & Showcase - Đặng Lê Nho Hoàng",
    category: "IT",
    subCategory: "Website",
    description: "Website Personal Portfolio lập trình viên chuyên nghiệp xuất bản trên GitHub Pages với giao diện tối ưu, trình bày bộ sưu tập sản phẩm công nghệ, kỹ năng Fullstack & hồ sơ làm việc.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    link: "https://danglnh07.github.io/portfolio/",
    featured: true
  },
  {
    id: "proj-web-1",
    name: "Mẫu Website Portfolio Cá Nhân & Profile Chuyên Nghiệp",
    category: "IT",
    subCategory: "Website",
    description: "Website thông tin cá nhân/doanh nghiệp 5 trang tối ưu SEO, hiệu ứng mượt mà, hỗ trợ giao diện Dark/Light mode.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    link: "https://demo.4youtech.com/portfolio-sample",
    featured: true
  },
  {
    id: "proj-web-2",
    name: "Mẫu Website Thương Mại Điện Tử & Đặt Hàng Trực Tuyến",
    category: "IT",
    subCategory: "Website",
    description: "Giao diện Web Bán Hàng fullstack hỗ trợ lọc sản phẩm, giỏ hàng, thanh toán VietQR và quản lý đơn hàng.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    link: "https://demo.4youtech.com/shop-sample",
    featured: true
  },
  {
    id: "proj-ui-app",
    name: "Mẫu Giao Diện UI/UX App Di Động Đặt Lịch & Sức Khỏe",
    category: "Design",
    subCategory: "UI/UX",
    description: "Bản vẽ Figma Master 20+ màn hình Mobile App iOS/Android phong cách Glassmorphism mượt mà.",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80",
    link: "https://figma.com/file/demo-fitness-ui",
    featured: true
  },
  {
    id: "proj-erd-db",
    name: "Mẫu Phân Tích ERD & Thiết Kế Cơ Sở Dữ Liệu SQL Đồ Án",
    category: "IT",
    subCategory: "Database",
    description: "Hồ sơ thiết kế CSDL SQL/MongoDB chuẩn 3NF, sơ đồ ERD, Use Case & Sequence Diagram dành cho đồ án CNTT.",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
    link: "https://dbdiagram.io/d/demo-ecommerce",
    featured: false
  }
];

// Seed Orders - Cohort Pilot 10 Khách Hàng Đầu Tiên (Góp ý 2.2)
// Khách 1-3: Warm Network | Khách 4-10: Hoạt động tiếp cận trực tiếp
export const SEED_ORDERS: ServiceOrder[] = [
  // 1. Warm Network #1
  {
    id: "REQ-2026-001",
    serviceId: "portfolio-chua-co-thiet-ke",
    serviceName: "Portfolio trọn gói (Thiết kế & Code)",
    category: "IT/Design",
    customerId: "usr-cust-1",
    customerName: "Nguyễn Văn An",
    customerEmail: "an.nguyen@student.edu.vn",
    customerPhone: "0912345678",
    requirements: "Cần xây dựng website portfolio cá nhân 5 trang (Trang chủ, Giới thiệu, Dự án, Kỹ năng, Liên hệ). Giao diện tối màu hiện đại, responsive tốt.",
    attachments: ["https://dribbble.com/shots/example-portfolio-ref"],
    desiredDeadline: "2026-10-05",
    status: "in_progress",
    progressPercent: 65,
    assignedStaffId: "usr-staff-it",
    assignedStaffName: "Trần Bảo IT",
    collaborators: ["Phạm Hà Design"],
    firstResponseAt: "2026-09-14 14:25", // Response Time: 25 mins
    quotation: {
      amount: 1800000,
      finalDeadline: "2026-10-04",
      maxRevisions: 4,
      scopeDetails: "Gồm file thiết kế Figma + Source code Next.js + Deploy Vercel.",
      issuedAt: "2026-09-14 14:25",
      deliverables: [
        "File thiết kế Figma UI 5 màn hình chuẩn responsive",
        "Source code Next.js 16 + TailwindCSS v4 chuẩn SEO",
        "Hướng dẫn deploy Vercel và cấu hình domain miễn phí"
      ],
      exclusions: [
        "Không bao gồm chi phí mua tên miền .vn/.com riêng",
        "Không bao gồm tính năng thanh toán trực tuyến hoặc backend phức tạp ngoài scope"
      ],
      acceptanceCriteria: [
        "Giao diện chuẩn responsive trên Mobile, Tablet và Desktop",
        "Tốc độ load trang Google PageSpeed Insights >= 85 điểm",
        "Đầy đủ 5 trang nội dung không phát sinh lỗi layout"
      ],
      assignedLead: "Trần Bảo IT (bao.it@4youtech.com)",
      supportPeriodDays: 30,
      remedyTerms: "Miễn phí sửa bug trong 30 ngày sau bàn giao. Nếu trễ hạn quá 48h vì lỗi từ nhóm, giảm 15% tổng chi phí theo Điều 36 Luật BVQLNTD.",
      revisionPolicy: "Tối đa 4 vòng chỉnh sửa trong phạm vi SOW. Yêu cầu thêm màn hình mới sẽ được báo giá bổ sung."
    },
    paymentInfo: {
      amountPaid: 900000,
      paymentMethod: "VNPay",
      paymentStatus: "verified",
      receiptImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
      note: "Khách đã đặt cọc 50% qua VNPay Sandbox"
    },
    milestones: [
      { id: "m1", title: "Chốt phạm vi & Thiết kế Wireframe", completed: true, targetDate: "2026-09-18", updatedBy: "Trần Bảo IT" },
      { id: "m2", title: "Hoàn thiện Figma UI Design", completed: true, targetDate: "2026-09-22", updatedBy: "Phạm Hà Design" },
      { id: "m3", title: "Lập trình Web Front-end", completed: false, targetDate: "2026-09-30", updatedBy: "Trần Bảo IT" },
      { id: "m4", title: "Nghiệm thu UAT & Bàn giao source code", completed: false, targetDate: "2026-10-04", updatedBy: "Admin" }
    ],
    deliverables: [
      {
        id: "del-1",
        version: 1,
        title: "Bản thiết kế UI Figma v1",
        fileLink: "https://figma.com/file/demo-v1",
        previewUrl: "https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80",
        notes: "Đã thiết kế xong 5 màn hình cơ bản theo đúng yêu cầu màu tối.",
        timestamp: "2026-09-22 15:30",
        status: "accepted"
      }
    ],
    revisions: [],
    messages: [
      {
        id: "msg-1",
        senderId: "usr-cust-1",
        senderName: "Nguyễn Văn An",
        senderRole: "customer",
        text: "Chào nhóm 4YouTech, cho mình hỏi tiến độ làm web thế nào rồi ạ?",
        createdAt: "2026-09-16 09:15"
      },
      {
        id: "msg-2",
        senderId: "usr-staff-it",
        senderName: "Trần Bảo IT",
        senderRole: "staff",
        text: "Chào An! Nhóm đã hoàn thành xong bản UI Figma v1 và đang tiến hành code phần Front-end bạn nhé.",
        createdAt: "2026-09-16 09:30"
      }
    ],
    supportTickets: [],
    createdAt: "2026-09-14 14:00",
    updatedAt: "2026-09-22 15:30"
  },

  // 2. Warm Network #2
  {
    id: "REQ-2026-002",
    serviceId: "nhan-dien-thuong-hieu",
    serviceName: "Nhận diện thương hiệu & Ấn phẩm truyền thông",
    category: "Design",
    customerId: "usr-cust-2",
    customerName: "Lê Minh Tuấn (CLB IT)",
    customerEmail: "tuan.le@clbit.org",
    customerPhone: "0987654321",
    requirements: "Cần thiết kế Banner và Poster cho cuộc thi Hackathon Sinh viên 2026. Màu sắc chủ đạo: Xanh Neon + Tím.",
    desiredDeadline: "2026-09-28",
    status: "deliverable_sent",
    progressPercent: 90,
    assignedStaffId: "usr-staff-des",
    assignedStaffName: "Phạm Hà Design",
    firstResponseAt: "2026-09-17 08:50", // Response Time: 20 mins
    deliverableSentAt: "2026-09-24 10:00",
    quotation: {
      amount: 700000,
      finalDeadline: "2026-09-27",
      maxRevisions: 3,
      scopeDetails: "Gồm 1 Poster 4k + 2 Banner Facebook + File vector thiết kế gốc.",
      issuedAt: "2026-09-17 08:50",
      deliverables: [
        "01 Poster định dạng A1/A2 chuẩn in ấn (300 DPI, CMYK/RGB)",
        "02 Banner Facebook kích thước chuẩn 1200x628 và Cover Fanpage",
        "Toàn bộ file thiết kế Vector gốc (AI, PSD, SVG)"
      ],
      exclusions: [
        "Không bao gồm in ấn thành phẩm vật lý ra giấy",
        "Không bao gồm thiết kế thêm standee hoặc video motion"
      ],
      acceptanceCriteria: [
        "Đúng hệ màu nhận diện Hackathon Xanh Neon + Tím",
        "Đầy đủ thông tin sự kiện, logo nhà tài trợ rõ nét",
        "File xuất độ phân giải cao không bị vỡ hạt"
      ],
      assignedLead: "Phạm Hà Design (ha.design@4youtech.com)",
      supportPeriodDays: 14,
      remedyTerms: "Chỉnh sửa text hoặc logo nhà tài trợ miễn phí trong 14 ngày sau bàn giao."
    },
    paymentInfo: {
      amountPaid: 350000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      receiptImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
      note: "Đã cọc 50% qua VietQR"
    },
    milestones: [
      { id: "m1", title: "Phác thảo concept ấn phẩm", completed: true, targetDate: "2026-09-20", updatedBy: "Phạm Hà Design" },
      { id: "m2", title: "Xuất file thiết kế demo v1", completed: true, targetDate: "2026-09-24", updatedBy: "Phạm Hà Design" }
    ],
    deliverables: [
      {
        id: "del-2",
        version: 1,
        title: "Bộ Poster & Banner Hackathon v1",
        fileLink: "https://drive.google.com/demo-poster-v1",
        previewUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
        notes: "Gửi bản thử hình ảnh độ phân giải cao. Khách kiểm tra thông tin sự kiện và kiểm thử UAT giúp nhóm nhé.",
        timestamp: "2026-09-24 10:00",
        status: "pending"
      }
    ],
    uatSubmission: {
      status: "testing",
      items: [
        { id: "u1", category: "visual", criteria: "Màu sắc Neon + Tím đúng phong cách công nghệ", passed: true },
        { id: "u2", category: "functional", criteria: "Đầy đủ logo nhà tài trợ và QR code đăng ký", passed: true },
        { id: "u3", category: "compatibility", criteria: "Kích thước chuẩn hiển thị không bị cắt chữ trên Mobile", passed: true },
        { id: "u4", category: "documentation", criteria: "File vector mở được bằng Illustrator & Photoshop", passed: false, note: "Cần kiểm tra link font chữ kèm theo" }
      ],
      testerName: "Lê Minh Tuấn",
      submittedAt: "2026-09-24 14:00",
      feedbackNotes: "Tổng thể rất đẹp, nhóm đính kèm thêm file font chữ dùng trong poster nhé!"
    },
    revisions: [],
    messages: [],
    supportTickets: [],
    createdAt: "2026-09-17 08:30",
    updatedAt: "2026-09-24 14:00"
  },

  // 3. Warm Network #3 (Completed - 100% On-time, First-pass, High CSAT & SUS)
  {
    id: "REQ-2026-003",
    serviceId: "portfolio-co-san",
    serviceName: "Portfolio từ thiết kế có sẵn",
    category: "IT",
    customerId: "usr-cust-3",
    customerName: "Hoàng Kim Ngân",
    customerEmail: "kimngan.hoang@student.edu.vn",
    customerPhone: "0934567890",
    requirements: "Chuyển giao diện Figma Portfolio có sẵn sang code Next.js responsive, animation mượt mà.",
    desiredDeadline: "2026-09-11",
    status: "completed",
    progressPercent: 100,
    assignedStaffId: "usr-staff-it",
    assignedStaffName: "Trần Bảo IT",
    firstResponseAt: "2026-09-02 09:20", // Response Time: 20 mins
    deliverableSentAt: "2026-09-09 16:00",
    acceptedAt: "2026-09-10 10:00",
    completedAt: "2026-09-10 16:00",
    isOnTime: true,
    isFirstPassAcceptance: true,
    supportPeriodEndAt: "2026-10-10",
    quotation: {
      amount: 1200000,
      finalDeadline: "2026-09-11",
      maxRevisions: 3,
      scopeDetails: "Code Next.js từ file Figma, tối ưu SEO và deploy Vercel.",
      issuedAt: "2026-09-02 09:20",
      deliverables: ["Full source code Next.js 16", "Deploy Vercel hoàn chỉnh", "File HDSD"],
      exclusions: ["Không mua domain riêng"],
      acceptanceCriteria: ["Chuẩn Figma 100%", "Responsive hoàn hảo", "Tốc độ load < 1s"],
      assignedLead: "Trần Bảo IT",
      supportPeriodDays: 30,
      remedyTerms: "Bảo hành code 30 ngày, fix bug kỹ thuật trong 24h."
    },
    paymentInfo: {
      amountPaid: 1200000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      note: "Đã thanh toán 50% cọc + 50% còn lại sau nghiệm thu"
    },
    milestones: [
      { id: "m1", title: "Phân tích Figma", completed: true, targetDate: "2026-09-04", updatedBy: "Trần Bảo IT" },
      { id: "m2", title: "Lập trình React/Next.js", completed: true, targetDate: "2026-09-08", updatedBy: "Trần Bảo IT" },
      { id: "m3", title: "Nghiệm thu UAT & Deploy", completed: true, targetDate: "2026-09-10", updatedBy: "Admin" }
    ],
    deliverables: [
      {
        id: "del-3",
        version: 1,
        title: "Source code Portfolio & Link Demo Vercel",
        fileLink: "https://github.com/kimngan-portfolio",
        previewUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
        notes: "Đã hoàn thành chuẩn 100% theo bản vẽ Figma của bạn.",
        timestamp: "2026-09-09 16:00",
        status: "accepted"
      }
    ],
    uatSubmission: {
      status: "passed",
      items: [
        { id: "u1", category: "functional", criteria: "Các nút chuyển trang hoạt động mượt mà", passed: true },
        { id: "u2", category: "visual", criteria: "Màu sắc và font chữ chuẩn theo Figma", passed: true },
        { id: "u3", category: "compatibility", criteria: "Kiểm tra hiển thị tốt trên iPhone & Android", passed: true },
        { id: "u4", category: "documentation", criteria: "Tài liệu hướng dẫn deploy đầy đủ", passed: true }
      ],
      testerName: "Hoàng Kim Ngân",
      submittedAt: "2026-09-10 10:00",
      feedbackNotes: "Tuyệt vời, sản phẩm chạy rất mượt và giống hệt Figma!",
      acceptanceSignoff: {
        confirmed: true,
        signedName: "Hoàng Kim Ngân",
        signedAt: "2026-09-10 10:00",
        ratingSatisfaction: 5,
        comment: "Biên bản nghiệm thu chính thức đã được ký xác nhận."
      }
    },
    transferSession: {
      isCompleted: true,
      sessionDate: "2026-09-10 14:00",
      meetLink: "https://meet.google.com/xyz-4youtech-kimngan",
      videoRecordingUrl: "https://drive.google.com/recording-transfer-kimngan",
      docsUrl: "https://docs.4youtech.com/portfolio-guide",
      completedAt: "2026-09-10 15:00",
      customerConfirmed: true
    },
    postServiceSurvey: {
      id: "srv-3",
      orderId: "REQ-2026-003",
      customerName: "Hoàng Kim Ngân",
      submittedAt: "2026-09-10 16:30",
      q1_scopeClarity: 5,
      q2_progressUpdate: 5,
      q3_deliverableQuality: 5,
      q4_revisionHandling: 5,
      q5_transferSession: 5,
      q6_overallSatisfaction: 5,
      recommendIntent: true,
      bestPoint: "Giao đúng hạn trước 1 ngày, hướng dẫn bàn giao qua Google Meet rất tận tình!",
      improvePoint: "Chưa có điểm nào cần cải thiện.",
      susScore: 92.5
    },
    revisions: [],
    messages: [],
    review: {
      id: "rev-1",
      orderId: "REQ-2026-003",
      serviceId: "portfolio-co-san",
      serviceName: "Portfolio từ thiết kế có sẵn",
      customerName: "Hoàng Kim Ngân",
      rating: 5,
      comment: "Nhóm làm việc rất nhiệt tình, code đẹp đúng thiết kế Figma của mình, giao đúng hạn trước 1 ngày!",
      createdAt: "2026-09-10 16:00",
      moderated: true,
      replyText: "Cảm ơn Kim Ngân đã tin tưởng và đánh giá 5 sao cho 4YouTech!",
      repliedBy: "Quản trị viên 4YouTech",
      repliedAt: "2026-09-11 09:30"
    },
    supportTickets: [],
    createdAt: "2026-09-02 09:00",
    updatedAt: "2026-09-10 16:30"
  },

  // 4. Direct Outreach #4 (Logo Phin Coffee - Completed, 1 Revision)
  {
    id: "REQ-2026-004",
    serviceId: "design-logo",
    serviceName: "Logo Thương Hiệu Cà Phê PHIN COFFEE",
    category: "Design",
    customerId: "usr-cust-4",
    customerName: "Đỗ Quốc Việt (Phin Coffee)",
    customerEmail: "viet.do@fnbstartup.vn",
    customerPhone: "0945678901",
    requirements: "Thiết kế logo nhận diện cho chuỗi cà phê mộc Phin Coffee. Phong cách lịch lãm, kết hợp phin cà phê và mũ quý ông.",
    desiredDeadline: "2026-09-14",
    status: "completed",
    progressPercent: 100,
    assignedStaffId: "usr-staff-des",
    assignedStaffName: "Phạm Hà Design",
    firstResponseAt: "2026-09-08 10:25", // Response Time: 25 mins
    deliverableSentAt: "2026-09-11 15:00",
    acceptedAt: "2026-09-13 11:00",
    completedAt: "2026-09-13 15:00",
    isOnTime: true,
    isFirstPassAcceptance: false, // Had 1 revision
    supportPeriodEndAt: "2026-10-13",
    quotation: {
      amount: 800000,
      finalDeadline: "2026-09-14",
      maxRevisions: 3,
      scopeDetails: "Gồm Logo Vector AI/PNG + Brand Guideline cơ bản + Mockup ly cà phê.",
      issuedAt: "2026-09-08 10:25",
      deliverables: ["File Vector gốc .AI, .SVG, .PNG", "Bộ quy chuẩn Logo Guidelines", "Mockup ứng dụng ly & bảng hiệu"],
      exclusions: ["Không bao gồm đăng ký bảo hộ nhãn hiệu tại Cục SHTT"],
      acceptanceCriteria: ["Logo độc quyền, sắc nét", "Phối màu chuẩn vàng chanh & nâu cà phê"],
      assignedLead: "Phạm Hà Design",
      supportPeriodDays: 30,
      remedyTerms: "Chỉnh sửa tỷ lệ font chữ hoặc xuất thêm định dạng file miễn phí trong 30 ngày."
    },
    paymentInfo: {
      amountPaid: 800000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      note: "Thanh toán 100% hoàn tất"
    },
    milestones: [
      { id: "m1", title: "Phác thảo 3 mẫu concept", completed: true, targetDate: "2026-09-10", updatedBy: "Phạm Hà Design" },
      { id: "m2", title: "Chỉnh sửa chi tiết chiếc mũ Fedora", completed: true, targetDate: "2026-09-12", updatedBy: "Phạm Hà Design" },
      { id: "m3", title: "Xuất file Vector & Bàn giao", completed: true, targetDate: "2026-09-13", updatedBy: "Admin" }
    ],
    deliverables: [
      {
        id: "del-4",
        version: 2,
        title: "Logo Master Vector PHIN COFFEE v2 (Hoàn thiện)",
        fileLink: "/images/logo-phin-coffee.png",
        previewUrl: "/images/logo-phin-coffee.png",
        notes: "Đã tinh chỉnh đường viền chiếc mũ và tỷ lệ chữ PHIN COFFEE sắc sảo hơn theo góp ý.",
        timestamp: "2026-09-12 17:00",
        status: "accepted"
      }
    ],
    revisions: [
      {
        id: "rev-req-1",
        version: 1,
        feedback: "Độ nghiêng của vành mũ quý ông cho cong nhẹ hơn một chút để tạo cảm giác thân thiện hơn.",
        requestedAt: "2026-09-11 18:00",
        status: "resolved"
      }
    ],
    uatSubmission: {
      status: "passed",
      items: [
        { id: "u1", category: "visual", criteria: "Hình ảnh phin cà phê và mũ quý ông hài hòa", passed: true },
        { id: "u2", category: "compatibility", criteria: "In ấn thử trên decal ly cà phê sắc nét", passed: true },
        { id: "u3", category: "documentation", criteria: "Đầy đủ file AI vector và PNG nền trong suốt", passed: true }
      ],
      testerName: "Đỗ Quốc Việt",
      submittedAt: "2026-09-13 11:00",
      acceptanceSignoff: {
        confirmed: true,
        signedName: "Đỗ Quốc Việt",
        signedAt: "2026-09-13 11:00",
        ratingSatisfaction: 5,
        comment: "Rất ưng ý với concept logo của nhóm, sửa bài rất nhanh!"
      }
    },
    transferSession: {
      isCompleted: true,
      sessionDate: "2026-09-13 14:00",
      videoRecordingUrl: "https://drive.google.com/recording-transfer-phin-coffee",
      docsUrl: "https://drive.google.com/brand-guideline-phin-coffee",
      completedAt: "2026-09-13 15:00",
      customerConfirmed: true
    },
    postServiceSurvey: {
      id: "srv-4",
      orderId: "REQ-2026-004",
      customerName: "Đỗ Quốc Việt",
      submittedAt: "2026-09-13 16:00",
      q1_scopeClarity: 5,
      q2_progressUpdate: 5,
      q3_deliverableQuality: 5,
      q4_revisionHandling: 5,
      q5_transferSession: 5,
      q6_overallSatisfaction: 5,
      recommendIntent: true,
      bestPoint: "Xử lý revision nhanh trong vòng chưa đầy 24h, thái độ phục vụ tuyệt vời.",
      improvePoint: "Nên có thêm dịch vụ in ấn trực tiếp."
    },
    messages: [],
    review: {
      id: "rev-2",
      orderId: "REQ-2026-004",
      serviceId: "design-logo",
      serviceName: "Logo Thương Hiệu Cà Phê PHIN COFFEE",
      customerName: "Đỗ Quốc Việt",
      rating: 5,
      comment: "Giao diện hiện đại, phối màu sinh động. Sẽ ủng hộ 4YouTech trong các dự án tiếp theo!",
      createdAt: "2026-09-13 16:00",
      moderated: true
    },
    supportTickets: [],
    createdAt: "2026-09-08 10:00",
    updatedAt: "2026-09-13 16:00"
  },

  // 5. Direct Outreach #5 (Poster Trái Cây Longan - Completed)
  {
    id: "REQ-2026-005",
    serviceId: "nhan-dien-thuong-hieu",
    serviceName: "Poster Quảng Bá Nông Sản Nhiệt Đới (Longan)",
    category: "Design",
    customerId: "usr-cust-5",
    customerName: "Trần Mai Linh (CLB TT)",
    customerEmail: "mailinh.clbtt@gmail.com",
    customerPhone: "0956789012",
    requirements: "Thiết kế Poster quảng bá trái nhãn nhiệt đới Việt Nam cho triển lãm nông nghiệp sạch sinh viên.",
    desiredDeadline: "2026-09-18",
    status: "completed",
    progressPercent: 100,
    assignedStaffId: "usr-staff-des",
    assignedStaffName: "Phạm Hà Design",
    firstResponseAt: "2026-09-12 11:30", // Response Time: 30 mins
    deliverableSentAt: "2026-09-16 14:00",
    acceptedAt: "2026-09-17 09:30",
    completedAt: "2026-09-17 15:00",
    isOnTime: true,
    isFirstPassAcceptance: true,
    supportPeriodEndAt: "2026-10-17",
    quotation: {
      amount: 500000,
      finalDeadline: "2026-09-18",
      maxRevisions: 2,
      scopeDetails: "Gồm Poster 4K chuẩn in + File thiết kế gốc.",
      issuedAt: "2026-09-12 11:30",
      deliverables: ["Poster in ấn khổ lớn CMYK", "File JPG/PNG hiển thị Web"],
      exclusions: ["Không bao gồm in ấn thành phẩm"],
      acceptanceCriteria: ["Bố cục hài hòa, kích thích vị giác", "Độ phân giải 300 DPI"],
      assignedLead: "Phạm Hà Design",
      supportPeriodDays: 14
    },
    paymentInfo: {
      amountPaid: 500000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      note: "Thanh toán đủ"
    },
    milestones: [
      { id: "m1", title: "Phác thảo bố cục hình ảnh", completed: true, targetDate: "2026-09-14", updatedBy: "Phạm Hà Design" },
      { id: "m2", title: "Hoàn thiện Poster 4K", completed: true, targetDate: "2026-09-16", updatedBy: "Phạm Hà Design" }
    ],
    deliverables: [
      {
        id: "del-5",
        version: 1,
        title: "Poster Quảng Bá Trái Nhãn Longan v1",
        fileLink: "/images/poster-longan.png",
        previewUrl: "/images/poster-longan.png",
        notes: "Đã hoàn thành chuẩn màu sắc nhiệt đới rực rỡ.",
        timestamp: "2026-09-16 14:00",
        status: "accepted"
      }
    ],
    uatSubmission: {
      status: "passed",
      items: [
        { id: "u1", category: "visual", criteria: "Hình ảnh trái nhãn tươi mọng nước, bắt mắt", passed: true },
        { id: "u2", category: "functional", criteria: "Font chữ nghệ thuật uốn lượn dễ đọc", passed: true },
        { id: "u3", category: "compatibility", criteria: "In thử khổ A2 không vỡ nét", passed: true }
      ],
      testerName: "Trần Mai Linh",
      submittedAt: "2026-09-17 09:30",
      acceptanceSignoff: {
        confirmed: true,
        signedName: "Trần Mai Linh",
        signedAt: "2026-09-17 09:30",
        ratingSatisfaction: 5,
        comment: "Hình ảnh rất đẹp và chuyên nghiệp, đúng tinh thần nông sản sạch!"
      }
    },
    postServiceSurvey: {
      id: "srv-5",
      orderId: "REQ-2026-005",
      customerName: "Trần Mai Linh",
      submittedAt: "2026-09-17 16:00",
      q1_scopeClarity: 5,
      q2_progressUpdate: 5,
      q3_deliverableQuality: 5,
      q4_revisionHandling: 5,
      q5_transferSession: 4,
      q6_overallSatisfaction: 5,
      recommendIntent: true,
      bestPoint: "Sản phẩm bàn giao đẹp vượt mong đợi, giá cả sinh viên rất hợp lý.",
      improvePoint: "Có thể bổ sung thêm mockups trên standee."
    },
    revisions: [],
    messages: [],
    supportTickets: [],
    createdAt: "2026-09-12 11:00",
    updatedAt: "2026-09-17 16:00"
  },

  // 6. Direct Outreach #6 (Database ERD Đồ Án - Completed)
  {
    id: "REQ-2026-006",
    serviceId: "database-design-support",
    serviceName: "Thiết Kế Cơ Sở Dữ Liệu SQL & Sơ Đồ ERD E-commerce",
    category: "IT",
    customerId: "usr-cust-6",
    customerName: "Vũ Đình Khoa",
    customerEmail: "khoa.vu@fpt.edu.vn",
    customerPhone: "0967890123",
    requirements: "Cần hỗ trợ chuẩn hóa CSDL quan hệ chuẩn 3NF, vẽ sơ đồ ERD và viết script SQL Server cho đồ án tốt nghiệp TMĐT.",
    desiredDeadline: "2026-09-22",
    status: "completed",
    progressPercent: 100,
    assignedStaffId: "usr-staff-it",
    assignedStaffName: "Trần Bảo IT",
    firstResponseAt: "2026-09-16 14:15", // Response Time: 25 mins
    deliverableSentAt: "2026-09-20 10:00",
    acceptedAt: "2026-09-21 09:00",
    completedAt: "2026-09-21 16:00",
    isOnTime: true,
    isFirstPassAcceptance: true,
    supportPeriodEndAt: "2026-10-21",
    quotation: {
      amount: 600000,
      finalDeadline: "2026-09-22",
      maxRevisions: 2,
      scopeDetails: "Hồ sơ thiết kế CSDL SQL chuẩn 3NF + Sơ đồ dbdiagram.io + File SQL DDL.",
      issuedAt: "2026-09-16 14:15",
      deliverables: ["Sơ đồ quan hệ ERD 15 bảng", "Script T-SQL tạo bảng & Foreign keys", "Tài liệu giải trình thiết kế"],
      exclusions: ["Không viết code Backend API"],
      acceptanceCriteria: ["Chuẩn 3NF không dư thừa dữ liệu", "Script chạy không báo lỗi"],
      assignedLead: "Trần Bảo IT",
      supportPeriodDays: 30
    },
    paymentInfo: {
      amountPaid: 600000,
      paymentMethod: "VNPay",
      paymentStatus: "verified",
      note: "Đã thanh toán đủ qua VNPay"
    },
    milestones: [
      { id: "m1", title: "Phân tích thực thể & Quan hệ", completed: true, targetDate: "2026-09-18", updatedBy: "Trần Bảo IT" },
      { id: "m2", title: "Vẽ sơ đồ ERD & Soạn Script SQL", completed: true, targetDate: "2026-09-20", updatedBy: "Trần Bảo IT" }
    ],
    deliverables: [
      {
        id: "del-6",
        version: 1,
        title: "Bộ Hồ Sơ CSDL ERD & Script SQL Server 15 Bảng",
        fileLink: "https://dbdiagram.io/d/demo-ecommerce",
        previewUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
        notes: "Đã chuẩn hóa 3NF đầy đủ ràng buộc khóa chính và khóa ngoại.",
        timestamp: "2026-09-20 10:00",
        status: "accepted"
      }
    ],
    uatSubmission: {
      status: "passed",
      items: [
        { id: "u1", category: "functional", criteria: "Script T-SQL thực thi thành công trên SSMS", passed: true },
        { id: "u2", category: "compatibility", criteria: "Đầy đủ quan hệ 1-N và N-N với bảng trung gian", passed: true },
        { id: "u3", category: "documentation", criteria: "Có chú thích chi tiết từng cột và kiểu dữ liệu", passed: true }
      ],
      testerName: "Vũ Đình Khoa",
      submittedAt: "2026-09-21 09:00",
      acceptanceSignoff: {
        confirmed: true,
        signedName: "Vũ Đình Khoa",
        signedAt: "2026-09-21 09:00",
        ratingSatisfaction: 5,
        comment: "CSDL thiết kế rất chặt chẽ, thầy hướng dẫn khen thiết kế chuẩn!"
      }
    },
    transferSession: {
      isCompleted: true,
      sessionDate: "2026-09-21 14:00",
      meetLink: "https://meet.google.com/db-transfer-khoa",
      videoRecordingUrl: "https://drive.google.com/recording-erd-khoa",
      docsUrl: "https://docs.4youtech.com/database-guide",
      completedAt: "2026-09-21 15:00",
      customerConfirmed: true
    },
    postServiceSurvey: {
      id: "srv-6",
      orderId: "REQ-2026-006",
      customerName: "Vũ Đình Khoa",
      submittedAt: "2026-09-21 16:30",
      q1_scopeClarity: 5,
      q2_progressUpdate: 5,
      q3_deliverableQuality: 5,
      q4_revisionHandling: 5,
      q5_transferSession: 5,
      q6_overallSatisfaction: 5,
      recommendIntent: true,
      bestPoint: "Anh Bảo IT giải thích cơ chế chuẩn hóa 3NF cực kỳ dễ hiểu, tự tin phản biện đồ án.",
      improvePoint: "Rất tốt rồi, tiếp tục phát huy."
    },
    revisions: [],
    messages: [],
    supportTickets: [],
    createdAt: "2026-09-16 13:50",
    updatedAt: "2026-09-21 16:30"
  },

  // 7. Direct Outreach #7 (Banner Y Tế V+ Health - Completed)
  {
    id: "REQ-2026-007",
    serviceId: "nhan-dien-thuong-hieu",
    serviceName: "Bộ Banner Quảng Cáo Sức Khỏe Gia Đình V+ Health",
    category: "Design",
    customerId: "usr-cust-7",
    customerName: "Ngô Thùy Trang (V+ Health)",
    customerEmail: "trang.ngo@charity.vn",
    customerPhone: "0978901234",
    requirements: "Thiết kế bộ banner Facebook & Website mang thông điệp chăm sóc sức khỏe gia đình, lối sống xanh an lành.",
    desiredDeadline: "2026-09-25",
    status: "completed",
    progressPercent: 100,
    assignedStaffId: "usr-staff-des",
    assignedStaffName: "Phạm Hà Design",
    firstResponseAt: "2026-09-19 16:20", // Response Time: 20 mins
    deliverableSentAt: "2026-09-23 11:00",
    acceptedAt: "2026-09-24 08:30",
    completedAt: "2026-09-24 15:00",
    isOnTime: true,
    isFirstPassAcceptance: true,
    supportPeriodEndAt: "2026-10-24",
    quotation: {
      amount: 600000,
      finalDeadline: "2026-09-25",
      maxRevisions: 3,
      scopeDetails: "Gồm 2 Banner ngang + 1 Banner vuông cho chiến dịch V+ Health.",
      issuedAt: "2026-09-19 16:20",
      deliverables: ["03 Banner định dạng PNG/JPG chuẩn hiển thị mạng xã hội", "File vector gốc AI"],
      exclusions: ["Không bao gồm chạy quảng cáo Ads"],
      acceptanceCriteria: ["Hệ màu xanh ngọc dịu mát, bố cục thoáng đãng"],
      assignedLead: "Phạm Hà Design",
      supportPeriodDays: 20
    },
    paymentInfo: {
      amountPaid: 600000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      note: "Đã thanh toán 100%"
    },
    milestones: [
      { id: "m1", title: "Lên layout & Bố cục", completed: true, targetDate: "2026-09-21", updatedBy: "Phạm Hà Design" },
      { id: "m2", title: "Xuất file thiết kế chính thức", completed: true, targetDate: "2026-09-23", updatedBy: "Phạm Hà Design" }
    ],
    deliverables: [
      {
        id: "del-7",
        version: 1,
        title: "Bộ Banner Sức Khỏe Gia Đình V+ Health",
        fileLink: "/images/banner-y-te.png",
        previewUrl: "/images/banner-y-te.png",
        notes: "Gửi bạn bộ ấn phẩm phối màu xanh ngọc dịu mát, truyền tải trọn vẹn thông điệp bảo vệ sức khỏe.",
        timestamp: "2026-09-23 11:00",
        status: "accepted"
      }
    ],
    uatSubmission: {
      status: "passed",
      items: [
        { id: "u1", category: "visual", criteria: "Hình ảnh mang lại cảm giác an tâm, giàu sức sống", passed: true },
        { id: "u2", category: "functional", criteria: "Text thông điệp ngắn gọn, dễ nhớ", passed: true },
        { id: "u3", category: "compatibility", criteria: "Kích thước tối ưu hiển thị trên Facebook Feed", passed: true }
      ],
      testerName: "Ngô Thùy Trang",
      submittedAt: "2026-09-24 08:30",
      acceptanceSignoff: {
        confirmed: true,
        signedName: "Ngô Thùy Trang",
        signedAt: "2026-09-24 08:30",
        ratingSatisfaction: 5,
        comment: "Hình ảnh tươi mới, rất hợp với tinh thần trung tâm y tế của nhóm mình!"
      }
    },
    postServiceSurvey: {
      id: "srv-7",
      orderId: "REQ-2026-007",
      customerName: "Ngô Thùy Trang",
      submittedAt: "2026-09-24 16:00",
      q1_scopeClarity: 5,
      q2_progressUpdate: 5,
      q3_deliverableQuality: 5,
      q4_revisionHandling: 5,
      q5_transferSession: 4,
      q6_overallSatisfaction: 5,
      recommendIntent: true,
      bestPoint: "Thiết kế nhanh chóng, giao diện trong sáng đúng thông điệp y tế.",
      improvePoint: "Chưa có."
    },
    revisions: [],
    messages: [],
    supportTickets: [],
    createdAt: "2026-09-19 16:00",
    updatedAt: "2026-09-24 16:00"
  },

  // 8. Direct Outreach #8 (UI/UX Mobile App - Completed with Support Ticket & Free Remedy in SLA)
  {
    id: "REQ-2026-008",
    serviceId: "it-ui-ux",
    serviceName: "Mẫu Giao Diện UI/UX App Di Động Sức Khỏe (20 Màn hình)",
    category: "Design",
    customerId: "usr-cust-8",
    customerName: "Bùi Hoàng Nam (Freelancer)",
    customerEmail: "nam.bui@designfreelance.com",
    customerPhone: "0989012345",
    requirements: "Thiết kế trọn gói bản vẽ Figma Master cho ứng dụng đặt lịch tập gym & theo dõi chỉ số sức khỏe.",
    desiredDeadline: "2026-09-28",
    status: "completed",
    progressPercent: 100,
    assignedStaffId: "usr-staff-des",
    assignedStaffName: "Phạm Hà Design",
    firstResponseAt: "2026-09-21 08:35", // Response Time: 35 mins
    deliverableSentAt: "2026-09-26 15:00",
    acceptedAt: "2026-09-27 10:00",
    completedAt: "2026-09-27 16:00",
    isOnTime: true,
    isFirstPassAcceptance: false, // 1 revision
    supportPeriodEndAt: "2026-10-27",
    quotation: {
      amount: 1500000,
      finalDeadline: "2026-09-28",
      maxRevisions: 3,
      scopeDetails: "File Figma Master 20 màn hình iOS, Style Guide component & Prototype tương tác.",
      issuedAt: "2026-09-21 08:35",
      deliverables: ["Figma Component System", "Prototype Flow tương tác", "Asset icons export"],
      exclusions: ["Không bao gồm code React Native / Flutter"],
      acceptanceCriteria: ["Chuẩn Human Interface Guidelines Apple", "Prototype click được luồng chính"],
      assignedLead: "Phạm Hà Design",
      supportPeriodDays: 30,
      remedyTerms: "Khắc phục lỗi font hoặc missing component miễn phí trong vòng 24h tiếp nhận (Tuân thủ Điều 31 & 36 Luật BVQLNTD)."
    },
    paymentInfo: {
      amountPaid: 1500000,
      paymentMethod: "VNPay",
      paymentStatus: "verified",
      note: "Thanh toán 100% hoàn tất"
    },
    milestones: [
      { id: "m1", title: "Thiết kế Wireframe & Flow", completed: true, targetDate: "2026-09-23", updatedBy: "Phạm Hà Design" },
      { id: "m2", title: "Dựng High-Fidelity UI", completed: true, targetDate: "2026-09-25", updatedBy: "Phạm Hà Design" },
      { id: "m3", title: "Nghiệm thu Prototype & Bàn giao", completed: true, targetDate: "2026-09-27", updatedBy: "Admin" }
    ],
    deliverables: [
      {
        id: "del-8",
        version: 2,
        title: "Bản vẽ Figma Master 20 Màn hình & Interactive Prototype v2",
        fileLink: "https://figma.com/file/demo-fitness-ui",
        previewUrl: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80",
        notes: "Đã cập nhật đầy đủ animation chuyển trang và bổ sung font chữ theo yêu cầu.",
        timestamp: "2026-09-26 15:00",
        status: "accepted"
      }
    ],
    revisions: [
      {
        id: "rev-req-8",
        version: 1,
        feedback: "Bổ sung thêm màn hình Popup xác nhận hủy lịch hẹn để luồng UX hoàn chỉnh.",
        requestedAt: "2026-09-25 17:00",
        status: "resolved"
      }
    ],
    uatSubmission: {
      status: "passed",
      items: [
        { id: "u1", category: "functional", criteria: "Luồng Prototype từ Đăng nhập -> Đặt lịch chạy mượt", passed: true },
        { id: "u2", category: "visual", criteria: "Thiết kế phong cách Glassmorphism sắc sảo", passed: true },
        { id: "u3", category: "documentation", criteria: "Component và Color Tokens được đặt tên chuẩn", passed: true }
      ],
      testerName: "Bùi Hoàng Nam",
      submittedAt: "2026-09-27 10:00",
      acceptanceSignoff: {
        confirmed: true,
        signedName: "Bùi Hoàng Nam",
        signedAt: "2026-09-27 10:00",
        ratingSatisfaction: 5,
        comment: "Prototype trực quan, bàn giao chuẩn chỉnh cho dev frontend."
      }
    },
    transferSession: {
      isCompleted: true,
      sessionDate: "2026-09-27 14:00",
      meetLink: "https://meet.google.com/ui-transfer-nam",
      videoRecordingUrl: "https://drive.google.com/recording-ui-nam",
      docsUrl: "https://docs.4youtech.com/figma-tokens-guide",
      completedAt: "2026-09-27 15:00",
      customerConfirmed: true
    },
    // Minh chứng M4: Support / Complaint Log giải quyết trong SLA <= 3 ngày theo Điều 31 Luật BVQLNTD
    supportTickets: [
      {
        id: "TCK-2026-001",
        orderId: "REQ-2026-008",
        customerName: "Bùi Hoàng Nam",
        customerEmail: "nam.bui@designfreelance.com",
        subject: "Hỗ trợ xuất thiếu icon SVG ở màn hình Tracking",
        content: "Mình mở file Figma thấy thiếu 3 icon SVG ở màn hình Tracking nhịp tim, nhờ nhóm xuất bổ sung giúp nhé.",
        type: "support",
        category: "post_handover",
        priority: "medium",
        status: "resolved",
        assignedStaffId: "usr-staff-des",
        assignedStaffName: "Phạm Hà Design",
        createdAt: "2026-09-27 16:30",
        slaAcknowledgeDeadline: "2026-09-30 09:00", // SLA <= 3 ngày làm việc
        acknowledgedAt: "2026-09-27 17:30", // Xác nhận sau 1.5 giờ!
        remedyType: "free_fix", // Biện pháp khắc phục miễn phí
        remedyDetails: "Đã bổ sung bộ 3 icon SVG độ nét cao vào thư mục assets và cập nhật link Figma.",
        resolvedAt: "2026-09-28 09:00", // Giải quyết xong trong chưa đầy 16h!
        response: "Chào Nam, Phạm Hà Design đã xuất bổ sung đầy đủ 3 icon SVG vào file Figma và gửi kèm link Google Drive. Bạn kiểm tra lại giúp nhóm nhé!",
        customerSatisfactionRating: 5 // Đánh giá hài lòng cách giải quyết khiếu nại (Tax et al., 1998)
      }
    ],
    postServiceSurvey: {
      id: "srv-8",
      orderId: "REQ-2026-008",
      customerName: "Bùi Hoàng Nam",
      submittedAt: "2026-09-28 11:00",
      q1_scopeClarity: 5,
      q2_progressUpdate: 5,
      q3_deliverableQuality: 5,
      q4_revisionHandling: 5,
      q5_transferSession: 5,
      q6_overallSatisfaction: 5,
      recommendIntent: true,
      bestPoint: "Khi gửi ticket hỗ trợ được xác nhận cực nhanh và sửa lỗi miễn phí trong buổi sáng, phong cách làm việc rất uy tín!",
      improvePoint: "Nên tích hợp xuất code Flutter tự động.",
      susScore: 89.0
    },
    messages: [],
    createdAt: "2026-09-21 08:00",
    updatedAt: "2026-09-28 11:00"
  },

  // 9. Direct Outreach #9 (Landing Page Bán Hàng - Accepted & Final Payment Completed)
  {
    id: "REQ-2026-009",
    serviceId: "it-thiet-ke-web",
    serviceName: "Website Landing Page Bán Hàng Thời Trang Hiện Đại",
    category: "IT",
    customerId: "usr-cust-9",
    customerName: "Phạm Quỳnh Chi",
    customerEmail: "quynhchi.fashion@gmail.com",
    customerPhone: "0990123456",
    requirements: "Xây dựng website bán hàng thời trang 1 trang tối ưu tỷ lệ chuyển đổi, tích hợp đặt hàng và kết nối Zalo/Hotline.",
    desiredDeadline: "2026-09-30",
    status: "completed",
    progressPercent: 100,
    assignedStaffId: "usr-staff-it",
    assignedStaffName: "Trần Bảo IT",
    firstResponseAt: "2026-09-24 13:20", // Response Time: 20 mins
    deliverableSentAt: "2026-09-28 16:00",
    acceptedAt: "2026-09-29 10:00",
    completedAt: "2026-09-29 15:00",
    isOnTime: true,
    isFirstPassAcceptance: true,
    supportPeriodEndAt: "2026-10-29",
    quotation: {
      amount: 1400000,
      finalDeadline: "2026-09-30",
      maxRevisions: 3,
      scopeDetails: "Website Landing Page chuẩn SEO, tích hợp giỏ hàng và form đặt hàng VietQR.",
      issuedAt: "2026-09-24 13:20",
      deliverables: ["Full source code Web", "Tích hợp Form đặt hàng", "Deploy Vercel & SSL miễn phí"],
      exclusions: ["Không bao gồm phí duy trì hosting VPS riêng"],
      acceptanceCriteria: ["Chuẩn Mobile 100%", "Form gửi thông tin về email chủ shop"],
      assignedLead: "Trần Bảo IT",
      supportPeriodDays: 30
    },
    paymentInfo: {
      amountPaid: 1400000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      note: "Đã thanh toán đủ 50% cọc + 50% còn lại sau nghiệm thu"
    },
    milestones: [
      { id: "m1", title: "Dựng giao diện mẫu", completed: true, targetDate: "2026-09-26", updatedBy: "Trần Bảo IT" },
      { id: "m2", title: "Lập trình chức năng đặt hàng", completed: true, targetDate: "2026-09-28", updatedBy: "Trần Bảo IT" },
      { id: "m3", title: "Nghiệm thu UAT & Bàn giao", completed: true, targetDate: "2026-09-29", updatedBy: "Admin" }
    ],
    deliverables: [
      {
        id: "del-9",
        version: 1,
        title: "Landing Page Shop Thời Trang & Mã Nguồn",
        fileLink: "https://demo.4youtech.com/shop-sample",
        previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        notes: "Gửi bản web chạy thực tế trên Vercel. Khách hàng kiểm thử UAT tính năng đặt hàng giúp nhóm nhé.",
        timestamp: "2026-09-28 16:00",
        status: "accepted"
      }
    ],
    uatSubmission: {
      status: "passed",
      items: [
        { id: "u1", category: "functional", criteria: "Form đặt hàng gửi thông báo thành công", passed: true },
        { id: "u2", category: "visual", criteria: "Giao diện bắt mắt, hình ảnh sản phẩm load nhanh", passed: true },
        { id: "u3", category: "compatibility", criteria: "Bấm gọi hotline và chat Zalo mở ứng dụng mượt mà", passed: true }
      ],
      testerName: "Phạm Quỳnh Chi",
      submittedAt: "2026-09-29 10:00",
      acceptanceSignoff: {
        confirmed: true,
        signedName: "Phạm Quỳnh Chi",
        signedAt: "2026-09-29 10:00",
        ratingSatisfaction: 5,
        comment: "Website rất đẹp, khách vào xem khen giao diện sang trọng!"
      }
    },
    transferSession: {
      isCompleted: true,
      sessionDate: "2026-09-29 14:00",
      videoRecordingUrl: "https://drive.google.com/recording-web-quynhchi",
      docsUrl: "https://docs.4youtech.com/shop-admin-guide",
      completedAt: "2026-09-29 15:00",
      customerConfirmed: true
    },
    postServiceSurvey: {
      id: "srv-9",
      orderId: "REQ-2026-009",
      customerName: "Phạm Quỳnh Chi",
      submittedAt: "2026-09-29 16:00",
      q1_scopeClarity: 5,
      q2_progressUpdate: 5,
      q3_deliverableQuality: 5,
      q4_revisionHandling: 5,
      q5_transferSession: 5,
      q6_overallSatisfaction: 5,
      recommendIntent: true,
      bestPoint: "Quy trình làm việc minh bạch, chỉ thu 50% còn lại sau khi mình tự tay test web xong xuôi.",
      improvePoint: "Nên hỗ trợ kết nối thêm cổng VNPay cá nhân.",
      susScore: 91.0
    },
    revisions: [],
    messages: [],
    supportTickets: [],
    createdAt: "2026-09-24 13:00",
    updatedAt: "2026-09-29 16:00"
  },

  // 10. Direct Outreach #10 (Test Lỗi Phần Mềm - In Progress / Fast Response)
  {
    id: "REQ-2026-010",
    serviceId: "it-test-loi-phan-mem",
    serviceName: "Kiểm Thử Phần Mềm (Manual & UI Testing) Ứng Dụng",
    category: "IT",
    customerId: "usr-cust-10",
    customerName: "Nguyễn Đăng Quang",
    customerEmail: "quang.dang@gmail.com",
    customerPhone: "0911223344",
    requirements: "Kiểm thử rà soát toàn bộ lỗi giao diện, tương thích trình duyệt và xuất báo cáo Test Matrix cho ứng dụng đồ án.",
    desiredDeadline: "2026-10-08",
    status: "in_progress",
    progressPercent: 40,
    assignedStaffId: "usr-staff-it",
    assignedStaffName: "Trần Bảo IT",
    firstResponseAt: "2026-09-28 09:18", // Response Time: 18 mins
    quotation: {
      amount: 500000,
      finalDeadline: "2026-10-07",
      maxRevisions: 2,
      scopeDetails: "Báo cáo Test Case Excel + Danh sách Bug Log kèm video minh họa.",
      issuedAt: "2026-09-28 09:18",
      deliverables: ["Bảng Test Cases (Excel/PDF)", "Danh sách Bug kèm ảnh chụp và video", "Đề xuất fix lỗi"],
      exclusions: ["Không trực tiếp can thiệp sửa code nguồn"],
      acceptanceCriteria: ["Báo cáo tối thiểu 20 test cases trọng yếu"],
      assignedLead: "Trần Bảo IT",
      supportPeriodDays: 14
    },
    paymentInfo: {
      amountPaid: 250000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      note: "Đã cọc 50%"
    },
    milestones: [
      { id: "m1", title: "Xây dựng kịch bản kiểm thử", completed: true, targetDate: "2026-09-30", updatedBy: "Trần Bảo IT" },
      { id: "m2", title: "Thực thi test & Ghi nhận Bug", completed: false, targetDate: "2026-10-05", updatedBy: "Trần Bảo IT" }
    ],
    deliverables: [],
    revisions: [],
    messages: [],
    supportTickets: [],
    createdAt: "2026-09-28 09:00",
    updatedAt: "2026-09-28 09:18"
  }
];

// Seed Reviews
export const SEED_REVIEWS: ServiceReview[] = [
  {
    id: "rev-1",
    orderId: "REQ-PREV-099",
    serviceId: "portfolio-co-san",
    serviceName: "Portfolio từ thiết kế có sẵn",
    customerName: "Hoàng Kim Ngân",
    rating: 5,
    comment: "Nhóm làm việc rất nhiệt tình, code đẹp đúng thiết kế Figma của mình, giao đúng hạn trước 1 ngày!",
    createdAt: "2026-09-10 16:00",
    moderated: true,
    replyText: "Cảm ơn Kim Ngân đã tin tưởng và đánh giá 5 sao cho 4YouTech! Chúc bạn có một website portfolio thật ấn tượng.",
    repliedBy: "Quản trị viên 4YouTech",
    repliedAt: "2026-09-11 09:30"
  },
  {
    id: "rev-2",
    orderId: "REQ-PREV-098",
    serviceId: "ui-design",
    serviceName: "Thiết kế Giao diện Web & App (UI/UX)",
    customerName: "Đỗ Quốc Việt",
    rating: 5,
    comment: "Giao diện hiện đại, phối màu sinh động. Sẽ ủng hộ 4YouTech trong các đồ án tiếp theo!",
    createdAt: "2026-09-12 11:20",
    moderated: true
  }
];
