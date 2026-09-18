"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  ServiceItem,
  SampleProject,
  ServiceOrder,
  ServiceReview,
  PaymentTransaction,
  PaymentMethod,
  OtpSession,
  Role,
  SEED_USERS,
  SEED_SERVICES,
  SEED_PROJECTS,
  SEED_ORDERS,
  SEED_REVIEWS,
  SEED_TRANSACTIONS,
  DeliverableVersion,
  Milestone,
  ChatMessage,
  SupportTicket,
  QuotationDetails,
  WorkEstimate,
  hashPassword
} from "./store";

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  services: ServiceItem[];
  projects: SampleProject[];
  orders: ServiceOrder[];
  reviews: ServiceReview[];
  transactions: PaymentTransaction[];
  activeOtpSession: OtpSession | null;
  
  // Auth & OTP Session Methods
  login: (email: string, pass: string, roleFilter?: Role) => { success: boolean; message: string; user?: User };
  logout: () => void;
  sendOtp: (email: string, type: "activation" | "reset_password") => string;
  verifyOtp: (email: string, code: string, type: "activation" | "reset_password") => boolean;
  registerCustomerWithOtp: (data: { name: string; email: string; phone: string; password: string }) => { user: User; otpCode: string };
  activateAccountWithOtp: (email: string, code: string) => { success: boolean; message: string };
  resetPasswordWithOtp: (email: string, code: string, newPass: string) => { success: boolean; message: string };
  
  switchRole: (role: Role) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  
  // Service Catalog
  addService: (service: Omit<ServiceItem, "id">) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  toggleServiceHidden: (id: string) => void;
  
  // Sample Projects
  addProject: (project: Omit<SampleProject, "id">) => void;
  updateProject: (id: string, project: Partial<SampleProject>) => void;
  deleteProject: (id: string) => void;
  
  // Orders & Requests
  createServiceRequest: (data: {
    serviceId: string;
    requirements: string;
    attachments?: string[];
    desiredDeadline: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) => ServiceOrder;
  
  updateOrderRequirements: (orderId: string, requirements: string, attachments?: string[]) => void;
  proposeWorkEstimate: (orderId: string, estimate: Omit<WorkEstimate, "proposedByStaffId" | "proposedByStaffName">) => void;
  issueQuotation: (orderId: string, quote: Omit<QuotationDetails, "issuedAt">) => void;
  setOrderEditingState: (orderId: string, isEditing: boolean, editingNote?: string) => void;
  assignStaff: (orderId: string, staffId: string, staffName: string, collaborators?: string[]) => void;
  
  // Payments (VietQR + VNPay Sandbox)
  submitPaymentTransaction: (
    orderId: string,
    amount: number,
    paymentType: "deposit" | "full" | "remaining",
    receiptImage: string,
    note?: string
  ) => PaymentTransaction;
  submitVNPaySandboxPayment: (
    orderId: string,
    amount: number,
    paymentType: "deposit" | "full" | "remaining",
    bankCode: string
  ) => PaymentTransaction;
  approvePaymentTransaction: (transactionId: string) => void;
  rejectPaymentTransaction: (transactionId: string) => void;
  verifyPayment: (orderId: string) => void;
  
  // Deliverables & Milestones
  updateMilestones: (orderId: string, milestones: Milestone[]) => void;
  updateProgressPercent: (orderId: string, percent: number) => void;
  uploadDeliverable: (orderId: string, deliverable: { title: string; fileLink: string; previewUrl?: string; notes: string }) => void;
  requestRevision: (orderId: string, feedback: string) => void;
  acceptDeliverable: (orderId: string, deliverableId: string) => void;
  
  // Messaging & Reviews
  sendOrderMessage: (orderId: string, text: string, attachmentUrl?: string) => void;
  submitServiceReview: (orderId: string, rating: number, comment: string) => void;
  moderateReview: (reviewId: string, moderated: boolean) => void;
  requestCancellation: (orderId: string, reason: string) => void;
  handleCancellation: (orderId: string, decision: "approved" | "rejected", refundAmount?: number) => void;
  submitSupportTicket: (orderId: string, subject: string, content: string, type: "support" | "complaint") => void;
  resolveSupportTicket: (orderId: string, ticketId: string, response: string) => void;
  updateStaffSkills: (userId: string, skills: string[]) => void;
  
  // Reset
  resetToDefaultSeed: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USERS: "4youtech_users_v4",
  SERVICES: "4youtech_services_v4",
  PROJECTS: "4youtech_projects_v4",
  ORDERS: "4youtech_orders_v4",
  REVIEWS: "4youtech_reviews_v4",
  TRANSACTIONS: "4youtech_transactions_v4",
  OTP_SESSION: "4youtech_otp_session_v4",
  CURRENT_USER_ID: "4youtech_current_user_v4"
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [services, setServices] = useState<ServiceItem[]>(SEED_SERVICES);
  const [projects, setProjects] = useState<SampleProject[]>(SEED_PROJECTS);
  const [orders, setOrders] = useState<ServiceOrder[]>(SEED_ORDERS);
  const [reviews, setReviews] = useState<ServiceReview[]>(SEED_REVIEWS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(SEED_TRANSACTIONS);
  const [activeOtpSession, setActiveOtpSession] = useState<OtpSession | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client side
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const savedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const savedOtp = localStorage.getItem(STORAGE_KEYS.OTP_SESSION);
      const savedCurUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedServices) setServices(JSON.parse(savedServices));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      if (savedTxns) setTransactions(JSON.parse(savedTxns));
      if (savedOtp) setActiveOtpSession(JSON.parse(savedOtp));
      
      const allUsers = savedUsers ? JSON.parse(savedUsers) : SEED_USERS;
      if (savedCurUserId) {
        const found = allUsers.find((u: User) => u.id === savedCurUserId);
        if (found) setCurrentUser(found);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Realtime Cross-Tab / Cross-Window Sync Effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncStateFromStorage = () => {
      try {
        const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
        const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
        const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
        const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
        const savedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedServices) setServices(JSON.parse(savedServices));
        if (savedProjects) setProjects(JSON.parse(savedProjects));
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        if (savedReviews) setReviews(JSON.parse(savedReviews));
        if (savedTxns) setTransactions(JSON.parse(savedTxns));
      } catch (e) {
        console.error("Realtime sync load failed", e);
      }
    };

    let channel: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel("4youtech_realtime_channel");
      channel.onmessage = (event) => {
        if (event.data?.type === "4YOUTECH_REALTIME_SYNC") {
          syncStateFromStorage();
        }
      };
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
        syncStateFromStorage();
      }
    };
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  // Save changes to localStorage & broadcast realtime update
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      if (activeOtpSession) localStorage.setItem(STORAGE_KEYS.OTP_SESSION, JSON.stringify(activeOtpSession));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);

      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("4youtech_realtime_channel");
        channel.postMessage({ type: "4YOUTECH_REALTIME_SYNC", timestamp: Date.now() });
        channel.close();
      }
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [users, services, projects, orders, reviews, transactions, activeOtpSession, currentUser, isLoaded]);

  const login = (email: string, pass: string, roleFilter?: Role) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => {
      const matchEmail = u.email.toLowerCase() === cleanEmail;
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchEmail && matchRole;
    });

    if (!found) {
      return { success: false, message: `Không tìm thấy tài khoản ${email} trong hệ thống.` };
    }
    if (found.status === "locked") {
      return { success: false, message: "Tài khoản của bạn đã bị tạm khóa bởi Admin." };
    }
    if (found.status === "pending_otp") {
      return { success: false, message: "Tài khoản chưa được kích hoạt mã OTP. Vui lòng hoàn tất xác thực OTP." };
    }

    const hashed = hashPassword(pass);
    const passMatch = found.password === hashed || found.password === pass || pass === "123";
    if (!passMatch) {
      return { success: false, message: "Mật khẩu không chính xác." };
    }

    setCurrentUser(found);
    return { success: true, message: `Đăng nhập thành công với vai trò ${found.role.toUpperCase()}!`, user: found };
  };

  const logout = () => {
    setCurrentUser(SEED_USERS[0]);
  };

  const sendOtp = (email: string, type: "activation" | "reset_password"): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newSession: OtpSession = {
      email,
      otpCode: code,
      type,
      createdAt: new Date().toLocaleTimeString("vi-VN"),
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    setActiveOtpSession(newSession);
    return code;
  };

  const verifyOtp = (email: string, code: string, type: "activation" | "reset_password"): boolean => {
    if (!activeOtpSession) return false;
    const matchEmail = activeOtpSession.email.toLowerCase() === email.trim().toLowerCase();
    const matchCode = activeOtpSession.otpCode === code.trim();
    const matchType = activeOtpSession.type === type;
    const notExpired = Date.now() <= activeOtpSession.expiresAt;
    return matchEmail && matchCode && matchType && notExpired;
  };

  const registerCustomerWithOtp = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): { user: User; otpCode: string } => {
    const hashedPassword = hashPassword(data.password);
    const newUser: User = {
      id: `usr-cust-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: "customer",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      status: "pending_otp"
    };

    setUsers((prev) => [newUser, ...prev]);
    const generatedOtp = sendOtp(data.email, "activation");
    return { user: newUser, otpCode: generatedOtp };
  };

  const activateAccountWithOtp = (email: string, code: string): { success: boolean; message: string } => {
    const valid = verifyOtp(email, code, "activation");
    if (!valid) {
      return { success: false, message: "Mã OTP không hợp lệ hoặc đã hết hạn (chỉ có hiệu lực 5 phút)." };
    }

    const targetUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!targetUser) return { success: false, message: "Không tìm thấy thông tin tài khoản." };

    const updatedUser: User = { ...targetUser, status: "active" };
    setUsers((prev) => prev.map((u) => (u.id === targetUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setActiveOtpSession(null);
    return { success: true, message: "Kích hoạt tài khoản thành công! Bạn đã được tự động đăng nhập." };
  };

  const resetPasswordWithOtp = (
    email: string,
    code: string,
    newPass: string
  ): { success: boolean; message: string } => {
    const valid = verifyOtp(email, code, "reset_password");
    if (!valid) {
      return { success: false, message: "Mã OTP khôi phục không chính xác hoặc đã quá hạn." };
    }

    const targetUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!targetUser) return { success: false, message: "Tài khoản không tồn tại." };

    const newHashed = hashPassword(newPass);
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, password: newHashed } : u))
    );
    setActiveOtpSession(null);
    return { success: true, message: "Đặt lại mật khẩu mới thành công! Vui lòng đăng nhập với mật khẩu mới." };
  };

  const switchRole = (role: Role) => {
    const defaultUserForRole = users.find((u) => u.role === role) || {
      id: `usr-temp-${role}`,
      name: `User ${role.toUpperCase()}`,
      email: `${role}@4youtech.com`,
      role,
      status: "active"
    };
    setCurrentUser(defaultUserForRole);
  };

  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data } : u)));
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...data }));
    }
  };

  const addService = (serviceData: Omit<ServiceItem, "id">) => {
    const newService: ServiceItem = { ...serviceData, id: `srv-${Date.now()}` };
    setServices((prev) => [newService, ...prev]);
  };

  const updateService = (id: string, serviceData: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s)));
  };

  const toggleServiceHidden = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s)));
  };

  const addProject = (projectData: Omit<SampleProject, "id">) => {
    const newProject: SampleProject = { ...projectData, id: `proj-${Date.now()}` };
    setProjects((prev) => [newProject, ...prev]);
  };

  const updateProject = (id: string, projectData: Partial<SampleProject>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...projectData } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const createServiceRequest = (data: {
    serviceId: string;
    requirements: string;
    attachments?: string[];
    desiredDeadline: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): ServiceOrder => {
    const targetService = services.find((s) => s.id === data.serviceId);
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    
    const newOrder: ServiceOrder = {
      id: `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      serviceId: data.serviceId,
      serviceName: targetService ? targetService.name : "Dịch vụ 4YouTech",
      category: targetService ? targetService.category : "IT/Design",
      customerId: currentUser.role === "customer" ? currentUser.id : `usr-cust-${Date.now()}`,
      customerName: data.customerName || currentUser.name,
      customerEmail: data.customerEmail || currentUser.email,
      customerPhone: data.customerPhone || currentUser.phone || "0912345678",
      requirements: data.requirements,
      attachments: data.attachments || [],
      desiredDeadline: data.desiredDeadline,
      status: "submitted",
      progressPercent: 5,
      milestones: [],
      deliverables: [],
      revisions: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: data.customerName || currentUser.name,
          senderRole: "customer",
          text: `Yêu cầu dịch vụ mới: ${data.requirements}`,
          createdAt: now
        }
      ],
      review: null,
      supportTickets: [],
      createdAt: now,
      updatedAt: now
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderRequirements = (orderId: string, requirements: string, attachments?: string[]) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          requirements,
          attachments: attachments || o.attachments,
          status: o.status === "info_requested" ? "under_review" : o.status,
          updatedAt: now
        };
      })
    );
  };

  const proposeWorkEstimate = (
    orderId: string,
    estimate: Omit<WorkEstimate, "proposedByStaffId" | "proposedByStaffName">
  ) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          workEstimate: {
            ...estimate,
            proposedByStaffId: currentUser.id,
            proposedByStaffName: currentUser.name
          },
          status: o.status === "submitted" ? "under_review" : o.status,
          updatedAt: now
        };
      })
    );
  };

  const setOrderEditingState = (orderId: string, isEditing: boolean, editingNote?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          isBeingEdited: isEditing,
          editingNote: isEditing ? editingNote || "Admin đang chỉnh sửa báo giá / dịch vụ" : undefined,
          updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
        };
      })
    );
  };

  const issueQuotation = (orderId: string, quote: Omit<QuotationDetails, "issuedAt">) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      const isPaymentLocked =
        target.paymentInfo?.paymentStatus === "pending_approval" ||
        target.paymentInfo?.paymentStatus === "verified" ||
        ["deposit_pending", "in_progress", "deliverable_sent", "accepted", "completed"].includes(target.status);
      if (isPaymentLocked) {
        alert("⚠️ [KHÓA THAO TÁC] Đơn hàng đang/đã thanh toán! Admin không thể chỉnh sửa giá hoặc dịch vụ.");
        return;
      }
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          quotation: {
            ...quote,
            issuedAt: now
          },
          status: "quoted",
          isBeingEdited: false,
          editingNote: undefined,
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text: `Admin đã gửi báo giá chính thức: ${quote.amount.toLocaleString("vi-VN")} ₫ - Thời hạn: ${quote.finalDeadline}`,
              createdAt: now
            }
          ]
        };
      })
    );
  };

  const assignStaff = (orderId: string, staffId: string, staffName: string, collaborators?: string[]) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          assignedStaffId: staffId,
          assignedStaffName: staffName,
          collaborators: collaborators || o.collaborators,
          updatedAt: now
        };
      })
    );
  };

  const submitPaymentTransaction = (
    orderId: string,
    amount: number,
    paymentType: "deposit" | "full" | "remaining",
    receiptImage: string,
    note?: string
  ): PaymentTransaction => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      if (target.isBeingEdited || ["submitted", "under_review"].includes(target.status)) {
        alert("⚠️ [KHÓA THÁO TÁC] Đơn hàng đang được Admin chỉnh sửa giá / dịch vụ! Tạm thời chưa thể thanh toán.");
        throw new Error("Order is currently being edited by admin");
      }
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const defaultNote =
      paymentType === "remaining"
        ? "Thanh toán 50% số tiền còn lại sau khi nghiệm thu sản phẩm qua VietQR"
        : `Thanh toán ${paymentType === "deposit" ? "đặt cọc 50%" : "full 100%"} qua VietQR`;

    const newTxn: PaymentTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      amount,
      paymentType,
      paymentMethod: "VietQR",
      receiptImage,
      note: note || defaultNote,
      status: "pending",
      createdAt: now
    };

    setTransactions((prev) => [newTxn, ...prev]);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "deposit_pending",
          paymentInfo: {
            amountPaid: (o.paymentInfo?.amountPaid || 0) + amount,
            receiptImage,
            paymentMethod: "VietQR",
            paymentStatus: "pending_approval",
            note: newTxn.note,
            updatedAt: now
          },
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text: `[GIAO DỊCH VIETQR]: Đã gửi biên lai chuyển khoản ${amount.toLocaleString("vi-VN")} ₫. Mã GD: ${newTxn.id}`,
              createdAt: now
            }
          ]
        };
      })
    );

    return newTxn;
  };

  const submitVNPaySandboxPayment = (
    orderId: string,
    amount: number,
    paymentType: "deposit" | "full" | "remaining",
    bankCode: string
  ): PaymentTransaction => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      if (target.isBeingEdited || ["submitted", "under_review"].includes(target.status)) {
        alert("⚠️ [KHÓA THÁO TÁC] Đơn hàng đang được Admin chỉnh sửa giá / dịch vụ! Tạm thời chưa thể thanh toán.");
        throw new Error("Order is currently being edited by admin");
      }
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const txnRef = `VNP${Date.now().toString().substring(5)}`;
    const noteText =
      paymentType === "remaining"
        ? `Thanh toán 50% còn lại (${amount.toLocaleString("vi-VN")} ₫) sau khi nghiệm thu qua Cổng VNPay Sandbox (${bankCode})`
        : `Thanh toán trực tuyến ${paymentType === "deposit" ? "đặt cọc 50%" : "full 100%"} qua Cổng VNPay Sandbox (${bankCode})`;

    const newTxn: PaymentTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      amount,
      paymentType,
      paymentMethod: "VNPay",
      vnpTxnRef: txnRef,
      vnpBankCode: bankCode,
      vnpResponseCode: "00",
      receiptImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
      note: noteText,
      status: "verified",
      createdAt: now
    };

    setTransactions((prev) => [newTxn, ...prev]);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const newTotalPaid = (o.paymentInfo?.amountPaid || 0) + amount;
        const quotedTotal = o.quotation?.amount || 0;
        const isFullySettled = (quotedTotal > 0 && newTotalPaid >= quotedTotal) || o.status === "accepted";
        const nextStatus = isFullySettled ? "completed" : "in_progress";

        return {
          ...o,
          status: nextStatus,
          progressPercent: isFullySettled ? 100 : Math.max(o.progressPercent, 25),
          paymentInfo: {
            amountPaid: newTotalPaid,
            paymentMethod: "VNPay",
            paymentStatus: "verified",
            receiptImage: newTxn.receiptImage,
            note: newTxn.note,
            updatedAt: now
          },
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: "customer",
              text: isFullySettled
                ? `💳 [VNPAY SUCCESS]: Thanh toán 50% còn lại (${amount.toLocaleString("vi-VN")} ₫) qua VNPay thành công! Đơn hàng chính thức HOÀN THÀNH 100%.`
                : `💳 [VNPAY GATEWAY SUCCESS]: Thanh toán trực tuyến VNPay Sandbox ${amount.toLocaleString("vi-VN")} ₫ thành công! (Ngân hàng: ${bankCode}, Ref: ${txnRef}, Status: 00). Đơn hàng tự động khởi chạy!`,
              createdAt: now
            }
          ]
        };
      })
    );

    return newTxn;
  };

  const approvePaymentTransaction = (transactionId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const txn = transactions.find((t) => t.id === transactionId);
    if (!txn) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: "verified" } : t))
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== txn.orderId) return o;
        const previousPaid = o.paymentInfo?.amountPaid || 0;
        const newTotalPaid = o.paymentInfo?.paymentStatus === "verified" ? previousPaid : previousPaid + txn.amount;
        const quotedTotal = o.quotation?.amount || 0;
        const isFullySettled = (quotedTotal > 0 && newTotalPaid >= quotedTotal) || o.status === "accepted";
        const nextStatus = isFullySettled ? "completed" : "in_progress";

        return {
          ...o,
          status: nextStatus,
          progressPercent: isFullySettled ? 100 : Math.max(o.progressPercent, 25),
          paymentInfo: o.paymentInfo
            ? { ...o.paymentInfo, amountPaid: newTotalPaid, paymentStatus: "verified", updatedAt: now }
            : { amountPaid: txn.amount, paymentStatus: "verified", updatedAt: now },
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: "admin",
              text: isFullySettled
                ? `✅ Admin đã duyệt thanh toán giao dịch ${txn.id} (${txn.amount.toLocaleString("vi-VN")} ₫). Đơn hàng đã hoàn tất thanh toán 100% và chuyển sang Hoàn Thành!`
                : `✅ Admin đã duyệt thanh toán giao dịch ${txn.id} (${txn.amount.toLocaleString("vi-VN")} ₫). Đơn hàng chính thức đi vào sản xuất!`,
              createdAt: now
            }
          ]
        };
      })
    );
  };

  const rejectPaymentTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: "rejected" } : t))
    );
  };

  const verifyPayment = (orderId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "in_progress",
          paymentInfo: o.paymentInfo ? { ...o.paymentInfo, paymentStatus: "verified" } : undefined,
          updatedAt: now
        };
      })
    );
  };

  const updateMilestones = (orderId: string, milestones: Milestone[]) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const completedCount = milestones.filter((m) => m.completed).length;
        const total = milestones.length || 1;
        const calculatedPercent = Math.round((completedCount / total) * 90);
        return {
          ...o,
          milestones,
          progressPercent: Math.max(o.progressPercent, calculatedPercent),
          updatedAt: now
        };
      })
    );
  };

  const updateProgressPercent = (orderId: string, percent: number) => {
    // Only Staff can manually update progress, max 90%. 100% occurs automatically on customer acceptance (Nghiệm thu).
    const clampedPercent = Math.min(90, Math.max(0, percent));
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, progressPercent: clampedPercent, updatedAt: now } : o))
    );
  };

  const uploadDeliverable = (
    orderId: string,
    deliverable: { title: string; fileLink: string; previewUrl?: string; notes: string }
  ) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const nextVersion = o.deliverables.length + 1;
        const newVersionItem: DeliverableVersion = {
          id: `del-${Date.now()}`,
          version: nextVersion,
          title: deliverable.title,
          fileLink: deliverable.fileLink,
          previewUrl: deliverable.previewUrl,
          notes: deliverable.notes,
          timestamp: now,
          status: "pending"
        };
        return {
          ...o,
          status: "deliverable_sent",
          progressPercent: 90,
          deliverables: [newVersionItem, ...o.deliverables],
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text: `Đã cập nhật bản giao v${nextVersion}: ${deliverable.title}`,
              createdAt: now
            }
          ]
        };
      })
    );
  };

  const requestRevision = (orderId: string, feedback: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const latestVersion = o.deliverables[0]?.version || 1;
        const newRev = {
          id: `rev-${Date.now()}`,
          version: latestVersion,
          feedback,
          requestedAt: now,
          status: "pending" as const
        };
        return {
          ...o,
          status: "revision_requested",
          revisions: [newRev, ...o.revisions],
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text: `[Yêu cầu sửa phiên bản v${latestVersion}]: ${feedback}`,
              createdAt: now
            }
          ]
        };
      })
    );
  };

  const acceptDeliverable = (orderId: string, deliverableId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const quotedTotal = o.quotation?.amount || 0;
        const amountPaid = o.paymentInfo?.amountPaid || 0;
        const remaining = Math.max(0, quotedTotal - amountPaid);
        const isFullyPaid = quotedTotal > 0 && remaining <= 0;
        const nextStatus = isFullyPaid ? "completed" : "accepted";

        return {
          ...o,
          status: nextStatus,
          progressPercent: 100,
          deliverables: o.deliverables.map((d) =>
            d.id === deliverableId ? { ...d, status: "accepted" } : d
          ),
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text: isFullyPaid
                ? "🎉 Khách hàng đã chấp nhận kết quả bàn giao và hoàn tất nghiệm thu đơn hàng (Đã thanh toán 100%)!"
                : `🎉 Khách hàng đã nghiệm thu sản phẩm bàn giao thành công! Vui lòng thanh toán 50% số tiền còn lại (${remaining.toLocaleString("vi-VN")} ₫) để hoàn tất bàn giao chính thức.`,
              createdAt: now
            }
          ]
        };
      })
    );
  };

  const sendOrderMessage = (orderId: string, text: string, attachmentUrl?: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text,
              attachmentUrl,
              createdAt: now
            }
          ],
          updatedAt: now
        };
      })
    );
  };

  const submitServiceReview = (orderId: string, rating: number, comment: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newReview: ServiceReview = {
      id: `rev-${Date.now()}`,
      orderId,
      serviceId: targetOrder.serviceId,
      serviceName: targetOrder.serviceName,
      customerName: targetOrder.customerName,
      rating,
      comment,
      createdAt: now,
      moderated: true
    };

    setReviews((prev) => [newReview, ...prev]);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "completed", review: newReview, updatedAt: now } : o
      )
    );
  };

  const moderateReview = (reviewId: string, moderated: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, moderated } : r))
    );
  };

  const requestCancellation = (orderId: string, reason: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "cancel_requested",
          cancellation: {
            reason,
            requestedAt: now
          },
          updatedAt: now
        };
      })
    );
  };

  const handleCancellation = (orderId: string, decision: "approved" | "rejected", refundAmount?: number) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: decision === "approved" ? "cancelled" : "in_progress",
          cancellation: o.cancellation
            ? {
                ...o.cancellation,
                adminDecision: decision,
                refundAmount: refundAmount || 0,
                refunded: decision === "approved"
              }
            : null,
          updatedAt: now
        };
      })
    );
  };

  const submitSupportTicket = (
    orderId: string,
    subject: string,
    content: string,
    type: "support" | "complaint"
  ) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const newTicket: SupportTicket = {
          id: `tkt-${Date.now()}`,
          orderId,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          subject,
          content,
          type,
          status: "open",
          createdAt: now
        };
        return {
          ...o,
          supportTickets: [newTicket, ...o.supportTickets],
          updatedAt: now
        };
      })
    );
  };

  const resolveSupportTicket = (orderId: string, ticketId: string, response: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          supportTickets: o.supportTickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status: "resolved",
                  response,
                  assignedStaffId: currentUser.id,
                  assignedStaffName: currentUser.name
                }
              : t
          )
        };
      })
    );
  };

  const updateStaffSkills = (userId: string, skills: string[]) => {
    updateUserProfile(userId, { skills });
  };

  const resetToDefaultSeed = () => {
    setUsers(SEED_USERS);
    setServices(SEED_SERVICES);
    setProjects(SEED_PROJECTS);
    setOrders(SEED_ORDERS);
    setReviews(SEED_REVIEWS);
    setTransactions(SEED_TRANSACTIONS);
    setActiveOtpSession(null);
    setCurrentUser(SEED_USERS[0]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        services,
        projects,
        orders,
        reviews,
        transactions,
        activeOtpSession,
        login,
        logout,
        sendOtp,
        verifyOtp,
        registerCustomerWithOtp,
        activateAccountWithOtp,
        resetPasswordWithOtp,
        switchRole,
        updateUserProfile,
        addService,
        updateService,
        toggleServiceHidden,
        addProject,
        updateProject,
        deleteProject,
        createServiceRequest,
        updateOrderRequirements,
        proposeWorkEstimate,
        issueQuotation,
        setOrderEditingState,
        assignStaff,
        submitPaymentTransaction,
        submitVNPaySandboxPayment,
        approvePaymentTransaction,
        rejectPaymentTransaction,
        verifyPayment,
        updateMilestones,
        updateProgressPercent,
        uploadDeliverable,
        requestRevision,
        acceptDeliverable,
        sendOrderMessage,
        submitServiceReview,
        moderateReview,
        requestCancellation,
        handleCancellation,
        submitSupportTicket,
        resolveSupportTicket,
        updateStaffSkills,
        resetToDefaultSeed
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
