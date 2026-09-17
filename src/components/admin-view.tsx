"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import {
  User,
  ServiceItem,
  SampleProject,
  ServiceOrder,
  Role,
  ServiceCategory
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
  FileCheck
} from "lucide-react";

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
    issueQuotation,
    assignStaff,
    approvePaymentTransaction,
    rejectPaymentTransaction,
    verifyPayment,
    handleCancellation,
    moderateReview,
    updateStaffSkills
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    "overview" | "requests" | "payments" | "users" | "services" | "projects" | "reviews"
  >("overview");

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

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
  const [projectForm, setProjectForm] = useState<Omit<SampleProject, "id">>({
    name: "",
    category: "IT",
    description: "",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    link: "https://demo.4youtech.com/sample",
    featured: true
  });

  // Edit Staff Skills modal state
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [skillsInput, setSkillsInput] = useState("");

  // Refund Action Modal
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  // Compute Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentInfo?.amountPaid || 0), 0);
  const staffList = users.filter((u) => u.role === "staff");
  const pendingRequests = orders.filter((o) => ["submitted", "under_review", "info_requested"].includes(o.status));
  const activeOrders = orders.filter((o) => ["in_progress", "deliverable_sent", "revision_requested"].includes(o.status));
  const pendingTxns = transactions.filter((t) => t.status === "pending");

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Control Bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Executive Management Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">Quản Trị Hệ Thống 4YouTech</h1>
        </div>

        {/* Navigation Admin Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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

      {/* OVERVIEW & METRICS TAB */}
      {activeAdminTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu Thực Thu</div>
              <div className="text-2xl font-black text-emerald-600">{totalRevenue.toLocaleString("vi-VN")} ₫</div>
              <div className="text-[11px] text-slate-400">Từ tiền cọc & thanh toán đủ của khách</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giao Dịch Chờ Xác Minh</div>
              <div className="text-2xl font-black text-amber-500">{pendingTxns.length} giao dịch</div>
              <div className="text-[11px] text-slate-400">Cần duyệt chuyển khoản VietQR</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đơn Hàng Đang Chạy</div>
              <div className="text-2xl font-black text-purple-600">{activeOrders.length} đơn</div>
              <div className="text-[11px] text-slate-400">Đã phân công Staff thực hiện</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tỷ Lệ Hài Lòng (Rating)</div>
              <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
                5.0 <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div className="text-[11px] text-slate-400">{reviews.length} lượt đánh giá công khai</div>
            </div>
          </div>

          {/* Service Statistics Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-lg">Báo Cáo Thống Kê Gói Dịch Vụ Được Đặt Nhiều</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Tên Dịch Vụ</th>
                    <th className="py-3 px-4">Phân Loại</th>
                    <th className="py-3 px-4">Số Đơn Đã Đặt</th>
                    <th className="py-3 px-4">Giá Tham Khảo</th>
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
                        <td className="py-3 px-4 font-bold text-indigo-600">{count} đơn</td>
                        <td className="py-3 px-4">{srv.estimatedPrice ? `${srv.estimatedPrice.toLocaleString("vi-VN")} ₫` : "Báo giá linh hoạt"}</td>
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

      {/* PAYMENT TRANSACTIONS APPROVAL DESK TAB */}
      {activeAdminTab === "payments" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Bàn Duyệt Giao Dịch Thanh Toán VietQR</h2>
              <p className="text-xs text-slate-500 mt-0.5">Xác minh tiền về tài khoản MBBank & kích hoạt đơn hàng vào sản xuất.</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
              {pendingTxns.length} Giao dịch chờ xác minh
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">Chưa có giao dịch thanh toán nào trong hệ thống.</div>
          ) : (
            <div className="space-y-4">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className={`p-5 rounded-2xl border transition space-y-3 ${
                    txn.status === "pending"
                      ? "bg-amber-50/50 border-amber-300"
                      : txn.status === "verified"
                      ? "bg-emerald-50/30 border-emerald-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{txn.id}</span>
                      <span className="text-xs font-semibold text-slate-500">({txn.orderId})</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        txn.status === "verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : txn.status === "pending"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {txn.status === "verified" ? "Đã Xác Minh" : txn.status === "pending" ? "Chờ Duyệt Tiền" : "Từ Chối"}
                      </span>
                    </div>

                    <div className="text-sm font-black text-indigo-600">
                      {txn.amount.toLocaleString("vi-VN")} ₫ ({txn.paymentType === "deposit" ? "Đặt cọc 50%" : "Full 100%"})
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-xs">
                    <div className="sm:col-span-8 space-y-1">
                      <div><span className="font-bold text-slate-700">Khách hàng:</span> {txn.customerName}</div>
                      <div><span className="font-bold text-slate-700">Thời gian:</span> {txn.createdAt}</div>
                      <div><span className="font-bold text-slate-700">Ghi chú:</span> {txn.note}</div>
                    </div>

                    {txn.receiptImage && (
                      <div className="sm:col-span-4 flex items-center justify-end gap-2">
                        <a href={txn.receiptImage} target="_blank" rel="noreferrer">
                          <img src={txn.receiptImage} alt="Receipt" className="w-16 h-16 object-cover rounded-xl border border-slate-300" />
                        </a>
                      </div>
                    )}
                  </div>

                  {txn.status === "pending" && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          approvePaymentTransaction(txn.id);
                          alert(`Đã duyệt giao dịch ${txn.id}! Đơn ${txn.orderId} đã chuyển sang trạng thái "Đang thực hiện".`);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Duyệt Thanh Toán & Kích Hoạt Đơn
                      </button>

                      <button
                        onClick={() => {
                          rejectPaymentTransaction(txn.id);
                          alert(`Đã từ chối giao dịch ${txn.id}`);
                        }}
                        className="px-4 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700 font-bold text-xs rounded-xl"
                      >
                        Từ Chối
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REQUESTS & ORDERS DESK TAB */}
      {activeAdminTab === "requests" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left Column: All Orders List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toàn bộ Đơn hàng / Yêu cầu ({orders.length})</span>
            <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
              {orders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-amber-50/80 border-amber-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{ord.serviceName}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Khách: {ord.customerName}</span>
                      <span>Staff: {ord.assignedStaffName || "Chưa phân công"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Admin Inspection & Actions Desk */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400">{selectedOrder.id} • {selectedOrder.createdAt}</div>
                    <h2 className="text-xl font-black text-slate-900 mt-1">{selectedOrder.serviceName}</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setQuoteForm({
                          amount: selectedOrder.workEstimate?.proposedPrice || selectedOrder.quotation?.amount || 1500000,
                          deadline: selectedOrder.desiredDeadline,
                          maxRevisions: 3,
                          scopeDetails: selectedOrder.workEstimate?.note || "Phạm vi thiết kế & code hoàn thiện theo yêu cầu"
                        });
                        setShowQuoteModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                    >
                      Lập / Cập nhật Báo Giá
                    </button>

                    <button
                      onClick={() => {
                        setAssignForm({
                          staffId: selectedOrder.assignedStaffId || staffList[0]?.id || "",
                          collaborators: selectedOrder.collaborators?.join(", ") || ""
                        });
                        setShowAssignModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                    >
                      Phân Công Staff
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
                      <span className="uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                        {selectedOrder.paymentInfo.paymentStatus}
                      </span>
                    </div>
                    <div>Đã chuyển: {selectedOrder.paymentInfo.amountPaid.toLocaleString("vi-VN")} ₫</div>
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
      )}

      {/* USER & STAFF MANAGEMENT TAB */}
      {activeAdminTab === "users" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Danh Sách Tài Khoản & Chuyên Môn Nhân Viên</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Người Dùng</th>
                  <th className="py-3 px-4">Email / SĐT</th>
                  <th className="py-3 px-4">Vai Trò (Role)</th>
                  <th className="py-3 px-4">Chuyên Môn IT/Design (Staff)</th>
                  <th className="py-3 px-4">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <img src={usr.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-slate-900">{usr.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{usr.email}<br />{usr.phone}</td>
                    <td className="py-3 px-4">
                      <select
                        value={usr.role}
                        onChange={(e) => updateUserProfile(usr.id, { role: e.target.value as Role })}
                        className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {usr.role === "staff" ? (
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {usr.skills?.map((sk, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                                {sk}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setEditingStaffId(usr.id);
                              setSkillsInput(usr.skills?.join(", ") || "");
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:underline"
                          >
                            + Sửa chuyên môn
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          const nextStatus = usr.status === "active" ? "locked" : "active";
                          updateUserProfile(usr.id, { status: nextStatus });
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          usr.status === "active" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {usr.status === "active" ? "Khóa TK" : "Kích hoạt"}
                      </button>
                    </td>
                  </tr>
                ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div key={srv.id} className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-200 text-slate-800">{srv.category}</span>
                  <button
                    onClick={() => toggleServiceHidden(srv.id)}
                    className={`text-xs font-bold px-2 py-0.5 rounded ${srv.hidden ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"}`}
                  >
                    {srv.hidden ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                <div className="font-bold text-slate-900 text-sm">{srv.name}</div>
                <div className="text-xs text-slate-500 line-clamp-2">{srv.description}</div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 border-t pt-2">
                  <span>{srv.estimatedPrice ? `${srv.estimatedPrice.toLocaleString("vi-VN")} ₫` : "Báo giá linh hoạt"}</span>
                  <span>{srv.estimatedDays} ngày</span>
                </div>
              </div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-2xl border border-slate-200 flex gap-4 bg-slate-50/50">
                <img src={proj.image} alt={proj.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="space-y-1 text-xs flex-1">
                  <div className="font-bold text-slate-900 text-sm">{proj.name}</div>
                  <div className="text-slate-500">{proj.description}</div>
                  <div className="text-indigo-600 font-bold">{proj.link}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS MODERATION TAB */}
      {activeAdminTab === "reviews" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          <h2 className="text-xl font-black text-slate-900">Kiểm Duyệt Đánh Giá Từ Khách Hàng</h2>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <span className="text-amber-500 flex font-bold">{rev.rating} ★</span>
                    <span className="text-slate-400">({rev.serviceName})</span>
                  </div>
                  <div className="text-slate-700 font-medium">"{rev.comment}"</div>
                </div>

                <button
                  onClick={() => moderateReview(rev.id, !rev.moderated)}
                  className={`px-3 py-1.5 rounded-xl font-bold ${
                    rev.moderated ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {rev.moderated ? "Công khai" : "Đã ẩn / Spam"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue Quotation Modal */}
      {showQuoteModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowQuoteModal(false)} className="absolute top-4 right-4 text-slate-400">
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold text-indigo-600"
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
              onClick={() => {
                issueQuotation(selectedOrder.id, {
                  amount: quoteForm.amount,
                  finalDeadline: quoteForm.deadline || selectedOrder.desiredDeadline,
                  maxRevisions: quoteForm.maxRevisions,
                  scopeDetails: quoteForm.scopeDetails
                });
                setShowQuoteModal(false);
                alert("Đã phát hành báo giá chính thức cho khách!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs"
            >
              Phát Hành Báo Giá Ngay
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
              onClick={() => {
                const targetStaff = staffList.find((s) => s.id === assignForm.staffId) || staffList[0];
                if (targetStaff) {
                  assignStaff(
                    selectedOrder.id,
                    targetStaff.id,
                    targetStaff.name,
                    assignForm.collaborators ? assignForm.collaborators.split(",").map((s) => s.trim()) : []
                  );
                  setShowAssignModal(false);
                  alert(`Đã phân công ${targetStaff.name} làm nhiệm vụ!`);
                }
              }}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Xác Nhận Phân Công
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowServiceModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Tạo / Sửa Gói Dịch Vụ</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên dịch vụ *</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân loại *</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as ServiceCategory })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold"
                >
                  <option value="IT">IT (Code / Database / System)</option>
                  <option value="Design">Design (UI/UX / Branding)</option>
                  <option value="IT/Design">IT/Design Trọn gói</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giá tham khảo (₫)</label>
                <input
                  type="number"
                  value={serviceForm.estimatedPrice || 0}
                  onChange={(e) => setServiceForm({ ...serviceForm, estimatedPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đầu ra & Sản phẩm bàn giao</label>
                <input
                  type="text"
                  value={serviceForm.scopeOutput}
                  onChange={(e) => setServiceForm({ ...serviceForm, scopeOutput: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!serviceForm.name) return;
                addService(serviceForm);
                setShowServiceModal(false);
                alert("Đã lưu dịch vụ vào Catalog!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs"
            >
              Lưu Gói Dịch Vụ
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
                if (!projectForm.name) return;
                addProject(projectForm);
                setShowProjectModal(false);
                alert("Đã thêm dự án mẫu thành công!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs"
            >
              Lưu Dự Án Mẫu
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

    </div>
  );
}
