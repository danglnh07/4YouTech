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
  estimatedPrice: number | null;
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
  estimatedDays: number | null;
  requirements?: string;
  desiredDeadline?: string;
  addedAt: string;
}

export interface SampleProject {
  id: string;
  name: string;
  category: ServiceCategory;
  image: string;
  description: string;
  link?: string;
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

export interface SupportTicket {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  type: "support" | "complaint";
  status: "open" | "processing" | "resolved";
  assignedStaffId?: string;
  assignedStaffName?: string;
  response?: string;
  createdAt: string;
}

export interface QuotationDetails {
  amount: number;
  finalDeadline: string;
  maxRevisions: number;
  scopeDetails: string;
  issuedAt: string;
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
  paymentStatus: "unpaid" | "pending_approval" | "verified" | "refunded";
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

  isBeingEdited?: boolean;
  editingNote?: string;

  createdAt: string;
  updatedAt: string;
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
  {
    id: "portfolio-co-san",
    name: "Portfolio từ thiết kế có sẵn",
    description: "Xây dựng website portfolio cá nhân tối ưu SEO & responsive dựa trên file Figma/Adobe XD sẵn có.",
    category: "IT",
    estimatedDays: 3,
    estimatedPrice: 1000000,
    maxRevisions: 3,
    scopeOutput: "Mã nguồn Next.js/React, Responsive chuẩn Mobile/Tablet, Deploy Vercel/Netlify miễn phí.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "portfolio-chua-co-thiet-ke",
    name: "Portfolio trọn gói (Thiết kế & Code)",
    description: "Tư vấn ý tưởng, thiết kế UI cá tính và lập trình hoàn thiện website cá nhân từ A đến Z.",
    category: "IT/Design",
    estimatedDays: 6,
    estimatedPrice: 1800000,
    maxRevisions: 4,
    scopeOutput: "File Figma UI, Mã nguồn Front-end, Tích hợp Form liên hệ, Hướng dẫn quản trị.",
    supportType: "Hybrid",
    demoImages: [
      "https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "ui-design",
    name: "Thiết kế Giao diện Web & App (UI/UX)",
    description: "Thiết kế UI/UX hiện đại theo chuẩn Design System, Wireframe, Prototype tương tác mượt mà.",
    category: "Design",
    estimatedDays: 5,
    estimatedPrice: 1500000,
    maxRevisions: 3,
    scopeOutput: "File Figma master, Component Design System, Export PNG/SVG assets, Prototype link.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "database-design-support",
    name: "Hỗ trợ Thiết kế Cơ sở dữ liệu & ERD",
    description: "Chuẩn hóa bảng dữ liệu, vẽ sơ đồ ERD, tối ưu truy vấn SQL / MongoDB cho đồ án & sản phẩm.",
    category: "IT",
    estimatedDays: 2,
    estimatedPrice: 500000,
    maxRevisions: 2,
    scopeOutput: "Sơ đồ ERD (Draw.io/dbdiagram), File SQL script khởi tạo, Tài liệu giải thích mối quan hệ bảng.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "system-analysis-support",
    name: "Phân tích & Thiết kế Hệ thống (BA / System)",
    description: "Xác định Actor, Use Case, Sequence Diagram, Activity Diagram & lập tài liệu SRS bài bản.",
    category: "IT",
    estimatedDays: 4,
    estimatedPrice: 800000,
    maxRevisions: 3,
    scopeOutput: "File tài liệu SRS PDF/Word, Bộ biểu đồ PlantUML/Draw.io đầy đủ.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "nhan-dien-thuong-hieu",
    name: "Nhận diện thương hiệu & Ấn phẩm truyền thông",
    description: "Thiết kế Logo, Banner sự kiện, Poster, Standee, Slide thuyết trình chuyên nghiệp cho CLB/Nhóm.",
    category: "Design",
    estimatedDays: 3,
    estimatedPrice: 700000,
    maxRevisions: 3,
    scopeOutput: "File thiết kế Vector (AI/PSD), File in chất lượng cao (PDF/PNG), Mockup thực tế.",
    supportType: "Online",
    demoImages: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80"
    ]
  }
];

// Seed Sample Projects
export const SEED_PROJECTS: SampleProject[] = [
  {
    id: "proj-1",
    name: "Website Đặt Sân & Quản Lý Sự Kiện Sinh Viên",
    category: "IT",
    description: "Hệ thống Web Fullstack hỗ trợ CLB trường đặt lịch sự kiện, thanh toán và quản lý thành viên.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    link: "https://demo.4youtech.com/student-event",
    featured: true
  },
  {
    id: "proj-2",
    name: "Bộ Giao diện UI App Sức Khỏe & Thể Thao",
    category: "Design",
    description: "Thiết kế UI/UX 18 màn hình phong cách Glassmorphism màu neon dành cho gen Z.",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80",
    link: "https://figma.com/file/demo-fitness-ui",
    featured: true
  },
  {
    id: "proj-3",
    name: "Phân Tích ERD & Hệ Thống E-Commerce Chuyên Sâu",
    category: "IT",
    description: "Thiết kế CSDL SQL gồm 32 bảng chuẩn hóa 3NF xử lý đơn hàng, kho và khuyến mãi.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    link: "https://dbdiagram.io/d/demo-ecommerce",
    featured: false
  },
  {
    id: "proj-4",
    name: "Bộ Nhận Diện Thương Hiệu CLB Sáng Tạo TechClub",
    category: "Design",
    description: "Logo, Brand Guidelines, Template slide thuyết trình và 10 mẫu poster truyền thông.",
    image: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&auto=format&fit=crop&q=80",
    link: "https://behance.net/gallery/techclub-brand",
    featured: true
  }
];

// Seed Orders
export const SEED_ORDERS: ServiceOrder[] = [
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
    quotation: {
      amount: 1800000,
      finalDeadline: "2026-10-04",
      maxRevisions: 4,
      scopeDetails: "Gồm file thiết kế Figma + Source code Next.js + Deploy Vercel.",
      issuedAt: "2026-09-15 10:00"
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
      { id: "m4", title: "Nghiệm thu & Bàn giao source code", completed: false, targetDate: "2026-10-04", updatedBy: "Admin" }
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
    review: null,
    supportTickets: [],
    createdAt: "2026-09-14 14:00",
    updatedAt: "2026-09-22 15:30"
  },
  {
    id: "REQ-2026-002",
    serviceId: "nhan-dien-thuong-hieu",
    serviceName: "Nhận diện thương hiệu & Ấn phẩm truyền thông",
    category: "Design",
    customerId: "usr-cust-2",
    customerName: "Lê Minh Tuấn (CLB IT)",
    customerEmail: "tuan.le@clbit.org",
    customerPhone: "0987654321",
    requirements: "Cần thiết kế Banner và Poster cho cuộc phạm Hackathon Sinh viên 2026. Màu sắc chủ đạo: Xanh Neon + Tím.",
    desiredDeadline: "2026-09-28",
    status: "deliverable_sent",
    progressPercent: 90,
    assignedStaffId: "usr-staff-des",
    assignedStaffName: "Phạm Hà Design",
    quotation: {
      amount: 700000,
      finalDeadline: "2026-09-27",
      maxRevisions: 3,
      scopeDetails: "Gồm 1 Poster 4k + 2 Banner Facebook + File vector thiết kế gốc.",
      issuedAt: "2026-09-18 11:00"
    },
    paymentInfo: {
      amountPaid: 700000,
      paymentMethod: "VietQR",
      paymentStatus: "verified",
      receiptImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
      note: "Đã thanh toán full 100%"
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
        notes: "Gửi bản thử hình ảnh độ phân giải cao. Khách kiểm tra thông tin sự kiện giúp nhóm nhé.",
        timestamp: "2026-09-24 10:00",
        status: "pending"
      }
    ],
    revisions: [],
    messages: [],
    review: null,
    supportTickets: [],
    createdAt: "2026-09-17 08:30",
    updatedAt: "2026-09-24 10:00"
  },
  {
    id: "REQ-2026-003",
    serviceId: "database-design-support",
    serviceName: "Hỗ trợ Thiết kế Cơ sở dữ liệu & ERD",
    category: "IT",
    customerId: "usr-cust-1",
    customerName: "Nguyễn Văn An",
    customerEmail: "an.nguyen@student.edu.vn",
    customerPhone: "0912345678",
    requirements: "Cần hỗ trợ vẽ sơ đồ ERD và chuẩn hóa CSDL cho ứng dụng quản lý thư viện sách trực tuyến.",
    desiredDeadline: "2026-10-10",
    status: "submitted",
    progressPercent: 10,
    milestones: [],
    deliverables: [],
    revisions: [],
    messages: [],
    review: null,
    supportTickets: [],
    createdAt: "2026-09-25 14:20",
    updatedAt: "2026-09-25 14:20"
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
