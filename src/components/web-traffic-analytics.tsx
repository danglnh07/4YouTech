"use client";

import React, { useState } from "react";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Calendar,
  Sparkles,
  Filter,
  BarChart3,
  LineChart,
  Clock,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Download
} from "lucide-react";

export interface DailyTrafficData {
  dateStr: string;      // "01/10"
  fullDate: string;     // "01/10/2026"
  visits: number;       // 12 .. 50 .. 16
  pageviews: number;
  uniqueVisitors: number;
  bounceRate: number;   // %
  avgTime: string;      // "2m 45s"
  isPeak: boolean;      // true for 07/10 - 10/10
  note?: string;
}

export const sampleTrafficData: DailyTrafficData[] = [
  { dateStr: "01/10", fullDate: "01/10/2026", visits: 12, pageviews: 28, uniqueVisitors: 10, bounceRate: 45, avgTime: "2m 15s", isPeak: false, note: "Bắt đầu ghi nhận" },
  { dateStr: "02/10", fullDate: "02/10/2026", visits: 15, pageviews: 34, uniqueVisitors: 13, bounceRate: 42, avgTime: "2m 30s", isPeak: false },
  { dateStr: "03/10", fullDate: "03/10/2026", visits: 19, pageviews: 42, uniqueVisitors: 16, bounceRate: 40, avgTime: "2m 50s", isPeak: false },
  { dateStr: "04/10", fullDate: "04/10/2026", visits: 24, pageviews: 55, uniqueVisitors: 21, bounceRate: 38, avgTime: "3m 10s", isPeak: false },
  { dateStr: "05/10", fullDate: "05/10/2026", visits: 31, pageviews: 70, uniqueVisitors: 27, bounceRate: 35, avgTime: "3m 25s", isPeak: false },
  { dateStr: "06/10", fullDate: "06/10/2026", visits: 39, pageviews: 86, uniqueVisitors: 34, bounceRate: 32, avgTime: "3m 45s", isPeak: false, note: "Lan tỏa qua CLB sinh viên" },
  { dateStr: "07/10", fullDate: "07/10/2026", visits: 48, pageviews: 108, uniqueVisitors: 42, bounceRate: 28, avgTime: "4m 10s", isPeak: true, note: "🚀 Tăng tốc đợt Pilot Cohort" },
  { dateStr: "08/10", fullDate: "08/10/2026", visits: 50, pageviews: 116, uniqueVisitors: 45, bounceRate: 26, avgTime: "4m 35s", isPeak: true, note: "🔥 ĐỈNH CAO NHẤT (50 lượt)" },
  { dateStr: "09/10", fullDate: "09/10/2026", visits: 50, pageviews: 114, uniqueVisitors: 44, bounceRate: 27, avgTime: "4m 20s", isPeak: true, note: "🔥 ĐỈNH CAO NHẤT (50 lượt)" },
  { dateStr: "10/10", fullDate: "10/10/2026", visits: 49, pageviews: 110, uniqueVisitors: 43, bounceRate: 29, avgTime: "4m 05s", isPeak: true, note: "Duy trì đỉnh cao điểm" },
  { dateStr: "11/10", fullDate: "11/10/2026", visits: 42, pageviews: 94, uniqueVisitors: 38, bounceRate: 33, avgTime: "3m 50s", isPeak: false, note: "Bắt đầu hạ nhiệt dần" },
  { dateStr: "12/10", fullDate: "12/10/2026", visits: 34, pageviews: 76, uniqueVisitors: 30, bounceRate: 36, avgTime: "3m 30s", isPeak: false, note: "Hạ dần sau đợt đăng ký" },
  { dateStr: "13/10", fullDate: "13/10/2026", visits: 26, pageviews: 59, uniqueVisitors: 23, bounceRate: 39, avgTime: "3m 15s", isPeak: false },
  { dateStr: "14/10", fullDate: "14/10/2026", visits: 20, pageviews: 45, uniqueVisitors: 18, bounceRate: 42, avgTime: "2m 55s", isPeak: false },
  { dateStr: "15/10", fullDate: "15/10/2026", visits: 16, pageviews: 36, uniqueVisitors: 14, bounceRate: 44, avgTime: "2m 40s", isPeak: false, note: "Ổn định vận hành" }
];

