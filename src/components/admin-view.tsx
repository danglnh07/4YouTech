"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import {
  User,
  ServiceItem,
  SampleProject,
  ServiceOrder,
  Role,
  ServiceCategory,
  ServiceReview,
  formatPriceRange,
  formatDaysRange
} from "@/lib/store";
import {
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit,
  EyeOff,
  Eye,
  UserPlus,
  Plus,
  X,
  Star,
  LifeBuoy,
  MessageSquare,
  Send,
  Trash2,
  Search,
  Check,
  CreditCard,
  QrCode,
  FileCheck,
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  FileText,
  Lock
} from "lucide-react";

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function RevenueLineChartComponent({
  transactions,
  orders
}: {
  transactions: any[];
  orders: any[];
}) {
  const [filterMode, setFilterMode] = useState<"week" | "month">("month");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const items: { date: Date; amount: number }[] = [];

    // 1) From verified transactions
    transactions.forEach((tx) => {
      if (tx.status === "verified" && tx.amount > 0) {
        items.push({
          date: new Date(tx.createdAt || Date.now()),
          amount: Number(tx.amount) || 0
        });
      }
    });

    // 2) From verified orders payment without duplicate txns
    orders.forEach((ord) => {
      const hasTxn = transactions.some((t) => t.orderId === ord.id && t.status === "verified");
      if (!hasTxn && ord.paymentInfo?.paymentStatus === "verified" && ord.paymentInfo.amountPaid > 0) {
        items.push({
          date: new Date(ord.createdAt || Date.now()),
          amount: Number(ord.paymentInfo.amountPaid) || 0
        });
      }
    });

    const now = new Date();

    if (filterMode === "month") {
      // Last 6 calendar months
      const months: { label: string; amount: number; year: number; month: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = `T${d.getMonth() + 1}/${d.getFullYear().toString().slice(2)}`;
        months.push({ label, amount: 0, year: d.getFullYear(), month: d.getMonth() });
      }

      items.forEach((item) => {
        const y = item.date.getFullYear();
        const m = item.date.getMonth();
        const found = months.find((mo) => mo.year === y && mo.month === m);
        if (found) {
          found.amount += item.amount;
        }
      });

      return months.map((m) => ({ label: m.label, amount: m.amount }));
    } else {
      // Last 8 weeks
      const weeks: { label: string; amount: number; startDate: Date; endDate: Date }[] = [];
      for (let i = 7; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - i * 7 - ((now.getDay() + 6) % 7));
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        const label = `W${getWeekNumber(start)} (${start.getDate()}/${start.getMonth() + 1})`;
        weeks.push({ label, amount: 0, startDate: start, endDate: end });
      }

      items.forEach((item) => {
        const found = weeks.find((w) => item.date >= w.startDate && item.date <= w.endDate);
        if (found) {
          found.amount += item.amount;
        }
      });

      return weeks.map((w) => ({ label: w.label, amount: w.amount }));
    }
  }, [transactions, orders, filterMode]);

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 100000);
  const totalInPeriod = chartData.reduce((acc, curr) => acc + curr.amount, 0);

  const width = 700;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1 || 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.amount / maxAmount) * (height - paddingY * 2);
    return { x, y, label: d.label, amount: d.amount };
  });

  // Sharp polyline path like financial chart in reference image
  const dPath = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
  }, "");

  const areaPath = points.length > 0
    ? `${dPath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`
    : "";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 text-lg">Biểu Đồ Doanh Thu Thực Thu</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
              Đường Cam Nhỏ Gọn
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Doanh thu thực thu lọc theo {filterMode === "month" ? "Tháng" : "Tuần"}:{" "}
            <span className="font-black text-orange-600">{totalInPeriod.toLocaleString("vi-VN")} ₫</span>
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setFilterMode("month")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "month"
                ? "bg-white text-orange-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Theo Tháng
          </button>
          <button
            onClick={() => setFilterMode("week")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "week"
                ? "bg-white text-orange-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Theo Tuần
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="orangeChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Left Vertical Boundary Line ("2 bên có đường thẳng đứng") */}
          <line
            x1={paddingX}
            y1={15}
            x2={paddingX}
            y2={height - paddingY}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />

          {/* Right Vertical Boundary Line ("2 bên có đường thẳng đứng") */}
          <line
            x1={width - paddingX}
            y1={15}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />

          {/* Horizontal Grid lines */}
          {[0.2, 0.5, 0.8].map((ratio) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#orangeChartGradient)" />}

          {/* Vertical dashed line down to baseline on hover */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              y1={points[hoveredIndex].y}
              x2={points[hoveredIndex].x}
              y2={height - paddingY}
              stroke="#f97316"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {/* Sharp orange polyline stroke */}
          {dPath && (
            <path
              d={dPath}
              fill="none"
              stroke="#f97316"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Points */}
          {points.map((pt, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === idx ? "5.5" : "3.5"}
                fill="#ffffff"
                stroke="#f97316"
                strokeWidth={hoveredIndex === idx ? "3" : "2.5"}
                className="transition-all duration-150"
              />
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-bold"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-10 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 transition-all duration-150"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100}%`
            }}
          >
            <div className="font-bold text-orange-400">{points[hoveredIndex].label}</div>
            <div className="text-[11px] font-semibold text-white">
              {points[hoveredIndex].amount.toLocaleString("vi-VN")} ₫
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminView() {
  const {
    users,
    services,
    projects,
    orders,
    reviews,
    transactions,
    updateUserProfile,
    addService,
    updateService,
    toggleServiceHidden,
    addProject,
    updateProject,
    deleteProject,
    issueQuotation,
    setOrderEditingState,
    assignStaff,
    approvePaymentTransaction,
    rejectPaymentTransaction,
    verifyPayment,
    handleCancellation,
    moderateReview,
    replyToServiceReview,
    updateStaffSkills
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    "overview" | "requests" | "payments" | "users" | "services" | "projects" | "reviews"
  >("overview");

  // Selected Order for Detail Inspection Modal or Split View
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState<boolean>(false);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Review Inspection & Reply Modal state
  const [viewingReviewDetail, setViewingReviewDetail] = useState<ServiceReview | null>(null);
  const [replyInputText, setReplyInputText] = useState("");

  // Search & Filter state for Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Search & Filter state for Users
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");

  // Anti-Spam submitting state
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  // Quotation Issuer Modal state
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ amount: 1500000, deadline: "", maxRevisions: 3, scopeDetails: "" });

  // Assign Staff Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ staffId: "", collaborators: "" });

  // Add/Edit Service Modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<ServiceItem, "id">>({
    name: "",
    description: "",
    category: "IT",
    estimatedDays: 3,
    estimatedPrice: 1000000,
    maxRevisions: 3,
    scopeOutput: "",
    supportType: "Online",
    demoImages: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"]
  });

  // Add/Edit Project Modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<SampleProject, "id">>({
    name: "",
    category: "IT",
    description: "",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    link: "https://demo.4youtech.com/sample",
    featured: true
  });

  // View Detail Modals
  const [viewingServiceDetail, setViewingServiceDetail] = useState<ServiceItem | null>(null);
  const [viewingUserDetail, setViewingUserDetail] = useState<User | null>(null);
  const [viewingProjectDetail, setViewingProjectDetail] = useState<SampleProject | null>(null);

  // Edit Staff Skills modal state
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [skillsInput, setSkillsInput] = useState("");

  // Refund Action Modal
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  // ----------------------------------------------------
  // ACCURATE METRICS CALCULATIONS
  // ----------------------------------------------------
  // 1) Total Verified Revenue (Real Money Collected)
  const totalVerifiedRevenue = transactions
    .filter((t) => t.status === "verified")
    .reduce((sum, t) => sum + t.amount, 0);

  // Fallback: If transactions list is empty or partially updated, include orders with amountPaid
  const orderAmountPaidSum = orders.reduce((sum, o) => {
    // If order has transactions linked, avoid double counting
    const hasTxn = transactions.some((t) => t.orderId === o.id && t.status === "verified");
    if (hasTxn) return sum;
    return sum + (o.paymentInfo?.paymentStatus === "verified" ? o.paymentInfo.amountPaid : 0);
  }, 0);

  const finalTotalRevenue = totalVerifiedRevenue + orderAmountPaidSum;

  // 2) Quoted / Expected Total Contract Value
  const totalQuotedContractValue = orders.reduce(
    (sum, o) => sum + (o.quotation?.amount || 0),
    0
  );

  // 3) User & Order Status Counts
  const staffList = users.filter((u) => u.role === "staff");
  const customerList = users.filter((u) => u.role === "customer");
  const activeCustomersCount = new Set(orders.map((o) => o.customerEmail || o.customerId)).size;
  const pendingQuoteOrders = orders.filter((o) =>
    ["submitted", "under_review", "info_requested"].includes(o.status)
  );
  const quotedOrders = orders.filter((o) => o.status === "quoted");
  const inProgressOrders = orders.filter((o) =>
    ["deposit_pending", "in_progress", "revision_requested"].includes(o.status)
  );
  const deliverableOrders = orders.filter((o) => o.status === "deliverable_sent");
  const completedOrders = orders.filter((o) =>
    ["accepted", "completed"].includes(o.status)
  );
  const cancelledOrders = orders.filter((o) =>
    ["cancelled", "cancel_requested"].includes(o.status)
  );

  const pendingTxns = transactions.filter((t) => t.status === "pending");

  // Filtered Orders List
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.serviceName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearchQuery.toLowerCase());

    const matchesStatus =
      orderStatusFilter === "all" ||
      (orderStatusFilter === "pending_quote" && ["submitted", "under_review", "info_requested"].includes(o.status)) ||
      (orderStatusFilter === "in_progress" && ["deposit_pending", "in_progress", "revision_requested"].includes(o.status)) ||
      (orderStatusFilter === "deliverable_sent" && o.status === "deliverable_sent") ||
      (orderStatusFilter === "completed" && ["accepted", "completed"].includes(o.status)) ||
      (orderStatusFilter === "cancelled" && ["cancelled", "cancel_requested"].includes(o.status));

    return matchesSearch && matchesStatus;
  });

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q) ||
        (u.skills && u.skills.some((s) => s.toLowerCase().includes(q)));

      const matchesRole =
        userRoleFilter === "all" || u.role === userRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, userSearchQuery, userRoleFilter]);

  const getStatusBadge = (status: ServiceOrder["status"]) => {
    switch (status) {
      case "submitted":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 whitespace-nowrap inline-block">Mới Gửi</span>;
      case "under_review":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 whitespace-nowrap inline-block">Đang Khảo Sát</span>;
      case "quoted":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 whitespace-nowrap inline-block">Đã Báo Giá</span>;
      case "deposit_pending":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 whitespace-nowrap inline-block">Chờ Duyệt Tiền</span>;
      case "in_progress":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 whitespace-nowrap inline-block">Đang Thực Hiện</span>;
      case "deliverable_sent":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 whitespace-nowrap inline-block">Đã Bàn Giao (v1)</span>;
      case "revision_requested":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 whitespace-nowrap inline-block">Yêu Cầu Chỉnh Sửa</span>;
      case "accepted":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap inline-block">Đã Nghiệm Thu (Chờ Thu 50%)</span>;
      case "completed":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap inline-block">Hoàn Thành (100%)</span>;
      case "cancel_requested":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 whitespace-nowrap inline-block">Chờ Duyệt Hủy</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 whitespace-nowrap inline-block">Đã Hủy</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 whitespace-nowrap inline-block">{status}</span>;
    }
  };

  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowOrderDetailModal(true);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Control Header Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Executive Management Platform
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Quản Trị Hệ Thống 4YouTech</h1>
        </div>

        {/* Navigation Admin Tabs */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 max-w-full">
          {[
            { id: "overview", label: "Báo Cáo Tổng Quan" },
            { id: "requests", label: `Đơn Hàng (${orders.length})` },
            { id: "payments", label: `Duyệt Thanh Toán (${pendingTxns.length})` },
            { id: "users", label: `Tài Khoản & Staff (${users.length})` },
            { id: "services", label: `Gói Dịch Vụ (${services.length})` },
            { id: "projects", label: `Dự Án Mẫu (${projects.length})` },
            { id: "reviews", label: `Đánh Giá (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition whitespace-nowrap shrink-0 ${
                activeAdminTab === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeAdminTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top KPI Cards - Real Accurate Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Doanh Thu Thực Thu</div>
                <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-600 truncate">{finalTotalRevenue.toLocaleString("vi-VN")} ₫</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Đã qua VNPay & VietQR</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Giá Trị Báo Giá</div>
                <div className="p-1.5 bg-sky-50 rounded-xl text-sky-600 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-sky-600 truncate">{totalQuotedContractValue.toLocaleString("vi-VN")} ₫</div>
              <div className="text-[10px] text-slate-400 truncate">Tổng hợp đồng chính thức</div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Tổng Customer</div>
                <div className="p-1.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 truncate">{customerList.length} Khách Hàng</div>
              <div className="text-[10px] text-slate-400 truncate">
                <span className="text-blue-600 font-bold">{activeCustomersCount} khách</span> phát sinh đơn
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Tổng Đơn Hàng</div>
                <div className="p-1.5 bg-purple-50 rounded-xl text-purple-600 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 truncate">{orders.length} Đơn Hàng</div>
              <div className="text-[10px] text-slate-400 truncate">
                <span className="text-purple-600 font-bold">{inProgressOrders.length} chạy</span> •{" "}
                <span className="text-emerald-600 font-bold">{completedOrders.length} xong</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Cần Xử Lý Ngay</div>
                <div className="p-1.5 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-500 truncate">
                {pendingQuoteOrders.length + pendingTxns.length} Mục
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {pendingQuoteOrders.length} chưa báo giá • {pendingTxns.length} chờ duyệt
              </div>
            </div>
          </div>

          {/* Revenue Line Chart Component */}
          <RevenueLineChartComponent transactions={transactions} orders={orders} />

          {/* Quick Orders Overview Table with 1-click Modal View */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Danh Sách Đơn Hàng Gần Đây</h3>
                <p className="text-xs text-slate-500">Bấm vào đơn hàng bất kỳ để xem toàn bộ chi tiết & quản trị.</p>
              </div>

              <button
                onClick={() => setActiveAdminTab("requests")}
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả {orders.length} đơn</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50 font-bold">
                    <th className="py-3 px-4 whitespace-nowrap">Mã Đơn</th>
                    <th className="py-3 px-4 whitespace-nowrap">Khách Hàng</th>
                    <th className="py-3 px-4 whitespace-nowrap">Dịch Vụ</th>
                    <th className="py-3 px-4 whitespace-nowrap">Giá Trị Báo Giá</th>
                    <th className="py-3 px-4 whitespace-nowrap">Đã Thu Thực Tế</th>
                    <th className="py-3 px-4 whitespace-nowrap">Trạng Thái</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.slice(0, 5).map((ord) => (
                    <tr
                      key={ord.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => openOrderDetail(ord.id)}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap font-mono">{ord.id}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">{ord.customerName}</td>
                      <td className="py-3 px-4 text-slate-800 whitespace-nowrap">{ord.serviceName}</td>
                      <td className="py-3 px-4 font-bold text-sky-600 whitespace-nowrap">
                        {ord.quotation ? `${ord.quotation.amount.toLocaleString("vi-VN")} ₫` : "Chờ báo giá"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {ord.quotation ? (
                          <div className="space-y-0.5 whitespace-nowrap">
                            <div className="font-bold text-emerald-600">
                              {ord.paymentInfo ? `${ord.paymentInfo.amountPaid.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                            </div>
                            <div className="text-[10px]">
                              {(ord.paymentInfo?.amountPaid || 0) >= ord.quotation.amount ? (
                                <span className="bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded whitespace-nowrap">Đã thu 100%</span>
                              ) : (ord.paymentInfo?.amountPaid || 0) > 0 ? (
                                <span className="bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded whitespace-nowrap">Đã cọc 50%</span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.2 rounded whitespace-nowrap">Chưa cọc</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal whitespace-nowrap">Chờ báo giá</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(ord.status)}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderDetail(ord.id);
                          }}
                          className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-lg whitespace-nowrap"
                        >
                          Xem Chi Tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Service Popularity Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-lg">Báo Cáo Thống Kê Gói Dịch Vụ Được Đặt Nhiều</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Tên Dịch Vụ</th>
                    <th className="py-3 px-4">Phân Loại</th>
                    <th className="py-3 px-4">Số Đơn Đã Đặt</th>
                    <th className="py-3 px-4">Giá Tham Khảo Catalog</th>
                    <th className="py-3 px-4">Trạng Thái Catalog</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {services.map((srv) => {
                    const count = orders.filter((o) => o.serviceId === srv.id).length;
                    return (
                      <tr key={srv.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800">{srv.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${srv.category === "IT" ? "badge-it" : srv.category === "Design" ? "badge-design" : "badge-mixed"}`}>
                            {srv.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-sky-600">{count} đơn</td>
                        <td className="py-3 px-4">{formatPriceRange(srv.estimatedPrice, srv.maxPrice)}</td>
                        <td className="py-3 px-4">
                          {srv.hidden ? (
                            <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Đã ẩn</span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Hiển thị</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: REQUESTS & ORDERS MANAGEMENT DESK */}
      {activeAdminTab === "requests" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Search & Filter Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách, email, dịch vụ..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="all">Tất cả trạng thái ({orders.length})</option>
                <option value="pending_quote">Chờ báo giá ({pendingQuoteOrders.length})</option>
                <option value="in_progress">Đang thực hiện ({inProgressOrders.length})</option>
                <option value="deliverable_sent">Đã bàn giao v1 ({deliverableOrders.length})</option>
                <option value="completed">Đã hoàn thành ({completedOrders.length})</option>
                <option value="cancelled">Yêu cầu hủy / Đã hủy ({cancelledOrders.length})</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: All Orders List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Đơn Hàng Theo Bộ Lọc ({filteredOrders.length})
                </span>
              </div>

              <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                    Không tìm thấy đơn hàng nào phù hợp với điều kiện lọc.
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedOrder?.id === ord.id;
                    return (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 relative. ${
                          isSelected
                            ? "bg-amber-50/80 border-amber-500 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">{ord.id}</span>
                          {getStatusBadge(ord.status)}
                        </div>

                        <div className="text-xs font-bold text-slate-800 line-clamp-1">{ord.serviceName}</div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2 mt-1">
                          <span>Khách: <strong className="text-slate-700">{ord.customerName}</strong></span>
                          <span>Staff: <strong className="text-sky-600">{ord.assignedStaffName || "Chưa phân công"}</strong></span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Admin Inspection & Actions Desk */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">{selectedOrder.id} • {selectedOrder.createdAt}</span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <h2 className="text-xl font-black text-slate-900 mt-1">{selectedOrder.serviceName}</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openOrderDetail(selectedOrder.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> Modal Chi Tiết Toàn Bộ
                      </button>
                    </div>
                  </div>

                  {/* Customer Request Details */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl text-xs">
                    <div className="font-bold text-slate-700">Thông tin Khách hàng & Yêu cầu:</div>
                    <div className="text-slate-800">
                      <span className="font-semibold">{selectedOrder.customerName}</span> ({selectedOrder.customerEmail} - {selectedOrder.customerPhone})
                    </div>
                    <div className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 mt-1">
                      {selectedOrder.requirements}
                    </div>
                  </div>

                  {/* Quick Action Buttons for Admin */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2">
                    {(() => {
                      const isPaymentLocked =
                        selectedOrder.paymentInfo?.paymentStatus === "pending_approval" ||
                        selectedOrder.paymentInfo?.paymentStatus === "verified" ||
                        ["deposit_pending", "in_progress", "deliverable_sent", "accepted", "completed"].includes(selectedOrder.status);
                      const isAlreadyQuoted = selectedOrder.status === "quoted" || !!selectedOrder.quotation;

                      return (
                        <button
                          disabled={isPaymentLocked}
                          onClick={() => {
                            if (isPaymentLocked) return;
                            setQuoteForm({
                              amount: selectedOrder.workEstimate?.proposedPrice || selectedOrder.quotation?.amount || 1500000,
                              deadline: selectedOrder.desiredDeadline,
                              maxRevisions: 3,
                              scopeDetails: selectedOrder.workEstimate?.note || "Phạm vi thiết kế & code hoàn thiện theo yêu cầu"
                            });
                            setOrderEditingState(selectedOrder.id, true);
                            setShowQuoteModal(true);
                          }}
                          className={`py-2.5 px-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition ${
                            isPaymentLocked
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                              : isAlreadyQuoted
                              ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                              : "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs"
                          }`}
                        >
                          {isPaymentLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-500" /> Báo Giá Đã Khóa (Đã/Đang TT)
                            </>
                          ) : isAlreadyQuoted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> Đã Báo Giá ({selectedOrder.quotation?.amount.toLocaleString("vi-VN")} ₫) - Sửa
                            </>
                          ) : (
                            "Lập Báo Giá Mới"
                          )}
                        </button>
                      );
                    })()}

                    {(() => {
                      const isAlreadyAssigned = !!selectedOrder.assignedStaffId;
                      const isFinished = ["completed", "cancelled"].includes(selectedOrder.status);

                      return (
                        <button
                          disabled={isFinished}
                          onClick={() => {
                            if (isFinished) return;
                            setAssignForm({
                              staffId: selectedOrder.assignedStaffId || staffList[0]?.id || "",
                              collaborators: selectedOrder.collaborators?.join(", ") || ""
                            });
                            setShowAssignModal(true);
                          }}
                          className={`py-2.5 px-3 rounded-xl font-bold text-xs text-center transition flex items-center justify-center gap-1.5 ${
                            isFinished
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                              : isAlreadyAssigned
                              ? "bg-sky-100 text-sky-900 border border-sky-300 hover:bg-sky-200"
                              : "bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                          }`}
                        >
                          {isFinished ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-500" /> Đơn Đã Hoàn Thành / Hủy
                            </>
                          ) : isAlreadyAssigned ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" /> Đã Phân Công ({selectedOrder.assignedStaffName}) - Đổi
                            </>
                          ) : (
                            "Phân Công Staff"
                          )}
                        </button>
                      );
                    })()}
                  </div>

                  {/* Staff Work Estimate if proposed */}
                  {selectedOrder.workEstimate && (
                    <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl text-xs space-y-1">
                      <div className="font-bold text-purple-900">
                        Đề xuất từ Staff ({selectedOrder.workEstimate.proposedByStaffName}):
                      </div>
                      <div className="text-purple-950">
                        Thời gian: {selectedOrder.workEstimate.proposedDays} ngày | Giá đề xuất: {selectedOrder.workEstimate.proposedPrice.toLocaleString("vi-VN")} ₫
                      </div>
                      <div className="text-purple-800 italic">"{selectedOrder.workEstimate.note}"</div>
                    </div>
                  )}

                  {/* Payment Status & Verify Action */}
                  {selectedOrder.paymentInfo && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>Thông tin Thanh toán Khách gửi</span>
                        <span className="uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded font-bold">
                          {selectedOrder.paymentInfo.paymentStatus}
                        </span>
                      </div>
                      <div>Đã chuyển: <strong className="text-emerald-700 font-extrabold">{selectedOrder.paymentInfo.amountPaid.toLocaleString("vi-VN")} ₫</strong></div>
                      {selectedOrder.paymentInfo.paymentStatus !== "verified" && (
                        <button
                          onClick={() => {
                            verifyPayment(selectedOrder.id);
                            alert("Đã xác minh thanh toán thành công!");
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Xác Minh Đã Thu Tiền Thực Tế
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cancellation Requests & Refund Handling */}
                  {selectedOrder.cancellation && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2">
                      <div className="font-bold text-rose-900">Yêu cầu hủy từ khách: "{selectedOrder.cancellation.reason}"</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setRefundAmount(selectedOrder.paymentInfo?.amountPaid || 0);
                            setShowRefundModal(true);
                          }}
                          className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl"
                        >
                          Chấp Nhận Hủy & Hoàn Tiền
                        </button>
                        <button
                          onClick={() => {
                            handleCancellation(selectedOrder.id, "rejected");
                            alert("Đã từ chối đề nghị hủy!");
                          }}
                          className="px-3.5 py-1.5 bg-slate-200 text-slate-800 font-bold rounded-xl"
                        >
                          Từ Chối Hủy
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : null}
            </div>

          </div>
        </div>
      )}

      {/* PAYMENTS & TRANSACTIONS APPROVAL TAB */}
      {activeAdminTab === "payments" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Quản Lý & Duyệt Giao Dịch Thanh Toán (50% / 100%)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Admin kiểm tra biên lai VietQR hoặc lịch sử VNPay Sandbox để phê duyệt cọc 50% hoặc thanh toán 100%</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                ⚠️ Chờ duyệt: {pendingTxns.length} giao dịch
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                ✓ Doanh thu đã duyệt: {finalTotalRevenue.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400">
                Chưa có lịch sử giao dịch thanh toán nào được khởi tạo.
              </div>
            ) : (
              <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl">
                <table className="w-full min-w-[950px] text-left text-xs border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50 font-bold">
                      <th className="py-3.5 px-4 whitespace-nowrap">Mã Giao Dịch</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Mã Đơn Hàng</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Khách Hàng</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Số Tiền</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Loại Thanh Toán</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Phương Thức</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Biên Lai / Ghi Chú</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right whitespace-nowrap">Thao Tác Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {transactions.map((txn) => {
                      const isDeposit = txn.paymentType === "deposit";
                      const isRemaining = txn.paymentType === "remaining";

                      return (
                        <tr key={txn.id} className={`hover:bg-slate-50 transition ${txn.status === "pending" ? "bg-amber-50/40" : ""}`}>
                          <td className="py-3 px-4 font-bold text-slate-900 font-mono whitespace-nowrap">{txn.id}</td>
                          <td className="py-3 px-4 font-bold text-sky-600 font-mono whitespace-nowrap">{txn.orderId}</td>
                          <td className="py-3 px-4 text-slate-800 font-semibold whitespace-nowrap">{txn.customerName}</td>
                          <td className="py-3 px-4 font-black text-emerald-600 text-xs sm:text-sm whitespace-nowrap">
                            {txn.amount.toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap inline-flex items-center ${
                              isDeposit ? "bg-amber-100 text-amber-900 border border-amber-300" : isRemaining ? "bg-blue-100 text-blue-900 border border-blue-300" : "bg-purple-100 text-purple-900 border border-purple-300"
                            }`}>
                              {isDeposit ? "Đặt Cọc 50%" : isRemaining ? "50% Còn Lại" : "Full 100%"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                            {txn.paymentMethod === "VNPay" ? (
                              <span className="text-blue-600 font-bold inline-flex items-center gap-1 whitespace-nowrap">
                                <CreditCard className="w-3.5 h-3.5" /> VNPay Sandbox
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-bold inline-flex items-center gap-1 whitespace-nowrap">
                                <QrCode className="w-3.5 h-3.5" /> VietQR
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {txn.receiptImage ? (
                              <a
                                href={txn.receiptImage}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                <Eye className="w-3.5 h-3.5" /> Xem biên lai
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px] whitespace-nowrap">{txn.note || "Tự động VNPay"}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {txn.status === "verified" ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1 whitespace-nowrap">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã Duyệt (Thành công)
                              </span>
                            ) : txn.status === "rejected" ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 inline-flex items-center gap-1 whitespace-nowrap">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Đã Từ Chối
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 inline-flex items-center gap-1 animate-pulse whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5 text-amber-600" /> Chờ Admin Duyệt
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            {txn.status === "pending" ? (
                              <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    approvePaymentTransaction(txn.id);
                                    alert(`🎉 Đã duyệt giao dịch ${txn.id} (${txn.amount.toLocaleString("vi-VN")} ₫)! Trạng thái đơn hàng ${txn.orderId} đã được cập nhật thanh toán.`);
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1 whitespace-nowrap"
                                >
                                  <Check className="w-3.5 h-3.5" /> Duyệt GD
                                </button>
                                <button
                                  onClick={() => {
                                    rejectPaymentTransaction(txn.id);
                                    alert(`Đã từ chối giao dịch ${txn.id}!`);
                                  }}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition inline-flex items-center gap-1 whitespace-nowrap"
                                >
                                  <X className="w-3.5 h-3.5" /> Từ Chối
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic whitespace-nowrap">Xử lý hoàn tất</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USER & STAFF MANAGEMENT TAB */}
      {activeAdminTab === "users" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Danh Sách Tài Khoản & Chuyên Môn Nhân Viên</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tìm kiếm tài khoản theo tên, email, sĐT, vai trò (Customer/Staff/Admin) hoặc kỹ năng chuyên môn.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold self-start">
              Tổng số {filteredUsers.length} / {users.length} tài khoản
            </span>
          </div>

          {/* Search & Role Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm tên, email, SĐT, kỹ năng..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Tất cả vai trò ({users.length})</option>
                <option value="customer">Khách hàng - Customer ({users.filter((u) => u.role === "customer").length})</option>
                <option value="staff">Nhân viên - Staff ({users.filter((u) => u.role === "staff").length})</option>
                <option value="admin">Quản trị viên - Admin ({users.filter((u) => u.role === "admin").length})</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50 font-bold">
                  <th className="py-3 px-4 whitespace-nowrap">Người Dùng</th>
                  <th className="py-3 px-4 whitespace-nowrap">Email / SĐT</th>
                  <th className="py-3 px-4 whitespace-nowrap">Vai Trò (Role)</th>
                  <th className="py-3 px-4 whitespace-nowrap">Chuyên Môn IT/Design (Staff)</th>
                  <th className="py-3 px-4 whitespace-nowrap">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                      Không tìm thấy tài khoản nào khớp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 whitespace-nowrap flex items-center gap-2.5">
                        <img src={usr.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <span className="font-bold text-slate-900 whitespace-nowrap">{usr.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{usr.email}<br />{usr.phone}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={usr.role}
                          onChange={(e) => updateUserProfile(usr.id, { role: e.target.value as Role })}
                          className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-sky-500 whitespace-nowrap shadow-xs"
                        >
                          <option value="customer" className="bg-white text-slate-900 font-bold py-1">Customer</option>
                          <option value="staff" className="bg-white text-slate-900 font-bold py-1">Staff</option>
                          <option value="admin" className="bg-white text-slate-900 font-bold py-1">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {usr.role === "staff" ? (
                          <div className="space-y-1 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1 whitespace-nowrap">
                              {usr.skills?.map((sk, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold whitespace-nowrap">
                                  {sk}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => {
                                setEditingStaffId(usr.id);
                                setSkillsInput(usr.skills?.join(", ") || "");
                              }}
                              className="text-[10px] font-bold text-sky-600 hover:underline whitespace-nowrap"
                            >
                              + Sửa chuyên môn
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setViewingUserDetail(usr)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 transition whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" /> Chi tiết
                          </button>
                          <button
                            onClick={() => {
                              const nextStatus = usr.status === "active" ? "locked" : "active";
                              updateUserProfile(usr.id, { status: nextStatus });
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                              usr.status === "active" ? "bg-rose-50 text-rose-700 hover:bg-rose-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {usr.status === "active" ? "Khóa TK" : "Kích hoạt"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SERVICE CATALOG MANAGEMENT TAB */}
      {activeAdminTab === "services" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Quản Lý Catalog Dịch Vụ</h2>
            <button
              onClick={() => {
                setEditingServiceId(null);
                setServiceForm({
                  name: "",
                  description: "",
                  category: "IT",
                  estimatedDays: 3,
                  estimatedPrice: 1000000,
                  maxRevisions: 3,
                  scopeOutput: "",
                  supportType: "Online",
                  demoImages: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"]
                });
                setShowServiceModal(true);
              }}
              className="px-4 py-2.5 rounded-xl gradient-btn font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Thêm Dịch Vụ Mới
            </button>
          </div>

          <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50 font-bold">
                  <th className="py-3.5 px-4 whitespace-nowrap font-bold">Tên Dịch Vụ</th>
                  <th className="py-3.5 px-4 whitespace-nowrap font-bold">Phân Loại</th>
                  <th className="py-3.5 px-4 whitespace-nowrap font-bold">Giá Tham Khảo</th>
                  <th className="py-3.5 px-4 whitespace-nowrap font-bold">Thời Gian & Hình Thức</th>
                  <th className="py-3.5 px-4 whitespace-nowrap font-bold">Trạng Thái</th>
                  <th className="py-3.5 px-4 whitespace-nowrap font-bold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {services.map((srv) => (
                  <tr key={srv.id} className={`hover:bg-slate-50 transition ${srv.hidden ? "bg-slate-50/70 opacity-80" : ""}`}>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2 whitespace-nowrap">
                        {srv.name}
                        {srv.hidden && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-extrabold whitespace-nowrap">
                            ĐÃ ẨN
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 line-clamp-1 max-w-xs text-[11px] mt-0.5 whitespace-nowrap truncate">{srv.description}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
                        {srv.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 text-sm whitespace-nowrap">
                      {formatPriceRange(srv.estimatedPrice, srv.maxPrice)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 whitespace-nowrap">{formatDaysRange(srv.estimatedDays, srv.maxDays)}</div>
                      <div className="text-[10px] text-slate-400 whitespace-nowrap">{srv.supportType || "Online"}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${srv.hidden ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"}`}>
                        {srv.hidden ? "Ẩn với Khách & Staff" : "Đang Hiện Public"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setViewingServiceDetail(srv)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" /> Chi tiết
                        </button>
                        <button
                          onClick={() => {
                            setEditingServiceId(srv.id);
                            setServiceForm({
                              name: srv.name,
                              description: srv.description,
                              category: srv.category,
                              estimatedDays: srv.estimatedDays,
                              estimatedPrice: srv.estimatedPrice,
                              maxRevisions: srv.maxRevisions || 3,
                              scopeOutput: srv.scopeOutput || "",
                              supportType: srv.supportType || "Online",
                              demoImages: srv.demoImages && srv.demoImages.length > 0 ? srv.demoImages : ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"]
                            });
                            setShowServiceModal(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs flex items-center gap-1 transition whitespace-nowrap"
                        >
                          <Edit className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          onClick={() => toggleServiceHidden(srv.id)}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 whitespace-nowrap ${
                            srv.hidden ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          }`}
                        >
                          {srv.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {srv.hidden ? "Hiện" : "Ẩn"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SAMPLE PROJECTS TAB */}
      {activeAdminTab === "projects" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Quản Lý Sản Phẩm Mẫu Công Khai</h2>
            <button
              onClick={() => {
                setProjectForm({
                  name: "",
                  category: "IT",
                  description: "",
                  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
                  link: "https://demo.4youtech.com/sample",
                  featured: true
                });
                setShowProjectModal(true);
              }}
              className="px-4 py-2.5 rounded-xl gradient-btn font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Thêm Dự Án Mẫu
            </button>
          </div>

          <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50 font-bold">
                  <th className="py-3.5 px-4 whitespace-nowrap">Hình Ảnh</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Tên Dự Án Mẫu</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Phân Loại</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Mô Tả Sản Phẩm</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <img src={proj.image} alt={proj.name} className="w-16 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-sm whitespace-nowrap">{proj.name}</div>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-sky-600 text-[11px] hover:underline inline-flex items-center gap-1 font-semibold mt-0.5 whitespace-nowrap">
                          {proj.link} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs whitespace-nowrap">{proj.description}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setViewingProjectDetail(proj)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" /> Chi tiết
                        </button>
                        <button
                          onClick={() => {
                            setEditingProjectId(proj.id);
                            setProjectForm({
                              name: proj.name,
                              category: proj.category,
                              description: proj.description,
                              image: proj.image,
                              link: proj.link || "",
                              featured: proj.featured || false
                            });
                            setShowProjectModal(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs flex items-center gap-1 transition whitespace-nowrap"
                        >
                          <Edit className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa dự án mẫu "${proj.name}"?`)) {
                              deleteProject(proj.id);
                              alert("Đã xóa dự án mẫu!");
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1 transition whitespace-nowrap"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEWS MODERATION & REPLY TAB */}
      {activeAdminTab === "reviews" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Quản Lý & Phản Hồi Đánh Giá Từ Khách Hàng</h2>
              <p className="text-xs text-slate-500 mt-0.5">Admin & Staff xem chi tiết đánh giá, kiểm duyệt và phản hồi trực tiếp cho khách hàng</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold self-start">
              Tổng số {reviews.length} đánh giá
            </span>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs italic">
                Chưa có đánh giá dịch vụ nào từ khách hàng.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-3 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{rev.customerName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                        {rev.rating} ★
                      </span>
                      <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-md">
                        {rev.serviceName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-mono">{rev.createdAt}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rev.moderated ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {rev.moderated ? "Đang công khai" : "Đã ẩn / Spam"}
                      </span>
                      {rev.replyText ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                          ✓ Đã phản hồi
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          Chưa phản hồi
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-800 font-medium bg-white p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
                    "{rev.comment}"
                  </div>

                  {/* Reply snippet if present */}
                  {rev.replyText && (
                    <div className="bg-sky-50/80 p-3 rounded-xl border border-sky-100 text-xs space-y-1">
                      <div className="font-bold text-sky-900 text-[11px] flex items-center justify-between">
                        <span>💬 Phản hồi từ {rev.repliedBy}:</span>
                        <span className="text-[10px] text-slate-400 font-normal">{rev.repliedAt}</span>
                      </div>
                      <div className="text-sky-950 font-medium italic">"{rev.replyText}"</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => moderateReview(rev.id, !rev.moderated)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        rev.moderated ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {rev.moderated ? "Ẩn khỏi web" : "Công khai lại"}
                    </button>
                    <button
                      onClick={() => {
                        setViewingReviewDetail(rev);
                        setReplyInputText(rev.replyText || "");
                      }}
                      className="px-4 py-1.5 rounded-xl gradient-btn font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem Chi Tiết & Phản Hồi
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Issue Quotation Modal */}
      {showQuoteModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button
              onClick={() => {
                setOrderEditingState(selectedOrder.id, false);
                setShowQuoteModal(false);
              }}
              className="absolute top-4 right-4 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Lập Báo Giá Cho Khách Hàng</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số tiền Báo Giá (VNĐ) *</label>
                <input
                  type="number"
                  value={quoteForm.amount}
                  onChange={(e) => setQuoteForm({ ...quoteForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold text-sky-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hạn giao chính thức *</label>
                <input
                  type="date"
                  value={quoteForm.deadline}
                  onChange={(e) => setQuoteForm({ ...quoteForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số lần chỉnh sửa miễn phí</label>
                <input
                  type="number"
                  value={quoteForm.maxRevisions}
                  onChange={(e) => setQuoteForm({ ...quoteForm, maxRevisions: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chi tiết Phạm vi & Cam kết đầu ra</label>
                <textarea
                  rows={3}
                  value={quoteForm.scopeDetails}
                  onChange={(e) => setQuoteForm({ ...quoteForm, scopeDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              disabled={adminSubmitting}
              onClick={() => {
                if (adminSubmitting) return;
                setAdminSubmitting(true);
                issueQuotation(selectedOrder.id, {
                  amount: quoteForm.amount,
                  finalDeadline: quoteForm.deadline || selectedOrder.desiredDeadline,
                  maxRevisions: quoteForm.maxRevisions,
                  scopeDetails: quoteForm.scopeDetails
                });
                setOrderEditingState(selectedOrder.id, false);
                setShowQuoteModal(false);
                setTimeout(() => setAdminSubmitting(false), 500);
                alert("Đã phát hành báo giá chính thức cho khách!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs disabled:opacity-50"
            >
              {adminSubmitting ? "Đang xử lý phát hành..." : "Phát Hành Báo Giá Ngay"}
            </button>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowAssignModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Phân Công Nhân Viên Phụ Trách</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn Staff phụ trách chính *</label>
                <select
                  value={assignForm.staffId}
                  onChange={(e) => setAssignForm({ ...assignForm, staffId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.skills?.join(", ")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên người phối hợp (Collaborators)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phạm Hà Design, Nguyễn IT"
                  value={assignForm.collaborators}
                  onChange={(e) => setAssignForm({ ...assignForm, collaborators: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              disabled={adminSubmitting}
              onClick={() => {
                if (adminSubmitting) return;
                const targetStaff = staffList.find((s) => s.id === assignForm.staffId) || staffList[0];
                if (targetStaff) {
                  setAdminSubmitting(true);
                  assignStaff(
                    selectedOrder.id,
                    targetStaff.id,
                    targetStaff.name,
                    assignForm.collaborators ? assignForm.collaborators.split(",").map((s) => s.trim()) : []
                  );
                  setShowAssignModal(false);
                  setTimeout(() => setAdminSubmitting(false), 500);
                  alert(`Đã phân công ${targetStaff.name} làm nhiệm vụ!`);
                }
              }}
              className="w-full py-3 rounded-xl bg-sky-600 text-white font-bold text-xs disabled:opacity-50"
            >
              {adminSubmitting ? "Đang phân công..." : "Xác Nhận Phân Công"}
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 relative animate-fade-in">
            <button
              onClick={() => {
                setShowServiceModal(false);
                setEditingServiceId(null);
              }}
              className="absolute top-4 right-4 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">
              {editingServiceId ? "Chỉnh Sửa Gói Dịch Vụ" : "Tạo Gói Dịch Vụ Mới"}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên dịch vụ *</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Ví dụ: Thiết kế & Lập trình Web Portfolio"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none text-slate-900 bg-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân loại *</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as ServiceCategory })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 bg-white"
                >
                  <option value="IT" className="text-slate-900 bg-white">IT (Code / Database / System)</option>
                  <option value="Design" className="text-slate-900 bg-white">Design (UI/UX / Branding)</option>
                  <option value="IT/Design" className="text-slate-900 bg-white">IT/Design Trọn gói</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá tham khảo (₫)</label>
                  <input
                    type="number"
                    value={serviceForm.estimatedPrice || 0}
                    onChange={(e) => setServiceForm({ ...serviceForm, estimatedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold text-sky-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời gian (Ngày)</label>
                  <input
                    type="number"
                    value={serviceForm.estimatedDays || 0}
                    onChange={(e) => setServiceForm({ ...serviceForm, estimatedDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hình thức hỗ trợ</label>
                  <select
                    value={serviceForm.supportType}
                    onChange={(e) => setServiceForm({ ...serviceForm, supportType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none text-slate-900 bg-white"
                  >
                    <option value="Online" className="text-slate-900 bg-white">Online</option>
                    <option value="Direct" className="text-slate-900 bg-white">Trực tiếp</option>
                    <option value="Hybrid" className="text-slate-900 bg-white">Hybrid (Kết hợp)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số lần sửa free</label>
                  <input
                    type="number"
                    value={serviceForm.maxRevisions}
                    onChange={(e) => setServiceForm({ ...serviceForm, maxRevisions: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn dịch vụ</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none text-slate-900 bg-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đầu ra & Sản phẩm bàn giao</label>
                <input
                  type="text"
                  value={serviceForm.scopeOutput}
                  onChange={(e) => setServiceForm({ ...serviceForm, scopeOutput: e.target.value })}
                  placeholder="Ví dụ: Link Source Code Github, Link Figma, Đĩa demo"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none text-slate-900 bg-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hình ảnh đại diện & minh họa Dịch Vụ (URL/Link Ảnh) *</label>
                
                {/* Live Image Preview Card */}
                {serviceForm.demoImages && serviceForm.demoImages[0] ? (
                  <div className="relative mb-2 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-inner">
                    <img
                      src={serviceForm.demoImages[0]}
                      alt="Xem trước ảnh dịch vụ"
                      className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                      🖼️ Live Preview (Xem trực tiếp)
                    </div>
                  </div>
                ) : (
                  <div className="mb-2 h-28 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <span>Chưa chọn đường dẫn hình ảnh</span>
                  </div>
                )}

                <input
                  type="text"
                  value={serviceForm.demoImages?.[0] || ""}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      demoImages: [e.target.value.trim()]
                    })
                  }
                  placeholder="Nhập link đường dẫn ảnh (ví dụ: https://... hoặc /images/banner-y-te.png)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none text-slate-900 bg-white placeholder-slate-400 font-medium"
                />
                
                {/* Quick Presets for Demo Images */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 font-bold">Mẫu ảnh có sẵn:</span>
                  <button
                    type="button"
                    onClick={() => setServiceForm({ ...serviceForm, demoImages: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"] })}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    Web Portfolio
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceForm({ ...serviceForm, demoImages: ["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"] })}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    UI/UX App
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceForm({ ...serviceForm, demoImages: ["/images/logo-phin-coffee.png"] })}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    Logo Phin Coffee
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceForm({ ...serviceForm, demoImages: ["/images/banner-y-te.png"] })}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    Banner Y Tế
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceForm({ ...serviceForm, demoImages: ["/images/poster-avocado.png"] })}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                  >
                    Poster Avocado
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!serviceForm.name.trim()) {
                  alert("Vui lòng nhập tên dịch vụ!");
                  return;
                }
                if (editingServiceId) {
                  updateService(editingServiceId, serviceForm);
                  alert("Đã cập nhật dịch vụ thành công!");
                } else {
                  addService(serviceForm);
                  alert("Đã lưu gói dịch vụ mới vào Catalog!");
                }
                setShowServiceModal(false);
                setEditingServiceId(null);
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md"
            >
              {editingServiceId ? "Cập Nhật Dịch Vụ" : "Lưu Gói Dịch Vụ Mới"}
            </button>
          </div>
        </div>
      )}

      {/* Add Sample Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowProjectModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Tạo Dự Án Mẫu Showcase</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên dự án *</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Ảnh xem trước *</label>
                <input
                  type="url"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link xem trực tiếp demo</label>
                <input
                  type="url"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!projectForm.name.trim()) {
                  alert("Vui lòng nhập tên dự án!");
                  return;
                }
                if (editingProjectId) {
                  updateProject(editingProjectId, projectForm);
                  alert("Đã cập nhật dự án mẫu thành công!");
                } else {
                  addProject(projectForm);
                  alert("Đã thêm dự án mẫu mới!");
                }
                setShowProjectModal(false);
                setEditingProjectId(null);
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md"
            >
              {editingProjectId ? "Cập Nhật Dự Án Mẫu" : "Lưu Dự Án Mẫu"}
            </button>
          </div>
        </div>
      )}

      {/* SERVICE DETAIL INSPECTION MODAL */}
      {viewingServiceDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative animate-fade-in">
            <button onClick={() => setViewingServiceDetail(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800">
                {viewingServiceDetail.category}
              </span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${viewingServiceDetail.hidden ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"}`}>
                {viewingServiceDetail.hidden ? "Đã ẩn khỏi Catalog" : "Đang công khai"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{viewingServiceDetail.name}</h3>
              <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{viewingServiceDetail.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Giá Tham Khảo</span>
                <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
                  {formatPriceRange(viewingServiceDetail.estimatedPrice, viewingServiceDetail.maxPrice)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Thời Gian</span>
                <span className="font-bold text-sky-600 text-sm mt-0.5 block">
                  {formatDaysRange(viewingServiceDetail.estimatedDays, viewingServiceDetail.maxDays)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Sửa Free</span>
                <span className="font-bold text-purple-600 text-sm mt-0.5 block">
                  Tối đa {viewingServiceDetail.maxRevisions || 3} lần
                </span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-800">Sản phẩm & Phạm vi bàn giao:</div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                {viewingServiceDetail.scopeOutput || "Source code, tài liệu hướng dẫn và hỗ trợ demo"}
              </div>
            </div>
            {viewingServiceDetail.demoImages && viewingServiceDetail.demoImages.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-slate-800 text-xs">Hình ảnh minh họa:</div>
                <div className="grid grid-cols-2 gap-2">
                  {viewingServiceDetail.demoImages.map((img, idx) => (
                    <img key={idx} src={img} alt="demo" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setViewingServiceDetail(null)} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs">
              Đóng Xem Chi Tiết
            </button>
          </div>
        </div>
      )}

      {/* USER DETAIL INSPECTION MODAL */}
      {viewingUserDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 relative animate-fade-in">
            <button onClick={() => setViewingUserDetail(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img src={viewingUserDetail.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-sky-200" />
              <div>
                <h3 className="text-lg font-black text-slate-900">{viewingUserDetail.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                  {viewingUserDetail.role}
                </span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${viewingUserDetail.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {viewingUserDetail.status === "active" ? "Hoạt động" : "Đã khóa"}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">ID Người dùng:</span>
                <span className="font-bold text-slate-800">{viewingUserDetail.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-bold text-slate-800">{viewingUserDetail.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số điện thoại:</span>
                <span className="font-bold text-slate-800">{viewingUserDetail.phone || "Chưa cập nhật"}</span>
              </div>
              {viewingUserDetail.role === "staff" && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block mb-1">Chuyên môn kỹ thuật:</span>
                  <div className="flex flex-wrap gap-1">
                    {viewingUserDetail.skills?.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                        {sk}
                      </span>
                    )) || <span className="text-slate-400">Chưa khai báo</span>}
                  </div>
                </div>
              )}
              {viewingUserDetail.role === "customer" && (
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-400">Số đơn hàng đã khởi tạo:</span>
                  <span className="font-bold text-sky-600">
                    {orders.filter((o) => o.customerId === viewingUserDetail.id || o.customerEmail === viewingUserDetail.email).length} đơn
                  </span>
                </div>
              )}
            </div>

            <button onClick={() => setViewingUserDetail(null)} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs">
              Đóng Xem Chi Tiết
            </button>
          </div>
        </div>
      )}

      {/* PROJECT DETAIL INSPECTION MODAL */}
      {viewingProjectDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative animate-fade-in">
            <button onClick={() => setViewingProjectDetail(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <img src={viewingProjectDetail.image} alt={viewingProjectDetail.name} className="w-full h-52 object-cover rounded-2xl border border-slate-200" />
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800">
                {viewingProjectDetail.category}
              </span>
              <h3 className="text-xl font-black text-slate-900">{viewingProjectDetail.name}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{viewingProjectDetail.description}</p>
            </div>
            {viewingProjectDetail.link && (
              <div className="p-3 bg-sky-50 rounded-xl text-xs font-semibold text-sky-800">
                Link sản phẩm demo: <a href={viewingProjectDetail.link} target="_blank" rel="noreferrer" className="underline font-bold text-sky-600 ml-1">{viewingProjectDetail.link}</a>
              </div>
            )}
            <button onClick={() => setViewingProjectDetail(null)} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs">
              Đóng Xem Chi Tiết
            </button>
          </div>
        </div>
      )}

      {/* Edit Staff Skills Modal */}
      {editingStaffId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setEditingStaffId(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Cập Nhật Chuyên Môn Nhân Viên</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kỹ năng chuyên môn (cách nhau dấu phẩy)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Next.js, UI/UX, Database, Figma..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                updateStaffSkills(editingStaffId, skillsInput.split(",").map((s) => s.trim()));
                setEditingStaffId(null);
                alert("Đã cập nhật chuyên môn staff!");
              }}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Lưu Kỹ Năng Staff
            </button>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowRefundModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Xác Nhận Hủy Đơn & Hoàn Tiền</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số tiền hoàn trả thực tế (₫)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold text-rose-600"
                />
              </div>
            </div>

            <button
              onClick={() => {
                handleCancellation(selectedOrder.id, "approved", refundAmount);
                setShowRefundModal(false);
                alert("Đã xử lý hủy đơn và hoàn tiền cho khách!");
              }}
              className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Xác Nhận Hủy Đơn & Hoàn Tiền
            </button>
          </div>
        </div>
      )}

      {/* FULL ORDER DETAIL MODAL */}
      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-fade-in space-y-6">
            
            {/* Modal Header */}
            <button
              onClick={() => setShowOrderDetailModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md font-mono">
                  {selectedOrder.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedOrder.category === "IT" ? "badge-it" : selectedOrder.category === "Design" ? "badge-design" : "badge-mixed"
                }`}>
                  Dịch vụ {selectedOrder.category}
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <h2 className="text-xl font-black text-slate-900">{selectedOrder.serviceName}</h2>
              <div className="text-xs text-slate-400">
                Ngày gửi: {selectedOrder.createdAt} • Cập nhật gần nhất: {selectedOrder.updatedAt}
              </div>
            </div>

            {/* Grid Section 1: Customer Details & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-600" /> Thông Tin Khách Hàng
                </div>
                <div><strong className="text-slate-700">Họ tên:</strong> {selectedOrder.customerName}</div>
                <div><strong className="text-slate-700">Email:</strong> {selectedOrder.customerEmail}</div>
                <div><strong className="text-slate-700">Số điện thoại:</strong> {selectedOrder.customerPhone}</div>
                <div><strong className="text-slate-700">Hạn chót mong muốn:</strong> {selectedOrder.desiredDeadline}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-600" /> Yêu Cầu & Mô Tả Chi Tiết
                </div>
                <div className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed max-h-32 overflow-y-auto">
                  {selectedOrder.requirements}
                </div>
                {selectedOrder.attachments && selectedOrder.attachments.length > 0 && (
                  <div className="pt-1">
                    <span className="font-bold text-slate-600">File đính kèm ({selectedOrder.attachments.length}):</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOrder.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> File #{idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid Section 2: Quotation & Progress Control */}
            <div className="bg-sky-50/50 p-5 rounded-3xl border border-sky-100 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 pb-3">
                <div>
                  <div className="font-bold text-sky-900 text-sm">Báo Giá & Phân Công Nhân Viên</div>
                  <div className="text-slate-500">Thông tin tài chính & nhân sự phụ trách đơn hàng</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Tổng giá trị hợp đồng:</div>
                  <div className="text-lg font-black text-sky-600">
                    {selectedOrder.quotation ? `${selectedOrder.quotation.amount.toLocaleString("vi-VN")} ₫` : "Chưa lập báo giá"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-sky-100/80">
                  <div className="text-slate-400 font-semibold">Staff Phụ Trách:</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.assignedStaffName || "Chưa phân công"}</div>
                  {selectedOrder.collaborators && selectedOrder.collaborators.length > 0 && (
                    <div className="text-[10px] text-slate-500 mt-1">Cùng: {selectedOrder.collaborators.join(", ")}</div>
                  )}
                </div>

                <div className="bg-white p-3 rounded-2xl border border-sky-100/80">
                  <div className="text-slate-400 font-semibold">Hạn Giao Báo Giá:</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.quotation?.finalDeadline || selectedOrder.desiredDeadline}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Số lần sửa free: {selectedOrder.quotation?.maxRevisions || 3} lần</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-sky-100/80">
                  <div className="text-slate-400 font-semibold">Tiến Độ Sản Xuất:</div>
                  <div className="font-black text-purple-600 text-sm mt-0.5">{selectedOrder.progressPercent}%</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-purple-600 h-full transition-all" style={{ width: `${selectedOrder.progressPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* 50% Deposit & Financial Progress Breakdown */}
              {selectedOrder.quotation && (() => {
                const quotedVal = selectedOrder.quotation.amount;
                const depositNeeded = Math.round(quotedVal * 0.5);
                const actualPaid = selectedOrder.paymentInfo?.amountPaid || 0;
                const remainingNeeded = Math.max(0, quotedVal - actualPaid);
                const payProgress = Math.min(100, Math.round((actualPaid / quotedVal) * 100));

                return (
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5 text-sm">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        Tiến Độ Thu Tiền Đặt Cọc 50% & Nghiệm Thu
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-black">
                        {actualPaid >= quotedVal ? "Đã Thu 100%" : actualPaid > 0 ? "Đã Thu Cọc 50%" : "Chưa Thu Cọc"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="text-[10px] text-slate-400 font-semibold">Báo Giá Tổng</div>
                        <div className="font-extrabold text-sky-700 text-xs mt-0.5">{quotedVal.toLocaleString("vi-VN")} ₫</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="text-[10px] text-slate-400 font-semibold">Yêu Cầu Cọc 50%</div>
                        <div className="font-extrabold text-amber-700 text-xs mt-0.5">{depositNeeded.toLocaleString("vi-VN")} ₫</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="text-[10px] text-slate-400 font-semibold">Thực Thu Đã Duyệt</div>
                        <div className="font-extrabold text-emerald-600 text-xs mt-0.5">{actualPaid.toLocaleString("vi-VN")} ₫</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="text-[10px] text-slate-400 font-semibold">Phải Thu Còn Lại</div>
                        <div className="font-extrabold text-rose-600 text-xs mt-0.5">{remainingNeeded.toLocaleString("vi-VN")} ₫</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Tiến độ thu ngân: {payProgress}%</span>
                        <span>Đã thu {actualPaid.toLocaleString("vi-VN")} ₫ / {quotedVal.toLocaleString("vi-VN")} ₫</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${payProgress}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Grid Section 3: Payment Transactions History */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> Lịch Sử Giao Dịch & Tiền Đã Thu
                </div>
                <div className="font-black text-emerald-600 text-sm">
                  Đã Thu: {selectedOrder.paymentInfo ? `${selectedOrder.paymentInfo.amountPaid.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                </div>
              </div>

              {transactions.filter((t) => t.orderId === selectedOrder.id).length === 0 ? (
                <div className="text-slate-400 text-center py-3 italic bg-white rounded-2xl border border-slate-200/60">
                  Chưa có lịch sử giao dịch chuyển khoản / VNPay trực tiếp nào được ghi nhận cho đơn hàng này.
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions
                    .filter((t) => t.orderId === selectedOrder.id)
                    .map((t) => (
                      <div key={t.id} className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{t.id} • {t.paymentMethod}</div>
                          <div className="text-[11px] text-slate-500">{t.createdAt} - {t.note}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-600">{t.amount.toLocaleString("vi-VN")} ₫</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.status === "verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                          }`}>
                            {t.status === "verified" ? "Đã duyệt" : "Chờ duyệt"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Grid Section 4: Deliverables & Revision Feedback History */}
            {selectedOrder.deliverables && selectedOrder.deliverables.length > 0 && (
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Phiên Bản Sản Phẩm Bàn Giao ({selectedOrder.deliverables.length})
                </div>
                <div className="space-y-2">
                  {selectedOrder.deliverables.map((del) => (
                    <div key={del.id} className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Phiên bản v{del.version}: {del.title}</div>
                        <div className="text-slate-500 text-[11px]">{del.notes} • {del.timestamp}</div>
                      </div>
                      <a
                        href={del.fileLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-cyan-50 text-cyan-800 font-bold rounded-lg hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Xem Bàn Giao
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowOrderDetailModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Đóng Window
              </button>

              {(() => {
                const isPaymentLocked =
                  selectedOrder.paymentInfo?.paymentStatus === "pending_approval" ||
                  selectedOrder.paymentInfo?.paymentStatus === "verified" ||
                  ["deposit_pending", "in_progress", "deliverable_sent", "accepted", "completed"].includes(selectedOrder.status);
                return (
                  <button
                    disabled={isPaymentLocked}
                    onClick={() => {
                      if (isPaymentLocked) return;
                      setShowOrderDetailModal(false);
                      setQuoteForm({
                        amount: selectedOrder.workEstimate?.proposedPrice || selectedOrder.quotation?.amount || 1500000,
                        deadline: selectedOrder.desiredDeadline,
                        maxRevisions: 3,
                        scopeDetails: selectedOrder.workEstimate?.note || "Phạm vi thiết kế & code hoàn thiện theo yêu cầu"
                      });
                      setOrderEditingState(selectedOrder.id, true);
                      setShowQuoteModal(true);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                      isPaymentLocked
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                        : "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm"
                    }`}
                  >
                    {isPaymentLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-slate-500" /> Báo Giá Đã Khóa
                      </>
                    ) : (
                      "Lập / Cập nhật Báo Giá"
                    )}
                  </button>
                );
              })()}

              <button
                onClick={() => {
                  setShowOrderDetailModal(false);
                  setAssignForm({
                    staffId: selectedOrder.assignedStaffId || staffList[0]?.id || "",
                    collaborators: selectedOrder.collaborators?.join(", ") || ""
                  });
                  setShowAssignModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
              >
                Phân Công Staff
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REVIEW DETAIL & REPLY MODAL */}
      {viewingReviewDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative animate-fade-in">
            <button
              onClick={() => setViewingReviewDetail(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1">
                  {viewingReviewDetail.rating} ★
                </span>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-md">
                  {viewingReviewDetail.serviceName}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Đơn: {viewingReviewDetail.orderId}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Chi Tiết Đánh Giá Từ {viewingReviewDetail.customerName}</h3>
              <div className="text-xs text-slate-400">Thời gian đánh giá: {viewingReviewDetail.createdAt}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-600">Nội dung nhận xét của khách:</div>
                <div className="text-slate-900 font-medium leading-relaxed italic text-sm">
                  "{viewingReviewDetail.comment}"
                </div>
              </div>

              {/* Moderation Status Bar */}
              <div className="flex items-center justify-between bg-slate-100/70 p-3 rounded-xl">
                <span className="font-bold text-slate-700">Trạng thái hiển thị:</span>
                <button
                  onClick={() => {
                    const nextMod = !viewingReviewDetail.moderated;
                    moderateReview(viewingReviewDetail.id, nextMod);
                    setViewingReviewDetail({ ...viewingReviewDetail, moderated: nextMod });
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewingReviewDetail.moderated ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                  }`}
                >
                  {viewingReviewDetail.moderated ? "✓ Đang Công Khai" : "✕ Đã Ẩn (Spam)"}
                </button>
              </div>

              {/* Existing Reply Display */}
              {viewingReviewDetail.replyText && (
                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 space-y-1">
                  <div className="font-bold text-sky-900 flex items-center justify-between text-xs">
                    <span>💬 Phản hồi hiện tại từ {viewingReviewDetail.repliedBy}:</span>
                    <span className="text-[10px] text-slate-400 font-normal">{viewingReviewDetail.repliedAt}</span>
                  </div>
                  <div className="text-sky-950 font-medium italic">"{viewingReviewDetail.replyText}"</div>
                </div>
              )}

              {/* Write or Edit Reply */}
              <div className="space-y-1.5 pt-2">
                <label className="block font-bold text-slate-700 text-xs">
                  {viewingReviewDetail.replyText ? "Chỉnh sửa phản hồi cho khách hàng:" : "Nhập phản hồi phản hồi cho khách hàng:"}
                </label>
                <textarea
                  rows={3}
                  value={replyInputText}
                  onChange={(e) => setReplyInputText(e.target.value)}
                  placeholder="Cảm ơn bạn đã sử dụng dịch vụ của 4YouTech..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingReviewDetail(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  if (!replyInputText.trim()) {
                    alert("Vui lòng nhập nội dung phản hồi!");
                    return;
                  }
                  replyToServiceReview(viewingReviewDetail.id, replyInputText.trim());
                  setViewingReviewDetail(null);
                  alert("Đã gửi phản hồi đánh giá thành công! Khách hàng sẽ nhìn thấy phản hồi này.");
                }}
                className="px-5 py-2.5 rounded-xl gradient-btn font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Gửi Phản Hồi Cho Khách
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
