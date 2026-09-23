"use client";

import React from "react";
import {
  Sparkles,
  Target,
  Rocket,
  ShieldCheck,
  Code2,
  Palette,
  Clock,
  Heart,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Zap,
  Globe,
  Star,
  ArrowRight,
  Layers,
  Eye
} from "lucide-react";

export function AboutView({
  onSelectServiceToBook,
  onSwitchToWorkspace
}: {
  onSelectServiceToBook?: (serviceId: string) => void;
  onSwitchToWorkspace?: () => void;
}) {
  const stats = [
    { number: "500+", label: "Đồ án & Dự án hoàn thành", desc: "Bàn giao đúng deadline 100%" },
    { number: "100%", label: "Thiết kế UI/UX độc quyền", desc: "Chuẩn Pixel-Perfect & Modern Art" },
    { number: "99.8%", label: "Khách hàng hài lòng", desc: "Đánh giá 5 sao xuất sắc" },
    { number: "24/7", label: "Đồng hành & Hỗ trợ kỹ thuật", desc: "Giải đáp thắc mắc liên tục" }
  ];

  const designPillars = [
    {
      icon: <Palette className="w-7 h-7 text-cyan-400" />,
      badge: "UI/UX & Aesthetic",
      title: "Trải Nghiệm Thẩm Mỹ Đẳng Cấp",
      desc: "Tập trung nghiên cứu hành vi người dùng, phối màu Gradient thời thượng, phong cách Dark Mode & Glassmorphism sang trọng giúp thu hút mọi ánh nhìn ngay từ giây đầu tiên."
    },
    {
      icon: <Code2 className="w-7 h-7 text-purple-400" />,
      badge: "Clean Architecture",
      title: "Mã Nguồn Chuẩn & Tối Ưu",
      desc: "Kiến trúc mã nguồn Next.js/React tối ưu, phân chia component rõ ràng, chuẩn SEO, bảo mật cao và dễ dàng mở rộng tính năng về sau."
    },
    {
      icon: <Zap className="w-7 h-7 text-amber-400" />,
      badge: "Micro-Interactions",
      title: "Hiệu Ứng Chuyển Động Mượt Mà",
      desc: "Tích hợp hiệu ứng hover linh hoạt, animation tinh tế giúp giao diện ứng dụng trở nên sinh động, chuyên nghiệp và giàu tính tương tác."
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
      badge: "Pixel-Perfect Vector",
      title: "Đường Nét Đồ Họa Chuẩn Xác",
      desc: "Mọi thiết kế Logo, Banner và Ấn phẩm truyền thông đều sử dụng Vector đồ họa độ phân giải cao, sẵn sàng xuất bản trên mọi nền tảng."
    }
  ];

  const designProcess = [
    {
      step: "01",
      title: "Nghiên Cứu Ý Tưởng & Moodboard",
      desc: "Lắng nghe nhu cầu, định hình phong cách thiết kế, phác thảo Wireframe và xây dựng bảng màu chủ đạo.",
      icon: <Target className="w-5 h-5 text-cyan-400" />
    },
    {
      step: "02",
      title: "Thiết Kế UI/UX High-Fidelity",
      desc: "Dựng giao diện chi tiết chuẩn Figma, chăm chút từng icon, khoảng cách margin/padding và hiệu ứng thị giác.",
      icon: <Palette className="w-5 h-5 text-purple-400" />
    },
    {
      step: "03",
      title: "Lập Trình Code & Tích Hợp CSDL",
      desc: "Chuyển bản vẽ thành mã nguồn chạy thực tế, tối ưu CSDL SQL Server và tích hợp các chức năng nâng cao.",
      icon: <Code2 className="w-5 h-5 text-amber-400" />
    },
    {
      step: "04",
      title: "Bàn Giao, Hướng Dẫn & Hỗ Trợ",
      desc: "Kiểm thử toàn diện, bàn giao đầy đủ mã nguồn, tài liệu hướng dẫn và đồng hành hỗ trợ chạy bảo vệ.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    }
  ];

  const techStack = [
    { name: "Next.js 16 & React 19", category: "Fullstack Web Framework", icon: "⚡" },
    { name: "TypeScript & Clean Code", category: "Robust Type System", icon: "💎" },
    { name: "Figma Master Design", category: "UI/UX & Prototyping", icon: "🎨" },
    { name: "Microsoft SQL Server", category: "Database & ERD Diagram", icon: "🗄️" },
    { name: "Adobe Creative Cloud", category: "Branding & Graphic Design", icon: "🖼️" },
    { name: "Tailwind CSS & Glassmorphism", category: "Modern UI Styling System", icon: "🌈" }
  ];

  return (
    <div className="space-y-16 pb-20 animate-fade-in text-slate-100">
      
      {/* Ultra-Aesthetic Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950 via-[#070d26] to-purple-950 p-8 sm:p-14 shadow-2xl border border-blue-500/30">
        
        {/* Glowing Background Light Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            Về Chúng Tôi — 4YouTech Creative Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Nơi Ý Tưởng Được Thổi Hồn Bằng <br />
            <span className="gradient-title-cyan">
              Thiết Kế Đột Phá & Code Chuẩn Đẳng Cấp
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-3xl">
            4YouTech không chỉ tạo ra sản phẩm công nghệ – chúng tôi biến từng đồ án, dự án cá nhân và giải pháp doanh nghiệp thành một tác phẩm nghệ thuật số ấn tượng. Sự kết hợp hoàn hảo giữa <strong className="text-cyan-300">T duy Thẩm mỹ Đỉnh cao</strong> và <strong className="text-purple-300">Mã nguồn Độc quyền Tối ưu</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onSwitchToWorkspace && onSwitchToWorkspace()}
              className="px-7 py-4 rounded-2xl gradient-btn font-extrabold text-xs text-white shadow-xl shadow-cyan-500/30 hover:scale-105 transition flex items-center gap-2"
            >
              <span>Khám Phá Dịch Vụ 4YouTech</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-blue-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cam kết 100% đúng hạn & thiết kế đẹp nhất
            </div>
          </div>
        </div>
      </div>

      {/* Impressive Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => (
          <div
            key={i}
            className="dark-glass-card p-6 rounded-3xl border border-blue-500/25 shadow-xl hover:border-cyan-400/60 transition space-y-2 text-center group"
          >
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 group-hover:scale-105 transition duration-300">
              {st.number}
            </div>
            <div className="text-xs font-extrabold text-white">{st.label}</div>
            <div className="text-[11px] text-slate-400 font-medium">{st.desc}</div>
          </div>
        ))}
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="dark-glass-card p-8 rounded-3xl border border-blue-500/25 shadow-xl space-y-4 relative overflow-hidden group hover:border-cyan-400/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Sứ Mệnh Đột Phá
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Mang đến giải pháp thiết kế đồ họa & lập trình phần mềm với tiêu chuẩn thẩm mỹ cao nhất và mức chi phí hợp lý. Giúp các bạn sinh viên, CLB và doanh nghiệp trẻ sở hữu những sản phẩm số chuẩn mực, gây ấn tượng tuyệt đối trong mắt khách hàng và hội đồng đánh giá.
          </p>
        </div>

        <div className="dark-glass-card p-8 rounded-3xl border border-purple-500/25 shadow-xl space-y-4 relative overflow-hidden group hover:border-purple-400/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Tầm Nhìn Sáng Tạo
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Trở thành Studio Dịch Vụ IT & Creative Design tiên phong số 1, nâng tầm chất lượng các sản phẩm công nghệ Việt Nam bằng ngôn ngữ thiết kế hiện đại, tinh tế và đột phá.
          </p>
        </div>
      </div>

      {/* Design & Creative Excellence Pillars Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-cyan-400 uppercase tracking-widest px-3 py-1 rounded bg-blue-950/80 border border-blue-500/30">
            TRIẾT LÝ THIẾT KẾ
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            4 Trụ Cột Tạo Nên <span className="gradient-title-cyan">Sản Phẩm Đẳng Cấp</span>
          </h2>
          <p className="text-xs text-slate-400">
            Mọi sản phẩm do 4YouTech đảm nhận đều đáp ứng khắt khe các tiêu chí nghệ thuật & kỹ thuật
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designPillars.map((item, idx) => (
            <div
              key={idx}
              className="dark-glass-card p-6 rounded-3xl border border-blue-500/25 shadow-xl space-y-4 hover:border-cyan-400/60 transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-blue-500/30 inline-block shadow-md group-hover:scale-110 transition duration-300">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-900/60 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                  <h3 className="font-extrabold text-white text-base mt-2 group-hover:text-cyan-400 transition">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Design & Development Workflow Timeline */}
      <div className="dark-glass-card p-8 sm:p-12 rounded-3xl border border-blue-500/30 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-purple-400 uppercase tracking-widest px-3 py-1 rounded bg-purple-950/80 border border-purple-500/30">
            QUY TRÌNH SÁNG TẠO
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Từ Ý Tưởng Sơ Khai Đến Sản Phẩm Hoàn Hảo
          </h2>
          <p className="text-xs text-slate-400">
            Quy trình làm việc 4 bước chuẩn mực giúp kiểm soát chất lượng và bàn giao đúng hẹn 100%
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {designProcess.map((proc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950/70 border border-blue-500/20 space-y-3 relative overflow-hidden hover:border-cyan-400/50 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-700 group-hover:text-cyan-400 transition">
                  {proc.step}
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center">
                  {proc.icon}
                </div>
              </div>
              <h4 className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition">
                {proc.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {proc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Tech & Design Stack Section */}
      <div className="dark-glass-card p-8 sm:p-10 rounded-3xl border border-blue-500/25 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950 border border-blue-500/30">
              CÔNG CỤ & CÔNG NGHỆ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Hệ Sinh Thái Công Nghệ & Thiết Kế Tiêu Chuẩn
            </h2>
          </div>
          <span className="text-xs text-slate-400">Tối ưu hiệu năng, thẩm mỹ sang trọng & độ ổn định vượt trội</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/20 flex items-center justify-between hover:border-cyan-400/40 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tech.icon}</span>
                <div>
                  <div className="font-extrabold text-white text-xs">{tech.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tech.category}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Office & Official Contact Card */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-950 via-[#0a1435] to-purple-950 border border-blue-500/40 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-400/40">
            THÔNG TIN LIÊN HỆ TRỰC TIẾP
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Sẵn Sàng Đồng Hành Cùng Dự Án Của Bạn</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hãy chia sẻ ý tưởng của bạn với 4YouTech. Đội ngũ kỹ sư & designer của chúng tôi luôn sẵn sàng lắng nghe và mang đến giải pháp tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs pt-4 border-t border-blue-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <MapPin className="w-4 h-4" /> Địa chỉ văn phòng:
            </div>
            <div className="text-slate-300 leading-relaxed">Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Phone className="w-4 h-4" /> Hotline Zalo tư vấn:
            </div>
            <div className="text-white font-black text-sm">0999.888.777 (24/7)</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Mail className="w-4 h-4" /> Email liên hệ official:
            </div>
            <div className="text-slate-300 font-mono">support@4youtech.com</div>
          </div>
        </div>
      </div>

    </div>
  );
}

