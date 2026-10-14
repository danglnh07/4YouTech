"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Star,
  Sparkles,
  Printer,
  X,
  Send,
  ShieldCheck,
  Check,
  PenTool
} from "lucide-react";
import { ServiceOrder, UatCheckItem } from "@/lib/store";
import { useApp } from "@/lib/app-context";

interface UatAcceptanceModalProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestRevision?: (feedback: string) => void;
  onOpenCheckoutRemaining?: () => void;
}

export function UatAcceptanceModal({
  order,
  isOpen,
  onClose,
  onRequestRevision,
  onOpenCheckoutRemaining
}: UatAcceptanceModalProps) {
  const { signoffAcceptance, submitUatChecklist } = useApp();

  const initialItems: UatCheckItem[] = order?.uatSubmission?.items || [
    {
      id: "u1",
      category: "functional",
      criteria: "Chức năng hệ thống hoạt động đầy đủ, không phát sinh lỗi chặn (blocker)",
      passed: true
    },
    {
      id: "u2",
      category: "visual",
      criteria: "Giao diện, màu sắc, font chữ và mỹ thuật đúng theo bản vẽ/yêu cầu đã thống nhất",
      passed: true
    },
    {
      id: "u3",
      category: "compatibility",
      criteria: "Tương thích tốt trên các thiết bị (Mobile/Tablet/Desktop) hoặc định dạng file mở chuẩn xác",
      passed: true
    },
    {
      id: "u4",
      category: "documentation",
      criteria: "Đầy đủ tài liệu bàn giao, liên kết mã nguồn / vector gốc và video hướng dẫn vận hành",
      passed: true
    }
  ];

  const [items, setItems] = useState<UatCheckItem[]>(initialItems);
  const [bugNotes, setBugNotes] = useState("");
  const [signerName, setSignerName] = useState(order?.customerName || "");
  const [rating, setRating] = useState(5);
  const [signoffComment, setSignoffComment] = useState("");
  const [isSignoffMode, setIsSignoffMode] = useState(false);

  if (!isOpen || !order) return null;

  const allPassed = items.every((i) => i.passed);
  const failedCount = items.filter((i) => !i.passed).length;
  const isAlreadySigned = order.uatSubmission?.acceptanceSignoff?.confirmed;

  const handleToggleItem = (id: string) => {
    if (isAlreadySigned) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, passed: !item.passed } : item))
    );
  };

  const handleSaveChecklist = () => {
    submitUatChecklist(order.id, items, bugNotes);
    alert("Đã lưu kết quả kiểm thử UAT thành công!");
  };

  const handleSendRevision = () => {
    const failedDescriptions = items
      .filter((i) => !i.passed)
      .map((i) => `• ${i.criteria}`)
      .join("\n");
    const fullFeedback = `Các tiêu chí UAT chưa đạt:\n${failedDescriptions}\n\nGhi chú thêm: ${bugNotes || "Cần điều chỉnh theo yêu cầu"}`;
    if (onRequestRevision) {
      onRequestRevision(fullFeedback);
    }
    onClose();
  };

  const handleCompleteSignoff = () => {
    if (!signerName.trim()) {
      alert("Vui lòng nhập tên người ký biên bản nghiệm thu!");
      return;
    }
    signoffAcceptance(order.id, signerName.trim(), rating, signoffComment);
    submitUatChecklist(order.id, items, signoffComment);
    alert("🎉 Đã ký Biên Bản Nghiệm Thu (Acceptance Sign-off) thành công! Bạn có thể thanh toán 50% còn lại để nhận bàn giao chính thức.");
    onClose();
    if (onOpenCheckoutRemaining) {
      setTimeout(() => onOpenCheckoutRemaining(), 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-[#070e28] border border-emerald-500/30 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/80 via-[#091b35] to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/30">
                  MINH CHỨNG M3 • UAT & ACCEPTANCE FORM
                </span>
                <span className="text-[11px] text-slate-400">Đơn hàng #{order.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                Phiếu Kiểm Thử UAT & Biên Bản Nghiệm Thu Điện Tử
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

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* Order Summary Ribbon */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Dịch Vụ</span>
              <div className="font-extrabold text-white text-sm mt-0.5">{order.serviceName}</div>
              <div className="text-slate-400 text-[11px]">Người kiểm thử: {order.customerName}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Trạng thái UAT</span>
                <span className={`font-black text-xs ${allPassed ? "text-emerald-400" : "text-amber-400"}`}>
                  {allPassed ? "Đạt Tất Cả Tiêu Chí" : `Còn ${failedCount} Mục Cần Sửa`}
                </span>
              </div>
              {isAlreadySigned && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã Ký Nghiệm Thu
                </div>
              )}
            </div>
          </div>

          {/* UAT Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Bảng Tiêu Chí Kiểm Thử Người Dùng (UAT Checklist)
              </h4>
              <span className="text-[11px] text-slate-400">Click vào tiêu chí để đổi trạng thái Đạt / Chưa Đạt</span>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                    item.passed
                      ? "bg-slate-900/80 border-emerald-500/30 hover:border-emerald-400/50"
                      : "bg-rose-950/20 border-rose-500/30 hover:border-rose-400/50"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                      item.passed
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 border border-rose-500/50 text-rose-400"
                    }`}
                  >
                    {item.passed ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[2]" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs">
                        {idx + 1}. {item.criteria}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          item.passed
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-950 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {item.passed ? "ĐẠT" : "CẦN SỬA"}
                      </span>
                    </div>

                    {item.note && (
                      <div className="text-[11px] text-rose-300 italic mt-1">Ghi chú: {item.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bug / Feedback Notes Box */}
          <div className="space-y-1.5">
            <label className="block font-bold text-white text-xs">
              Ghi Chú Kiểm Thử & Lỗi Phát Hiện (Nếu Có)
            </label>
            <textarea
              rows={2}
              value={bugNotes}
              onChange={(e) => setBugNotes(e.target.value)}
              placeholder="Nhập chi tiết các lỗi cần điều chỉnh hoặc ghi chú thêm cho Staff..."
              disabled={isAlreadySigned}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />
          </div>

          {/* Acceptance Sign-off Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-2 text-emerald-300">
                <PenTool className="w-4 h-4" /> Biên Bản Nghiệm Thu Bàn Giao Điện Tử (Acceptance Sign-off)
              </div>
              <span className="text-[10px] text-slate-400">Có giá trị mở khóa thanh toán 50%</span>
            </div>

            {isAlreadySigned ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Đã Ký Bởi: {order.uatSubmission?.acceptanceSignoff?.signedName}
                </div>
                <div className="text-[11px] text-slate-300">
                  Thời gian ký: {order.uatSubmission?.acceptanceSignoff?.signedAt}
                </div>
                <div className="text-[11px] text-slate-300">
                  Đánh giá nghiệm thu: {order.uatSubmission?.acceptanceSignoff?.ratingSatisfaction}/5 sao
                </div>
                {order.uatSubmission?.acceptanceSignoff?.comment && (
                  <div className="italic text-[11px] text-slate-400 pt-1">
                    "{order.uatSubmission?.acceptanceSignoff?.comment}"
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Bằng việc ký xác nhận biên bản này, bạn xác nhận đã kiểm thử đầy đủ và hài lòng với chất lượng sản phẩm bàn giao. Đơn hàng sẽ đủ điều kiện chuyển sang bước thanh toán 50% còn lại.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Họ Tên Người Ký Nghiệm Thu *</label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Đánh Giá Độ Hài Lòng</label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">{rating}/5 sao</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Lời Nhận Xét Khi Nghiệm Thu</label>
                  <input
                    type="text"
                    value={signoffComment}
                    onChange={(e) => setSignoffComment(e.target.value)}
                    placeholder="Sản phẩm rất đẹp, đúng tiến độ và yêu cầu..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-emerald-500/20 bg-[#060b1e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> In Biên Bản UAT
          </button>

          <div className="flex items-center gap-2.5">
            {!allPassed && (
              <button
                onClick={handleSendRevision}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Yêu Cầu Chỉnh Sửa ({failedCount} Lỗi)
              </button>
            )}

            {!isAlreadySigned ? (
              <button
                onClick={handleCompleteSignoff}
                disabled={!allPassed}
                className={`px-5 py-2 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 transition ${
                  allPassed
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Ký Xác Nhận Nghiệm Thu (Sign-off)
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl gradient-btn font-extrabold text-xs shadow-md"
              >
                Đóng
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
