"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ServiceOrder, Milestone, SupportTicket } from "@/lib/store";
import {
  Wrench,
  CheckSquare,
  Clock,
  Upload,
  MessageSquare,
  Send,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  X,
  History,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  UserCheck
} from "lucide-react";

export function StaffView() {
  const {
    currentUser,
    orders,
    proposeWorkEstimate,
    updateMilestones,
    updateProgressPercent,
    uploadDeliverable,
    sendOrderMessage,
    resolveSupportTicket,
    sendOrderMessage: updateReqInfo
  } = useApp();

  // Staff sees orders assigned to them or unassigned pending evaluation
  const assignedOrders = orders.filter(
    (o) => o.assignedStaffId === currentUser.id || !o.assignedStaffId || o.collaborators?.includes(currentUser.name)
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(assignedOrders[0]?.id || null);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || assignedOrders[0];

  // Work Estimate form modal
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [estimateForm, setEstimateForm] = useState({ days: 3, price: 1000000, note: "" });

  // Upload Deliverable modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [delivForm, setDelivForm] = useState({ title: "", fileLink: "", previewUrl: "", notes: "" });

  // Milestones Manager state
  const [milestonesList, setMilestonesList] = useState<Milestone[]>(selectedOrder?.milestones || []);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");

  // Direct chat input
  const [chatInput, setChatInput] = useState("");

  // Additional info request modal
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoRequestText, setInfoRequestText] = useState("");

  // Support ticket resolve modal
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [ticketResponseText, setTicketResponseText] = useState("");

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedOrder) return;
    sendOrderMessage(selectedOrder.id, chatInput.trim());
    setChatInput("");
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle || !newMilestoneDate) return;
    const updated: Milestone[] = [
      ...milestonesList,
      {
        id: `m-${Date.now()}`,
        title: newMilestoneTitle,
        completed: false,
        targetDate: newMilestoneDate,
        updatedBy: currentUser.name
      }
    ];
    setMilestonesList(updated);
    if (selectedOrder) updateMilestones(selectedOrder.id, updated);
    setNewMilestoneTitle("");
    setNewMilestoneDate("");
  };

  const toggleMilestone = (milestoneId: string) => {
    const updated = milestonesList.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed, updatedBy: currentUser.name } : m
    );
    setMilestonesList(updated);
    if (selectedOrder) updateMilestones(selectedOrder.id, updated);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Staff Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
              Role: Staff Execution
            </span>
            <span className="text-xs text-slate-400">({currentUser.skills?.join(", ") || "IT / Design Specialization"})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Workbench Nhân Viên Thực Hiện</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="font-bold text-white">{currentUser.name}</div>
            <div className="text-slate-400">{currentUser.email}</div>
          </div>
          <img src={currentUser.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-purple-400" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Assigned Tasks List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đơn Hàng Phân Công ({assignedOrders.length})</span>
          
          {assignedOrders.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              Hiện chưa có nhiệm vụ nào được phân công.
            </div>
          ) : (
            assignedOrders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              const hasRevision = ord.status === "revision_requested";
              return (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setMilestonesList(ord.milestones || []);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-purple-50/80 border-purple-500 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{ord.id}</span>
                    {hasRevision && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                        Cần sửa đổi!
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{ord.serviceName}</div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Khách: {ord.customerName}</span>
                    <span className="font-semibold text-purple-600">{ord.progressPercent}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Execution Hub */}
        <div className="lg:col-span-8">
          {selectedOrder ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8 animate-fade-in">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{selectedOrder.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedOrder.serviceName}</h2>
                </div>

                {/* Toolbar Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowInfoModal(true)}
                    className="px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs transition flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Yêu cầu bổ sung thông tin
                  </button>

                  <button
                    onClick={() => {
                      setEstimateForm({
                        days: selectedOrder.serviceId.includes("portfolio") ? 5 : 3,
                        price: 1200000,
                        note: "Đề xuất phạm vi công việc chi tiết"
                      });
                      setShowEstimateModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 font-bold text-xs transition"
                  >
                    Đề xuất Khối lượng/Giá
                  </button>

                  <button
                    onClick={() => {
                      setDelivForm({ title: "", fileLink: "", previewUrl: "", notes: "" });
                      setShowUploadModal(true);
                    }}
                    className="px-4 py-2 rounded-xl gradient-btn font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Gửi Bản Thử / Deliverable
                  </button>
                </div>
              </div>

              {/* Requirements & Scope Inspector */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Yêu cầu từ Khách hàng & Phạm vi chốt</span>
                  <span className="text-xs text-slate-400">Hạn giao: {selectedOrder.desiredDeadline}</span>
                </div>
                <div className="text-xs text-slate-800 font-medium leading-relaxed">
                  {selectedOrder.requirements}
                </div>
                {selectedOrder.attachments && selectedOrder.attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">File/Link đính kèm: </span>
                    {selectedOrder.attachments.map((att, idx) => (
                      <a key={idx} href={att} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline ml-1">
                        [Link {idx + 1}]
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Milestones & Progress Percentage Tracker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Cập Nhật Mốc Công Việc & Tiến Độ</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">% Hoàn thành:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={selectedOrder.progressPercent}
                      onChange={(e) => updateProgressPercent(selectedOrder.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-2">
                  {milestonesList.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(m.id)}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={m.completed}
                          onChange={() => {}}
                          className="w-4 h-4 rounded-md accent-purple-600 cursor-pointer"
                        />
                        <span className={m.completed ? "line-through text-slate-400" : "font-bold text-slate-800"}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">Hạn: {m.targetDate}</span>
                    </div>
                  ))}

                  {/* Add Milestone Inline */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Tên mốc mới..."
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none"
                    />
                    <input
                      type="date"
                      value={newMilestoneDate}
                      onChange={(e) => setNewMilestoneDate(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none"
                    />
                    <button
                      onClick={handleAddMilestone}
                      className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                    >
                      + Thêm mốc
                    </button>
                  </div>
                </div>
              </div>

              {/* Revision Requests Handling */}
              {selectedOrder.revisions.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                    <span>Lịch Sử Yêu Cầu Chỉnh Sửa Từ Khách</span>
                    <span>{selectedOrder.revisions.length} phiên bản yêu cầu</span>
                  </div>
                  {selectedOrder.revisions.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white rounded-xl border border-rose-100 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-rose-800">
                        <span>Yêu cầu sửa v{rev.version}</span>
                        <span className="text-[10px] text-slate-400">{rev.requestedAt}</span>
                      </div>
                      <div className="text-slate-700">{rev.feedback}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Version Comparison & Archived Deliverables */}
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <History className="w-4 h-4 text-purple-600" /> Lưu Trữ Các Phiên Bản Bàn Giao ({selectedOrder.deliverables.length})
                  </h3>
                </div>

                {selectedOrder.deliverables.map((del) => (
                  <div key={del.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">v{del.version}: {del.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{del.notes}</div>
                    </div>
                    <a
                      href={del.fileLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition inline-flex items-center gap-1"
                    >
                      Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Support Tickets Assigned */}
              {selectedOrder.supportTickets.length > 0 && (
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  <h3 className="font-bold text-slate-900 text-sm">Ticket Hỗ Trợ Được Giao ({selectedOrder.supportTickets.length})</h3>
                  {selectedOrder.supportTickets.map((tkt) => (
                    <div key={tkt.id} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>[{tkt.type.toUpperCase()}] {tkt.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${tkt.status === "resolved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                          {tkt.status}
                        </span>
                      </div>
                      <div className="text-slate-700">{tkt.content}</div>

                      {tkt.response ? (
                        <div className="p-2.5 bg-white rounded-xl border border-amber-100 text-slate-800">
                          <span className="font-bold text-indigo-600">Phản hồi của Staff: </span>{tkt.response}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTicket(tkt);
                            setTicketResponseText("");
                          }}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Xử lý & Trả lời Ticket này
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Messages Section */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-600" /> Trao đổi trực tiếp với Khách Hàng
                </h3>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 max-h-64 overflow-y-auto">
                  {selectedOrder.messages.map((m) => {
                    const isMe = m.senderId === currentUser.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div className="text-[10px] text-slate-400 mb-0.5">
                          {m.senderName} ({m.senderRole}) • {m.createdAt}
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs max-w-md ${
                            isMe ? "bg-purple-600 text-white font-medium" : "bg-white text-slate-800 border border-slate-200"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhập phản hồi cho khách..."
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button type="submit" className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Gửi
                  </button>
                </form>
              </div>

            </div>
          ) : null}
        </div>

      </div>

      {/* Propose Work Estimate Modal */}
      {showEstimateModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowEstimateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Đề Xuất Khối Lượng & Giá Cho Admin</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số ngày ước tính (Ngày)</label>
                <input
                  type="number"
                  value={estimateForm.days}
                  onChange={(e) => setEstimateForm({ ...estimateForm, days: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đề xuất Báo giá VNĐ</label>
                <input
                  type="number"
                  value={estimateForm.price}
                  onChange={(e) => setEstimateForm({ ...estimateForm, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú chuyên môn cho Admin</label>
                <textarea
                  rows={3}
                  value={estimateForm.note}
                  onChange={(e) => setEstimateForm({ ...estimateForm, note: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                proposeWorkEstimate(selectedOrder.id, {
                  proposedDays: estimateForm.days,
                  proposedPrice: estimateForm.price,
                  note: estimateForm.note
                });
                setShowEstimateModal(false);
                alert("Đã gửi đề xuất công việc cho Admin duyệt báo giá!");
              }}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Gửi Đề Xuất Cho Admin
            </button>
          </div>
        </div>
      )}

      {/* Upload Deliverable Modal */}
      {showUploadModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowUploadModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Gửi Sản Phẩm Bàn Giao / Bản Thử</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề sản phẩm bàn giao *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bản Demo UI Figma v2 / Link Web Vercel"
                  value={delivForm.title}
                  onChange={(e) => setDelivForm({ ...delivForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link File bàn giao (Figma / Drive / Website test) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/..."
                  value={delivForm.fileLink}
                  onChange={(e) => setDelivForm({ ...delivForm, fileLink: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Ảnh xem trước (Preview Image URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={delivForm.previewUrl}
                  onChange={(e) => setDelivForm({ ...delivForm, previewUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú cho khách hàng</label>
                <textarea
                  rows={3}
                  value={delivForm.notes}
                  onChange={(e) => setDelivForm({ ...delivForm, notes: e.target.value })}
                  placeholder="Những điểm đã sửa hoặc lưu ý nghiệm thu..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!delivForm.title || !delivForm.fileLink) return;
                uploadDeliverable(selectedOrder.id, delivForm);
                setShowUploadModal(false);
                alert("Đã cập nhật bản bàn giao cho khách hàng!");
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs"
            >
              Gửi Sản Phẩm Ngay
            </button>
          </div>
        </div>
      )}

      {/* Info Request Modal */}
      {showInfoModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setShowInfoModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Yêu Cầu Khách Hàng Bổ Sung Thông Tin</h3>
            <textarea
              rows={4}
              value={infoRequestText}
              onChange={(e) => setInfoRequestText(e.target.value)}
              placeholder="Ghi rõ thông tin cần làm rõ (Ví dụ: Thiếu danh sách màn hình, chưa có file logo vector...)"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
            />
            <button
              onClick={() => {
                if (!infoRequestText.trim()) return;
                sendOrderMessage(selectedOrder.id, `[YÊU CẦU BỔ SUNG THÔNG TIN]: ${infoRequestText.trim()}`);
                setShowInfoModal(false);
                setInfoRequestText("");
                alert("Đã gửi yêu cầu bổ sung thông tin cho khách hàng!");
              }}
              className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-xs"
            >
              Gửi Yêu Cầu
            </button>
          </div>
        </div>
      )}

      {/* Resolve Support Ticket Modal */}
      {activeTicket && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-fade-in">
            <button onClick={() => setActiveTicket(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">Trả Lời & Xử Lý Support Ticket</h3>
            <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl">
              <span className="font-bold">{activeTicket.subject}:</span> {activeTicket.content}
            </div>

            <textarea
              rows={4}
              value={ticketResponseText}
              onChange={(e) => setTicketResponseText(e.target.value)}
              placeholder="Nhập phương án xử lý hoặc kết quả hỗ trợ..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
            />

            <button
              onClick={() => {
                if (!ticketResponseText.trim()) return;
                resolveSupportTicket(selectedOrder.id, activeTicket.id, ticketResponseText.trim());
                setActiveTicket(null);
                alert("Đã giải quyết Ticket thành công!");
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Xác Nhận Giải Quyết Ticket
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
