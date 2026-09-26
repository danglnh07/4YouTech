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