export function WebTrafficAnalytics({
  isCompact = false,
  onViewDetails
}: {
  isCompact?: boolean;
  onViewDetails?: () => void;
}) {
  const [chartMode, setChartMode] = useState<"line" | "bar">("line");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "peak" | "cooling">("all");
  const [hoveredDay, setHoveredDay] = useState<DailyTrafficData | null>(null);

  // Compute metrics
  const totalVisits = sampleTrafficData.reduce((acc, d) => acc + d.visits, 0);
  const totalPageviews = sampleTrafficData.reduce((acc, d) => acc + d.pageviews, 0);
  const totalUnique = sampleTrafficData.reduce((acc, d) => acc + d.uniqueVisitors, 0);
  const avgBounceRate = Math.round(sampleTrafficData.reduce((acc, d) => acc + d.bounceRate, 0) / sampleTrafficData.length);
  const peakVisits = Math.max(...sampleTrafficData.map((d) => d.visits)); // 50

  // Filtered dataset for table or view
  const displayData = sampleTrafficData.filter((d) => {
    if (filterPeriod === "peak") return d.isPeak;
    if (filterPeriod === "cooling") return ["11/10", "12/10", "13/10", "14/10", "15/10"].includes(d.dateStr);
    return true;
  });

  // SVG Chart Geometry
  const width = 860;
  const height = 240;
  const padX = 40;
  const padY = 30;
  const maxVal = 55; // Max scale above 50

  const points = sampleTrafficData.map((d, index) => {
    const x = padX + (index / (sampleTrafficData.length - 1)) * (width - padX * 2);
    const y = height - padY - (d.visits / maxVal) * (height - padY * 2);
    return { x, y, data: d };
  });

  // Smooth SVG path using cubic bezier curve
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x},${height - padY} L ${points[0].x},${height - padY} Z`
    : "";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs select-none">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  Thống Kê Lượt Truy Cập Website
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  01/10 – 15/10/2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dữ liệu mẫu chu kỳ chiến dịch Pilot: Giai đoạn <strong className="text-amber-600">07/10 – 10/10 đạt đỉnh 50 lượt</strong>, sau đó hạ dần và ổn định.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Chart Mode Toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setChartMode("line")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                chartMode === "line"
                  ? "bg-white text-cyan-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Biểu đồ đường mượt"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Đường</span>
            </button>
            <button
              onClick={() => setChartMode("bar")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                chartMode === "bar"
                  ? "bg-white text-cyan-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Biểu đồ cột"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cột</span>
            </button>
          </div>

          {onViewDetails && isCompact && (
            <button
              onClick={onViewDetails}
              className="px-3.5 py-2 rounded-xl bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-bold text-xs flex items-center gap-1 transition"
            >
              <span>Xem chi tiết</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Tổng lượt truy cập</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalVisits.toLocaleString("vi-VN")} <span className="text-xs font-bold text-slate-400 font-normal">lượt</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>TB: {Math.round(totalVisits / 15)} lượt/ngày</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Đỉnh cao nhất (Peak)</span>
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {peakVisits} <span className="text-xs font-bold text-amber-700/70 font-normal">lượt/ngày</span>
          </div>
          <div className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Giai đoạn 07/10 – 10/10</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Tổng lượt xem trang</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalPageviews.toLocaleString("vi-VN")} <span className="text-xs font-bold text-slate-400 font-normal">pageviews</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Tỷ lệ ~{(totalPageviews / totalVisits).toFixed(1)} trang/lượt
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Tỷ lệ thoát (Bounce Rate)</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {avgBounceRate}%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Thời gian trên trang: 3m 42s</span>
          </div>
        </div>
      </div>

      {/* Campaign Peak Banner Announcement */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 text-white border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-cyan-300">
              Điểm Nhấn: Giai đoạn đỉnh điểm (07/10 – 10/10) đạt 50 lượt/ngày
            </div>
            <div className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              Chiến dịch kích hoạt Pilot Cohort thu hút đông đảo sinh viên FPT Cần Thơ truy cập đặt dịch vụ đồ án & thiết kế. Sau ngày 10/10, lượt truy cập hạ dần xuống mức 16–20 lượt/ngày theo đúng chu kỳ đặt hàng.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs">
            Tăng +316% so với ngày 01/10
          </span>
        </div>
      </div>

      {/* MAIN VISUAL CHART SECTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
            Biểu đồ xu hướng: Tăng vọt lên 50 (ngày 7-10) và hạ dần về ngày 15
          </span>
          <span className="text-[11px] text-slate-400">
            Rê chuột vào điểm để xem thông số chi tiết từng ngày
          </span>
        </div>

        <div className="relative bg-slate-950 rounded-2xl p-4 sm:p-6 overflow-hidden border border-slate-800 shadow-inner">
          
          {/* SVG Canvas */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-48 sm:h-64 overflow-visible font-sans"
            >
              <defs>
                {/* Cyan Gradient for Area */}
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                </linearGradient>

                {/* Peak Highlight Zone Pattern */}
                <linearGradient id="peakBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
                </linearGradient>

                <linearGradient id="normalBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-axis labels */}
              {[10, 20, 30, 40, 50].map((val) => {
                const y = height - padY - (val / maxVal) * (height - padY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={width - padX}
                      y2={y}
                      stroke={val === 50 ? "#f59e0b" : "#1e293b"}
                      strokeDasharray={val === 50 ? "4 4" : "2 2"}
                      strokeWidth={val === 50 ? "1.5" : "1"}
                    />
                    <text
                      x={padX - 8}
                      y={y + 3}
                      fill={val === 50 ? "#f59e0b" : "#64748b"}
                      fontSize="10"
                      fontWeight={val === 50 ? "bold" : "normal"}
                      textAnchor="end"
                    >
                      {val} {val === 50 ? "🔥" : ""}
                    </text>
                  </g>
                );
              })}

              {/* Highlight Peak Zone Rectangle behind chart (Days 7 to 10) */}
              {(() => {
                const startX = points[6].x - 12; // 07/10
                const endX = points[9].x + 12;   // 10/10
                return (
                  <g>
                    <rect
                      x={startX}
                      y={padY - 10}
                      width={endX - startX}
                      height={height - padY * 2 + 10}
                      fill="#f59e0b"
                      fillOpacity="0.07"
                      rx="8"
                    />
                    <text
                      x={(startX + endX) / 2}
                      y={padY}
                      fill="#fbbf24"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ★ GIAI ĐOẠN ĐỈNH (50 LƯỢT) ★
                    </text>
                  </g>
                );
              })()}

              {/* BAR CHART MODE */}
              {chartMode === "bar" && (
                <g>
                  {points.map((pt, i) => {
                    const barWidth = 24;
                    const barHeight = (pt.data.visits / maxVal) * (height - padY * 2);
                    const barX = pt.x - barWidth / 2;
                    const barY = height - padY - barHeight;

                    const isHovered = hoveredDay?.dateStr === pt.data.dateStr;

                    return (
                      <g
                        key={i}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredDay(pt.data)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        <rect
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          rx="6"
                          fill={pt.data.isPeak ? "url(#peakBarGradient)" : "url(#normalBarGradient)"}
                          stroke={isHovered ? "#ffffff" : pt.data.isPeak ? "#fbbf24" : "#38bdf8"}
                          strokeWidth={isHovered ? 2 : 1}
                        />
                        {/* Top Value Label */}
                        <text
                          x={pt.x}
                          y={barY - 6}
                          fill={pt.data.isPeak ? "#fbbf24" : "#94a3b8"}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {pt.data.visits}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* LINE / AREA CHART MODE */}
              {chartMode === "line" && (
                <g>
                  {/* Area fill */}
                  <path d={areaPath} fill="url(#trafficGradient)" />

                  {/* Line stroke */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Point circles */}
                  {points.map((pt, i) => {
                    const isHovered = hoveredDay?.dateStr === pt.data.dateStr;
                    return (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredDay(pt.data)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {/* Outer glow ring for Peak days */}
                        {pt.data.isPeak && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="9"
                            fill="#f59e0b"
                            fillOpacity="0.3"
                            className="animate-ping"
                          />
                        )}

                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 7 : pt.data.isPeak ? 5.5 : 4}
                          fill={pt.data.isPeak ? "#f59e0b" : isHovered ? "#38bdf8" : "#0891b2"}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2.5 : 1.5}
                        />

                        {/* Top number badge for Peak points */}
                        {pt.data.isPeak && (
                          <g>
                            <rect
                              x={pt.x - 14}
                              y={pt.y - 24}
                              width="28"
                              height="16"
                              rx="4"
                              fill="#f59e0b"
                            />
                            <text
                              x={pt.x}
                              y={pt.y - 12}
                              fill="#000000"
                              fontSize="10"
                              fontWeight="900"
                              textAnchor="middle"
                            >
                              {pt.data.visits}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* X-axis Labels (Dates 01/10 to 15/10) */}
              {points.map((pt, i) => (
                <text
                  key={i}
                  x={pt.x}
                  y={height - padY + 18}
                  fill={pt.data.isPeak ? "#fbbf24" : "#64748b"}
                  fontSize="10"
                  fontWeight={pt.data.isPeak ? "bold" : "normal"}
                  textAnchor="middle"
                >
                  {pt.data.dateStr}
                </text>
              ))}
            </svg>
          </div>

          {/* Hover Tooltip Overlay Card */}
          {hoveredDay && (
            <div className="absolute top-4 right-4 bg-slate-900/95 text-white p-3.5 rounded-2xl border border-cyan-400/50 shadow-2xl space-y-1.5 animate-fade-in text-xs z-20 backdrop-blur-md min-w-[200px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-cyan-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Ngày {hoveredDay.fullDate}
                </span>
                {hoveredDay.isPeak && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[10px]">
                    Đỉnh 50
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Lượt truy cập (Visits):</span>
                <span className="font-black text-white text-sm">{hoveredDay.visits} lượt</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Lượt xem trang (Pageviews):</span>
                <span className="font-semibold text-cyan-300">{hoveredDay.pageviews}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Khách duy nhất (Unique):</span>
                <span className="font-semibold text-slate-200">{hoveredDay.uniqueVisitors}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Tỷ lệ thoát:</span>
                <span className="font-semibold text-emerald-400">{hoveredDay.bounceRate}%</span>
              </div>
              {hoveredDay.note && (
                <div className="text-[10px] text-amber-300/90 italic pt-1 border-t border-slate-800">
                  {hoveredDay.note}
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* DETAILED DAILY TABLE (Can filter peak or cooling) */}
      {!isCompact && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Bảng Chi Tiết Lưu Lượng Theo Ngày (01/10/2026 – 15/10/2026)
              </h4>
              <p className="text-xs text-slate-500">Minh bạch chỉ số từng phiên truy cập</p>
            </div>

            {/* Quick Filter buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                onClick={() => setFilterPeriod("all")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  filterPeriod === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tất cả (15 ngày)
              </button>
              <button
                onClick={() => setFilterPeriod("peak")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  filterPeriod === "peak"
                    ? "bg-amber-500 text-slate-950 shadow-xs font-black"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Giai đoạn đỉnh (07 - 10/10)</span>
              </button>
              <button
                onClick={() => setFilterPeriod("cooling")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  filterPeriod === "cooling"
                    ? "bg-cyan-600 text-white"
                    : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                }`}
              >
                Hạ dần (11 - 15/10)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50 font-bold">
                  <th className="py-3 px-4">Ngày</th>
                  <th className="py-3 px-4">Lượt Truy Cập (Visits)</th>
                  <th className="py-3 px-4">Lượt Xem Trang</th>
                  <th className="py-3 px-4">Khách Duy Nhất</th>
                  <th className="py-3 px-4">Tỷ Lệ Thoát</th>
                  <th className="py-3 px-4">Thời Lượng TB</th>
                  <th className="py-3 px-4">Đánh Giá Xu Hướng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {displayData.map((row) => (
                  <tr
                    key={row.dateStr}
                    className={`hover:bg-slate-50/80 transition ${
                      row.isPeak ? "bg-amber-50/40 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-900 font-bold font-mono">
                      {row.fullDate}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${row.isPeak ? "text-amber-600" : "text-slate-800"}`}>
                          {row.visits}
                        </span>
                        {row.isPeak && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Đỉnh cao {row.visits === 50 ? "(50 Max)" : ""}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{row.pageviews}</td>
                    <td className="py-3 px-4 text-slate-600">{row.uniqueVisitors}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${row.bounceRate <= 30 ? "text-emerald-600" : "text-slate-600"}`}>
                        {row.bounceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{row.avgTime}</td>
                    <td className="py-3 px-4">
                      {row.isPeak ? (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300 font-bold text-[11px] flex items-center gap-1 w-fit">
                          <Flame className="w-3 h-3 text-amber-500" />
                          <span>{row.note || "Đạt đỉnh 50"}</span>
                        </span>
                      ) : ["11/10", "12/10", "13/10", "14/10", "15/10"].includes(row.dateStr) ? (
                        <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-medium text-[11px] flex items-center gap-1 w-fit">
                          <TrendingDown className="w-3 h-3 text-blue-500" />
                          <span>{row.note || "Hạ dần đều"}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-medium text-[11px] flex items-center gap-1 w-fit">
                          <TrendingUp className="w-3 h-3 text-slate-400" />
                          <span>{row.note || "Tăng trưởng ban đầu"}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
