"use client";

import React, { useState } from "react";
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  Scale,
  Send,
  Star,
  Plus,
  Filter,
  Check,
  ChevronRight,
  ExternalLink,
  X
} from "lucide-react";
import { SupportTicket, TicketCategory, TicketPriority, RemedyType, ServiceOrder } from "@/lib/store";
import { useApp } from "@/lib/app-context";

interface SupportTicketsManagementProps {
  orders: ServiceOrder[];
  currentUserRole: "customer" | "staff" | "admin";
  onOpenCreateTicket?: (orderId: string) => void;
}

export function SupportTicketsManagement({
  orders,
  currentUserRole,
  onOpenCreateTicket
}: SupportTicketsManagementProps) {
  const { acknowledgeSupportTicket, applyTicketRemedy, resolveSupportTicket, rateComplaintResolution } = useApp();

  const [filterType, setFilterType] = useState<"all" | "support" | "complaint">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "acknowledged" | "resolved">("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Remedy Modal State
  const [remedyModalTicket, setRemedyModalTicket] = useState<{ orderId: string; ticket: SupportTicket } | null>(null);
  const [selectedRemedyType, setSelectedRemedyType] = useState<RemedyType>("free_fix");
  const [remedyDetailsText, setRemedyDetailsText] = useState("");
  const [responseText, setResponseText] = useState("");

  // Gather all tickets across provided orders
  const allTicketsWithOrder: Array<{ order: ServiceOrder; ticket: SupportTicket }> = [];
  orders.forEach((ord) => {
    (ord.supportTickets || []).forEach((t) => {
      allTicketsWithOrder.push({ order: ord, ticket: t });
    });
  });

  // Filtered list
  const filteredList = allTicketsWithOrder.filter(({ ticket }) => {
    if (filterType !== "all" && ticket.type !== filterType) return false;
    if (filterStatus !== "all") {
      if (filterStatus === "open" && ticket.status !== "open") return false;
      if (filterStatus === "acknowledged" && ticket.status !== "acknowledged" && ticket.status !== "investigating" && ticket.status !== "processing") return false;
      if (filterStatus === "resolved" && ticket.status !== "resolved") return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold">Mới tiếp nhận</span>;
      case "acknowledged":
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">Đã xác nhận trong SLA 3 ngày</span>;
      case "investigating":
      case "processing":
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-bold">Đang xử lý remedy</span>;
      case "resolved":
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">Đã giải quyết</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">{status}</span>;
    }
  };

  const getCategoryLabel = (category?: TicketCategory) => {
    switch (category) {
      case "technical_bug": return "Lỗi Kỹ Thuật";
      case "scope_dispute": return "Bất Đồng Scope";
      case "deadline_delay": return "Trễ Hạn Tiến Độ";
      case "post_handover": return "Hỗ Trợ Sau Bàn Giao";
      case "quality_issue": return "Chất Lượng Chưa Đạt";
      default: return "Hỗ Trợ Chung";
    }
  };

  const getRemedyLabel = (remedy?: RemedyType) => {
    switch (remedy) {
      case "free_fix": return "Sửa lỗi / Bảo trì miễn phí (Free Fix)";
      case "redo_work": return "Làm lại hạng mục chưa đạt (Redo Work)";
      case "fee_discount": return "Giảm trừ chi phí hợp đồng (Fee Discount)";
      case "partial_refund": return "Hoàn một phần tiền cọc (Partial Refund)";
      case "full_refund": return "Hủy hợp đồng & Hoàn tiền 100% (Full Refund)";
      case "guidance": return "Bổ sung hướng dẫn & Transfer 1-1";
      default: return "";
    }
  };

  const handleApplyRemedySubmit = () => {
    if (!remedyModalTicket) return;
    if (!responseText.trim()) {
      alert("Vui lòng nhập nội dung giải pháp / phản hồi chính thức cho khách hàng!");
      return;
    }
    applyTicketRemedy(
      remedyModalTicket.orderId,
      remedyModalTicket.ticket.id,
      selectedRemedyType,
      remedyDetailsText || getRemedyLabel(selectedRemedyType),
      responseText.trim()
    );
    alert("Đã áp dụng biện pháp khắc phục (Remedy) và gửi phản hồi thành công!");
    setRemedyModalTicket(null);
    setRemedyDetailsText("");
    setResponseText("");
  };

  return (
    <div className="space-y-6">

      {/* Top Banner: Legal & ISO Compliance */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Quy Trình Tiếp Nhận & Xử Lý Khiếu Nại</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
            Tuân thủ Điều 31 & 36 Luật BVQLNTD • ISO 10002:2018
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Mọi phản ánh đều được cam kết <strong className="text-white">xác nhận tiếp nhận trong vòng tối đa 03 ngày làm việc</strong>. Trường hợp dịch vụ cung cấp không đúng thỏa thuận trong SOW, 4YouTech lập tức kích hoạt cơ chế <strong>Khắc phục & Bồi thường (Remedy)</strong> bao gồm: làm lại miễn phí, giảm trừ phí, hoặc chấm dứt hoàn tiền.
        </p>
      </div>

      {/* Control Bar: Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Type */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: "all", label: `Tất cả (${allTicketsWithOrder.length})` },
              { id: "complaint", label: "Khiếu nại" },
              { id: "support", label: "Hỗ trợ sau bàn giao" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${filterType === f.id
                    ? "bg-cyan-500 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filter Status */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: "all", label: "Mọi trạng thái" },
              { id: "open", label: "Chờ xác nhận SLA" },
              { id: "acknowledged", label: "Đang xử lý" },
              { id: "resolved", label: "Đã giải quyết" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${filterStatus === f.id
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {currentUserRole === "customer" && onOpenCreateTicket && orders.length > 0 && (
          <button
            onClick={() => onOpenCreateTicket(orders[0]?.id)}
            className="px-4 py-2 rounded-xl gradient-btn font-extrabold text-xs shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Gửi Yêu Cầu Mới
          </button>
        )}
      </div>

      {/* Tickets List */}
      {filteredList.length === 0 ? (
        <div className="p-8 dark-glass-card rounded-2xl border border-slate-800 text-center space-y-2">
          <LifeBuoy className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="font-bold text-slate-300 text-xs">Không có Ticket hỗ trợ / khiếu nại nào phù hợp</div>
          <p className="text-[11px] text-slate-500">Mọi tương tác và yêu cầu bảo vệ quyền lợi đều được lưu vết đầy đủ.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map(({ order, ticket }) => {
            const isSelected = selectedTicketId === ticket.id;
            return (
              <div
                key={ticket.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition space-y-3"
              >
                {/* Ticket Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
                      #{ticket.id}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{ticket.subject}</span>
                    <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {getCategoryLabel(ticket.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(ticket.status)}
                    <span className="text-[10px] text-slate-400">{ticket.createdAt}</span>
                  </div>
                </div>

                {/* Ticket Meta Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500">Đơn hàng:</span>{" "}
                    <strong className="text-slate-300">#{order.id} ({order.serviceName})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Khách hàng:</span>{" "}
                    <strong className="text-slate-300">{ticket.customerName} ({ticket.customerEmail})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Hạn xác nhận SLA (3 ngày):</span>{" "}
                    <strong className="text-amber-300">{ticket.slaAcknowledgeDeadline || "Trong 3 ngày làm việc"}</strong>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-200">
                  "{ticket.content}"
                </div>

                {/* Remedy Details If Applied (Điều 36) */}
                {ticket.remedyType && (
                  <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 text-xs space-y-1">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-purple-400" />
                      Biện pháp khắc phục đã áp dụng (Remedy - Điều 36):
                    </div>
                    <div className="text-white font-medium pl-5">{getRemedyLabel(ticket.remedyType)}</div>
                    {ticket.remedyDetails && (
                      <div className="text-[11px] text-slate-300 pl-5 italic">Chi tiết: {ticket.remedyDetails}</div>
                    )}
                  </div>
                )}

                {/* Official Response */}
                {ticket.response && (
                  <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-500/30 text-xs space-y-1">
                    <div className="font-bold text-cyan-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        Phản hồi từ {ticket.assignedStaffName || "4YouTech Support"}:
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">{ticket.resolvedAt}</span>
                    </div>
                    <div className="text-slate-200 pl-5">{ticket.response}</div>
                  </div>
                )}

                {/* Customer Complaint Satisfaction Rating (Tax et al., 1998) */}
                {ticket.status === "resolved" && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px]">Đánh giá cách xử lý khiếu nại (Tax et al., 1998):</span>
                    {ticket.customerSatisfactionRating ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= ticket.customerSatisfactionRating! ? "fill-amber-400 text-amber-400" : "text-slate-700"
                              }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-amber-400 ml-1">
                          {ticket.customerSatisfactionRating}/5 sao
                        </span>
                      </div>
                    ) : currentUserRole === "customer" ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-300 font-bold text-[11px]">Chấm điểm xử lý:</span>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              rateComplaintResolution(order.id, ticket.id, s);
                              alert(`Cảm ơn bạn đã chấm điểm ${s} sao cho cách xử lý khiếu nại của nhóm!`);
                            }}
                            className="p-1 hover:scale-125 transition-transform"
                          >
                            <Star className="w-4 h-4 text-slate-600 hover:text-amber-400 hover:fill-amber-400" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Khách chưa chấm điểm</span>
                    )}
                  </div>
                )}

                {/* Staff / Admin Actions Bar */}
                {(currentUserRole === "admin" || currentUserRole === "staff") && ticket.status !== "resolved" && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    {ticket.status === "open" && (
                      <button
                        onClick={() => {
                          acknowledgeSupportTicket(order.id, ticket.id);
                          alert("Đã xác nhận tiếp nhận khiếu nại tuân thủ SLA <= 3 ngày làm việc (Điều 31 Luật BVQLNTD)!");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Xác Nhận Tiếp Nhận (SLA Điều 31)
                      </button>
                    )}

                    <button
                      onClick={() => setRemedyModalTicket({ orderId: order.id, ticket })}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Scale className="w-3.5 h-3.5" /> Áp Dụng Remedy & Khắc Phục (Điều 36)
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Apply Remedy Modal */}
      {remedyModalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#080f2d] border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-extrabold text-white text-sm flex items-center gap-2 text-purple-300">
                <Scale className="w-4 h-4 text-purple-400" />
                Áp Dụng Biện Pháp Khắc Phục (Remedy - Điều 36)
              </div>
              <button onClick={() => setRemedyModalTicket(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Chọn Biện Pháp Khắc Phục (Remedy Type)</label>
                <select
                  value={selectedRemedyType}
                  onChange={(e) => setSelectedRemedyType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-purple-400"
                >
                  <option value="free_fix">1. Sửa lỗi / Bảo trì miễn phí (Không tính lượt revision)</option>
                  <option value="redo_work">2. Làm lại hạng mục chưa đạt tiêu chuẩn SOW</option>
                  <option value="fee_discount">3. Giảm trừ chi phí hợp đồng (15% - 30%)</option>
                  <option value="partial_refund">4. Hoàn trả một phần tiền cọc</option>
                  <option value="full_refund">5. Chấm dứt hợp đồng & Hoàn tiền 100%</option>
                  <option value="guidance">6. Bổ sung tài liệu & Phiên chuyển giao 1-1</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Mô Tả Chi Tiết Biện Pháp Khắc Phục</label>
                <input
                  type="text"
                  value={remedyDetailsText}
                  onChange={(e) => setRemedyDetailsText(e.target.value)}
                  placeholder="Ví dụ: Đã bổ sung 3 icon SVG còn thiếu vào link Google Drive..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Nội Dung Phản Hồi Chính Thức Gửi Khách Hàng *</label>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Chào bạn, 4YouTech đã tiếp nhận và xử lý dứt điểm vấn đề..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setRemedyModalTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyRemedySubmit}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Xác Nhận Giải Quyết & Đóng Ticket
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
