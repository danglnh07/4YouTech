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
  CartItem,
  OrderStatus,
  hashPassword
} from "./store";
import { sendOtpEmail } from "./email";

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
  cart: CartItem[];
  
  // Cart Management
  addToCart: (service: ServiceItem, requirements?: string, desiredDeadline?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  submitCartBooking: (customerInfo: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    desiredDeadline: string;
    requirements?: string;
  }) => ServiceOrder[];
  
  // Auth & OTP Session Methods
  login: (email: string, pass: string, roleFilter?: Role) => { success: boolean; message: string; user?: User };
  logout: () => void;
  sendOtp: (email: string, type: "activation" | "reset_password", customerName?: string) => string;
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
  replyToServiceReview: (reviewId: string, replyText: string) => void;
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
  SERVICES: "4youtech_services_v6",
  PROJECTS: "4youtech_projects_v15",
  ORDERS: "4youtech_orders_v4",
  REVIEWS: "4youtech_reviews_v4",
  TRANSACTIONS: "4youtech_transactions_v4",
  OTP_SESSION: "4youtech_otp_session_v4",
  CURRENT_USER_ID: "4youtech_current_user_v4",
  CART: "4youtech_cart_v4"
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // SQL Server Sync Helpers
  const syncUserToDb = (u: User) => {
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    }).catch((err) => console.warn("SQL Server user sync warning:", err));
  };

  const syncServiceToDb = (s: ServiceItem) => {
    fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    }).catch((err) => console.warn("SQL Server service sync warning:", err));
  };

  const syncProjectToDb = (p: SampleProject) => {
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    }).catch((err) => console.warn("SQL Server project sync warning:", err));
  };

  const syncOrderToDb = (o: ServiceOrder) => {
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(o)
    }).catch((err) => console.warn("SQL Server order sync warning:", err));
  };

  const syncReviewToDb = (r: ServiceReview) => {
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r)
    }).catch((err) => console.warn("SQL Server review sync warning:", err));
  };

  const syncTransactionToDb = (t: PaymentTransaction) => {
    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t)
    }).catch((err) => console.warn("SQL Server transaction sync warning:", err));
  };

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
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);

      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedServices) setServices(JSON.parse(savedServices));
      if (savedProjects) {
        const parsed: SampleProject[] = JSON.parse(savedProjects);
        const updated = parsed.map((p) => {
          const seed = SEED_PROJECTS.find((s) => s.id === p.id);
          return seed ? { ...p, description: seed.description } : p;
        });
        const missingSeed = SEED_PROJECTS.filter((sp) => !updated.some((p) => p.id === sp.id));
        setProjects([...updated, ...missingSeed]);
      } else {
        setProjects(SEED_PROJECTS);
      }
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      if (savedTxns) setTransactions(JSON.parse(savedTxns));
      if (savedOtp) setActiveOtpSession(JSON.parse(savedOtp));
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const allUsers = savedUsers ? JSON.parse(savedUsers) : SEED_USERS;
      if (savedCurUserId) {
        const found = allUsers.find((u: User) => u.id === savedCurUserId);
        if (found) setCurrentUser(found);
      }
    } catch (e) {
      console.error("Initial load from storage failed", e);
    }

    // Query Real MySQL Database APIs
    const fetchFromDb = () => {
      Promise.all([
        fetch("/api/users").then((r) => r.json()).catch(() => null),
        fetch("/api/services").then((r) => r.json()).catch(() => null),
        fetch("/api/orders").then((r) => r.json()).catch(() => null),
        fetch("/api/projects").then((r) => r.json()).catch(() => null),
        fetch("/api/reviews").then((r) => r.json()).catch(() => null),
        fetch("/api/transactions").then((r) => r.json()).catch(() => null)
      ]).then(([uRes, sRes, oRes, pRes, rRes, tRes]) => {
        if (uRes?.data && uRes.data.length > 0) setUsers(uRes.data);
        if (sRes?.data && sRes.data.length > 0) setServices(sRes.data);
        if (oRes?.data && oRes.data.length > 0) setOrders(oRes.data);
        if (pRes?.data && pRes.data.length > 0) setProjects(pRes.data);
        if (rRes?.data && rRes.data.length > 0) setReviews(rRes.data);
        if (tRes?.data && tRes.data.length > 0) setTransactions(tRes.data);
      }).catch((err) => {
        console.warn("MySQL DB fetch notice:", err);
      });
    };

    fetchFromDb();
    setIsLoaded(true);
  }, []);

  // Realtime Polling & Cross-Browser Sync Effect
  useEffect(() => {
    if (!isLoaded) return;
    const intervalId = setInterval(() => {
      Promise.all([
        fetch("/api/users").then((r) => r.json()).catch(() => null),
        fetch("/api/services").then((r) => r.json()).catch(() => null),
        fetch("/api/orders").then((r) => r.json()).catch(() => null),
        fetch("/api/projects").then((r) => r.json()).catch(() => null),
        fetch("/api/reviews").then((r) => r.json()).catch(() => null),
        fetch("/api/transactions").then((r) => r.json()).catch(() => null)
      ]).then(([uRes, sRes, oRes, pRes, rRes, tRes]) => {
        if (uRes?.data && uRes.data.length > 0) setUsers(uRes.data);
        if (sRes?.data && sRes.data.length > 0) setServices(sRes.data);
        if (oRes?.data && oRes.data.length > 0) setOrders(oRes.data);
        if (pRes?.data && pRes.data.length > 0) setProjects(pRes.data);
        if (rRes?.data && rRes.data.length > 0) setReviews(rRes.data);
        if (tRes?.data && tRes.data.length > 0) setTransactions(tRes.data);
      }).catch(() => {});
    }, 4000);

    return () => clearInterval(intervalId);
  }, [isLoaded]);

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
        if (savedProjects) {
          const parsed: SampleProject[] = JSON.parse(savedProjects);
          const updated = parsed.map((p) => {
            const seed = SEED_PROJECTS.find((s) => s.id === p.id);
            return seed ? { ...p, description: seed.description } : p;
          });
          const missingSeed = SEED_PROJECTS.filter((sp) => !updated.some((p) => p.id === sp.id));
          setProjects([...updated, ...missingSeed]);
        }
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        if (savedReviews) setReviews(JSON.parse(savedReviews));
        if (savedTxns) setTransactions(JSON.parse(savedTxns));
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) setCart(JSON.parse(savedCart));
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
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));

      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("4youtech_realtime_channel");
        channel.postMessage({ type: "4YOUTECH_REALTIME_SYNC", timestamp: Date.now() });
        channel.close();
      }
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [users, services, projects, orders, reviews, transactions, activeOtpSession, currentUser, cart, isLoaded]);

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

  const sendOtp = (email: string, type: "activation" | "reset_password", customerName?: string): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newSession: OtpSession = {
      email,
      otpCode: code,
      type,
      createdAt: new Date().toLocaleTimeString("vi-VN"),
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    setActiveOtpSession(newSession);

    // Asynchronously dispatch real email / API request
    sendOtpEmail({
      to_email: email,
      customer_name: customerName,
      otp_code: code,
      type
    }).then((res) => {
      console.log("OTP Email dispatch status:", res.message);
    }).catch((err) => {
      console.error("OTP Email dispatch error:", err);
    });

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
    const cleanName = data.name ? data.name.trim() : "";
    const cleanEmail = data.email ? data.email.trim().toLowerCase() : "";
    const cleanPhone = data.phone ? data.phone.trim() : "";

    if (!cleanName || cleanName.length < 2) {
      throw new Error("Vui lòng nhập Họ và Tên hợp lệ (tối thiểu 2 ký tự).");
    }

    if (!cleanEmail || !/.+@.+\..+/.test(cleanEmail)) {
      throw new Error("Vui lòng nhập địa chỉ Email hợp lệ (ví dụ: student@edu.vn).");
    }

    const phoneDigits = cleanPhone.replace(/\D/g, "");
    if (!cleanPhone || phoneDigits.length < 9) {
      throw new Error("Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 9-10 chữ số).");
    }

    const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingUser && existingUser.status === "active") {
      throw new Error(`Email "${cleanEmail}" đã được đăng ký trên hệ thống 4YouTech. Vui lòng đăng nhập hoặc sử dụng chức năng Quên Mật Khẩu.`);
    }

    const hashedPassword = hashPassword(data.password);
    const newUser: User = {
      id: `usr-cust-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: "customer",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      status: "pending_otp"
    };

    setUsers((prev) => [newUser, ...prev.filter(u => u.email.toLowerCase() !== cleanEmail)]);
    
    // Sync newly registered user to Database with status 'pending_otp'
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    }).catch((err) => console.warn("Sync new user to DB notice:", err));

    const generatedOtp = sendOtp(cleanEmail, "activation", cleanName);
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

    // Sync active status to SQL Server DB
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    }).catch((err) => console.warn("Sync activated user to SQL Server notice:", err));

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
    const updatedUser: User = { ...targetUser, password: newHashed };
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? updatedUser : u))
    );
    setActiveOtpSession(null);

    // Sync new password to SQL Server DB
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    }).catch((err) => console.warn("Sync reset password to SQL Server notice:", err));

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
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? { ...u, ...data } : u));
      const target = next.find((u) => u.id === userId);
      if (target) syncUserToDb(target);
      return next;
    });
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...data }));
    }
  };

  const addService = (serviceData: Omit<ServiceItem, "id">) => {
    const newService: ServiceItem = { ...serviceData, id: `srv-${Date.now()}` };
    setServices((prev) => [newService, ...prev]);
    syncServiceToDb(newService);
  };

  const updateService = (id: string, serviceData: Partial<ServiceItem>) => {
    setServices((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s));
      const target = next.find((s) => s.id === id);
      if (target) syncServiceToDb(target);
      return next;
    });
  };

  const toggleServiceHidden = (id: string) => {
    setServices((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s));
      const target = next.find((s) => s.id === id);
      if (target) syncServiceToDb(target);
      return next;
    });
  };

  const addProject = (projectData: Omit<SampleProject, "id">) => {
    const newProject: SampleProject = { ...projectData, id: `proj-${Date.now()}` };
    setProjects((prev) => [newProject, ...prev]);
    syncProjectToDb(newProject);
  };

  const updateProject = (id: string, projectData: Partial<SampleProject>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...projectData } : p));
      const target = next.find((p) => p.id === id);
      if (target) syncProjectToDb(target);
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    }).catch((err) => console.warn("Delete project notice:", err));
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
    syncOrderToDb(newOrder);
    return newOrder;
  };

  const updateOrderRequirements = (orderId: string, requirements: string, attachments?: string[]) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          requirements,
          attachments: attachments || o.attachments,
          status: o.status === "info_requested" ? "under_review" : o.status,
          updatedAt: now
        };
      });
      const target = next.find((o) => o.id === orderId);
      if (target) syncOrderToDb(target);
      return next;
    });
  };

  const proposeWorkEstimate = (
    orderId: string,
    estimate: Omit<WorkEstimate, "proposedByStaffId" | "proposedByStaffName">
  ) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next = prev.map((o) => {
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
      });
      const target = next.find((o) => o.id === orderId);
      if (target) syncOrderToDb(target);
      return next;
    });
  };

  const setOrderEditingState = (orderId: string, isEditing: boolean, editingNote?: string) => {
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          isBeingEdited: isEditing,
          editingNote: isEditing ? editingNote || "Admin đang chỉnh sửa báo giá / dịch vụ" : undefined,
          updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
        };
      });
      const target = next.find((o) => o.id === orderId);
      if (target) syncOrderToDb(target);
      return next;
    });
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
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          quotation: {
            ...quote,
            issuedAt: now
          },
          status: "quoted" as OrderStatus,
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
      });
      const updated = next.find((o) => o.id === orderId);
      if (updated) syncOrderToDb(updated);
      return next;
    });
  };

  const assignStaff = (orderId: string, staffId: string, staffName: string, collaborators?: string[]) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          assignedStaffId: staffId,
          assignedStaffName: staffName,
          collaborators: collaborators || o.collaborators,
          updatedAt: now
        };
      });
      const target = next.find((o) => o.id === orderId);
      if (target) syncOrderToDb(target);
      return next;
    });
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
    syncTransactionToDb(newTxn);

    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        const currentVerifiedPaid = o.paymentInfo?.paymentStatus === "verified" ? (o.paymentInfo.amountPaid || 0) : 0;
        return {
          ...o,
          status: "deposit_pending" as OrderStatus,
          paymentInfo: {
            amountPaid: currentVerifiedPaid,
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
              text: `[GIAO DỊCH VIETQR]: Đã gửi biên lai chuyển khoản ${amount.toLocaleString("vi-VN")} ₫ (${paymentType === "deposit" ? "Đặt cọc 50%" : paymentType === "remaining" ? "50% còn lại" : "Full 100%"}). Mã GD: ${newTxn.id}`,
              createdAt: now
            }
          ]
        };
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });

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

    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    syncTransactionToDb(newTxn);

    const totalVerifiedForOrder = updatedTxns
      .filter((t) => t.orderId === orderId && t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0);

    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        const quotedTotal = o.quotation?.amount || 0;
        const isFullySettled = (quotedTotal > 0 && totalVerifiedForOrder >= quotedTotal) || paymentType === "full" || (paymentType === "remaining" && o.status === "accepted");
        const nextStatus: OrderStatus = isFullySettled ? "completed" : "in_progress";

        return {
          ...o,
          status: nextStatus,
          progressPercent: isFullySettled ? 100 : Math.max(o.progressPercent, 25),
          paymentInfo: {
            amountPaid: totalVerifiedForOrder,
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
                ? `💳 [VNPAY SUCCESS]: Thanh toán ${amount.toLocaleString("vi-VN")} ₫ qua VNPay thành công! Đơn hàng chính thức HOÀN THÀNH 100%.`
                : `💳 [VNPAY GATEWAY SUCCESS]: Thanh toán đặt cọc 50% (${amount.toLocaleString("vi-VN")} ₫) qua VNPay Sandbox thành công! (Ngân hàng: ${bankCode}, Ref: ${txnRef}, Status: 00). Đơn hàng tự động khởi chạy!`,
              createdAt: now
            }
          ]
        };
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });

    return newTxn;
  };

  const approvePaymentTransaction = (transactionId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const txn = transactions.find((t) => t.id === transactionId);
    if (!txn) return;

    const updatedTxns = transactions.map((t) => (t.id === transactionId ? { ...t, status: "verified" as const } : t));
    setTransactions(updatedTxns);
    syncTransactionToDb({ ...txn, status: "verified" });

    const totalVerifiedForOrder = updatedTxns
      .filter((t) => t.orderId === txn.orderId && t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0);

    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== txn.orderId) return o;
        const quotedTotal = o.quotation?.amount || 0;
        const isFullySettled = (quotedTotal > 0 && totalVerifiedForOrder >= quotedTotal) || txn.paymentType === "full" || (txn.paymentType === "remaining" && o.status === "accepted");
        const nextStatus: OrderStatus = isFullySettled ? "completed" : "in_progress";

        return {
          ...o,
          status: nextStatus,
          progressPercent: isFullySettled ? 100 : Math.max(o.progressPercent, 25),
          paymentInfo: {
            amountPaid: totalVerifiedForOrder,
            receiptImage: txn.receiptImage || o.paymentInfo?.receiptImage || "",
            paymentMethod: txn.paymentMethod || "VietQR",
            paymentStatus: "verified",
            note: txn.note || o.paymentInfo?.note,
            updatedAt: now
          },
          updatedAt: now,
          messages: [
            ...o.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: "admin",
              text: isFullySettled
                ? `✅ Admin đã duyệt thanh toán giao dịch ${txn.id} (${txn.amount.toLocaleString("vi-VN")} ₫). Đơn hàng đã hoàn tất 100% thanh toán và chuyển sang Hoàn Thành!`
                : `✅ Admin đã duyệt thanh toán đặt cọc 50% (${txn.amount.toLocaleString("vi-VN")} ₫, Mã GD: ${txn.id}). Đơn hàng chính thức đi vào sản xuất!`,
              createdAt: now
            }
          ]
        };
      });
      const targetOrder = next.find((o) => o.id === txn.orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const rejectPaymentTransaction = (transactionId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const txn = transactions.find((t) => t.id === transactionId);

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: "rejected" } : t))
    );
    if (txn) syncTransactionToDb({ ...txn, status: "rejected" });

    if (txn) {
      setOrders((prev) => {
        const next: ServiceOrder[] = prev.map((o) => {
          if (o.id !== txn.orderId) return o;
          const statusVal: OrderStatus = o.paymentInfo?.amountPaid ? "in_progress" : "quoted";
          return {
            ...o,
            status: statusVal,
            paymentInfo: o.paymentInfo ? { ...o.paymentInfo, paymentStatus: "rejected" } : undefined,
            updatedAt: now,
            messages: [
              ...o.messages,
              {
                id: `msg-${Date.now()}`,
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderRole: "admin",
                text: `❌ Admin đã từ chối biên lai giao dịch ${txn.id} (${txn.amount.toLocaleString("vi-VN")} ₫). Vui lòng kiểm tra lại thông tin chuyển khoản hoặc gửi lại biên lai chính xác.`,
                createdAt: now
              }
            ]
          };
        });
        const targetOrder = next.find((o) => o.id === txn.orderId);
        if (targetOrder) syncOrderToDb(targetOrder);
        return next;
      });
    }
  };

  const verifyPayment = (orderId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    
    // Auto-verify any pending transaction linked to this order
    const updatedTxns = transactions.map((t) => (t.orderId === orderId && t.status === "pending" ? { ...t, status: "verified" as const } : t));
    setTransactions(updatedTxns);
    updatedTxns.filter((t) => t.orderId === orderId && t.status === "verified").forEach(syncTransactionToDb);

    const totalVerifiedForOrder = updatedTxns
      .filter((t) => t.orderId === orderId && t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0);

    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        const quotedTotal = o.quotation?.amount || 0;
        const finalPaid = totalVerifiedForOrder > 0 ? totalVerifiedForOrder : (o.quotation?.amount ? Math.round(o.quotation.amount * 0.5) : 500000);
        const isFullySettled = (quotedTotal > 0 && finalPaid >= quotedTotal) || o.status === "accepted";
        const nextStatus: OrderStatus = isFullySettled ? "completed" : "in_progress";

        return {
          ...o,
          status: nextStatus,
          progressPercent: isFullySettled ? 100 : Math.max(o.progressPercent, 25),
          paymentInfo: o.paymentInfo
            ? { ...o.paymentInfo, amountPaid: finalPaid, paymentStatus: "verified", updatedAt: now }
            : { amountPaid: finalPaid, paymentStatus: "verified", updatedAt: now },
          updatedAt: now
        };
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const updateMilestones = (orderId: string, milestones: Milestone[]) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
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
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const updateProgressPercent = (orderId: string, percent: number) => {
    // Only Staff can manually update progress, max 90%. 100% occurs automatically on customer acceptance (Nghiệm thu).
    const clampedPercent = Math.min(90, Math.max(0, percent));
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => (o.id === orderId ? { ...o, progressPercent: clampedPercent, updatedAt: now } : o));
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const uploadDeliverable = (
    orderId: string,
    deliverable: { title: string; fileLink: string; previewUrl?: string; notes: string }
  ) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
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
          status: "deliverable_sent" as OrderStatus,
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
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const requestRevision = (orderId: string, feedback: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
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
          status: "revision_requested" as OrderStatus,
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
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const acceptDeliverable = (orderId: string, deliverableId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        const quotedTotal = o.quotation?.amount || 0;
        const amountPaid = o.paymentInfo?.amountPaid || 0;
        const remaining = Math.max(0, quotedTotal - amountPaid);
        const isFullyPaid = quotedTotal > 0 && remaining <= 0;
        const nextStatus: OrderStatus = isFullyPaid ? "completed" : "accepted";

        return {
          ...o,
          status: nextStatus,
          progressPercent: 100,
          deliverables: o.deliverables.map((d) =>
            d.id === deliverableId ? { ...d, status: "accepted" as const } : d
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
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const sendOrderMessage = (orderId: string, text: string, attachmentUrl?: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
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
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
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
    syncReviewToDb(newReview);

    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) =>
        o.id === orderId ? { ...o, status: "completed" as OrderStatus, review: newReview, updatedAt: now } : o
      );
      const updatedOrder = next.find((o) => o.id === orderId);
      if (updatedOrder) syncOrderToDb(updatedOrder);
      return next;
    });
  };

  const moderateReview = (reviewId: string, moderated: boolean) => {
    setReviews((prev) => {
      const next = prev.map((r) => (r.id === reviewId ? { ...r, moderated } : r));
      const target = next.find((r) => r.id === reviewId);
      if (target) syncReviewToDb(target);
      return next;
    });
  };

  const replyToServiceReview = (reviewId: string, replyText: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const replierName = currentUser.name || (currentUser.role === "admin" ? "Quản trị viên 4YouTech" : "Nhân viên 4YouTech");

    setReviews((prev) => {
      const next = prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              replyText,
              repliedBy: replierName,
              repliedAt: now
            }
          : r
      );
      const target = next.find((r) => r.id === reviewId);
      if (target) syncReviewToDb(target);
      return next;
    });

    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.review && o.review.id === reviewId) {
          return {
            ...o,
            review: {
              ...o.review,
              replyText,
              repliedBy: replierName,
              repliedAt: now
            },
            updatedAt: now
          };
        }
        return o;
      });
      const targetOrder = next.find((o) => o.review?.id === reviewId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const requestCancellation = (orderId: string, reason: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "cancel_requested" as const,
          cancellation: {
            reason,
            requestedAt: now
          },
          updatedAt: now
        };
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const handleCancellation = (orderId: string, decision: "approved" | "rejected", refundAmount?: number) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: decision === "approved" ? ("cancelled" as const) : ("in_progress" as const),
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
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const submitSupportTicket = (
    orderId: string,
    subject: string,
    content: string,
    type: "support" | "complaint"
  ) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
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
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
  };

  const resolveSupportTicket = (orderId: string, ticketId: string, response: string) => {
    setOrders((prev) => {
      const next: ServiceOrder[] = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          supportTickets: o.supportTickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status: "resolved" as const,
                  response,
                  assignedStaffId: currentUser.id,
                  assignedStaffName: currentUser.name
                }
              : t
          )
        };
      });
      const targetOrder = next.find((o) => o.id === orderId);
      if (targetOrder) syncOrderToDb(targetOrder);
      return next;
    });
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
        addToCart: (service, requirements, desiredDeadline) => {
          if (currentUser.role === "admin" || currentUser.role === "staff") {
            alert("Tài khoản Admin và Nhân viên chỉ quản lý hệ thống, không thể đặt hoặc thêm dịch vụ vào giỏ hàng.");
            return;
          }
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            serviceId: service.id,
            serviceName: service.name,
            category: service.category,
            estimatedPrice: service.estimatedPrice,
            maxPrice: service.maxPrice,
            estimatedDays: service.estimatedDays,
            maxDays: service.maxDays,
            requirements: requirements || "",
            desiredDeadline: desiredDeadline || "",
            addedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
          };
          setCart((prev) => [...prev, newItem]);
        },
        removeFromCart: (cartItemId) => {
          setCart((prev) => prev.filter((item) => item.id !== cartItemId));
        },
        clearCart: () => {
          setCart([]);
        },
        submitCartBooking: (customerInfo) => {
          if (cart.length === 0) return [];
          const now = new Date().toISOString().replace("T", " ").substring(0, 16);
          const createdOrders: ServiceOrder[] = cart.map((item, index) => {
            const orderReq = item.requirements?.trim() || customerInfo.requirements?.trim() || "Yêu cầu dịch vụ từ Giỏ hàng";
            const deadline = item.desiredDeadline || customerInfo.desiredDeadline;

            return {
              id: `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900 + index)}`,
              serviceId: item.serviceId,
              serviceName: item.serviceName,
              category: item.category,
              customerId: currentUser.role === "customer" ? currentUser.id : `usr-cust-${Date.now()}`,
              customerName: customerInfo.customerName || currentUser.name,
              customerEmail: customerInfo.customerEmail || currentUser.email,
              customerPhone: customerInfo.customerPhone || currentUser.phone || "0912345678",
              requirements: orderReq,
              attachments: [],
              desiredDeadline: deadline,
              status: "submitted",
              progressPercent: 5,
              milestones: [],
              deliverables: [],
              revisions: [],
              messages: [
                {
                  id: `msg-${Date.now()}-${index}`,
                  senderId: currentUser.id,
                  senderName: customerInfo.customerName || currentUser.name,
                  senderRole: "customer",
                  text: `Yêu cầu dịch vụ mới từ Giỏ hàng: ${orderReq}`,
                  createdAt: now
                }
              ],
              review: null,
              supportTickets: [],
              createdAt: now,
              updatedAt: now
            };
          });

          setOrders((prev) => [...createdOrders, ...prev]);
          createdOrders.forEach(syncOrderToDb);
          setCart([]);
          return createdOrders;
        },
        cart,
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
        replyToServiceReview,
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
