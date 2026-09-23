"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { ServiceOrder, hashPassword, addDaysToDate, formatVNShortDate, formatDaysRange, formatPriceRange } from "@/lib/store";
import { PaymentCheckoutModal } from "@/components/payment-checkout-modal";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
  FileText,
  CreditCard,
  Star,
  Download,
  RotateCcw,
  LifeBuoy,
  X,
  Upload,
  ChevronRight,
  UserCheck,
  Calendar,
  DollarSign,
  ShieldCheck,
  Eye,
  EyeOff,
  QrCode,
  Lock,
  Pencil,
  KeyRound,
  Sparkles,
  CheckSquare,
  Square
} from "lucide-react";

export function CustomerView({ preselectedServiceId }: { preselectedServiceId?: string | string[] }) {
  const {
    currentUser,
    orders,
    services,
    createServiceRequest,
    requestRevision,
    acceptDeliverable,
    sendOrderMessage,
    submitServiceReview,
    requestCancellation,
    submitSupportTicket,
    updateUserProfile
  } = useApp();

  const myOrders = orders.filter((o) => o.customerId === currentUser.id || o.customerEmail === currentUser.email);
  const activeServices = useMemo(() => services.filter((s) => !s.hidden), [services]);

  const initialSelectedIds = useMemo(() => {
    if (!preselectedServiceId) return activeServices[0] ? [activeServices[0].id] : [];
    if (Array.isArray(preselectedServiceId)) {
      const valid = preselectedServiceId.filter((id) => activeServices.some((s) => s.id === id));
      return valid.length > 0 ? valid : [activeServices[0]?.id || ""];
    }
    return [preselectedServiceId];
  }, [preselectedServiceId, activeServices]);

  const [activeTab, setActiveTab] = useState<"orders" | "new_request" | "profile">(
    preselectedServiceId ? "new_request" : "orders"
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(myOrders[0]?.id || null);

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(initialSelectedIds);

  // Auto switch to new_request tab if preselectedServiceId is provided
  useEffect(() => {
    if (preselectedServiceId) {
      setActiveTab("new_request");
      if (Array.isArray(preselectedServiceId)) {
        setSelectedServiceIds(preselectedServiceId);
      } else if (typeof preselectedServiceId === "string") {
        setSelectedServiceIds([preselectedServiceId]);
      }
    }
  }, [preselectedServiceId]);

  // VietQR Payment Modal Launcher
  const [activeCheckoutOrder, setActiveCheckoutOrder] = useState<ServiceOrder | null>(null);

  // New Request Form state
  const [newForm, setNewForm] = useState({
    requirements: "",
    attachment: "",
    desiredDeadline: "",
    customerName: currentUser.name || "",
    customerEmail: currentUser.email || "",
    customerPhone: currentUser.phone || ""
  });

  // Selected services list & calculation
  const selectedServices = useMemo(() => {
    return activeServices.filter((s) => selectedServiceIds.includes(s.id));
  }, [activeServices, selectedServiceIds]);

  const currentSelectedService = selectedServices[0] || activeServices[0];

  const serviceMinDays = useMemo(() => {
    if (selectedServices.length === 0) return 3;
    return Math.max(...selectedServices.map((s) => s.estimatedDays || 3));
  }, [selectedServices]);

  const serviceMaxDays = useMemo(() => {
    if (selectedServices.length === 0) return 5;
    return Math.max(...selectedServices.map((s) => s.maxDays || (s.estimatedDays ? s.estimatedDays + 2 : 5)));
  }, [selectedServices]);

  const totalMinPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + (s.estimatedPrice || 0), 0);
  }, [selectedServices]);

  const totalMaxPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + (s.maxPrice || s.estimatedPrice || 0), 0);
  }, [selectedServices]);

  const minDeadlineDate = useMemo(() => {
    return addDaysToDate(new Date(), serviceMinDays);
  }, [serviceMinDays]);

  const maxDeadlineDate = useMemo(() => {
    return addDaysToDate(new Date(), serviceMaxDays);
  }, [serviceMaxDays]);

  // Keep desiredDeadline within allowed date range when service changes
  useEffect(() => {
    if (!newForm.desiredDeadline || newForm.desiredDeadline < minDeadlineDate || newForm.desiredDeadline > maxDeadlineDate) {
      setNewForm((prev) => ({ ...prev, desiredDeadline: maxDeadlineDate }));
    }
  }, [selectedServiceIds, minDeadlineDate, maxDeadlineDate]);

  // Action Modals state
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionText, setRevisionText] = useState("");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", content: "", type: "support" as "support" | "complaint" });

  const [chatInput, setChatInput] = useState("");
  
  // Profile edit mode state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    phone: currentUser.phone || "",
    avatar: currentUser.avatar || ""
  });
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Change Password state
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setProfileMsg({ type: "error", text: "Vui lòng không để trống họ và tên." });
      return;
    }
    updateUserProfile(currentUser.id, profileForm);
    setProfileMsg({ type: "success", text: "Đã lưu thay đổi thông tin cá nhân thành công!" });
    setIsEditingProfile(false);
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      name: currentUser.name,
      phone: currentUser.phone || "",
      avatar: currentUser.avatar || ""
    });
    setProfileMsg(null);
    setIsEditingProfile(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
      setPassMsg({ type: "error", text: "Vui lòng nhập đầy đủ các trường mật khẩu." });
      return;
    }

    if (currentUser.password && hashPassword(passForm.currentPassword) !== currentUser.password) {
      setPassMsg({ type: "error", text: "Mật khẩu hiện tại không chính xác!" });
      return;
    }

    if (passForm.newPassword.length < 6) {
      setPassMsg({ type: "error", text: "Mật khẩu mới phải có tối thiểu 6 ký tự." });
      return;
    }

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg({ type: "error", text: "Xác nhận mật khẩu mới không trùng khớp!" });
      return;
    }

    const hashed = hashPassword(passForm.newPassword);
    updateUserProfile(currentUser.id, { password: hashed });
    setPassMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
    setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || myOrders[0];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRequest) return;

    if (!newForm.customerName.trim()) {
      alert("Vui lòng nhập Họ và tên của bạn.");
      return;
    }

    if (!newForm.customerEmail.trim() || !/.+@.+\..+/.test(newForm.customerEmail.trim())) {
      alert("Vui lòng nhập địa chỉ Email liên hệ hợp lệ.");
      return;
    }

    const phoneDigits = newForm.customerPhone.replace(/\D/g, "");
    if (!newForm.customerPhone.trim() || phoneDigits.length < 9) {
      alert("Vui lòng nhập Số điện thoại liên hệ chính xác (tối thiểu 9-10 chữ số).");
      return;
    }

    if (!newForm.requirements || !newForm.desiredDeadline) {
      alert("Vui lòng nhập đầy đủ mô tả yêu cầu và thời hạn mong muốn.");
      return;
    }

    if (newForm.desiredDeadline < minDeadlineDate || newForm.desiredDeadline > maxDeadlineDate) {
      alert(`Vui lòng chọn ngày hoàn thành trong khoảng từ ${formatVNShortDate(minDeadlineDate)} đến ${formatVNShortDate(maxDeadlineDate)} (${serviceMinDays} - ${serviceMaxDays} ngày kể từ hôm nay).`);
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const createdOrders: ServiceOrder[] = [];
      for (const srvId of selectedServiceIds) {
        const created = createServiceRequest({
          serviceId: srvId,
          requirements: newForm.requirements,
          attachments: newForm.attachment ? [newForm.attachment] : [],
          desiredDeadline: newForm.desiredDeadline,
          customerName: newForm.customerName.trim(),
          customerEmail: newForm.customerEmail.trim(),
          customerPhone: newForm.customerPhone.trim()
        });
        createdOrders.push(created);
      }

      alert(`🎉 Đã gửi thành công ${createdOrders.length} yêu cầu dịch vụ! Mã đơn: ${createdOrders.map((o) => o.id).join(", ")}`);
      setSelectedOrderId(createdOrders[0].id);
      setActiveTab("orders");
      setTimeout(() => setIsSubmittingRequest(false), 500);
    } catch (err: any) {
      setIsSubmittingRequest(false);
      alert(err.message || "Không thể gửi yêu cầu. Vui lòng thử lại!");
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedOrder) return;
    sendOrderMessage(selectedOrder.id, chatInput.trim());
    setChatInput("");
  };

  const statusLabel = (status: ServiceOrder["status"]) => {
    const map: Record<ServiceOrder["status"], { title: string; color: string }> = {
      submitted: { title: "Yêu cầu mới gửi", color: "status-submitted" },
      under_review: { title: "Đang đánh giá", color: "status-under_review" },
      info_requested: { title: "Cần bổ sung thông tin", color: "status-info_requested" },
      quoted: { title: "Đã có báo giá", color: "status-quoted" },
      deposit_pending: { title: "Đã chuyển cọc (Chờ duyệt)", color: "status-deposit_pending" },
      in_progress: { title: "Đang thực hiện", color: "status-in_progress" },
      deliverable_sent: { title: "Đã gửi sản phẩm thử", color: "status-deliverable_sent" },
      revision_requested: { title: "Khách yêu cầu sửa", color: "status-revision_requested" },
      accepted: { title: "Đã nghiệm thu", color: "status-accepted" },
      completed: { title: "Hoàn tất bàn giao", color: "status-completed" },
      cancel_requested: { title: "Yêu cầu hủy đơn", color: "status-cancel_requested" },
      cancelled: { title: "Đã hủy đơn", color: "status-cancelled" }
    };
    return map[status] || { title: status, color: "bg-slate-100 text-slate-700" };
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Customer Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark-glass-card p-6 rounded-3xl border border-blue-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Customer Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Xin chào, {currentUser.name}!</h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-blue-500/20">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Đơn hàng ({myOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("new_request")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
              activeTab === "new_request"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <PlusCircle className="w-4.5 h-4.5" /> Đặt Dịch Vụ Mới
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Hồ sơ cá nhân
          </button>
        </div>
      </div>

      {/* Profile & Change Password Tab */}
      {activeTab === "profile" && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Section 1: Update Profile */}
          <div className="lg:col-span-6 dark-glass-card rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">Cập nhật Hồ Sơ Khách Hàng</h2>
                <p className="text-xs text-slate-400 mt-1">Quản lý họ tên, số điện thoại và ảnh đại diện</p>
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-950/80 text-cyan-300 hover:bg-cyan-900 font-bold text-xs transition flex items-center gap-1.5 border border-cyan-500/40"
                >
                  <Pencil className="w-3.5 h-3.5" /> Chỉnh Sửa Thông Tin
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelProfileEdit}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs transition"
                >
                  Hủy Chỉnh Sửa
                </button>
              )}
            </div>

            {profileMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  profileMsg.type === "success"
                    ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-950/70 text-rose-300 border border-rose-500/30"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Email Đăng Nhập</label>
                <input
                  type="email"
                  disabled
                  readOnly
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Họ và tên</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  readOnly={!isEditingProfile}
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold outline-none transition ${
                    isEditingProfile
                      ? "bg-slate-900 border-cyan-400 text-white focus:ring-1 focus:ring-cyan-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-300 cursor-not-allowed select-none"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  readOnly={!isEditingProfile}
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold outline-none transition ${
                    isEditingProfile
                      ? "bg-slate-900 border-cyan-400 text-white focus:ring-1 focus:ring-cyan-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-300 cursor-not-allowed select-none"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Avatar Link</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  readOnly={!isEditingProfile}
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold outline-none transition ${
                    isEditingProfile
                      ? "bg-slate-900 border-cyan-400 text-white focus:ring-1 focus:ring-cyan-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-300 cursor-not-allowed select-none"
                  }`}
                />
              </div>

              {isEditingProfile && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl gradient-btn font-extrabold text-xs text-white shadow-md"
                  >
                    Lưu Thông Tin Hồ Sơ
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelProfileEdit}
                    className="px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Section 2: Change Password with Eye Toggles */}
          <div className="lg:col-span-6 dark-glass-card rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" /> Đổi Mật Khẩu Bảo Mật
              </h2>
              <p className="text-xs text-slate-400 mt-1">Nên sử dụng mật khẩu mạnh có tối thiểu 6-8 ký tự</p>
            </div>

            {passMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  passMsg.type === "success"
                    ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-950/70 text-rose-300 border border-rose-500/30"
                }`}
              >
                {passMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                {passMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Mật khẩu hiện tại *</label>
                <div className="relative">
                  <input
                    type={showCurrPass ? "text" : "password"}
                    required
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    placeholder="Nhập mật khẩu hiện tại..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrPass(!showCurrPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded-lg transition"
                    title={showCurrPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showCurrPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Mật khẩu mới *</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded-lg transition"
                    title={showNewPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Xác nhận mật khẩu mới *</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded-lg transition"
                    title={showConfirmPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-extrabold text-white text-xs shadow-md transition hover:scale-[1.01]"
              >
                Cập Nhật Mật Khẩu
              </button>
            </form>
          </div>

        </div>
      )}

      {/* New Request Tab (Expanded 2-column Layout to fill screen width) */}
      {activeTab === "new_request" && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 dark-glass-card rounded-3xl border border-blue-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Tạo Yêu Cầu Dịch Vụ Mới</h2>
              <p className="text-xs text-slate-400 mt-1">Vui lòng điền thông tin chi tiết để Admin & Staff lập báo giá chính xác.</p>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-200">
                    Chọn gói dịch vụ * <span className="text-cyan-400 font-normal">(Có thể tích chọn 1 hoặc nhiều dịch vụ)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedServiceIds(activeServices.map((s) => s.id))}
                      className="text-[11px] font-bold text-cyan-400 hover:underline"
                    >
                      Chọn tất cả ({activeServices.length})
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedServiceIds([])}
                      className="text-[11px] font-bold text-slate-400 hover:underline"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {activeServices.map((srv) => {
                    const isChecked = selectedServiceIds.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => {
                          setSelectedServiceIds((prev) =>
                            prev.includes(srv.id) ? prev.filter((id) => id !== srv.id) : [...prev, srv.id]
                          );
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? "bg-blue-950/80 border-cyan-400 text-white shadow-md"
                            : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="shrink-0">
                            {isChecked ? (
                              <CheckSquare className="w-4.5 h-4.5 text-cyan-400" />
                            ) : (
                              <Square className="w-4.5 h-4.5 text-slate-500" />
                            )}
                          </div>
                          <div className="truncate text-xs font-bold">
                            <span className="text-cyan-300 mr-1.5 font-mono">[{srv.category}]</span>
                            <span className={isChecked ? "text-white" : "text-slate-300"}>{srv.name}</span>
                          </div>
                        </div>

                        <div className="text-[11px] font-semibold text-emerald-400 shrink-0">
                          {formatPriceRange(srv.estimatedPrice, srv.maxPrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Đã tích chọn: </span>
                      <span className="font-extrabold text-cyan-300">{selectedServices.length} gói dịch vụ</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Tổng giá trị ước tính: </span>
                      <span className="font-extrabold text-emerald-400">
                        {formatPriceRange(totalMinPrice, totalMaxPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Mô tả chi tiết yêu cầu & đầu ra mong muốn *</label>
                <textarea
                  rows={4}
                  required
                  value={newForm.requirements}
                  onChange={(e) => setNewForm({ ...newForm, requirements: e.target.value })}
                  placeholder="Ví dụ: Cần làm website portfolio 5 trang phong cách tối giản màu tím neon, có trang giới thiệu kỹ năng và danh mục dự án đồ án môn Lập trình Web..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Link file đính kèm (Figma / Drive / Tham khảo nếu có)</label>
                <input
                  type="url"
                  value={newForm.attachment}
                  onChange={(e) => setNewForm({ ...newForm, attachment: e.target.value })}
                  placeholder="https://drive.google.com/file/..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-200">Thời hạn mong muốn hoàn thành *</label>
                  <span className="text-[11px] font-bold text-cyan-300 bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                    Phạm vi: {serviceMinDays} - {serviceMaxDays} ngày
                  </span>
                </div>
                <input
                  type="date"
                  required
                  min={minDeadlineDate}
                  max={maxDeadlineDate}
                  value={newForm.desiredDeadline}
                  onChange={(e) => setNewForm({ ...newForm, desiredDeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-cyan-300 outline-none focus:border-cyan-400 [color-scheme:dark]"
                />
                <div className="mt-2 p-3 bg-blue-950/70 border border-blue-500/30 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed text-[11px]">
                    <span className="font-extrabold text-cyan-300">Giới hạn chọn ngày hoàn thành:</span> Dịch vụ <strong className="text-white">{currentSelectedService?.name}</strong> quy định thời gian xử lý từ <strong className="text-cyan-300">{serviceMinDays} đến {serviceMaxDays} ngày</strong>. Ngày hoàn thành chỉ được chọn từ <strong className="text-cyan-300">{formatVNShortDate(minDeadlineDate)}</strong> đến <strong className="text-cyan-300">{formatVNShortDate(maxDeadlineDate)}</strong>.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Họ tên người gửi</label>
                  <input
                    type="text"
                    value={newForm.customerName}
                    onChange={(e) => setNewForm({ ...newForm, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Số điện thoại Zalo</label>
                  <input
                    type="tel"
                    value={newForm.customerPhone}
                    onChange={(e) => setNewForm({ ...newForm, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingRequest}
                className="w-full py-3.5 rounded-xl gradient-btn font-extrabold text-xs text-white shadow-xl shadow-cyan-500/20 hover:scale-[1.01] transition mt-4 disabled:opacity-50"
              >
                {isSubmittingRequest ? "Đang gửi yêu cầu..." : "Gửi Yêu Cầu & Nhận Báo Giá"}
              </button>
            </form>
          </div>

          {/* Right Column: Guidance Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Payment policy alert */}
            <div className="p-6 bg-amber-950/70 rounded-3xl border border-amber-500/40 text-xs text-amber-200 space-y-3 shadow-xl">
              <div className="font-black text-sm flex items-center gap-2 text-amber-300">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" /> Quy định đặt cọc & thanh toán 50% - 50%
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed space-y-1">
                • Báo giá chính thức sẽ được Admin gửi sau khi đánh giá yêu cầu.<br />
                • Bạn cần <strong className="text-amber-300">thanh toán 50% tiền đặt cọc</strong> trước khi nhân viên triển khai.<br />
                • Sau khi nhận bản giao và <strong className="text-amber-300">nghiệm thu đạt yêu cầu</strong>, bạn thanh toán <strong className="text-amber-300">50% còn lại</strong> để nhận file gốc.
              </p>
            </div>

            {/* Workflow Process Card */}
            <div className="p-6 dark-glass-card rounded-3xl border border-blue-500/30 text-xs space-y-4 shadow-xl text-slate-200">
              <div className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Quy Trình Xử Lý Đơn Hàng 4 Bước
              </div>
              
              <div className="space-y-3 font-medium text-slate-300">
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                  <div><strong className="text-white">Gửi yêu cầu & Nhận báo giá:</strong> Admin gửi báo giá hợp đồng chi tiết trong 15-30 phút.</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                  <div><strong className="text-white">Cọc 50% & Triển khai:</strong> Chuyển khoản 50% cọc qua VNPay/VietQR để Staff IT nhận việc.</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                  <div><strong className="text-white">Cập nhật tiến độ %:</strong> Theo dõi tiến độ thời gian thực trực tiếp trên Workspace.</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-black text-[11px] flex items-center justify-center shrink-0">4</span>
                  <div><strong className="text-white">Nghiệm thu & Bàn giao:</strong> Thanh toán 50% còn lại để nhận toàn bộ Source Code / Figma.</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Orders Workspace */}
      {activeTab === "orders" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh sách Đơn hàng</span>
            {myOrders.length === 0 ? (
              <div className="p-8 dark-glass-card rounded-2xl border border-blue-500/30 text-center">
                <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-300">Chưa có đơn hàng nào</div>
                <button
                  onClick={() => setActiveTab("new_request")}
                  className="mt-3 text-xs font-bold text-cyan-400 underline hover:text-cyan-300"
                >
                  Tạo yêu cầu đầu tiên ngay
                </button>
              </div>
            ) : (
              myOrders.map((ord) => {
                const stInfo = statusLabel(ord.status);
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-blue-950/90 border-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{ord.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stInfo.color}`}>
                        {stInfo.title}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{ord.serviceName}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{ord.createdAt}</span>
                      {ord.isBeingEdited || ord.status === "under_review" ? (
                        <span className="font-bold text-rose-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Admin đang edit
                        </span>
                      ) : ord.status === "quoted" ? (
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          <QrCode className="w-3 h-3" /> Cần đặt cọc
                        </span>
                      ) : ord.status === "deposit_pending" ? (
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Chờ duyệt cọc
                        </span>
                      ) : (
                        <span className="font-semibold text-cyan-400">{ord.progressPercent}% hoàn thành</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Order Hub */}
          <div className="lg:col-span-8">
            {selectedOrder ? (() => {
              const selectedQuotedAmount = selectedOrder.quotation?.amount || 0;
              const selectedAmountPaid = selectedOrder.paymentInfo?.amountPaid || 0;
              const selectedRemaining = Math.max(0, selectedQuotedAmount - selectedAmountPaid);
              const isPendingFinalPayment = selectedOrder.status === "accepted" && selectedRemaining > 0;

              return (
              <div className="dark-glass-card rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in select-none cursor-default text-slate-100">
                
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{selectedOrder.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusLabel(selectedOrder.status).color}`}>
                        {isPendingFinalPayment ? "Đã Nghiệm Thu (Chờ Thu 50% Còn Lại)" : statusLabel(selectedOrder.status).title}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white mt-1">{selectedOrder.serviceName}</h2>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {["quoted", "deposit_pending"].includes(selectedOrder.status) && (
                      <button
                        onClick={() => setActiveCheckoutOrder(selectedOrder)}
                        className="px-4 py-2 rounded-xl gradient-btn font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <QrCode className="w-4 h-4" /> Quét Mã VietQR Thanh Toán
                      </button>
                    )}

                    {isPendingFinalPayment && (
                      <button
                        onClick={() => setActiveCheckoutOrder(selectedOrder)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 animate-bounce"
                      >
                        <QrCode className="w-4 h-4" /> Thanh Toán 50% Còn Lại ({selectedRemaining.toLocaleString("vi-VN")} ₫)
                      </button>
                    )}

                    {selectedOrder.status === "deliverable_sent" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowRevisionModal(true)}
                          className="px-3.5 py-2 rounded-xl border border-rose-500/40 bg-rose-950/60 text-rose-300 hover:bg-rose-900 font-bold text-xs transition"
                        >
                          Yêu cầu sửa
                        </button>
                        <button
                          onClick={() => {
                            if (selectedOrder.deliverables[0]) {
                              acceptDeliverable(selectedOrder.id, selectedOrder.deliverables[0].id);
                              alert("Đã nghiệm thu kết quả bàn giao thành công!");
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                        >
                          Nghiệm Thu Sản Phẩm
                        </button>
                      </div>
                    )}

                    {["accepted", "completed"].includes(selectedOrder.status) && (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" /> Đánh Giá Dịch Vụ
                      </button>
                    )}

                    {/* Support & Cancel buttons */}
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className="p-2 text-slate-300 hover:text-cyan-400 rounded-xl hover:bg-slate-800 border border-slate-700"
                      title="Gửi hỗ trợ / Khiếu nại"
                    >
                      <LifeBuoy className="w-4 h-4" />
                    </button>

                    {["submitted", "quoted", "deposit_pending"].includes(selectedOrder.status) && (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 border border-slate-700"
                        title="Đề nghị hủy đơn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Milestones Stepper */}
                <div className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-blue-500/20 select-none cursor-default">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1">
                        <span>Tiến độ thực hiện công việc: <strong className="text-cyan-400">{selectedOrder.progressPercent}%</strong></span>
                        <span>Hạn giao dự kiến: <strong className="text-white">{selectedOrder.quotation?.finalDeadline || selectedOrder.desiredDeadline}</strong></span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500 rounded-full"
                          style={{ width: `${selectedOrder.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Financial Payment Progress Bar */}
                    {selectedQuotedAmount > 0 && (
                      <div className="pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                            Tiến độ thanh toán: {Math.min(100, Math.round((selectedAmountPaid / selectedQuotedAmount) * 100))}% 
                            {selectedAmountPaid >= selectedQuotedAmount ? (
                              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-bold ml-1">Đã cọc/thanh toán 100%</span>
                            ) : selectedAmountPaid > 0 ? (
                              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full font-bold ml-1">Đã cọc 50%</span>
                            ) : (
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded-full font-bold ml-1">Chưa cọc</span>
                            )}
                          </span>
                          <span className="text-slate-300 font-extrabold">
                            {selectedAmountPaid.toLocaleString("vi-VN")} ₫ / {selectedQuotedAmount.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (selectedAmountPaid / selectedQuotedAmount) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>Đã cọc/trả: <strong className="text-emerald-400">{selectedAmountPaid.toLocaleString("vi-VN")} ₫</strong></span>
                          <span>Còn lại (sau nghiệm thu): <strong className="text-amber-400">{selectedRemaining.toLocaleString("vi-VN")} ₫</strong></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Milestones list */}
                  {selectedOrder.milestones.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      {selectedOrder.milestones.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 text-xs">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className={m.completed ? "font-semibold text-white" : "text-slate-400"}>
                            {m.title} ({m.targetDate})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quotation & VietQR Payment Trigger Details */}
                {selectedOrder.quotation && (
                  <div className="bg-blue-950/60 p-5 rounded-2xl border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Thông tin Báo Giá & Đặt Cọc 50%</span>
                      <span className="text-base font-black text-white">
                        {selectedOrder.quotation.amount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 font-medium leading-relaxed">
                      {selectedOrder.quotation.scopeDetails}
                    </div>

                    {/* Deposit Breakdown Info Card */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-3 rounded-xl border border-blue-500/20 text-xs">
                      <div>
                        <div className="text-[11px] text-slate-400">Số tiền đặt cọc 50%:</div>
                        <div className="font-bold text-cyan-300 text-sm">
                          {Math.round(selectedOrder.quotation.amount * 0.5).toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Đã thanh toán thực tế:</div>
                        <div className={`font-bold text-sm ${selectedAmountPaid > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                          {selectedAmountPaid.toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-blue-500/20 gap-2">
                      <div className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span>Đã thu: <strong className="text-emerald-400">{selectedAmountPaid.toLocaleString("vi-VN")} ₫</strong></span>
                        <span className="text-slate-500">•</span>
                        <span>Còn nợ: <strong className="text-amber-400">{selectedRemaining.toLocaleString("vi-VN")} ₫</strong></span>
                      </div>
                      
                      {selectedOrder.isBeingEdited || selectedOrder.status === "under_review" ? (
                        <div className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-rose-400" /> Admin đang chỉnh sửa giá/dịch vụ (Tạm khóa thanh toán)
                        </div>
                      ) : isPendingFinalPayment ? (
                        <button
                          onClick={() => setActiveCheckoutOrder(selectedOrder)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Thanh Toán 50% Còn Lại ({selectedRemaining.toLocaleString("vi-VN")} ₫)
                        </button>
                      ) : selectedOrder.status === "quoted" ? (
                        <button
                          onClick={() => setActiveCheckoutOrder(selectedOrder)}
                          className="px-4 py-2 rounded-xl gradient-btn font-bold text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Thanh Toán Đặt Cọc 50% ({Math.round(selectedOrder.quotation.amount * 0.5).toLocaleString("vi-VN")} ₫)
                        </button>
                      ) : selectedOrder.status === "deposit_pending" ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Đã gửi cọc 50% (Chờ Admin duyệt)
                          </span>
                          <button
                            onClick={() => setActiveCheckoutOrder(selectedOrder)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 font-semibold text-[11px] hover:bg-slate-800"
                          >
                            Xem biên lai / Chuyển thêm
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* 50% Remaining Balance Payment Banner */}
                {isPendingFinalPayment && (
                  <div className="p-5 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-200 space-y-3 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-extrabold text-sm flex items-center gap-2 text-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        🎉 Sản Phẩm Đã Nghiệm Thu — Yêu Cầu Thanh Toán 50% Số Tiền Còn Lại
                      </div>
                      <span className="font-black text-white text-base">
                        {selectedRemaining.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      Bạn đã nghiệm thu kết quả bàn giao công việc thành công! Vui lòng thanh toán nốt 50% số tiền còn lại để đơn hàng chuyển sang trạng thái <strong className="text-white">Hoàn thành 100%</strong> và nhận đầy đủ file mã nguồn chính thức.
                    </p>
                    <button
                      onClick={() => setActiveCheckoutOrder(selectedOrder)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md flex items-center gap-2 transition"
                    >
                      <QrCode className="w-4 h-4" /> Thanh Toán 50% Còn Lại Ngay ({selectedRemaining.toLocaleString("vi-VN")} ₫)
                    </button>
                  </div>
                )}

                {/* Deliverables Hub Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Sản Phẩm & Bản Thử Bàn Giao ({selectedOrder.deliverables.length})</h3>
                  </div>

                  {selectedOrder.deliverables.length === 0 ? (
                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      Nhóm thực hiện chưa gửi sản phẩm thử. Chúng tôi sẽ cập nhật sớm!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedOrder.deliverables.map((del) => (
                        <div key={del.id} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              Phiên bản v{del.version}: {del.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{del.timestamp}</span>
                          </div>

                          {del.previewUrl && (
                            <img src={del.previewUrl} alt="preview" className="h-40 w-full object-cover rounded-xl border border-slate-800" />
                          )}

                          <div className="text-xs text-slate-300 font-medium">{del.notes}</div>

                          <div className="flex items-center gap-3 pt-1">
                            <a
                              href={del.fileLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" /> Tải về / Xem Link
                            </a>
                            {isPendingFinalPayment && (
                              <span className="text-[11px] font-semibold text-amber-300">
                                ⚠️ Cần thanh toán nốt 50% để nhận bàn giao chính thức
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Review & Staff/Admin Reply Section */}
                {selectedOrder.review && (
                  <div className="space-y-3 bg-amber-950/50 p-5 rounded-3xl border border-amber-500/40 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        Đánh Giá Của Bạn Cho Đơn Hàng
                      </div>
                      <span className="font-bold text-amber-300 bg-amber-900/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs">
                        {selectedOrder.review.rating} / 5 ★
                      </span>
                    </div>

                    <div className="text-slate-200 font-medium bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 italic">
                      "{selectedOrder.review.comment}"
                    </div>

                    {/* Admin / Staff Reply */}
                    {selectedOrder.review.replyText ? (
                      <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-500/30 space-y-1.5 animate-fade-in">
                        <div className="font-bold text-cyan-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs">
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                            Phản hồi từ {selectedOrder.review.repliedBy || "4YouTech"}:
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {selectedOrder.review.repliedAt}
                          </span>
                        </div>
                        <p className="text-slate-200 font-medium leading-relaxed pl-5 text-xs">
                          {selectedOrder.review.replyText}
                        </p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        💬 4YouTech đã ghi nhận đánh giá của bạn và sẽ sớm phản hồi!
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Messages & Chat Box */}
                <div className="space-y-4 border-t border-slate-800 pt-6">
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" /> Trao đổi với Nhóm Thực Hiện
                  </h3>

                  <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 space-y-3 max-h-72 overflow-y-auto">
                    {selectedOrder.messages.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 py-4">Chưa có tin nhắn nào</div>
                    ) : (
                      selectedOrder.messages.map((msg) => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                          <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className="text-[10px] text-slate-400 mb-0.5">
                              {msg.senderName} ({msg.senderRole}) • {msg.createdAt}
                            </div>
                            <div
                              className={`p-3 rounded-2xl max-w-md text-xs font-medium ${
                                isMe
                                  ? "bg-cyan-600 text-white rounded-tr-none shadow-md"
                                  : "bg-slate-900 border border-slate-700 text-slate-200 rounded-tl-none"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Nhập tin nhắn cho Staff/Admin..."
                      className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                    />
                    <button type="submit" className="px-5 py-2.5 rounded-xl gradient-btn font-bold text-xs text-white shadow-md flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" /> Gửi
                    </button>
                  </form>
                </div>

              </div>
              );
            })() : null}
          </div>

        </div>
      )}

      {/* VietQR Payment Checkout Launcher Modal */}
      {activeCheckoutOrder && (
        <PaymentCheckoutModal
          order={activeCheckoutOrder}
          onClose={() => setActiveCheckoutOrder(null)}
        />
      )}

      {/* Revision Request Modal */}
      {showRevisionModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b132e] border border-blue-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl text-slate-100">
            <button onClick={() => setShowRevisionModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-white text-lg">Nêu Chi Tiết Nội Dung Cần Chỉnh Sửa</h3>
            <textarea
              rows={4}
              value={revisionText}
              onChange={(e) => setRevisionText(e.target.value)}
              placeholder="Nêu rõ các mục cần thay đổi..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />
            <button
              onClick={() => {
                if (!revisionText.trim()) return;
                requestRevision(selectedOrder.id, revisionText.trim());
                setShowRevisionModal(false);
                setRevisionText("");
                alert("Đã gửi yêu cầu chỉnh sửa cho Staff!");
              }}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md"
            >
              Gửi Yêu Cầu Chỉnh Sửa
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b132e] border border-blue-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl text-slate-100">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-white text-lg">Đánh Giá Chất Lượng Dịch Vụ</h3>
            
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="p-1">
                  <Star className={`w-8 h-8 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Viết nhận xét của bạn về 4YouTech..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />

            <button
              onClick={() => {
                submitServiceReview(selectedOrder.id, rating, reviewComment);
                setShowReviewModal(false);
                alert("Cảm ơn bạn đã gửi đánh giá cho 4YouTech!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-extrabold text-xs text-white shadow-md"
            >
              Hoàn Tất Đánh Giá
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b132e] border border-blue-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl text-slate-100">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-white text-lg">Đề Nghị Hủy Đơn Hàng</h3>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Lý do đề nghị hủy..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />
            <button
              onClick={() => {
                requestCancellation(selectedOrder.id, cancelReason);
                setShowCancelModal(false);
                alert("Đã gửi đề nghị hủy. Admin sẽ xem xét và phản hồi!");
              }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs shadow-md"
            >
              Gửi Đề Nghị Hủy
            </button>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b132e] border border-blue-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl text-slate-100">
            <button onClick={() => setShowTicketModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-white text-lg">Gửi Yêu Cầu Hỗ Trợ / Khiếu Nại</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-200 mb-1">Loại yêu cầu</label>
                <select
                  value={ticketForm.type}
                  onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400"
                >
                  <option value="support" className="bg-[#0b132e] text-white">Hỗ trợ kỹ thuật sau bàn giao</option>
                  <option value="complaint" className="bg-[#0b132e] text-white">Gửi khiếu nại về tiến độ/chất lượng</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Tiêu đề yêu cầu..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">Nội dung chi tiết</label>
                <textarea
                  rows={3}
                  value={ticketForm.content}
                  onChange={(e) => setTicketForm({ ...ticketForm, content: e.target.value })}
                  placeholder="Mô tả cụ thể vấn đề..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!ticketForm.subject || !ticketForm.content) return;
                submitSupportTicket(selectedOrder.id, ticketForm.subject, ticketForm.content, ticketForm.type);
                setShowTicketModal(false);
                alert("Đã gửi Ticket hỗ trợ thành công!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-extrabold text-xs text-white shadow-md"
            >
              Gửi Ticket Hỗ Trợ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
