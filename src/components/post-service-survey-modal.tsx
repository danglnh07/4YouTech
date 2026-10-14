"use client";

import React, { useState } from "react";
import {
  Star,
  Sparkles,
  Heart,
  CheckCircle2,
  X,
  Send,
  HelpCircle,
  Award,
  Layers,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { ServiceOrder } from "@/lib/store";
import { useApp } from "@/lib/app-context";

interface PostServiceSurveyModalProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PostServiceSurveyModal({ order, isOpen, onClose }: PostServiceSurveyModalProps) {
  const { submitPostServiceSurvey } = useApp();

  const [q1, setQ1] = useState(5); // Scope clarity
  const [q2, setQ2] = useState(5); // Progress update
  const [q3, setQ3] = useState(5); // Deliverable quality
  const [q4, setQ4] = useState(5); // Revision handling
  const [q5, setQ5] = useState(5); // Transfer session
  const [q6, setQ6] = useState(5); // Overall satisfaction
  const [recommendIntent, setRecommendIntent] = useState(true);
  const [bestPoint, setBestPoint] = useState("");
  const [improvePoint, setImprovePoint] = useState("");

  // Optional SUS (System Usability Scale) toggle
  const [showSus, setShowSus] = useState(false);
  const [susAnswers, setSusAnswers] = useState<number[]>([4, 2, 4, 2, 4, 2, 4, 2, 4, 2]); // 10 items (1-5)

  if (!isOpen || !order) return null;

  // Calculate Brooke (1996) SUS Score (0 - 100)
  const calculateSusScore = () => {
    let scoreSum = 0;
    susAnswers.forEach((ans, idx) => {
      if (idx % 2 === 0) {
        // Odd items (1, 3, 5, 7, 9): score = ans - 1
        scoreSum += (ans - 1);
      } else {
        // Even items (2, 4, 6, 8, 10): score = 5 - ans
        scoreSum += (5 - ans);
      }
    });
    return Math.round(scoreSum * 2.5);
  };

  const susQuestions = [
    "1. Tôi nghĩ rằng mình sẽ muốn sử dụng hệ thống này thường xuyên.",
    "2. Tôi thấy hệ thống này phức tạp không cần thiết.",
    "3. Tôi thấy hệ thống dễ sử dụng.",
    "4. Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của một chuyên gia kỹ thuật để có thể sử dụng hệ thống này.",
    "5. Tôi thấy các chức năng khác nhau trong hệ thống này được tích hợp rất tốt.",
    "6. Tôi nghĩ rằng có quá nhiều sự thiếu nhất quán trong hệ thống này.",
    "7. Tôi tưởng tượng rằng hầu hết mọi người sẽ học cách sử dụng hệ thống này rất nhanh chóng.",
    "8. Tôi thấy hệ thống này rất cồng kềnh/bất tiện khi sử dụng.",
    "9. Tôi cảm thấy rất tự tin khi sử dụng hệ thống này.",
    "10. Tôi cần phải học rất nhiều điều trước khi có thể bắt đầu sử dụng hệ thống này."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const susScore = showSus ? calculateSusScore() : undefined;

    submitPostServiceSurvey(order.id, {
      q1_scopeClarity: q1,
      q2_progressUpdate: q2,
      q3_deliverableQuality: q3,
      q4_revisionHandling: q4,
      q5_transferSession: q5,
      q6_overallSatisfaction: q6,
      recommendIntent,
      bestPoint: bestPoint.trim() || undefined,
      improvePoint: improvePoint.trim() || undefined,
      susScore
    });

    alert("🎉 Cảm ơn bạn đã hoàn thành khảo sát chất lượng dịch vụ 4YouTech theo chuẩn ISO 10004:2018!");
    onClose();
  };

  const renderStarSelector = (value: number, setValue: (v: number) => void) => (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => setValue(star)}
          className="p-1 hover:scale-125 transition-transform"
        >
          <Star
            className={`w-4 h-4 ${
              star <= value ? "fill-amber-400 text-amber-400" : "text-slate-600 hover:text-slate-400"
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-bold text-amber-400 ml-1.5">{value}/5</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-[#070e28] border border-cyan-500/30 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-[#0a163a] to-cyan-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/30">
                  ISO 10004:2018 • USER EVALUATION
                </span>
                <span className="text-[11px] text-slate-400">Đơn hàng #{order.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                Khảo Sát Đánh Giá Chất Lượng Dịch Vụ Sau Nghiệm Thu
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

        {/* Survey Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          
          <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            Khảo sát này giúp 4YouTech đo lường chính xác các tiêu chí KPI chất lượng dịch vụ theo chuẩn ISO 10004:2018 và nâng cao trải nghiệm của khách hàng tiếp theo.
          </p>

          {/* 6 Standardized Criteria (Góp ý 2.4) */}
          <div className="space-y-3.5">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-white font-medium">1. Yêu cầu và phạm vi công việc được giải thích rõ ràng trước khi bắt đầu:</span>
              {renderStarSelector(q1, setQ1)}
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-white font-medium">2. Nhóm cập nhật tiến độ đủ để tôi biết dự án đang ở trạng thái nào:</span>
              {renderStarSelector(q2, setQ2)}
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-white font-medium">3. Sản phẩm bàn giao đáp ứng đúng mục tiêu đã thống nhất:</span>
              {renderStarSelector(q3, setQ3)}
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-white font-medium">4. Quá trình yêu cầu chỉnh sửa dễ hiểu và được xử lý phù hợp:</span>
              {renderStarSelector(q4, setQ4)}
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-white font-medium">5. Phiên chuyển giao (Transfer Session) giúp tôi hiểu/tự sử dụng sản phẩm:</span>
              {renderStarSelector(q5, setQ5)}
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-white font-medium">6. Tôi hài lòng với toàn bộ trải nghiệm làm việc với 4YouTech (CSAT):</span>
              {renderStarSelector(q6, setQ6)}
            </div>
          </div>

          {/* Q7: Recommendation Intent */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-extrabold text-white text-xs block">7. Bạn có sẵn sàng giới thiệu 4YouTech cho người khác không?</span>
              <span className="text-[11px] text-slate-400">Đo lường mức độ ủng hộ và niềm tin thương hiệu</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRecommendIntent(true)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  recommendIntent
                    ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Có, sẵn sàng!
              </button>
              <button
                type="button"
                onClick={() => setRecommendIntent(false)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  !recommendIntent
                    ? "bg-rose-600 text-white shadow-md font-black"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" /> Chưa sẵn sàng
              </button>
            </div>
          </div>

          {/* Open-Ended Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="block font-bold text-white text-xs">Điểm làm bạn hài lòng nhất:</label>
              <textarea
                rows={2}
                value={bestPoint}
                onChange={(e) => setBestPoint(e.target.value)}
                placeholder="Ví dụ: Giao đúng hạn, tư vấn nhiệt tình, sản phẩm rất đẹp..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-white text-xs">Điểm 4YouTech cần cải thiện nhất:</label>
              <textarea
                rows={2}
                value={improvePoint}
                onChange={(e) => setImprovePoint(e.target.value)}
                placeholder="Ví dụ: Bổ sung thêm hướng dẫn video, hỗ trợ in ấn trực tiếp..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-400 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Optional SUS (System Usability Scale) Accordion */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs block">
                  Đánh Giá Độ Khả Dụng Hệ Thống SUS (System Usability Scale - Brooke, 1996)
                </span>
                <span className="text-[11px] text-slate-400">Khuyến nghị cho dự án Website, Web App và Interactive Prototype</span>
              </div>

              <button
                type="button"
                onClick={() => setShowSus(!showSus)}
                className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold hover:bg-slate-700 transition"
              >
                {showSus ? "Ẩn SUS" : "Mở 10 Câu SUS (+)"}
              </button>
            </div>

            {showSus && (
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-blue-500/30 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-cyan-300">10 Câu Hỏi Tiêu Chuẩn SUS (1: Hoàn toàn không đồng ý &rarr; 5: Rất đồng ý)</span>
                  <span className="font-black text-amber-400">Điểm SUS ước tính: {calculateSusScore()}/100</span>
                </div>

                <div className="space-y-2.5 text-[11px]">
                  {susQuestions.map((q, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 rounded-lg bg-slate-950/70 border border-slate-850">
                      <span className="text-slate-300 font-medium">{q}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => {
                              const next = [...susAnswers];
                              next[idx] = val;
                              setSusAnswers(next);
                            }}
                            className={`w-6 h-6 rounded-md text-[10px] font-bold transition ${
                              susAnswers[idx] === val
                                ? "bg-cyan-500 text-slate-950 font-black shadow-xs"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Để Sau
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl gradient-btn font-black text-xs text-white shadow-lg flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Gửi Đánh Giá Của Bạn
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
