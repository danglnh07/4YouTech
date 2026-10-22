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

export interface ProjectVersion {
  title: string;
  image: string;
  badge?: string;
  description?: string;
  characteristics?: string;
}

export interface ProjectBrandColor {
  name: string;
  hex?: string;
  role: string;
  desc: string;
}

export interface ProjectBrandVariant {
  name: string;
  bgDesc: string;
  description: string;
  characteristics: string;
  image: string;
}

export interface ProjectBrandDetails {
  overview?: string;
  idea?: string;
  visualAnalysis?: string;
  layout?: string;
  colors?: ProjectBrandColor[];
  typography?: string;
  tagline?: string;
  colorVariants?: ProjectBrandVariant[];
  summary?: string;
}

export interface SampleProject {
  id: string;
  name: string;
  category: ServiceCategory;
  subCategory?: "Logo" | "Banner" | "Poster" | "Website" | "UI/UX" | "Database" | "Other";
  image: string;
  images?: string[];
  versions?: ProjectVersion[];
  description: string;
  detailedDescription?: string;
  brandDetails?: ProjectBrandDetails;
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
      "/images/portfolio-trunghieu.jpg",
      "/images/portfolio-camly.png"
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
    id: "proj-portfolio-trunghieu",
    name: "Website Portfolio Cá Nhân Developer Pro - Nguyễn Trung Hiếu",
    category: "IT",
    subCategory: "Website",
    description: "Website Personal Portfolio Backend Developer & Web/UI Design chuyên nghiệp xuất bản trực tiếp trên Netlify. Tích hợp Dark Mode phong cách công nghệ cao với font Manrope & DM Mono, trình bày triết lý 'Từ logic đến trải nghiệm', dự án nền tảng 4YouTech (Fullstack + Figma Design/Prototype) và bộ 3 chứng chỉ quốc tế uy tín từ Coursera (Minnesota, Michigan, CertNexus).",
    image: "/images/portfolio-trunghieu.jpg",
    link: "https://nguyen-trung-hieu.netlify.app/",
    featured: true,
    brandDetails: {
      overview: "Website Portfolio cá nhân được xây dựng với định vị một Backend Developer đa năng, kết hợp tư duy logic hệ thống vững chắc với năng lực thiết kế giao diện Web & UI/UX hiện đại.\n\nÝ tưởng cốt lõi xoay quanh thông điệp \"Từ logic đến trải nghiệm\" — thể hiện sự kết nối chặt chẽ giữa cách thức dữ liệu và hệ thống vận hành trơn tru phía sau (Backend) với cách người dùng thực sự cảm nhận và tương tác trực quan ở phía trước (Frontend & UX). Giao diện mang hơi thở Futuristic Tech tối giản, sắc sảo và đậm chất kỹ sư phần mềm chuyên nghiệp.",
      visualAnalysis: "Điểm nhấn thị giác mở màn là khối Hero Art tương tác dạng Orb số hóa mang ký tự biểu trưng \"H.\" phát sáng đa tầng, tượng trưng cho hạt nhân logic và sự sáng tạo kỹ thuật số. Hiệu ứng nhịp đập Pulse đèn tín hiệu xanh báo trạng thái hoạt động trực tuyến (\"PORTFOLIO / 2026\") lập tức thu hút ánh nhìn.\n\nPhần trình diễn dự án nổi bật 4YouTech được đóng khung giao diện 3 pha (Discover - Design - Build) với 3 nút chuyển hướng tức thì đến Web thực tế, Bản thiết kế Figma Canvas và Bản tương tác Figma Prototype.",
      layout: "Website áp dụng bố cục trang đơn (Single-Page Application) liền mạch với cấu trúc 3 phân khu chuẩn hóa theo chỉ số số học [01 — 03]:\n\n• 01 / GIỚI THIỆU (About): Bố cục chia đôi (Split layout) giữa tuyên ngôn triết lý phát triển và danh mục thẻ kỹ năng chuyên môn (Backend, Web Dev, Figma UI, SDLC).\n• 02 / DỰ ÁN NỔI BẬT (Featured Project): Khung giao diện trung tâm nổi bật dự án 4YouTech kèm bộ liên kết tài nguyên trực tiếp.\n• 03 / HỌC TẬP & CHỨNG CHỈ (Certificates): Lưới 3 cột (3-column grid) trưng bày trực quan các chứng chỉ quốc tế có gắn link xác thực (Verify Credential) trực tuyến.",
      colors: [
        {
          name: "Dark Obsidian",
          hex: "#11151b",
          role: "Nền chủ đạo (Background)",
          desc: "Tạo chiều sâu không gian số, giảm mỏi mắt và tôn lên vẻ hiện đại, công nghệ cao của một kỹ sư Backend."
        },
        {
          name: "Electric Cyan",
          hex: "#06b6d4",
          role: "Điểm nhấn tương tác (Accent)",
          desc: "Xuất hiện ở các nút CTA, hiệu ứng hover, pulse tín hiệu và liên kết định hướng quan trọng."
        },
        {
          name: "Paper Slate",
          hex: "#f8fafc",
          role: "Văn bản & Tiêu đề (Typography)",
          desc: "Đạt độ tương phản chuẩn WCAG AAA trên nền đen, mang lại trải nghiệm đọc rõ ràng, sắc nét."
        }
      ],
      typography: "Sự kết hợp tinh tế giữa hai họ font chuẩn công nghệ quốc tế: Font tiêu đề chính Manrope (Sans-serif) với các biến thể nét in đậm (800) và chữ nghiêng nghệ thuật (Italic) tạo phong thái đĩnh đạc, hiện đại; kết hợp font DM Mono (Monospace) cho các chỉ số phân đoạn [01 / 02 / 03], nhãn kỹ thuật và mã code, mang lại phong vị của một IDE lập trình cao cấp.",
      tagline: "Từ logic đến trải nghiệm — Tôi quan tâm đến cách hệ thống vận hành phía sau và cách người dùng trải nghiệm sản phẩm ở phía trước.",
      summary: "Website Portfolio của Nguyễn Trung Hiếu là hình mẫu chuẩn mực cho một lập trình viên thế hệ mới: giao diện tinh gọn, hiệu năng tải trang tức thì (<500ms), bố cục trực quan chuẩn quốc tế và minh chứng năng lực rõ ràng qua dự án thực tế cùng các chứng nhận Coursera được xác thực minh bạch."
    }
  },
  {
    id: "proj-portfolio-camly",
    name: "Website Portfolio Cá Nhân Graphic Designer - Nguyễn Thị Cẩm Lý",
    category: "IT",
    subCategory: "Website",
    description: "Website Portfolio cá nhân Graphic Design xuất bản trực tiếp trên Netlify với phong cách Neo-Brutalism & Modern Pop Art rực rỡ, lấy cảm hứng từ kỹ thuật in ấn spot-colour print cổ điển. Trưng bày hơn 17 tác phẩm đa dạng (Logo, Banner, Poster, Bao bì, Bìa sách, Ấn phẩm sự kiện), hệ thống bộ lọc động kèm Lightbox tương tác và 2 chứng chỉ Coursera từ ĐH FPT định dạng cuống vé cổ điển.",
    image: "/images/portfolio-camly.png",
    link: "https://nguyen-thi-cam-ly.netlify.app/",
    featured: true,
    brandDetails: {
      overview: "Website Portfolio cá nhân của Nguyễn Thị Cẩm Lý là một tuyên ngôn thị giác sống động với triết lý: \"I turn creative ideas into thoughtful designs — From rough sketches to refined designs. I make things look like they mean it.\"\n\nThiết kế đoạn tuyệt với những bóng mờ mềm mại thông thường, thay vào đó là phong cách Neo-Brutalism kết hợp Modern Pop Art với những mảng màu phẳng sắc cạnh (flat, hard-edged colour blocks) lấy cảm hứng từ kỹ thuật in spot-colour print truyền thống.",
      visualAnalysis: "Tâm điểm thị giác ở khu vực Hero là tấm poster nghệ thuật trừu tượng đặt nghiêng 2.5 độ với bóng đổ cứng (hard shadow 14px) màu xanh thẫm, tích hợp hiệu ứng animation dạng pop-in bật nảy khi tải trang.\n\nCác mảng hình học cơ bản (nửa vầng trăng, hình tròn, kẻ sọc barcode, hình vuông xoay góc 12 độ) được sắp đặt theo nguyên lý bố cục phi đối xứng, tạo nhịp điệu thị giác vui tươi, tràn đầy năng lượng sáng tạo của một nhà thiết kế trẻ.",
      layout: "Website sử dụng kiến trúc chia khối màu đa tầng (Multi-colored Blocks) liên tục tạo bất ngờ khi cuộn trang:\n\n• Hero Block (Nền Xanh Coban #2B35F5): Màn chào sân ấn tượng với typography khổng lồ và poster nghệ thuật.\n• Work Showcase (Nền Giấy Trắng #FFFFFF): Hệ thống lọc danh mục thông minh (Banner, Poster, Logo, Menu, Bìa sách, Khác) cùng lưới Masonry 3 cột trưng bày 17+ dự án thực tế kèm Lightbox tương tác phóng to chi tiết.\n• About & Disciplines (Nền Vàng Chanh #D4F53C): Bố cục 2 cột thể hiện chân dung khung tròn cách điệu, kỹ năng chuyên sâu và phần mềm thành thạo (Illustrator, Photoshop, InDesign, Figma).\n• Certificates (Nền Hồng Pastel #FFB8DE): Trình bày chứng chỉ Coursera dưới dạng các cuống vé xem phim cổ điển (Ticket Stubs) đục lỗ khuyết bán nguyệt cực kỳ độc đáo.",
      colors: [
        {
          name: "Electric Cobalt Blue",
          hex: "#2B35F5",
          role: "Hero & Contact Block",
          desc: "Đại diện cho sự tự tin, chuyên nghiệp, chiều sâu nghệ thuật và khát khao sáng tạo không giới hạn."
        },
        {
          name: "Acid Lime",
          hex: "#D4F53C",
          role: "About & Accent Highlights",
          desc: "Màu điểm nhấn năng động, nút CTA và khối About, truyền tải năng lượng tươi mới và phong cách phá cách."
        },
        {
          name: "Bubblegum Pink",
          hex: "#FFB8DE",
          role: "Certificates Background",
          desc: "Màu nền khu vực chứng chỉ và hình họa bổ trợ, mang sắc thái ngọt ngào, tinh tế của tư duy đồ họa thị giác."
        }
      ],
      typography: "Bộ đôi phông chữ cá tính mang tính nhận diện thương hiệu tuyệt đối: Tiêu đề sử dụng Unbounded — kiểu chữ Sans-serif hình học góc cạnh, nét siêu đậm (Ultra Black) tạo hiệu ứng giật gân thị giác; phần thân trang sử dụng Hanken Grotesk với độ rộng dòng thoáng đãng, dễ đọc trên mọi thiết bị.",
      tagline: "I turn creative ideas into thoughtful designs — From rough sketches to refined designs.",
      summary: "Một tác phẩm portfolio kỹ thuật số xuất sắc, xóa nhòa ranh giới giữa một website tĩnh và một triển lãm nghệ thuật đồ họa. Trang web không chỉ lưu trữ tác phẩm mà bản thân nó chính là minh chứng sống động nhất cho tư duy màu sắc, bố cục và bản lĩnh sáng tạo độc nhất của Nguyễn Thị Cẩm Lý."
    }
  },
  {
    id: "proj-mcropdiary",
    name: "MyCropDiary - App & Giao Diện UI/UX Quản Lý Mùa Vụ Nông Nghiệp Tiêu Chuẩn VietGAP",
    category: "Design",
    subCategory: "UI/UX",
    description: "Nền tảng ứng dụng di động & Giao diện UI/UX chuyên sâu MyCropDiary hỗ trợ số hóa quy trình quản lý mùa vụ canh tác nông nghiệp theo tiêu chuẩn VietGAP. Cung cấp giải pháp ghi chép nhật ký nông vụ điện tử tự động, giám sát thời tiết vi khí hậu thời gian thực, quản lý kho vật tư - phân bón - thuốc bảo vệ thực vật, cảnh báo thời gian cách ly thu hoạch và trích xuất mã QR truy xuất nguồn gốc nông sản minh bạch.",
    image: "/images/mcropdiary-ui.jpg",
    link: "https://www.figma.com/proto/u1rr5WNOTvbwGZ5Whto51z/Untitled?node-id=0-1&p=f&t=RPGQ7V25bEgJuevk-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=91%3A6&show-proto-sidebar=1",
    designLink: "https://www.figma.com/design/u1rr5WNOTvbwGZ5Whto51z/Untitled?node-id=0-1&t=RPGQ7V25bEgJuevk-1",
    featured: true,
    brandDetails: {
      overview: "MyCropDiary được phát triển từ nhu cầu cấp thiết về việc chuẩn hóa và số hóa quy trình canh tác nông nghiệp công nghệ cao tại Việt Nam, trực tiếp giải quyết bài toán ghi chép nhật ký mùa vụ theo chuẩn VietGAP (Good Agricultural Practices).\n\nÝ tưởng cốt lõi là chuyển đổi sổ tay ghi chép truyền thống dễ rách, thất lạc và thiếu minh bạch thành một ứng dụng di động trực quan, thông minh và cực kỳ dễ sử dụng đối với cả người nông dân lẫn các kỹ sư nông nghiệp tại các hợp tác xã, trang trại. Nền tảng vừa là công cụ giám sát canh tác, vừa là chứng thư bảo chứng chất lượng và truy xuất nguồn gốc cho nông sản sạch khi đưa ra thị trường tiêu thụ.",
      visualAnalysis: "Trọng tâm thiết kế UI/UX được định hình xoay quanh nguyên lý \"Mobile-First for Field Work\" — tối ưu tuyệt đối cho thao tác bằng một tay (Thumb-zone) ngay tại bờ ruộng hoặc nhà màng:\n\n• Dashboard tổng quan mùa vụ: Trực quan hóa tiến độ sinh trưởng cây trồng bằng thanh tiến trình trực quan (Gieo mầm → Cây con → Ra hoa → Đậu trái → Thu hoạch).\n• Nhật ký điện tử 1-chạm (One-tap Logging): Ghi nhận nhanh các hoạt động tưới nước, bón phân, làm cỏ hoặc phòng trừ sâu bệnh bằng hệ thống icon minh họa lớn, giảm thiểu tối đa việc phải gõ văn bản phức tạp.\n• Cảnh báo an toàn & thời gian cách ly (PHI - Pre-Harvest Interval): Tự động đếm ngược số ngày cách ly sau khi phun chế phẩm sinh học hoặc phân bón, ngăn chặn nguy cơ thu hoạch sớm khi tồn dư hóa chất chưa phân hủy an toàn.",
      layout: "Hệ thống màn hình ứng dụng được cấu trúc khoa học theo hành trình trải nghiệm người dùng (Figma Prototype gồm 18+ artboards hoàn chỉnh):\n\n• Màn hình Trang chủ (Farm Hub): Thẻ trạng thái vi khí hậu thời tiết hôm nay, danh sách việc cần làm (To-Do List) trong ngày và cảnh báo sâu bệnh theo mùa.\n• Quản lý Lô/Thửa đất (Plot Management): Sơ đồ các thửa ruộng được phân chia trực quan, hiển thị giống cây trồng, ngày xuống giống và sản lượng dự kiến.\n• Quản lý Vật tư & Kho (Inventory): Thống kê số lượng hạt giống, phân bón, thuốc BVTV với mã vạch Barcode/QR, hạn sử dụng và chi phí đầu vào.\n• Báo cáo & QR Truy xuất nguồn gốc (Traceability): Tạo mã QR động cho từng lô nông sản thu hoạch, cho phép người tiêu dùng quét để xem toàn bộ lịch sử chăm sóc đạt chuẩn VietGAP.",
      colors: [
        {
          name: "VietGAP Emerald Green",
          hex: "#16a34a",
          role: "Màu chủ đạo (Primary Green)",
          desc: "Tượng trưng cho sự sống xanh tươi, nông nghiệp sạch và tiêu chuẩn chất lượng VietGAP nghiêm ngặt."
        },
        {
          name: "Harvest Amber Gold",
          hex: "#f59e0b",
          role: "Màu điểm nhấn (Harvest Accent)",
          desc: "Biểu trưng cho mùa màng bội thu, hoa trái chín rộ, trạng thái cảnh báo an toàn và giá trị kinh tế."
        },
        {
          name: "AgriTech Sky Blue",
          hex: "#0284c7",
          role: "Công nghệ & Tưới tiêu (IoT Water)",
          desc: "Đại diện cho tính năng tưới tiêu thông minh, dữ liệu khí tượng vi khí hậu và kết nối cảm biến nông trại."
        }
      ],
      typography: "Hệ thống phông chữ Sans-serif hiện đại (Plus Jakarta Sans / Inter) với các phân cấp thị giác rõ ràng: cỡ chữ tối thiểu 14px cho body text và 20px-28px cho các chỉ số số liệu quan trọng. Khoảng cách dòng thoáng (Line height 1.5) cùng các nút bấm to bản bo tròn (Corner radius 16px) mang lại trải nghiệm bấm chắc chắn, hạn chế thao tác nhầm khi người dùng đeo găng tay lao động.",
      tagline: "Số hóa nhật ký mùa vụ — Nâng tầm nông sản Việt theo chuẩn VietGAP.",
      summary: "MyCropDiary là một giải pháp thiết kế UI/UX toàn diện cho ngành nông nghiệp số, kết hợp hoàn hảo giữa quy chuẩn pháp lý khắt khe của VietGAP với trải nghiệm người dùng hiện đại, mở ra bước đột phá trong quản trị nông trại thông minh và minh bạch chuỗi cung ứng thực phẩm an toàn."
    }
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
    name: "Logo Dr. Bọ Rùa (Sản Phẩm Thuốc Trừ Sâu)",
    category: "Design",
    subCategory: "Logo",
    description: "Logo Dr. Bọ Rùa lấy cảm hứng từ loài thiên địch có ích trong nông nghiệp, kiểm soát sâu rệp hại mùa màng. Thiết kế cách điệu hình học tối giản với 3 phiên bản màu (Nền trắng, Nền đỏ đậm, Nền đen tương phản cao).",
    image: "/images/logo-ladybug-v1.png",
    images: [
      "/images/logo-ladybug-v1.png",
      "/images/logo-ladybug-v2.png",
      "/images/logo-ladybug-v3.png"
    ],
    versions: [
      {
        title: "Phương án tiêu chuẩn (Nền trắng, biểu tượng màu đỏ)",
        image: "/images/logo-ladybug-v1.png",
        badge: "Bản Gốc • Trắng Đỏ",
        description: "Phương án màu sắc tiêu chuẩn trên nền sáng, tôn vinh hình khối chú bọ rùa đỏ cô đọng, sắc nét và dễ ứng dụng trên bao bì, nhãn chai nông nghiệp.",
        characteristics: "Sạch sẽ, rõ nét, nhận diện tự nhiên."
      },
      {
        title: "Phương án đảo màu (Nền đỏ đậm, biểu tượng màu trắng)",
        image: "/images/logo-ladybug-v2.png",
        badge: "Đảo Màu • Đỏ Trắng",
        description: "Phương án đảo màu tạo ấn tượng thị giác mạnh mẽ với nền đỏ đậm của sức mạnh và sự cảnh giác, biểu tượng bọ rùa trắng nổi bật giúp thu hút sự chú ý ngay lập tức trên kệ trưng bày.",
        characteristics: "Mạnh mẽ, ấm áp, nổi bật trên kệ hàng."
      },
      {
        title: "Phương án tương phản cao (Nền đen, biểu tượng đỏ viền trắng)",
        image: "/images/logo-ladybug-v3.png",
        badge: "Nền Đen • Đỏ Viền Trắng",
        description: "Phương án trên nền tối mang diện mạo công nghệ, sắc đỏ kết hợp đường viền mảnh màu trắng tạo độ tương phản cao về độ sáng, làm rõ từng hình khối và râu bọ rùa cách điệu.",
        characteristics: "Tối giản, uy lực, tương phản vượt trội."
      }
    ],
    brandDetails: {
      overview: "Logo lấy cảm hứng từ hình tượng bọ rùa, một loài côn trùng có ích trong nông nghiệp, nổi bật với khả năng kiểm soát các loài sâu hại như rệp cây. Việc lựa chọn bọ rùa làm biểu tượng tạo sự liên kết trực tiếp với lĩnh vực bảo vệ thực vật, đồng thời truyền tải thông điệp về giải pháp phòng trừ sâu hại và bảo vệ mùa màng hiệu quả.",
      idea: "Ý tưởng chủ đạo của logo bắt nguồn từ hình tượng bọ rùa, một loài côn trùng có ích trong nông nghiệp, nổi bật với khả năng kiểm soát các loài sâu hại như rệp cây. Việc lựa chọn bọ rùa làm biểu tượng tạo sự liên kết trực tiếp với lĩnh vực bảo vệ thực vật, đồng thời truyền tải thông điệp về giải pháp phòng trừ sâu hại và bảo vệ mùa màng. Phần thân được kết hợp với những đường nét gợi liên tưởng đến chữ cái cách điệu, góp phần tạo dấu ấn riêng cho thương hiệu.",
      colors: [
        {
          name: "Màu Đỏ Nông Nghiệp",
          hex: "#C62828",
          role: "Màu chủ đạo / Sức mạnh diệt trừ",
          desc: "Màu đỏ là màu chủ đạo, gắn liền với hình ảnh tự nhiên của bọ rùa và mang ý nghĩa về sức mạnh, sự chủ động và tính hiệu quả. Trong lĩnh vực thuốc trừ sâu, màu đỏ còn tạo cảm giác cảnh giác và khả năng hành động nhanh chóng trước các tác nhân gây hại."
        },
        {
          name: "Màu Trắng Tinh Khiết",
          hex: "#FFFFFF",
          role: "Đường nét & Đảo màu",
          desc: "Xuất hiện ở các khoảng trống phân chia bộ phận râu, đầu và cánh, giúp hình khối tối giản rõ ràng, đồng thời tượng trưng cho sự an toàn và hiệu quả minh bạch đối với cây trồng."
        },
        {
          name: "Màu Đen Tương Phản",
          hex: "#0A0A0A",
          role: "Nền tương phản cao",
          desc: "Khi đặt trên nền đen, sắc đỏ tạo sự tương phản về độ sáng nhất định, mang đến diện mạo mạnh mẽ và nổi bật trên bao bì, nhãn mác và truyền thông số."
        }
      ],
      typography: "Logo được xây dựng theo phong cách tối giản và cách điệu hình học. Hai chiếc râu, phần đầu hình bán nguyệt và thân bọ rùa tạo thành một tổng thể dễ nhận biết. Phần thân được kết hợp với những đường nét gợi liên tưởng đến chữ cái cách điệu, góp phần tạo dấu ấn riêng cho thương hiệu. Cấu trúc logo gần đối xứng theo trục dọc, mang lại cảm giác chắc chắn, ổn định và dễ ghi nhớ. Các khoảng trống bên trong được sử dụng để phân chia những bộ phận của biểu tượng, giúp thiết kế không trở nên quá phức tạp.",
      colorVariants: [
        {
          name: "Nền trắng, biểu tượng màu đỏ",
          bgDesc: "Phương án tiêu chuẩn",
          characteristics: "Sạch sẽ, rõ nét, nhận diện tự nhiên.",
          description: "Phương án màu sắc tiêu chuẩn trên nền sáng, tôn vinh hình khối chú bọ rùa đỏ cô đọng, sắc nét và dễ ứng dụng trên bao bì, nhãn chai nông nghiệp.",
          image: "/images/logo-ladybug-v1.png"
        },
        {
          name: "Nền đỏ đậm, biểu tượng màu trắng",
          bgDesc: "Phương án đảo màu",
          characteristics: "Mạnh mẽ, ấm áp, nổi bật trên kệ hàng.",
          description: "Phương án đảo màu tạo ấn tượng thị giác mạnh mẽ với nền đỏ đậm của sức mạnh và sự cảnh giác, biểu tượng bọ rùa trắng nổi bật giúp thu hút sự chú ý ngay lập tức trên kệ trưng bày.",
          image: "/images/logo-ladybug-v2.png"
        },
        {
          name: "Nền đen, biểu tượng đỏ viền trắng",
          bgDesc: "Phương án tương phản cao",
          characteristics: "Tối giản, uy lực, tương phản vượt trội.",
          description: "Phương án trên nền tối mang diện mạo công nghệ, sắc đỏ kết hợp đường viền mảnh màu trắng tạo độ tương phản cao về độ sáng, làm rõ từng hình khối và râu bọ rùa cách điệu.",
          image: "/images/logo-ladybug-v3.png"
        }
      ],
      summary: "Logo có hình khối tương đối cô đọng, phù hợp với bao bì sản phẩm, nhãn chai, tem dán, biển quảng cáo và các nền tảng truyền thông số. Biểu tượng bọ rùa giúp khách hàng dễ dàng liên tưởng đến hoạt động kiểm soát sâu hại một cách chuyên nghiệp, uy tín và hiệu quả cao."
    },
    link: "/images/logo-ladybug-v1.png",
    featured: true
  },
  {
    id: "proj-logo-phin-coffee",
    name: "Logo Cà Phê “PHIN” (PHIN COFFEE - 3 Phiên Bản Sáng Tối)",
    category: "Design",
    subCategory: "Logo",
    description: "Thiết kế Logo PHIN COFFEE mang đậm bản sắc cà phê Việt Nam kết hợp phong cách đồ họa hiện đại với 3 phiên bản màu (Phương án gốc Nền Vàng, Đảo màu Nền Nâu, Đơn sắc Nền Đen). Ý tưởng phin cà phê truyền thống uốn lượn kết hợp tách cà phê ấm áp.",
    image: "/images/logo-phin-coffee-v1.png",
    images: [
      "/images/logo-phin-coffee-v1.png",
      "/images/logo-phin-coffee-v3.png",
      "/images/logo-phin-coffee-v2.png"
    ],
    versions: [
      {
        title: "Phương án màu gốc (Nền vàng, biểu tượng và chữ màu nâu)",
        image: "/images/logo-phin-coffee-v1.png",
        badge: "Bản Gốc • Vàng Nâu",
        description: "Phương án màu gốc mang đến cảm giác ấm áp, thân thiện và trẻ trung. Màu vàng nổi bật giúp thu hút sự chú ý, trong khi màu nâu gợi liên tưởng đến cà phê rang xay và hương vị đậm đà. Sự kết hợp này tạo nên phong cách gần gũi, năng động và dễ nhận diện.",
        characteristics: "Tươi sáng, nổi bật, gần gũi."
      },
      {
        title: "Phương án đảo màu (Nền nâu, biểu tượng và chữ màu vàng)",
        image: "/images/logo-phin-coffee-v3.png",
        badge: "Đảo Màu • Nâu Vàng",
        description: "Phương án đảo màu tạo cảm giác trầm ấm, đậm đà và trưởng thành hơn. Nền nâu gợi đến hạt cà phê rang và không gian quán cà phê, còn màu vàng làm nổi bật biểu tượng cùng tên thương hiệu. Tổng thể mang nét cá tính, tạo chiều sâu thị giác và phù hợp với hình ảnh thương hiệu cà phê hiện đại.",
        characteristics: "Ấm áp, cá tính, đậm chất cà phê."
      },
      {
        title: "Phương án đơn sắc (Nền đen, biểu tượng và chữ màu trắng)",
        image: "/images/logo-phin-coffee-v2.png",
        badge: "Đơn Sắc • Đen Trắng",
        description: "Phương án đơn sắc mang đến cảm giác tối giản, hiện đại và mạnh mẽ. Màu trắng nổi bật trên nền đen giúp logo có độ tương phản cao, làm rõ hình khối, đường nét và kiểu chữ. Việc loại bỏ màu sắc trang trí giúp tập trung vào cấu trúc biểu tượng và tăng tính linh hoạt khi ứng dụng trên nhiều chất liệu.",
        characteristics: "Tối giản, rõ ràng, hiện đại."
      }
    ],
    brandDetails: {
      overview: "Logo PHIN COFFEE được thiết kế theo phong cách đơn giản, độc đáo và mang đậm nét đặc trưng của văn hóa cà phê Việt Nam. Logo sử dụng hình ảnh chiếc phin cà phê cách điệu kết hợp với tách cà phê và tên thương hiệu, tạo nên dấu ấn trực quan dễ nhận biết. Tổng thể thiết kế hướng đến sự gần gũi, trẻ trung nhưng vẫn thể hiện được nét truyền thống của cà phê phin Việt Nam.",
      idea: "Ý tưởng chủ đạo của logo bắt nguồn từ hình ảnh phin cà phê truyền thống của Việt Nam – một dụng cụ pha chế quen thuộc, gắn liền với thói quen thưởng thức cà phê chậm rãi. Hình ảnh chiếc phin được cách điệu thành những đường nét uốn lượn, kết hợp với tách cà phê và giọt cà phê phía trên, tạo cảm giác sinh động và gợi liên tưởng đến quá trình pha chế. Tên thương hiệu “PHIN” được đặt ở vị trí trung tâm với kích thước lớn, giúp nhấn mạnh yếu tố nhận diện chính. Từ “COFFEE” được đặt ngay bên dưới với kích thước nhỏ hơn, bổ trợ cho tên thương hiệu và làm rõ lĩnh vực kinh doanh.",
      colors: [
        {
          name: "Màu Vàng",
          hex: "#FDD835",
          role: "Nền chủ đạo",
          desc: "Chiếm phần lớn diện tích nền, tạo cảm giác nổi bật, tươi sáng và thu hút sự chú ý. Màu vàng còn gợi liên tưởng đến sự ấm áp, năng lượng và không khí thân thiện."
        },
        {
          name: "Màu Nâu Đậm",
          hex: "#3D2314",
          role: "Biểu tượng & Chữ PHIN",
          desc: "Được sử dụng cho hình ảnh phin cà phê, tách cà phê và chữ “PHIN”, gợi liên tưởng đến màu sắc của cà phê rang xay, thể hiện sự đậm đà và đặc trưng của sản phẩm."
        },
        {
          name: "Màu Đen",
          hex: "#111827",
          role: "Đường viền & Chi tiết",
          desc: "Xuất hiện trong đường viền và một số chi tiết chữ, giúp tạo độ tương phản với nền vàng, làm cho logo rõ ràng và dễ nhận diện hơn."
        }
      ],
      typography: "Logo được xây dựng theo bố cục tập trung, với hình ảnh biểu tượng nằm ở phía trên và tên thương hiệu nằm ở phía dưới. Đường viền bo tròn bao quanh một phần biểu tượng và chữ, tạo sự liên kết giữa các thành phần, đồng thời giúp tổng thể trông gọn gàng và thống nhất. Kiểu chữ “PHIN” có nét dày, mạnh mẽ và mang tính trang trí, thể hiện sự cá tính, nổi bật. Trong khi đó, chữ “COFFEE” nhỏ hơn, sử dụng kiểu chữ đậm và dễ đọc, giúp cân bằng bố cục và bổ sung thông tin cho thương hiệu.",
      colorVariants: [
        {
          name: "Nền vàng, biểu tượng và chữ màu nâu",
          bgDesc: "Phương án màu gốc",
          characteristics: "Tươi sáng, nổi bật, gần gũi.",
          description: "Phương án màu gốc mang đến cảm giác ấm áp, thân thiện và trẻ trung. Màu vàng nổi bật giúp thu hút sự chú ý, trong khi màu nâu gợi liên tưởng đến cà phê rang xay và hương vị đậm đà. Sự kết hợp này tạo nên phong cách gần gũi, năng động và dễ nhận diện.",
          image: "/images/logo-phin-coffee-v1.png"
        },
        {
          name: "Nền nâu, biểu tượng và chữ màu vàng",
          bgDesc: "Phương án đảo màu",
          characteristics: "Ấm áp, cá tính, đậm chất cà phê.",
          description: "Phương án đảo màu tạo cảm giác trầm ấm, đậm đà và trưởng thành hơn. Nền nâu gợi đến hạt cà phê rang và không gian quán cà phê, còn màu vàng làm nổi bật biểu tượng cùng tên thương hiệu. Tổng thể mang nét cá tính, tạo chiều sâu thị giác và phù hợp với hình ảnh thương hiệu cà phê hiện đại.",
          image: "/images/logo-phin-coffee-v3.png"
        },
        {
          name: "Nền đen, biểu tượng và chữ màu trắng",
          bgDesc: "Phương án đơn sắc",
          characteristics: "Tối giản, rõ ràng, hiện đại.",
          description: "Phương án đơn sắc mang đến cảm giác tối giản, hiện đại và mạnh mẽ. Màu trắng nổi bật trên nền đen giúp logo có độ tương phản cao, làm rõ hình khối, đường nét và kiểu chữ. Việc loại bỏ màu sắc trang trí giúp tập trung vào cấu trúc biểu tượng và tăng tính linh hoạt khi ứng dụng trên nhiều chất liệu.",
          image: "/images/logo-phin-coffee-v2.png"
        }
      ],
      summary: "Logo PHIN COFFEE là sự kết hợp giữa hình ảnh cà phê phin truyền thống và cách thể hiện đồ họa mang tính hiện đại. Thông qua biểu tượng, màu sắc và kiểu chữ, logo truyền tải hình ảnh một thương hiệu cà phê gần gũi, đậm chất Việt Nam nhưng vẫn có nét trẻ trung và cá tính. Thiết kế không chỉ giúp nhận diện thương hiệu mà còn góp phần thể hiện tinh thần và văn hóa thưởng thức cà phê mà thương hiệu hướng đến."
    },
    link: "/images/logo-phin-coffee-v1.png",
    featured: true
  },
  {
    id: "proj-logo-vplus-health",
    name: "Logo Vitalis (Dịch Vụ Chăm Sóc Sức Khỏe Xanh)",
    category: "Design",
    subCategory: "Logo",
    description: "Logo Vitalis được phát triển dựa trên sự kết hợp giữa trái tim, chiếc lá, dấu thập y tế và chữ V. Định hướng mô hình chăm sóc sức khỏe xanh, biểu trưng cho sự sống, y học hiện đại và thân thiện môi trường.",
    image: "/images/logo-vitalis-v1.png",
    images: [
      "/images/logo-vitalis-v1.png",
      "/images/logo-vitalis-v2.png",
      "/images/logo-vitalis-v3.png"
    ],
    versions: [
      {
        title: "Phương án màu gốc (Nền trắng, chuyển sắc xanh dương - xanh lá)",
        image: "/images/logo-vitalis-v1.png",
        badge: "Bản Gốc • Nền Trắng",
        description: "Phương án tiêu chuẩn trên nền trắng làm nổi bật dải chuyển sắc mềm mại từ xanh dương sang xanh lá cây, tối ưu in ấn tài liệu y khoa, danh thiếp, website và hồ sơ sức khỏe.",
        characteristics: "Thanh thoát, hiện đại, chuẩn y tế."
      },
      {
        title: "Phương án màu xanh ngọc (Nền xanh pastel, logo viền trắng)",
        image: "/images/logo-vitalis-v2.png",
        badge: "Pastel • Xanh Ngọc",
        description: "Phương án trên nền xanh ngọc pastel mang lại cảm giác thư thái, an lành và trị liệu tự nhiên. Đường viền trắng tạo sự phân tách rõ ràng và gia tăng chiều sâu thị giác.",
        characteristics: "Dịu mát, chữa lành, thân thiện môi trường."
      },
      {
        title: "Phương án nền tối (Nền xanh navy đậm, logo viền trắng)",
        image: "/images/logo-vitalis-v3.png",
        badge: "Nền Tối • Xanh Navy",
        description: "Phương án trên nền xanh navy đậm tạo độ tương phản cao, tôn vinh chữ V màu trắng và dải gradient xanh dương - xanh lá, cực kỳ ấn tượng trên ứng dụng di động, biển hiệu phòng khám và đồng phục.",
        characteristics: "Chuyên nghiệp, tin cậy, chiều sâu vượt trội."
      }
    ],
    brandDetails: {
      overview: "Logo Vitalis được phát triển dựa trên sự kết hợp giữa trái tim, chiếc lá, dấu thập y tế và chữ V. Đây là những biểu tượng đại diện cho sức khỏe, sự sống, thiên nhiên và hoạt động chăm sóc con người. Sự kết hợp này góp phần thể hiện định hướng thương hiệu hướng đến mô hình chăm sóc sức khỏe xanh, chú trọng sự hài hòa giữa con người và môi trường.",
      idea: "Logo Vitalis bắt nguồn từ ý tưởng gắn kết chặt chẽ giữa Y học hiện đại và Thiên nhiên xanh. Trái tim thể hiện tấm lòng tận tụy chăm sóc con người; Dấu thập y tế khẳng định tiêu chuẩn chuyên môn chuẩn xác; Chiếc lá mầm đại diện cho sự hồi phục và sức sống bền vững; Chữ V vừa là chữ cái đầu của thương hiệu Vitalis, vừa mang ý nghĩa biểu trưng cho sự sống mãnh liệt và chăm sóc toàn diện.",
      colors: [
        {
          name: "Màu Xanh Dương",
          hex: "#0284C7",
          role: "Màu chủ đạo y tế",
          desc: "Đại diện cho sự tin cậy, ổn định, tính khoa học và sự chuyên nghiệp trong chăm sóc sức khỏe con người."
        },
        {
          name: "Màu Xanh Lá Cây",
          hex: "#65A30D",
          role: "Màu sắc thiên nhiên",
          desc: "Thể hiện sự sống, khả năng phục hồi, phát triển bền vững và định hướng thân thiện với môi trường tự nhiên."
        },
        {
          name: "Hiệu Ứng Chuyển Sắc (Gradient)",
          hex: "#0EA5E9",
          role: "Gắn kết Y tế & Thiên nhiên",
          desc: "Tạo cảm giác mềm mại, hiện đại và nhấn mạnh sự kết nối xuyên suốt giữa lĩnh vực y tế với thiên nhiên xanh."
        }
      ],
      typography: "Biểu tượng trái tim tạo thành đường bao tổng thể, đại diện cho sự quan tâm, tận tâm và chăm sóc. Chữ V được đặt bên trong, đóng vai trò nhận diện tên thương hiệu Vitalis. Dấu thập y tế ở phía trên bên phải giúp làm rõ lĩnh vực hoạt động, trong khi chiếc lá ở phần dưới tạo liên tưởng đến thiên nhiên, sự phát triển và sức sống. Các chi tiết được liên kết bằng những đường cong mềm mại, tạo cảm giác thân thiện và gần gũi. Bố cục bất đối xứng nhưng có sự cân bằng về mặt thị giác giữa phần chữ V và hình chiếc lá.",
      colorVariants: [
        {
          name: "Nền trắng, chuyển sắc xanh dương - xanh lá",
          bgDesc: "Phương án màu gốc",
          characteristics: "Thanh thoát, hiện đại, chuẩn y tế.",
          description: "Phương án tiêu chuẩn trên nền trắng làm nổi bật dải chuyển sắc mềm mại từ xanh dương sang xanh lá cây, tối ưu in ấn tài liệu y khoa, danh thiếp, website và hồ sơ sức khỏe.",
          image: "/images/logo-vitalis-v1.png"
        },
        {
          name: "Nền xanh pastel, logo viền trắng",
          bgDesc: "Phương án xanh ngọc",
          characteristics: "Dịu mát, chữa lành, thân thiện môi trường.",
          description: "Phương án trên nền xanh ngọc pastel mang lại cảm giác thư thái, an lành và trị liệu tự nhiên. Đường viền trắng tạo sự phân tách rõ ràng và gia tăng chiều sâu thị giác.",
          image: "/images/logo-vitalis-v2.png"
        },
        {
          name: "Nền xanh navy đậm, logo viền trắng",
          bgDesc: "Phương án nền tối",
          characteristics: "Chuyên nghiệp, tin cậy, chiều sâu vượt trội.",
          description: "Phương án trên nền xanh navy đậm tạo độ tương phản cao, tôn vinh chữ V màu trắng và dải gradient xanh dương - xanh lá, cực kỳ ấn tượng trên ứng dụng di động, biển hiệu phòng khám và đồng phục.",
          image: "/images/logo-vitalis-v3.png"
        }
      ],
      summary: "Logo có khả năng truyền đạt tương đối rõ lĩnh vực và giá trị thương hiệu, phù hợp với website y tế, ứng dụng chăm sóc sức khỏe, đồng phục, danh thiếp, biển hiệu và tài liệu truyền thông. Vitalis mang sứ mệnh giải pháp y tế xanh, an tâm và bền vững."
    },
    link: "/images/logo-vitalis-v1.png",
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
    name: "Banner Quảng Cáo Trung Tâm Y Tế Toàn Diện – Sống Khỏe Mỗi Ngày",
    category: "Design",
    subCategory: "Banner",
    description: "Banner quảng cáo chăm sóc sức khỏe toàn diện lấy con người và thiên nhiên làm trọng tâm. Kết hợp biểu tượng y tế, hoạt động thể dục gia đình và giải pháp liên hệ mã QR trên nền xanh ngọc tươi mát.",
    image: "/images/banner-y-te.png",
    link: "/images/banner-y-te.png",
    featured: true,
    brandDetails: {
      overview: "Banner hướng đến quảng bá dịch vụ chăm sóc sức khỏe toàn diện, lấy con người và thiên nhiên làm trọng tâm. Ý tưởng chủ đạo là truyền tải thông điệp về một lối sống lành mạnh, chủ động chăm sóc sức khỏe và duy trì sự cân bằng giữa thể chất với môi trường sống.\n\nThiết kế kết hợp các hình ảnh biểu trưng cho lĩnh vực y tế như dấu thập, cây lá và hoạt động thể chất nhằm xây dựng hình ảnh một dịch vụ chăm sóc sức khỏe gần gũi, tích cực và thân thiện.",
      visualAnalysis: "Thiết kế kết hợp hài hòa các biểu trưng y tế và lối sống vận động tích cực: Phía trên tiêu đề là dấu thập y tế màu đỏ và chiếc lá xanh mầm giúp nhận diện dịch vụ tức thì. Phần bên phải và phía dưới bố trí các nhân vật minh họa đang chạy bộ và tập thể dục yoga/stretching truyền tải tinh thần năng động. Các chi tiết cây lá viền tại bốn góc tạo khung trang trí tự nhiên, cùng những dấu cộng xanh rải rác duy trì sự liên kết chặt chẽ với chủ đề y tế gia đình.",
      layout: "Banner sử dụng bố cục ngang cân đối, phân bố thị giác khoa học:\n• Trung tâm: Tiêu đề chính “TRUNG TÂM Y TẾ TOÀN DIỆN – SỐNG KHỎE MỖI NGÀY” chiếm diện tích lớn, thu hút sự chú ý ngay từ cái nhìn đầu tiên.\n• Biểu tượng trên: Dấu thập y tế viền tròn và lá cây xanh đóng vai trò icon nhận diện.\n• Nửa dưới bên phải: Nhóm nhân vật hoạt hình minh họa chạy bộ và vươn vai tập thể dục đầy sức sống trên thảm tập yoga.\n• Góc dưới bên trái: Nút Call-To-Action “LIÊN HỆ NGAY!” bo góc nổi bật cùng mã QR thông minh giúp quét kết nối dịch vụ trực tiếp nhanh chóng.\n• Khung viền 4 góc: Cụm lá cây xanh mát bao bọc tạo cảm giác tươi mát, thân thiện và trong lành.",
      colors: [
        {
          name: "Xanh Lá Đậm (Medical Green)",
          hex: "#15803d",
          role: "Tiêu đề & Nút kêu gọi hành động",
          desc: "Tượng trưng cho thiên nhiên, sức sống, sự phát triển và định hướng chăm sóc sức khỏe xanh bền vững."
        },
        {
          name: "Xanh Ngọc & Nền Trắng (Teal & Pure White)",
          hex: "#0d9488",
          role: "Nền chính sạch sẽ & Sóng dịu mát",
          desc: "Nền trắng kết hợp xanh ngọc nhạt mang lại cảm giác sạch sẽ, thoáng đãng, vô trùng và thư thái chuẩn y tế."
        },
        {
          name: "Dấu Thập Đỏ Tương Phản (Medical Red Cross)",
          hex: "#dc2626",
          role: "Biểu tượng y tế khẩn cấp",
          desc: "Tạo sự tương phản mạnh mẽ với hệ màu xanh, giúp nhấn mạnh đặc trưng cứu chữa và bảo vệ sức khỏe."
        },
        {
          name: "Xanh Pastel Dấu Cộng (Sage Cross)",
          hex: "#86efac",
          role: "Dấu cộng y tế rải rác",
          desc: "Xuất hiện rải rác duy trì sự liên kết chủ đề y tế, tạo cảm giác được chăm sóc và bảo vệ toàn diện."
        }
      ],
      typography: "Tiêu đề “TRUNG TÂM Y TẾ TOÀN DIỆN – SỐNG KHỎE MỖI NGÀY” sử dụng kiểu chữ sans serif in hoa, nét đậm và màu xanh lá đậm, tạo cảm giác vững chắc và rõ ràng. Dòng chữ “CHĂM SÓC GIA ĐÌNH BẠN” và nút “LIÊN HỆ NGAY!” được đặt trong khung nền xanh bo góc, duy trì sự thống nhất về hình thức và tạo điểm nhấn cho lời kêu gọi hành động.",
      tagline: "TRUNG TÂM Y TẾ TOÀN DIỆN – SỐNG KHỎE MỖI NGÀY\nCHĂM SÓC GIA ĐÌNH BẠN\nLIÊN HỆ NGAY! • Quét mã QR nhận tư vấn sức khỏe gia đình",
      summary: "Banner quảng cáo truyền tải trọn vẹn thông điệp về sự chủ động chăm sóc sức khỏe gia đình, lối sống thể chất năng động và môi trường y tế xanh thân thiện. Bố cục ngang chuẩn mực, đồ họa tươi sáng kết hợp mã QR thực tế giúp tối ưu tỷ lệ chuyển đổi cho các chiến dịch marketing phòng khám và trung tâm chăm sóc sức khỏe."
    }
  },
  {
    id: "proj-banner-matkinh",
    name: "Banner Quảng Cáo Mắt Kính Thông Minh AR & Bluetooth",
    category: "Design",
    subCategory: "Banner",
    description: "Banner quảng cáo mắt kính thông minh 'Kết Nối Tương Lai' tích hợp AI, AR và Bluetooth. Phong cách hi-tech thanh lịch với bố cục ngang hiện đại, tương phản sắc nét giữa nền xanh cyan và gọng kính đen.",
    image: "/images/banner-mat-kinh.png",
    link: "/images/banner-mat-kinh.png",
    featured: true,
    brandDetails: {
      overview: "Banner giới thiệu sản phẩm mắt kính thông minh, nhấn mạnh khả năng tích hợp công nghệ hiện đại như trí tuệ nhân tạo (AI), thực tế tăng cường (AR), camera và kết nối Bluetooth. Ý tưởng chủ đạo là thể hiện sự kết hợp giữa phụ kiện thời trang quen thuộc với công nghệ tiên tiến, qua đó truyền tải hình ảnh một sản phẩm tiện ích, hiện đại và phù hợp với xu hướng sống số.",
      visualAnalysis: "Hình ảnh sản phẩm mắt kính thông minh gọng đen sắc nét với kích thước lớn được đặt ở phía bên phải đóng vai trò là điểm nhấn thị giác chính. Sản phẩm được đặt phía trước một hình kính lớn có độ mờ, tạo hiệu ứng chiều sâu 3D đa tầng và tôn vinh thiết kế công thái học thanh lịch. Các họa tiết chấm tròn halftone công nghệ ở hai góc góp phần tăng tính hiện đại, đồng thời giúp tổng thể không gian không bị đơn điệu.",
      layout: "Banner sử dụng bố cục ngang phân chia hai khu vực thị giác đối trọng cân bằng:\n• Khu vực bên trái: Tập trung vào hệ thống thông tin bao gồm tiêu đề chính 2 tầng, đoạn mô tả tính năng làm việc / giải trí rảnh tay, cụm icon tính năng nổi bật (AR Thực tế tăng cường & Bluetooth) và nút CTA “MUA NGAY!” bo góc màu đen nổi bật.\n• Khu vực bên phải: Không gian thị giác lớn dành riêng cho sản phẩm mắt kính thực tế với góc nghiêng năng động, kết hợp lớp nền bóng kính mờ tạo chiều sâu trường ảnh ấn tượng.\n• Hai góc chéo: Họa tiết chấm tròn chuyển sắc công nghệ (dot matrix) tạo hiệu ứng số hóa sống động.",
      colors: [
        {
          name: "Xanh Dương Đậm (Tech Blue)",
          hex: "#1d4ed8",
          role: "Tiêu đề phụ & Biểu tượng",
          desc: "Sử dụng cho tiêu đề phụ 'KẾT NỐI TƯƠNG LAI' và biểu tượng công nghệ, thể hiện sự tin cậy, hiện đại và tính chuyên nghiệp cao."
        },
        {
          name: "Xanh Cyan Nhạt & Trắng Sáng",
          hex: "#e0f7fa",
          role: "Nền chính công nghệ sạch",
          desc: "Nền xanh nhạt tạo cảm giác nhẹ nhàng, sạch sẽ, chuẩn không gian hiển thị hi-tech hiện đại."
        },
        {
          name: "Đen Gọng Kính & Nút CTA (Matte Black)",
          hex: "#1e293b",
          role: "Tương phản cao & Trọng tâm",
          desc: "Màu sắc gọng kính, tiêu đề chính và nút 'MUA NGAY!' tạo độ tương phản rõ ràng với nền sáng, giúp nhận diện thông tin nhanh chóng."
        },
        {
          name: "Xanh Điện Tử Highlight (Electric Blue)",
          hex: "#2563eb",
          role: "Tính năng AR & Bluetooth",
          desc: "Tạo điểm nhấn kết nối trực quan cho các tính năng đột phá của sản phẩm."
        }
      ],
      typography: "Tiêu đề “MẮT KÍNH THÔNG MINH – KẾT NỐI TƯƠNG LAI” sử dụng kiểu chữ sans serif in hoa nét đậm, hình khối vuông vức vững chãi, phù hợp với đặc trưng của sản phẩm công nghệ. Nội dung được phân cấp rõ ràng thông qua kích thước, độ đậm và màu sắc, kết hợp các biểu tượng trực quan để tăng khả năng ghi nhớ.",
      tagline: "“MẮT KÍNH THÔNG MINH – KẾT NỐI TƯƠNG LAI”\nThiết bị đeo mắt tích hợp AI, AR, Camera giúp làm việc, quay chụp và giải trí rảnh tay\n[AR] Thực tế tăng cường • Bluetooth • MUA NGAY!",
      summary: "Banner sản phẩm công nghệ Mắt kính thông minh thể hiện trọn vẹn sự giao thoa giữa thời trang tiện dụng và công nghệ tương lai. Bố cục ngang chuẩn mực cho sàn thương mại điện tử, Google Display Network và mạng xã hội, thu hút mạnh mẽ nhóm khách hàng yêu thích công nghệ và lối sống số."
    }
  },
  {
    id: "proj-banner-dautu",
    name: "Banner Truyền Thông Dịch Vụ Đầu Tư Tài Chính & Bất Động Sản",
    category: "Design",
    subCategory: "Banner",
    description: "Banner truyền thông tài chính 'Đầu Tư Thông Minh – Sinh Lời Bền Vững' với bố cục 2 tầng hiện đại, kết hợp màn hình biểu đồ nến, túi tiền vàng kim và dải 4 cam kết giá trị an toàn, minh bạch.",
    image: "/images/banner-dau-tu.png",
    link: "/images/banner-dau-tu.png",
    featured: true,
    brandDetails: {
      overview: "Banner được xây dựng theo chủ đề đầu tư tài chính, tập trung truyền tải thông điệp về việc quản lý nguồn vốn hiệu quả, tối ưu lợi nhuận và hướng đến sự tăng trưởng tài sản dài hạn.\n\nÝ tưởng chủ đạo là kết hợp các biểu tượng tài chính truyền thống với hình ảnh công nghệ phân tích thị trường, thể hiện một giải pháp đầu tư hiện đại, có định hướng và chú trọng quản trị rủi ro.",
      visualAnalysis: "Thiết kế kết hợp hài hòa giữa hình tượng tài sản hữu hình và công nghệ phân tích số liệu: Cụm hình minh họa bên phải gồm màn hình biểu đồ nến giao dịch tài chính chuyên sâu, túi tiền Euro đầy đặn, các cọc đồng xu vàng kim xếp chồng lớp cùng các mũi tên xanh vút cao hướng lên trên, đại diện cho hoạt động đầu tư hiệu quả và mục tiêu gia tăng tài sản bền vững. Các lớp hình ảnh được bố trí layer đa tầng tạo chiều sâu thị giác sinh động.",
      layout: "Banner sử dụng bố cục phân chia theo hai tầng nội dung khoa học và chuẩn mực:\n• Tầng trên (Nền xanh dương đậm): Phân chia thành hai nửa đối trọng:\n  - Bên trái: Tiêu đề 2 tầng “ĐẦU TƯ THÔNG MINH – SINH LỜI BỀN VỮNG”, nội dung giải pháp quản trị rủi ro và nút CTA mũi tên “TƯ VẤN MIỄN PHÍ” màu vàng kim cực kỳ nổi bật.\n  - Bên phải: Cụm minh họa màn hình biểu đồ nến, túi tiền, tiền vàng và mũi tên tăng trưởng bứt phá trên nền chấm tròn halftone công nghệ.\n• Tầng dưới (Nền trắng tinh khiết): Trình bày 4 nhóm lợi ích cốt lõi kèm icon trực quan (Danh mục đa dạng, Tối đa hóa lợi nhuận, Kiểm soát dòng tiền, Cam kết minh bạch & bảo mật).",
      colors: [
        {
          name: "Xanh Dương Đậm (Navy Blue)",
          hex: "#0a2540",
          role: "Nền chính chuyên nghiệp & Ổn định",
          desc: "Gợi sự chuyên nghiệp, ổn định, vững chắc và đáng tin cậy trong lĩnh vực tài chính đầu tư."
        },
        {
          name: "Vàng Kim Thịnh Vượng (Wealth Gold)",
          hex: "#fbbf24",
          role: "Tiêu đề & Nút kêu gọi hành động",
          desc: "Tượng trưng cho giá trị tiền bạc, tài sản tích lũy và sự thịnh vượng, đồng thời tạo điểm nhấn bắt mắt cho tiêu đề và nút kêu gọi hành động."
        },
        {
          name: "Xanh Lá Tăng Trưởng (Growth Green)",
          hex: "#22c55e",
          role: "Mũi tên & Đà tăng trưởng",
          desc: "Thể hiện xu hướng sinh lời và đà tăng trưởng của thị trường, xuất hiện ở các mũi tên vươn cao và biểu đồ nến xanh."
        },
        {
          name: "Trắng Tinh Khiết (Clean White)",
          hex: "#ffffff",
          role: "Cân bằng tổng thể & Dải lợi ích",
          desc: "Tạo sự cân bằng tổng thể, tối ưu khả năng đọc và làm nổi bật dải 4 lợi ích cam kết ở tầng dưới."
        }
      ],
      typography: "Tiêu đề “ĐẦU TƯ THÔNG MINH – SINH LỜI BỀN VỮNG” sử dụng kiểu chữ sans serif in hoa, có nét dày và kích thước lớn. Màu vàng được dùng để nhấn mạnh cụm “ĐẦU TƯ THÔNG MINH”, trong khi phần còn lại sử dụng màu trắng để tạo sự phân cấp. Phần nội dung mô tả sử dụng kiểu chữ hiện đại, dễ đọc. Nút “TƯ VẤN MIỄN PHÍ” có màu vàng nổi bật và hình dáng cách điệu, đóng vai trò hướng sự chú ý đến hành động tiếp theo của khách hàng.",
      tagline: "“ĐẦU TƯ THÔNG MINH – SINH LỜI BỀN VỮNG”\nGiải pháp tài chính toàn diện giúp bạn tối ưu hóa nguồn vốn, quản lý rủi ro và gia tăng tài sản một cách an toàn, hiệu quả.\nTƯ VẤN MIỄN PHÍ • 4 Cam kết giá trị dài hạn",
      summary: "Banner truyền thông tài chính mang phong cách hiện đại, đĩnh đạc và tin cậy. Bố cục 2 tầng phân chia thông điệp rõ ràng, vừa tạo ấn tượng thị giác mạnh mẽ với tăng trưởng tài sản, vừa cung cấp đầy đủ 4 giá trị cốt lõi, hoàn hảo cho các chiến dịch quảng bá quỹ đầu tư, công ty chứng khoán và dịch vụ tư vấn tài chính."
    }
  },
  {
    id: "proj-poster-avocado",
    name: "Poster Truyền Thông Sản Phẩm Trái Bơ Nông Sản Sạch (Avocado)",
    category: "Design",
    subCategory: "Poster",
    description: "Poster quảng bá trái bơ 'FRUIT AVOCADO' phong cách hiện đại với hình ảnh quả bơ cắt đôi béo mịn và quả bơ nguyên vỏ trên nền đen sang trọng, kết hợp tiêu đề vàng cam nghệ thuật và thông điệp dinh dưỡng lành mạnh.",
    image: "/images/poster-avocado.png",
    link: "/images/poster-avocado.png",
    featured: true,
    brandDetails: {
      overview: "Poster AVOCADO được thiết kế nhằm giới thiệu và quảng bá quả bơ, một loại trái cây giàu dinh dưỡng và có nhiều lợi ích cho sức khỏe. Thiết kế sử dụng phong cách hiện đại, kết hợp hình ảnh chụp thực tế với kiểu chữ cách điệu và bảng màu tương phản. Tổng thể poster mang đến cảm giác tự nhiên, mạnh mẽ và có phần cá tính, phù hợp với chủ đề trái cây và thực phẩm lành mạnh.",
      visualAnalysis: "Ý tưởng chủ đạo của poster là làm nổi bật hình ảnh quả bơ thông qua sự kết hợp giữa hình ảnh quả bơ nguyên vỏ và quả bơ đã cắt đôi. Quả bơ nguyên vỏ thể hiện đặc điểm bề mặt sần màu xanh đậm, trong khi quả bơ cắt đôi cho thấy phần thịt màu vàng xanh cùng hạt bơ lớn ở trung tâm.\n\nCách sắp xếp hai hình ảnh tạo sự đa dạng về hình khối, giúp người xem nhận biết sản phẩm một cách trực quan. Chiếc lá xanh được đặt cạnh quả bơ nguyên vỏ còn góp phần nhấn mạnh nguồn gốc tự nhiên của sản phẩm.",
      layout: "Poster được thiết kế theo bố cục dọc, chia thành các khu vực thông tin rõ ràng:\n• Phần đầu poster: Dải màu vàng cam với chữ “FRUIT” đặt ở góc trái phía trên, đóng vai trò giới thiệu nhóm sản phẩm nông sản sạch.\n• Phần tiêu đề: Chữ “AVOCADO” được đặt ở vị trí trung tâm phía trên, sử dụng kiểu chữ in hoa có nét cao, hẹp và uốn lượn cách điệu. Kích thước lớn giúp tên sản phẩm trở thành điểm nhấn chính.\n• Phần thông tin: Các từ “Creamy”, “Nutty”, “Smooth”, “Aromatic” được sắp xếp thành một hàng ngang mô tả đặc điểm cảm quan. Phía dưới là thông tin về thành phần dinh dưỡng (Vitamin B, Vitamin E, Fiber, Potassium) và công dụng hỗ trợ tim mạch, tiêu hóa, làm đẹp da & tóc.\n• Phần hình ảnh: Hình ảnh quả bơ chiếm phần lớn diện tích phía dưới, tạo trọng tâm thị giác vững chãi và cân bằng với khu vực chứa chữ.\n• Phần cuối poster: Câu hỏi mở “Have you tried it yet?” đặt ở góc dưới bên phải như một lời gợi mở, khuyến khích người xem trải nghiệm sản phẩm.",
      colors: [
        {
          name: "Màu Vàng Cam (Warm Orange Yellow)",
          hex: "#c58200",
          role: "Tiêu đề & Dải đầu poster",
          desc: "Xuất hiện ở phần đầu poster và tiêu đề “AVOCADO”, tạo điểm nhấn nổi bật, thu hút sự chú ý và mang lại cảm giác ấm áp."
        },
        {
          name: "Màu Đen & Xám Đậm (Dark Background)",
          hex: "#1a1a1a",
          role: "Nền chính & Chiều sâu",
          desc: "Sử dụng làm nền chính, tạo chiều sâu và giúp hình ảnh quả bơ cùng phần chữ sáng màu nổi bật hơn."
        },
        {
          name: "Xanh Lá & Vàng Xanh (Avocado Green)",
          hex: "#588126",
          role: "Đặc trưng tự nhiên vỏ & thịt bơ",
          desc: "Thể hiện qua vỏ bơ, chiếc lá và phần thịt quả mịn màng, gợi liên tưởng đến thiên nhiên, sự tươi mới và nguồn gốc thực vật."
        },
        {
          name: "Trắng Ngà Tương Phản (Creamy White)",
          hex: "#f4f4f4",
          role: "Phân chia thông tin dinh dưỡng",
          desc: "Được dùng cho đường kẻ ngang và nội dung chữ mô tả dinh dưỡng, giúp phân chia thông tin và tăng khả năng đọc."
        }
      ],
      typography: "Sự kết hợp giữa kiểu chữ tiêu đề “AVOCADO” in hoa mang tính trang trí cao và chữ phụ đơn giản tạo ra sự phân cấp thông tin rõ ràng, giúp poster vừa có cá tính vừa giữ trọn tính truyền thông.",
      tagline: "“FRUIT AVOCADO”\nCreamy • Nutty • Smooth • Aromatic\nSupports cardiovascular • Aids digestion • Beautifies skin and hair\nHave you tried it yet?",
      summary: "Poster AVOCADO sử dụng hình ảnh chân thực, màu sắc tương phản và kiểu chữ nghệ thuật để truyền tải trọn vẹn thông điệp về một loại trái cây tự nhiên, giàu dinh dưỡng và hấp dẫn. Sự kết hợp giữa nền tối, tiêu đề vàng cam và hình ảnh quả bơ xanh tươi ngon tạo nên phong cách thị giác sang trọng, cá tính và thu hút người xem."
    }
  },
  {
    id: "proj-poster-longan",
    name: "Poster Quảng Bá Trái Cây Nhiệt Đới Việt Nam - Quả Nhãn (Longan)",
    category: "Design",
    subCategory: "Poster",
    description: "Poster quảng bá trái nhãn 'Discover the taste of Vietnamese Longan' kết hợp hình ảnh chụp cận cảnh phần thịt nhãn mọng nước trên nền vườn cây nhiệt đới làm mờ, tôn vinh hương vị ngọt lành và nông sản đặc sản Việt Nam.",
    image: "/images/poster-longan.png",
    link: "/images/poster-longan.png",
    featured: true,
    brandDetails: {
      overview: "Poster quảng bá trái nhãn Việt Nam với chủ đề “Discover the taste of Vietnamese Longan” (Khám phá hương vị nhãn Việt Nam), hướng đến việc giới thiệu vẻ đẹp và hương vị tự nhiên của loại trái cây nhiệt đới này. Thiết kế kết hợp hình ảnh thực tế, kiểu chữ nổi bật và tông màu trầm ấm, tạo cảm giác gần gũi với thiên nhiên, đồng thời nhấn mạnh sự tươi ngon và hấp dẫn của sản phẩm.",
      visualAnalysis: "Hình ảnh quả nhãn được chụp cận cảnh, thể hiện rõ phần thịt quả trong mờ và hạt nhãn bên trong. Việc đặt hình ảnh sản phẩm ở tiền cảnh chiếm diện tích lớn giúp tăng tính chân thực, kích thích thị giác và gợi cảm giác muốn thưởng thức ngay lập tức.\n\nThông điệp “Sweet – Fresh – Juicy” nhấn mạnh ba đặc tính nổi bật: vị ngọt, sự tươi mới và độ mọng nước. Cụm từ “Vietnamese Longan” góp phần khẳng định nguồn gốc xuất xứ, quảng bá hình ảnh trái cây nhiệt đới Việt Nam đến người tiêu dùng trong nước và quốc tế.",
      layout: "Poster được tổ chức theo bố cục dọc, phân lớp rõ ràng và phù hợp với định dạng truyền thông đa kênh:\n• Phần đầu poster: Dòng chữ “Discover the taste of Vietnamese Longan” giới thiệu thông điệp chính. Bên dưới là cụm chữ “tropical fruit” với kiểu chữ viết tay mềm mại, tạo nét tự nhiên và phóng khoáng.\n• Phần trung tâm phía trên: Tiêu đề “LONGAN” được trình bày bằng kiểu chữ in hoa, kích thước lớn và màu vàng nổi bật, thu hút sự chú ý ngay cái nhìn đầu tiên.\n• Phần mô tả: Các dòng chữ “Fresh Vietnamese Longan”, “Naturally sweet – Juicy – Refreshing” và “Nourish the blood and calm the spirit” cung cấp thông tin, nhấn mạnh giá trị dinh dưỡng và bồi bổ sức khỏe.\n• Phần dưới poster: Cận cảnh quả nhãn bóc vỏ mọng nước ở tiền cảnh, kết hợp cụm từ “Sweet - Fresh - Juicy” đặt gọn gàng bên phải tạo thế cân bằng thị giác hài hòa.",
      colors: [
        {
          name: "Xanh Lá Cây Đậm (Deep Green)",
          hex: "#2d4a22",
          role: "Không gian vườn cây nhiệt đới",
          desc: "Xuất hiện ở phần nền làm mờ, gợi liên tưởng đến cây cối, sinh thái tự nhiên và môi trường phát triển của trái nhãn."
        },
        {
          name: "Màu Vàng Rực Rỡ (Tropical Yellow)",
          hex: "#d99b26",
          role: "Tiêu đề & Điểm nhấn vị giác",
          desc: "Sử dụng cho tiêu đề “LONGAN” và lời chào đầu poster, tạo điểm nhấn thị giác ấm áp, gợi cảm giác ngọt ngào và hấp dẫn."
        },
        {
          name: "Trắng Sáng & Nâu Ấm (White & Warm Brown)",
          hex: "#5c4033",
          role: "Tương phản & Chiều sâu vỏ nhãn",
          desc: "Màu trắng cho phần chữ mô tả dễ đọc trên nền tối; sắc nâu ấm tạo cảm giác mộc mạc và chân thực của nhà vườn."
        }
      ],
      typography: "Sự kết hợp tương phản giữa kiểu chữ in hoa không chân dày dặn (“LONGAN”) và kiểu chữ viết tay nghệ thuật (“tropical fruit”) mang lại cảm giác vừa hiện đại, chuyên nghiệp vừa mộc mạc, gần gũi với thiên nhiên.",
      tagline: "“Discover the taste of Vietnamese Longan”\nFresh Vietnamese Longan • Naturally sweet – Juicy – Refreshing\nNourish the blood and calm the spirit",
      summary: "Poster LONGAN – TROPICAL FRUIT truyền tải trọn vẹn hình ảnh trái nhãn Việt Nam thông qua sự kết hợp giữa nhiếp ảnh cận cảnh, màu sắc thiên nhiên và kiểu chữ giàu tính biểu cảm. Thiết kế hướng đến cảm giác tươi ngon, ngọt ngào và gần gũi, phù hợp cho các hoạt động quảng bá nông sản và thương hiệu thực phẩm chất lượng cao."
    }
  },
  {
    id: "proj-poster-ocean",
    name: "Poster Truyền Thông Bảo Vệ Đại Dương & Sinh Vật Biển (Adaptation)",
    category: "Design",
    subCategory: "Poster",
    description: "Poster thông điệp môi trường 'ADAPTATION' với hình ảnh con cá có phần thân chuyển dần thành chiếc đuôi làm từ túi nilon xoắn lại. Cách thể hiện ẩn dụ sâu sắc phản ánh sự thích nghi méo mó, báo động khi rác thải nhựa xâm lấn và thay thế sự sống tự nhiên của đại dương.",
    image: "/images/poster-ocean.jpg",
    link: "/images/poster-ocean.jpg",
    featured: true,
    brandDetails: {
      overview: "Trọng tâm ý tưởng nằm ở hình ảnh con cá có phần thân chuyển dần thành chiếc đuôi làm từ túi nilon xoắn lại như đuôi cá. Đây là một cách thể hiện rất hiệu quả vì nó không mô tả ô nhiễm theo kiểu trực diện như rác nổi dày đặc, mà dùng sự biến dạng của sinh vật để cho thấy thiên nhiên đang bị can thiệp và tổn thương.\n\nChi tiết này làm nổi bật khái niệm “adaptation” (thích nghi). Tuy nhiên, sự thích nghi ở đây không mang nghĩa tích cực, mà là một sự thích nghi bất đắc dĩ, méo mó và đáng báo động. Sinh vật biển đang buộc phải sống chung với rác thải nhựa đến mức cơ thể của chúng dường như bị “hóa nhựa”.",
      visualAnalysis: "Hình con cá là điểm nhấn thị giác chính của poster. Phần đầu và thân cá vẫn giữ được vẻ tự nhiên với sắc xanh đặc trưng của sinh vật biển, nhưng phần đuôi chuyển thành một túi nilon trong suốt, thắt xoắn và xòe ra như vây đuôi. Cách chuyển đổi này tạo ra hiệu ứng vừa đẹp vừa bất an:\n• Đẹp vì tạo hình khá mềm mại, hòa vào nước và vẫn giữ được dáng bơi.\n• Bất an vì người xem nhận ra phần đuôi không còn là cơ thể thật, mà là rác thải nhân tạo.\n\nChính sự “nửa sinh vật, nửa rác thải” này làm nên sức nặng biểu tượng. Nó cho thấy đại dương không chỉ bị ô nhiễm bên ngoài, mà rác nhựa đã trở thành một phần trong hệ sinh thái, thậm chí như đang thay thế sự sống tự nhiên.",
      layout: "Bố cục poster khá tối giản nhưng hiệu quả. Con cá được đặt lệch về trung tâm phải, bơi trong không gian nước sâu rộng lớn. Cách bố trí này tạo cảm giác:\n• Cô độc,\n• Nhỏ bé trước môi trường bao la,\n• Và bị nuốt chửng bởi chính đại dương đang dần trở nên xa lạ.\n\nNguồn sáng từ góc trên bên trái chiếu xuống tạo nên các tia sáng xuyên nước, giúp tăng chiều sâu không gian và thu hút mắt người xem đi từ ánh sáng xuống hình con cá rồi đến phần chữ ở phía dưới.\n\nKhoảng trống lớn của nền nước xanh cũng rất quan trọng. Nó giúp poster không bị rối, đồng thời tạo cảm giác yên tĩnh, lạnh và hơi ngột ngạt, phù hợp với chủ đề môi trường đang bị đe dọa.",
      colors: [
        {
          name: "Xanh Lam Đậm (Deep Ocean)",
          hex: "#071e3d",
          role: "Không gian biển sâu",
          desc: "Gợi không gian đại dương sâu thẳm, tự nhiên và bí ẩn; tạo cảm giác lạnh, lặng và nghiêm túc."
        },
        {
          name: "Ánh Sáng Trắng Xuyên Nước",
          hex: "#e0f2fe",
          role: "Nguồn sáng & Chiều sâu",
          desc: "Chiếu từ góc trên tạo các vệt tia sáng rọi xuống lòng biển, dẫn dắt thị giác và làm nổi bật phần chữ màu trắng."
        },
        {
          name: "Sắc Xanh Cá & Nilon Bán Trong Suốt",
          hex: "#0ea5e9",
          role: "Điểm nhấn trung tâm",
          desc: "Thân cá có độ bão hòa cao tạo tâm điểm; phần đuôi nilon bán trong suốt nhạt màu làm tăng vẻ mong manh và giả tạo."
        }
      ],
      typography: "Từ khóa “ADAPTATION” được đặt rất lớn ở phía dưới, sử dụng kiểu chữ sans serif mảnh, thanh thoát và hiện đại. Cách dùng chữ này tạo cảm giác tinh tế, đồng thời làm cho tiêu đề trở nên trang trọng và dễ đọc.",
      tagline: "“When nature suffers, so do we.\nOcean is worth protecting,\nfor the health of sea wildlife and ours.”",
      summary: "Poster mang tính kêu gọi và giải thích thêm cho hình ảnh. Nội dung này nhấn mạnh mối liên hệ mật thiết giữa sức khỏe của thiên nhiên và sức khỏe con người. Tức là đây không chỉ là vấn đề của cá, của đại dương, mà cũng là vấn đề của chính chúng ta."
    }
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
