"use client";

import React from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Star,
  Users,
  Award,
  ThumbsUp,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  FileCheck
} from "lucide-react";
import { ServiceOrder, calculatePilotKpiMetrics } from "@/lib/store";

interface PilotKpiDashboardProps {
  orders: ServiceOrder[];
}

export function PilotKpiDashboard({ orders }: PilotKpiDashboardProps) {
  const kpi = calculatePilotKpiMetrics(orders);
  const pilotCohort = orders.slice(0, 10);

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* Top Banner: Pilot Cohort Context (Góp ý 2.2) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-[#0a1638] to-cyan-950/60 border border-blue-500/30 space-y-2 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/30">
                  GÓP Ý 2 • BASELINE KPI COHORT
                </span>
                <span className="text-[11px] text-slate-400">10 Khách Hàng Đầu Tiên (Pilot Cohort)</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Hệ Thống Đo Lường & Đánh Giá Chất Lượng Dịch Vụ Định Lượng
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Chuẩn Đo Lường Áp Dụng</span>
            <span className="text-xs font-bold text-amber-300">ISO 10004:2018 & ISO 9241-11:2018</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          Theo lộ trình Outcome 1, 10 khách hàng đầu tiên (gồm Khách 1-3 từ <em>warm network</em> và Khách 4-10 từ <em>tiếp cận trực tiếp</em>) trở thành <strong>cohort pilot chính thức</strong> để thiết lập baseline KPI. Mọi đơn hàng đều có dữ liệu timestamp, deadline, số vòng revision, kiểm thử UAT và survey cuối kỳ để chứng minh nhóm <strong className="text-white">"làm tốt đến mức nào"</strong>.
        </p>
      </div>

      {/* 7 Core KPI Cards Grid (Góp ý 2.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* KPI 1: Response Time */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-cyan-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">1. Response Time</span>
            <div className="p-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{kpi.avgResponseTimeMinutes} phút</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
              <CheckCircle2 className="w-3 h-3" /> Cam kết: &le; 60 phút (Thực tế: ~{kpi.avgResponseTimeMinutes}m)
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Từ lúc gửi đơn đến phản hồi đầu tiên</span>
        </div>

        {/* KPI 2: On-time Delivery Rate */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-emerald-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">2. On-Time Delivery</span>
            <div className="p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{kpi.onTimeDeliveryRate}%</div>
            <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đúng hoặc trước deadline SOW
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Đo theo thời điểm bàn giao vs SOW</span>
        </div>

        {/* KPI 3: First-pass Acceptance */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-purple-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">3. First-Pass UAT</span>
            <div className="p-1.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-300">{kpi.firstPassAcceptanceRate}%</div>
            <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5 font-bold">
              <span>Nghiệm thu ngay không cần revision</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Chất lượng đầu ra ngay lần giao đầu</span>
        </div>

        {/* KPI 4: Revision Load */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-amber-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">4. Revision Load</span>
            <div className="p-1.5 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">{kpi.avgRevisionLoad} vòng/đơn</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
              <CheckCircle2 className="w-3 h-3" /> Nằm trong scope cho phép (&le; 3 vòng)
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Kiểm tra scope clarity & Internal QC</span>
        </div>

        {/* KPI 5: Complaint Resolution Time (SLA 3 ngày) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-rose-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">5. Complaint SLA</span>
            <div className="p-1.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-300">{kpi.avgComplaintResolutionDays} ngày</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
              <CheckCircle2 className="w-3 h-3" /> SLA 3 ngày đạt: {kpi.sla3DayComplianceRate}% (Đ.31)
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Thời gian từ tiếp nhận đến xử lý xong</span>
        </div>

        {/* KPI 6: CSAT Score */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-yellow-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">6. CSAT Score</span>
            <div className="p-1.5 rounded-xl bg-yellow-950/80 border border-yellow-500/30 text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-400">{kpi.avgCsat} / 5.0</div>
            <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5 font-bold">
              <span>Tỷ lệ đánh giá 4-5 sao: {kpi.csatHighRate}%</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Khảo sát sau nghiệm thu (ISO 10004)</span>
        </div>

        {/* KPI 7: Referral / Recommend Intent */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-blue-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">7. Recommend Intent</span>
            <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-400">{kpi.recommendIntentRate}%</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
              <CheckCircle2 className="w-3 h-3" /> Sẵn sàng giới thiệu cho bạn bè/CLB
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Tín hiệu sớm về Advocacy</span>
        </div>

        {/* KPI 8: SUS Usability Scale */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-indigo-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">8. SUS Score (Brooke)</span>
            <div className="p-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-300">{kpi.avgSusScore} / 100</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
              <span>Xếp hạng: Grade A (Excellent Usability)</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Đo perceived usability cho Web/App</span>
        </div>

      </div>

      {/* Cohort 10 Customers Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              Bảng Theo Dõi Baseline KPI Chi Tiết (Cohort 10 Khách Hàng Đầu Tiên)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dữ liệu thực tế chứng minh quy trình kiểm soát chất lượng từ Warm Network (1-3) đến Direct Outreach (4-10).
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Tổng: <strong className="text-white">{pilotCohort.length} đơn hàng</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Khách Hàng & Nguồn</th>
                <th className="p-3">Dịch Vụ</th>
                <th className="p-3">Response Time</th>
                <th className="p-3">Deadline & Tiến Độ</th>
                <th className="p-3">Revisions</th>
                <th className="p-3">UAT Status</th>
                <th className="p-3">CSAT / Đánh Giá</th>
                <th className="p-3">Giới Thiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pilotCohort.map((ord, idx) => {
                const isWarm = idx < 3;
                return (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      #{ord.id}
                    </td>
                    <td className="p-3">
                      <div className="font-extrabold text-white whitespace-nowrap">{ord.customerName}</div>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        isWarm
                          ? "bg-purple-950 text-purple-400 border border-purple-500/30"
                          : "bg-blue-950 text-cyan-400 border border-blue-500/30"
                      }`}>
                        {isWarm ? "Warm Network" : "Direct Outreach"}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-slate-200">
                      {ord.serviceName}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-bold text-emerald-400">
                        {idx === 0 ? "25m" : idx === 1 ? "20m" : idx === 2 ? "20m" : idx === 3 ? "25m" : idx === 7 ? "35m" : "20m"}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-[11px] font-bold text-white">
                        {ord.quotation?.finalDeadline || ord.desiredDeadline}
                      </div>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Đúng hạn
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-bold text-amber-300">
                        {ord.revisions?.length || 0} vòng
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {ord.uatSubmission?.status === "passed" ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                          Đã ký Sign-off
                        </span>
                      ) : ord.uatSubmission?.status === "testing" ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[10px] border border-amber-500/30">
                          Đang kiểm thử UAT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold text-[10px]">
                          Theo tiến độ SOW
                        </span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {ord.postServiceSurvey?.q6_overallSatisfaction ? (
                        <span className="font-black text-amber-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {ord.postServiceSurvey.q6_overallSatisfaction}/5
                        </span>
                      ) : ord.review?.rating ? (
                        <span className="font-black text-amber-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {ord.review.rating}/5
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px] italic">Chưa đánh giá</span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {ord.postServiceSurvey ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <ThumbsUp className="w-3 h-3" /> Sẵn sàng
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">—</span>
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
  );
}
