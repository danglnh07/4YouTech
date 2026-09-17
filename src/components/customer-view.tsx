"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ServiceOrder } from "@/lib/store";
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
  QrCode
} from "lucide-react";

export function CustomerView({ preselectedServiceId }: { preselectedServiceId?: string }) {
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

  const [activeTab, setActiveTab] = useState<"orders" | "new_request" | "profile">("orders");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(myOrders[0]?.id || null);

  // VietQR Payment Modal Launcher
  const [activeCheckoutOrder, setActiveCheckoutOrder] = useState<ServiceOrder | null>(null);

  // New Request Form state
  const [newForm, setNewForm] = useState({
    serviceId: preselectedServiceId || services[0]?.id || "",
    requirements: "",
    attachment: "",
    desiredDeadline: "",
    customerName: currentUser.name || "",
    customerEmail: currentUser.email || "",
    customerPhone: currentUser.phone || ""
  });

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
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    phone: currentUser.phone || "",
    avatar: currentUser.avatar || ""
  });
  const [profileMsg, setProfileMsg] = useState("");

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || myOrders[0];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.requirements || !newForm.desiredDeadline) {
      alert("Vui lòng nhập đầy đủ mô tả yêu cầu và thời hạn mong muốn.");
      return;
    }
    const created = createServiceRequest({
      serviceId: newForm.serviceId,
      requirements: newForm.requirements,
      attachments: newForm.attachment ? [newForm.attachment] : [],
      desiredDeadline: newForm.desiredDeadline,
      customerName: newForm.customerName,
      customerEmail: newForm.customerEmail,
      customerPhone: newForm.customerPhone
    });
    alert(`Đã gửi yêu cầu thành công! Mã đơn: ${created.id}`);
    setSelectedOrderId(created.id);
    setActiveTab("orders");
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
      deposit_pending: { title: "Chờ đặt cọc", color: "status-deposit_pending" },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Customer Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Xin chào, {currentUser.name}!</h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "orders" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Đơn hàng ({myOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("new_request")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "new_request" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Đặt Dịch Vụ Mới
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "profile" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hồ sơ cá nhân
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl mx-auto space-y-6">
          <h2 className="text-xl font-black text-slate-900">Cập nhật Hồ Sơ Khách Hàng</h2>
          {profileMsg && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium">{profileMsg}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Link</label>
              <input
                type="text"
                value={profileForm.avatar}
                onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <button
              onClick={() => {
                updateUserProfile(currentUser.id, profileForm);
                setProfileMsg("Đã lưu thay đổi hồ sơ thành công!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md"
            >
              Lưu Thông Tin Hồ Sơ
            </button>
          </div>
        </div>
      )}

      {/* New Request Tab */}
      {activeTab === "new_request" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Tạo Yêu Cầu Dịch Vụ Mới</h2>
            <p className="text-xs text-slate-500 mt-1">Vui lòng điền thông tin chi tiết để Admin & Staff lập báo giá chính xác.</p>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chọn gói dịch vụ *</label>
              <select
                value={newForm.serviceId}
                onChange={(e) => setNewForm({ ...newForm, serviceId: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    [{srv.category}] {srv.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết yêu cầu & đầu ra mong muốn *</label>
              <textarea
                rows={4}
                required
                value={newForm.requirements}
                onChange={(e) => setNewForm({ ...newForm, requirements: e.target.value })}
                placeholder="Ví dụ: Cần làm website portfolio 5 trang phong cách tối giản màu tím neon, có trang giới thiệu kỹ năng và danh mục dự án đồ án môn Lập trình Web..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Link file đính kèm (Figma / Drive / Tham khảo nếu có)</label>
              <input
                type="url"
                value={newForm.attachment}
                onChange={(e) => setNewForm({ ...newForm, attachment: e.target.value })}
                placeholder="https://drive.google.com/file/..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Thời hạn mong muốn hoàn thành *</label>
              <input
                type="date"
                required
                value={newForm.desiredDeadline}
                onChange={(e) => setNewForm({ ...newForm, desiredDeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên người gửi</label>
                <input
                  type="text"
                  value={newForm.customerName}
                  onChange={(e) => setNewForm({ ...newForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại Zalo</label>
                <input
                  type="tel"
                  value={newForm.customerPhone}
                  onChange={(e) => setNewForm({ ...newForm, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-xl gradient-btn font-bold text-xs shadow-md mt-4">
              Gửi Yêu Cầu & Nhận Báo Giá
            </button>
          </form>
        </div>
      )}

      {/* Orders Workspace */}
      {activeTab === "orders" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh sách Đơn hàng</span>
            {myOrders.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">Chưa có đơn hàng nào</div>
                <button
                  onClick={() => setActiveTab("new_request")}
                  className="mt-3 text-xs font-bold text-indigo-600 underline"
                >
                  Tạo yêu cầu đầu tiên ngay
                </button>
              </div>
            ) : (
              myOrders.map((ord) => {
                const stInfo = statusLabel(ord.status);
                const isSelected = selectedOrder?.id === ord.id;
                const canPay = ["quoted", "deposit_pending"].includes(ord.status);
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{ord.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stInfo.color}`}>
                        {stInfo.title}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{ord.serviceName}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{ord.createdAt}</span>
                      {canPay ? (
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <QrCode className="w-3 h-3" /> Cần đặt cọc
                        </span>
                      ) : (
                        <span className="font-semibold text-indigo-600">{ord.progressPercent}% hoàn thành</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Order Hub */}
          <div className="lg:col-span-8">
            {selectedOrder ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8 animate-fade-in">
                
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{selectedOrder.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusLabel(selectedOrder.status).color}`}>
                        {statusLabel(selectedOrder.status).title}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mt-1">{selectedOrder.serviceName}</h2>
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

                    {selectedOrder.status === "deliverable_sent" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowRevisionModal(true)}
                          className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition"
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
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                        >
                          Nghiệm Thu Sản Phẩm
                        </button>
                      </div>
                    )}

                    {selectedOrder.status === "accepted" && (
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
                      className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-50 border border-slate-200"
                      title="Gửi hỗ trợ / Khiếu nại"
                    >
                      <LifeBuoy className="w-4 h-4" />
                    </button>

                    {["submitted", "quoted", "deposit_pending"].includes(selectedOrder.status) && (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-slate-200"
                        title="Đề nghị hủy đơn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Milestones Stepper */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Tiến độ thực hiện: {selectedOrder.progressPercent}%</span>
                    <span>Hạn giao dự kiến: {selectedOrder.quotation?.finalDeadline || selectedOrder.desiredDeadline}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
                      style={{ width: `${selectedOrder.progressPercent}%` }}
                    ></div>
                  </div>

                  {/* Milestones list */}
                  {selectedOrder.milestones.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {selectedOrder.milestones.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 text-xs">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span className={m.completed ? "font-semibold text-slate-800" : "text-slate-500"}>
                            {m.title} ({m.targetDate})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quotation & VietQR Payment Trigger Details */}
                {selectedOrder.quotation && (
                  <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Thông tin Báo Giá từ Admin</span>
                      <span className="text-base font-black text-indigo-700">
                        {selectedOrder.quotation.amount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="text-xs text-indigo-950 font-medium leading-relaxed">
                      {selectedOrder.quotation.scopeDetails}
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-indigo-100 gap-2">
                      <div className="text-indigo-800 font-medium">
                        Đã thanh toán: <span className="font-bold">{selectedOrder.paymentInfo?.amountPaid ? `${selectedOrder.paymentInfo.amountPaid.toLocaleString("vi-VN")} ₫` : "0 ₫"}</span>
                      </div>
                      
                      {["quoted", "deposit_pending"].includes(selectedOrder.status) && (
                        <button
                          onClick={() => setActiveCheckoutOrder(selectedOrder)}
                          className="px-4 py-2 rounded-xl gradient-btn font-bold text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Thanh Toán VietQR Tự Động
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Deliverables Hub Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">Sản Phẩm & Bản Thử Bàn Giao ({selectedOrder.deliverables.length})</h3>
                  </div>

                  {selectedOrder.deliverables.length === 0 ? (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      Nhóm thực hiện chưa gửi sản phẩm thử. Chúng tôi sẽ cập nhật sớm!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedOrder.deliverables.map((del) => (
                        <div key={del.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              Phiên bản v{del.version}: {del.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{del.timestamp}</span>
                          </div>

                          {del.previewUrl && (
                            <img src={del.previewUrl} alt="preview" className="h-40 w-full object-cover rounded-xl border border-slate-200" />
                          )}

                          <div className="text-xs text-slate-600 font-medium">{del.notes}</div>

                          <div className="flex items-center gap-3 pt-1">
                            <a
                              href={del.fileLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs"
                            >
                              <Download className="w-3.5 h-3.5" /> Tải về / Xem Link
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Messages & Chat Box */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" /> Trao đổi với Nhóm Thực Hiện
                  </h3>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 max-h-72 overflow-y-auto">
                    {selectedOrder.messages.length === 0 ? (
                      <div className="text-center text-xs text-slate-400 py-4">Chưa có tin nhắn nào</div>
                    ) : (
                      selectedOrder.messages.map((m) => {
                        const isMe = m.senderId === currentUser.id;
                        return (
                          <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className="text-[10px] text-slate-400 mb-0.5">
                              {m.senderName} ({m.senderRole}) • {m.createdAt}
                            </div>
                            <div
                              className={`p-3 rounded-2xl text-xs max-w-md ${
                                isMe ? "bg-indigo-600 text-white font-medium" : "bg-white text-slate-800 border border-slate-200"
                              }`}
                            >
                              {m.text}
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
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="px-4 py-2.5 rounded-xl gradient-btn font-bold text-xs flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" /> Gửi
                    </button>
                  </form>
                </div>

              </div>
            ) : null}
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowRevisionModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Nêu Chi Tiết Nội Dung Cần Chỉnh Sửa</h3>
            <textarea
              rows={4}
              value={revisionText}
              onChange={(e) => setRevisionText(e.target.value)}
              placeholder="Nêu rõ các mục cần thay đổi..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
            />
            <button
              onClick={() => {
                if (!revisionText.trim()) return;
                requestRevision(selectedOrder.id, revisionText.trim());
                setShowRevisionModal(false);
                setRevisionText("");
                alert("Đã gửi yêu cầu chỉnh sửa cho Staff!");
              }}
              className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Gửi Yêu Cầu Chỉnh Sửa
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Đánh Giá Chất Lượng Dịch Vụ</h3>
            
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="p-1">
                  <Star className={`w-8 h-8 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Viết nhận xét của bạn về 4YouTech..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
            />

            <button
              onClick={() => {
                submitServiceReview(selectedOrder.id, rating, reviewComment);
                setShowReviewModal(false);
                alert("Cảm ơn bạn đã gửi đánh giá cho 4YouTech!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs"
            >
              Hoàn Tất Đánh Giá
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Đề Nghị Hủy Đơn Hàng</h3>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Lý do đề nghị hủy..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
            />
            <button
              onClick={() => {
                requestCancellation(selectedOrder.id, cancelReason);
                setShowCancelModal(false);
                alert("Đã gửi đề nghị hủy. Admin sẽ xem xét và phản hồi!");
              }}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Gửi Đề Nghị Hủy
            </button>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowTicketModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Gửi Yêu Cầu Hỗ Trợ / Khiếu Nại</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại yêu cầu</label>
                <select
                  value={ticketForm.type}
                  onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="support">Hỗ trợ kỹ thuật sau bàn giao</option>
                  <option value="complaint">Gửi khiếu nại về tiến độ/chất lượng</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Tiêu đề yêu cầu..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết</label>
                <textarea
                  rows={3}
                  value={ticketForm.content}
                  onChange={(e) => setTicketForm({ ...ticketForm, content: e.target.value })}
                  placeholder="Mô tả cụ thể vấn đề..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
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
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs"
            >
              Gửi Ticket Hỗ Trợ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
