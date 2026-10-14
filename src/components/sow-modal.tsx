"use client";

import React from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  User,
  ShieldCheck,
  X,
  Printer,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { ServiceOrder } from "@/lib/store";

interface SowModalProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onViewPolicy?: () => void;
}

export function SowModal({ order, isOpen, onClose, onViewPolicy }: SowModalProps) {
  if (!isOpen || !order || !order.quotation) return null;

  const quote = order.quotation;
  const depositAmount = Math.round(quote.amount * 0.5);
  const remainingAmount = quote.amount - depositAmount;

  const defaultDeliverables = quote.deliverables && quote.deliverables.length > 0
    ? quote.deliverables
    : [
        `Gói thành phẩm ${order.serviceName} hoàn chỉnh theo yêu cầu`,
        "Toàn bộ tài liệu hướng dẫn sử dụng và bàn giao",
        "Source code / File thiết kế Vector độ phân giải cao"
      ];

  const defaultExclusions = quote.exclusions && quote.exclusions.length > 0
    ? quote.exclusions
    : [
        "Các yêu cầu thay đổi concept hoàn toàn mới sau khi đã duyệt Wireframe",
        "Chi phí mua bản quyền domain riêng hoặc hosting máy chủ ngoài gói",
        "Các tính năng vượt ngoài mô tả yêu cầu trong SOW"
      ];

  const defaultCriteria = quote.acceptanceCriteria && quote.acceptanceCriteria.length > 0
    ? quote.acceptanceCriteria
    : [
        "Sản phẩm đáp ứng đầy đủ các chức năng đã thỏa thuận",
        "Giao diện chuẩn responsive / Vector sắc nét không vỡ hạt",
        "Đầy đủ tài liệu và hướng dẫn bàn giao qua Transfer Session"
      ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-[#080e26] border border-blue-500/30 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* SOW Header */}
        <div className="p-5 sm:p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-[#0a163a] to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500/30">
                  MINH CHỨNG M2 • SOW CONTRACT
                </span>
                <span className="text-[11px] text-slate-400">Mã đơn: #{order.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                Bản Đặc Tả Phạm Vi Công Việc & Báo Giá (Scope of Work - SOW)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SOW Document Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* Order Meta Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-blue-500/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Khách Hàng</span>
              <div className="font-extrabold text-white text-xs mt-0.5">{order.customerName}</div>
              <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Dịch Vụ & Lead Staff</span>
              <div className="font-extrabold text-cyan-300 text-xs mt-0.5">{order.serviceName}</div>
              <div className="text-[11px] text-slate-400">
                Phụ trách: {quote.assignedLead || order.assignedStaffName || "Đội ngũ Kỹ thuật 4YouTech"}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Deadline Cam Kết</span>
              <div className="font-extrabold text-amber-300 text-xs mt-0.5">{quote.finalDeadline}</div>
              <div className="text-[11px] text-slate-400">Ngày lập: {quote.issuedAt}</div>
            </div>
          </div>

          {/* Deliverables Section */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 1. Sản Phẩm Bàn Giao Cụ Thể (Deliverables)
            </h4>
            <div className="space-y-1.5 pl-2">
              {defaultDeliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions Section */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
              <AlertCircle className="w-4 h-4 text-rose-400" /> 2. Phạm Vi Không Bao Gồm (Exclusions)
            </h4>
            <div className="space-y-1.5 pl-2">
              {defaultExclusions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-200">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Criteria Section */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Tiêu Chí Nghiệm Thu Định Lượng (Acceptance Criteria)
            </h4>
            <div className="space-y-1.5 pl-2">
              {defaultCriteria.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & 50-50 Payment Terms */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">Tổng Giá Trị Báo Giá Hợp Đồng</span>
                <div className="text-xl font-black text-white">{quote.amount.toLocaleString("vi-VN")} ₫</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Số Vòng Revision Trong Scope</span>
                <div className="text-sm font-extrabold text-amber-300">Tối đa {quote.maxRevisions} vòng</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-white block mb-0.5">Đợt 1: Đặt cọc 50% ({depositAmount.toLocaleString("vi-VN")} ₫)</strong>
                <span className="text-slate-400 text-[11px]">Thanh toán ngay khi xác nhận SOW để kích hoạt thực hiện dự án.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-emerald-400 block mb-0.5">Đợt 2: Nghiệm thu 50% ({remainingAmount.toLocaleString("vi-VN")} ₫)</strong>
                <span className="text-slate-400 text-[11px]">Chỉ thanh toán SAU KHI khách hàng hoàn tất kiểm thử UAT và ký biên bản.</span>
              </div>
            </div>
          </div>

          {/* Post-handover & Remedy Terms */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] space-y-1.5 text-slate-300">
            <div>
              <strong className="text-cyan-300">• Hỗ trợ kỹ thuật sau bàn giao:</strong> Cam kết hỗ trợ {quote.supportPeriodDays || 30} ngày sau khi hoàn tất nghiệm thu (sửa bug miễn phí, hỗ trợ deploy, chuyển giao công nghệ).
            </div>
            <div>
              <strong className="text-rose-300">• Chế tài bồi thường / khắc phục (Remedy - Điều 36 Luật BVQLNTD):</strong> {quote.remedyTerms || "Nếu trễ hạn quá 48h vì lỗi từ nhóm, giảm 15% tổng chi phí hoặc hoàn tiền cọc nếu vi phạm cam kết."}
            </div>
          </div>

        </div>

        {/* SOW Footer */}
        <div className="p-4 sm:p-5 border-t border-blue-500/20 bg-[#060b1e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>SOW là văn bản thỏa thuận chính thức giữa Khách hàng và 4YouTech.</span>
          </div>

          <div className="flex items-center gap-2.5">
            {onViewPolicy && (
              <button
                onClick={() => {
                  onClose();
                  onViewPolicy();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Chính Sách Bảo Vệ KH
              </button>
            )}

            <button
              onClick={() => {
                window.print();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> In / Tải SOW
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl gradient-btn font-extrabold text-xs shadow-md"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
