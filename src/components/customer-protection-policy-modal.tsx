"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  X,
  Scale,
  RefreshCw,
  BookOpen,
  Download,
  PhoneCall,
  Mail,
  ChevronRight,
  ArrowRight
} from "lucide-react";

interface CustomerProtectionPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSowDemo?: () => void;
}

export function CustomerProtectionPolicyModal({
  isOpen,
  onClose,
  onOpenSowDemo
}: CustomerProtectionPolicyModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "lifecycle" | "sow_revisions" | "uat_acceptance" | "support_remedy" | "complaint_sla"
  >("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-[#070d24] border border-cyan-500/30 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-[#0a1638] to-cyan-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/30">
                  MINH CHỨNG • POLICY V2.0
                </span>
                <span className="text-[11px] text-slate-400">Có hiệu lực từ 01/07/2024</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                CÍNH SÁCH BẢO VỆ QUYỀN LỢI KHÁCH HÀNG
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 sm:px-6 bg-[#040818] border-b border-blue-500/15 text-xs font-bold shrink-0 scrollbar-none">
          {[
            { id: "overview", label: "Cơ Sở Pháp Lý & Tiêu Chuẩn" },
            { id: "lifecycle", label: "Vòng Đời Dịch Vụ 12 Bước" },
            { id: "sow_revisions", label: "SOW & Chính Sách Revision" },
            { id: "uat_acceptance", label: "Nghiệm Thu UAT & Cọc 50-50" },
            { id: "support_remedy", label: "Hỗ Trợ Sau Bàn Giao & Remedy" },
            { id: "complaint_sla", label: "Quy Trình Khiếu Nại SLA 3 Ngày" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition text-[11px] sm:text-xs font-bold ${activeTab === tab.id
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">

          {/* TAB 1: OVERVIEW & LEGAL FOUNDATION */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/30 space-y-2">
                <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4" /> Cam Kết Đồng Hành Vững Chắc — Xóa Bỏ Tư Duy "Miễn Trừ Trách Nhiệm"
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  4YouTech cam kết thiết lập cơ chế bảo vệ quyền lợi khách hàng minh bạch từ khâu tiếp nhận yêu cầu, sản xuất, kiểm thử đến sau bàn giao. Chúng tôi bãi bỏ hoàn toàn các điều khoản "miễn trừ trách nhiệm kết thúc sau bàn giao", thay thế bằng <strong>Quy trình hỗ trợ kỹ thuật có cam kết (Post-handover Support)</strong> và <strong>Cơ chế khắc phục (Remedy Framework)</strong> tuân thủ pháp luật Việt Nam và tiêu chuẩn quốc tế.
                </p>
              </div>

              {/* Legal Foundations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/25 space-y-2.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs">
                    <Scale className="w-4 h-4" />
                    <span>Luật BVQLNTD Số 19/2023/QH15</span>
                  </div>
                  <div className="text-xs space-y-2 text-slate-300">
                    <div>
                      <strong className="text-white">Điều 31 (Giải quyết khiếu nại):</strong> 4YouTech tổ chức tiếp nhận phản ánh đa kênh và cam kết <span className="text-amber-300 font-bold">thông báo việc tiếp nhận trong vòng tối đa 03 ngày làm việc</span>.
                    </div>
                    <div>
                      <strong className="text-white">Điều 36 (Biện pháp khắc phục):</strong> Quy định rõ ràng các biện pháp khi dịch vụ không đúng cam kết: cung cấp lại dịch vụ, giảm chi phí phần chưa đạt, hoặc hoàn trả tiền cọc/toàn bộ theo thỏa thuận.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/25 space-y-2.5">
                  <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>Tiêu Chuẩn ISO & Bằng Chứng Học Thuật</span>
                  </div>
                  <div className="text-xs space-y-2 text-slate-300">
                    <div>
                      <strong className="text-white">ISO 10002:2018:</strong> Hướng dẫn quy trình xử lý khiếu nại mở, hiệu quả, dễ tiếp cận và được chuẩn hóa bằng Ticket Log minh bạch.
                    </div>
                    <div>
                      <strong className="text-white">Tax, Brown & Chandrashekaran (1998):</strong> Khẳng định chất lượng xử lý khiếu nại (complaint handling) là cốt lõi xây dựng niềm tin (Trust) và cam kết gắn bó (Commitment) của khách hàng.
                    </div>
                    <div>
                      <strong className="text-white">ISO 10004:2018 & Anderson & Sullivan (1993):</strong> Đo lường sự hài lòng khách hàng định kỳ làm động lực cải tiến chất lượng và thúc đẩy repurchase/advocacy.
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Pillars of Protection */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
                  4 Trụ Cột Bảo Vệ Quyền Lợi Khách Hàng Tại 4YouTech:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">1. Scope of Work (SOW) Định Lượng:</strong> Có văn bản SOW ghi rõ Deliverables, Exclusions (không bao gồm), Deadlines và Tiêu chí nghiệm thu trước khi thu cọc.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">2. Thanh Toán 50-50 An Toàn:</strong> Đặt cọc 50% để triển khai; 50% còn lại chỉ thu SAU KHI khách hàng hoàn tất UAT và ký biên bản nghiệm thu.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">3. Hỗ Trợ Kỹ Thuật 14 - 30 Ngày:</strong> Không bao giờ bỏ rơi khách hàng sau bàn giao; sửa bug miễn phí, hỗ trợ deploy và tổ chức Transfer Session.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">4. Khiếu Nại Minh Bạch SLA 3 Ngày:</strong> Mọi phản ánh đều được cấp Ticket ID, xác nhận trong 3 ngày và có chế tài đền bù/hoàn tiền rõ ràng.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICE LIFECYCLE 12 STEPS */}
          {activeTab === "lifecycle" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  Quy Trình Dịch Vụ Toàn Diện 12 Bước
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Được thiết kế bao phủ từ khi tiếp nhận đến bảo vệ quyền lợi sau bàn giao.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { step: "01", title: "Request", desc: "Khách hàng gửi yêu cầu ban đầu qua Website/Cart/Form." },
                  { step: "02", title: "Requirement & Integrity Check", desc: "Rà soát tính khả thi kỹ thuật, thời hạn và chuẩn mực liêm chính học thuật." },
                  { step: "03", title: "Scope of Work & Quotation (M2)", desc: "Gửi báo giá kèm văn bản SOW chi tiết deliverables, exclusions và acceptance criteria." },
                  { step: "04", title: "Deposit (50%)", desc: "Khách hàng xác nhận SOW và chuyển cọc 50% qua VietQR hoặc VNPay." },
                  { step: "05", title: "Production", desc: "Phân công Lead Staff thực hiện, cập nhật tiến độ % liên tục qua Workspace." },
                  { step: "06", title: "Internal QC Checklist", desc: "Kiểm định chất lượng nội bộ bởi Admin/Team Lead trước khi gửi khách." },
                  { step: "07", title: "Customer UAT (Kiểm Thử M3)", desc: "Khách dùng thử bản demo, rà soát tính năng, mỹ thuật và tương thích." },
                  { step: "08", title: "Revision (Trong Scope)", desc: "Xử lý các vòng chỉnh sửa theo đúng quy định cam kết trong SOW." },
                  { step: "09", title: "Acceptance Sign-off", desc: "Khách hàng hoàn tất UAT và ký xác nhận biên bản nghiệm thu điện tử." },
                  { step: "10", title: "Final Payment (50%) & Handover", desc: "Thanh toán 50% còn lại để nhận bàn giao toàn bộ mã nguồn / vector gốc." },
                  { step: "11", title: "Transfer Session", desc: "Phiên hướng dẫn 1-1, bàn giao video recording và tài liệu hướng dẫn vận hành." },
                  { step: "12", title: "Post-handover Support & CSAT", desc: "Hỗ trợ sửa bug 14-30 ngày và thực hiện khảo sát hài lòng ISO 10004 & SUS." }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/70 border border-blue-500/20 flex items-start gap-3 hover:border-cyan-400/40 transition"
                  >
                    <span className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-black text-xs flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SOW & REVISION POLICY */}
          {activeTab === "sow_revisions" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-sm">
                  1. Văn Bản Phạm Vi Công Việc
                </h3>
                <p className="text-xs text-slate-300">
                  Mỗi đơn hàng tại 4YouTech đều được thiết lập SOW chính thức đính kèm báo giá, bao gồm các cấu phần bắt buộc:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-400">Sản phẩm bàn giao:</strong> Liệt kê cụ thể từng file, định dạng, độ phân giải hoặc source code sẽ bàn giao.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-rose-400">Phạm vi không bao gồm:</strong> Nêu rõ những gì không nằm trong gói để tránh hiểu lầm và ngăn ngừa Scope Creep.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-amber-400">Thời hạn và các mốc quan trọng:</strong> Thời hạn cam kết theo từng mốc công việc và chế tài xử lý nếu xảy ra trễ hạn.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-emerald-400">ATiêu chí nghiệm thu:</strong> Các tiêu chuẩn định lượng để đo lường việc hoàn thành đạt yêu cầu.
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h3 className="font-extrabold text-white text-sm">
                  2. Quy Định Vòng Chỉnh Sửa
                </h3>
                <ul className="space-y-2 text-xs list-disc pl-5 text-slate-300">
                  <li>
                    <strong className="text-white">Số vòng revisioan nằm trong scope:</strong> Tùy theo gói dịch vụ (thông thường từ 2 đến 4 vòng) được quy định rõ trong SOW.
                  </li>
                  <li>
                    <strong className="text-white">Phạm vi revision hợp lệ:</strong> Tinh chỉnh màu sắc, font chữ, bố cục, sửa lỗi bug kỹ thuật hoặc căn chỉnh tỷ lệ theo đúng yêu cầu ban đầu.
                  </li>
                  <li>
                    <strong className="text-white">Yêu cầu ngoài scope:</strong> Trường hợp thay đổi concept hoàn toàn mới hoặc phát sinh thêm màn hình/tính năng chưa có trong SOW ban đầu, nhóm sẽ báo giá bổ sung và xác nhận thời gian trước khi thực hiện.
                  </li>
                  <li>
                    <strong className="text-white">Thời gian hoàn thiện revision:</strong> Cam kết hoàn thành trong vòng 24 - 48 giờ làm việc kể từ khi nhận phản hồi chi tiết từ khách hàng.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: UAT & 50-50 PAYMENT */}
          {activeTab === "uat_acceptance" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                <div className="font-extrabold text-sm flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-4 h-4" /> Nguyên Tắc Vàng Về Thu Tiền 50% Còn Lại
                </div>
                <p className="leading-relaxed">
                  4YouTech <strong className="text-white">CHỈ THU 50% CHI PHÍ CÒN LẠI</strong> sau khi khách hàng đã hoàn tất quá trình kiểm thử (Customer UAT) và tự nguyện xác nhận ký <strong>Biên bản nghiệm thu (Acceptance Form)</strong>. Tuyệt đối không ép khách thanh toán khi chất lượng sản phẩm chưa đạt cam kết.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-extrabold text-white text-sm">
                  Quy Trình Kiểm Thử Chấp Nhận Của Người Dùng
                </h3>
                <p className="text-xs text-slate-300">
                  Khách hàng kiểm tra deliverable theo 4 nhóm tiêu chí chuẩn mực:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300">1. Tiêu chí Chức Năng :</span>
                    <p className="text-[11px] text-slate-400">Các nút bấm, form nhập liệu, đường dẫn liên kết và logic hệ thống hoạt động chính xác.</p>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-purple-300">2. Tiêu chí Mỹ Thuật :</span>
                    <p className="text-[11px] text-slate-400">Màu sắc, tỷ lệ chữ, khoảng cách, phong cách thiết kế đúng theo bản vẽ Figma hoặc moodboard đã duyệt.</p>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300">3. Tiêu chí Tương Thích :</span>
                    <p className="text-[11px] text-slate-400">Hiển thị chuẩn responsive trên Mobile/Tablet/Desktop hoặc mở file định dạng AI/PSD/PDF không lỗi font.</p>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-300">4. Tiêu chí Tài Liệu :</span>
                    <p className="text-[11px] text-slate-400">Có đầy đủ tài liệu hướng dẫn vận hành, link source code và video hướng dẫn sử dụng.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: POST-HANDOVER SUPPORT & REMEDIES */}
          {activeTab === "support_remedy" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Chính Sách Hỗ Trợ Kỹ Thuật Sau Bàn Giao
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thay vì dùng thuật ngữ "bảo hành" chung chung, 4YouTech định nghĩa rõ ràng phạm vi đồng hành hỗ trợ sau khi nghiệm thu:
                </p>
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-2 text-xs">
                  <div><strong className="text-white">• Thời hạn hỗ trợ:</strong> Từ <strong>14 đến 30 ngày</strong> kể từ thời điểm bàn giao chính thức (tùy gói dịch vụ).</div>
                  <div><strong className="text-white">• Phạm vi hỗ trợ:</strong> Sửa lỗi phát sinh (bug fix) nằm trong scope ban đầu, hỗ trợ deploy lên Vercel/Netlify, hướng dẫn cấu hình DNS tên miền, hỗ trợ xuất thêm định dạng file thiết kế.</div>
                  <div><strong className="text-white">• Kênh tiếp nhận:</strong> Ticket trực tuyến trên Workspace, Hotline khẩn cấp và Email hỗ trợ chính thức.</div>
                  <div><strong className="text-white">• Phiên Transfer Session:</strong> Tổ chức buổi hướng dẫn 1-on-1 qua Google Meet hoặc bàn giao video ghi hình độc quyền để khách hàng hoàn toàn làm chủ sản phẩm.</div>
                </div>
              </div>

              {/* Remedy Framework - Điều 36 Luật BVQLNTD */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2 text-rose-300">
                  <Scale className="w-4 h-4 text-rose-400" />
                  Cơ Chế Bồi Thường & Khắc Phục (Remedy Framework - Điều 36 Luật BVQLNTD)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Khi dịch vụ cung cấp không đúng nội dung đã công bố hoặc cam kết trong SOW:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">1. Làm lại miễn phí</strong>
                    Nhóm thực hiện lại phần việc chưa đạt yêu cầu mà không tính vào số vòng revision và không thu thêm bất kỳ phụ phí nào.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block mb-1">2. Giảm trừ chi phí</strong>
                    Nếu giao trễ hạn quá 48h vì lỗi từ nhóm hoặc một hạng mục phụ không hoàn thành được, giảm trực tiếp 15% - 30% giá trị hợp đồng.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-rose-400 block mb-1">3. Chấm dứt & Hoàn tiền</strong>
                    Nếu vi phạm nghiêm trọng cam kết tiến độ/chất lượng mà không khắc phục được, hoàn trả 100% tiền đặt cọc hoặc số tiền đã nhận.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COMPLAINT SLA & ISO 10002 */}
          {activeTab === "complaint_sla" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <h3 className="font-extrabold text-white text-sm">
                  Quy Trình Xử Lý Khiếu Nại 6 Bước Chuẩn ISO 10002:2018
                </h3>
                <p className="text-xs text-slate-300">
                  Mọi phản ánh, khiếu nại của khách hàng đều được xử lý công bằng, minh bạch và có truy vết:
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Bước 1: Tiếp nhận phản ánh</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Khách hàng gửi Ticket qua Workspace, Hotline hoặc Email.</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-cyan-400 font-bold">Tự động cấp Ticket ID</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-300">Bước 2: Thông báo tiếp nhận (Cam kết SLA)</span>
                      <p className="text-[11px] text-slate-300 mt-0.5">Xác nhận đã nhận khiếu nại trong <strong className="text-white">&le; 03 ngày làm việc</strong> (Tuân thủ Điều 31 Luật BVQLNTD).</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold">&le; 3 ngày làm việc</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Bước 3: Phân loại & Rà soát nguyên nhân</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Đánh giá theo SOW, lịch sử chat, phiên bản bàn giao và log hệ thống.</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">12 - 24 giờ</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Bước 4: Đề xuất phương án khắc phục (Remedy)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Áp dụng một trong các biện pháp: sửa bug miễn phí, làm lại, giảm phí hoặc hoàn tiền.</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-bold">Điều 36 Luật BVQLNTD</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Bước 5: Thực thi & Bàn giao kết quả khắc phục</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Triển khai xử lý dứt điểm và thông báo chính thức cho khách hàng.</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">Trong 24-48 giờ</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-300">Bước 6: Đóng Ticket & Đánh giá hài lòng xử lý</span>
                      <p className="text-[11px] text-slate-300 mt-0.5">Khách hàng chấm điểm hài lòng với cách xử lý khiếu nại (1-5 sao theo Tax et al., 1998).</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">Đóng Ticket</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-blue-500/20 bg-[#060b1e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-400 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Mọi giao dịch và đơn hàng tại 4YouTech đều được bảo vệ tự động theo chính sách này.</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenSowDemo && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSowDemo();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" /> Xem Mẫu Báo Giá SOW (M2)
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl gradient-btn font-extrabold text-xs shadow-md"
            >
              Tôi Đã Hiểu & Đồng Ý
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
