"use client";

import React from "react";
import {
  Sparkles,
  Target,
  Rocket,
  ShieldCheck,
  Users,
  Code2,
  Palette,
  Award,
  Clock,
  Heart,
  CheckCircle2,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Zap,
  Globe,
  Star,
  ArrowRight
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
    { number: "99.8%", label: "Khách hàng hài lòng", desc: "Đánh giá 5 sao xuất sắc" },
    { number: "50+", label: "Chuyên gia IT & Design", desc: "Đội ngũ từ các trường top đầu" },
    { number: "24/7", label: "Hỗ trợ kỹ thuật", desc: "Đồng hành xuyên suốt đồ án" }
  ];

  const coreValues = [
    {
      icon: <Target className="w-6 h-6 text-sky-600" />,
      title: "Chất Lượng Hàng Đầu",
      desc: "Mã nguồn sạch, chuẩn kiến trúc Clean Architecture, giao diện UI/UX thiết kế độc quyền theo phong cách hiện đại."
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      title: "Cam Kết Đúng Hạn 100%",
      desc: "Quy trình làm việc nghiêm ngặt theo mô hình Agile/Scrum. Không bao giờ trễ deadline đồ án hay lịch bảo vệ của khách hàng."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      title: "Bảo Mật Tuyệt Đối",
      desc: "Mọi thông tin cá nhân, ý tưởng dự án và file mã nguồn đều được bảo mật tuyệt đối. Cam kết không chia sẻ cho bên thứ ba."
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      title: "Đồng Hành & Hỗ Trợ Khách Hàng",
      desc: "Không chỉ giao sản phẩm, chúng tôi hướng dẫn giải thích code, hỗ trợ cài đặt chạy demo và chuẩn bị tài liệu báo cáo."
    }
  ];

  const teamMembers = [
    {
      name: "Nguyễn Lê Nguyên Hải",
      role: "Founder & Lead Software Architect",
      skills: "Fullstack Next.js, System Design, SQL Server",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      quote: "Sứ mệnh của chúng tôi là biến ý tưởng công nghệ của bạn thành sản phẩm hoàn hảo."
    },
    {
      name: "Trần Minh Khoa",
      role: "Senior UI/UX & Brand Designer",
      skills: "Figma, Brand Identity, Motion Design",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      quote: "Một thiết kế tuyệt vời là sự kết hợp hoàn hảo giữa thẩm mỹ và trải nghiệm người dùng."
    },
    {
      name: "Lê Hoàng Yến",
      role: "Head of Project Management",
      skills: "Agile, Quality Assurance, Client Support",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      quote: "Đảm bảo mọi tiến độ dự án minh bạch và mang đến sự an tâm tuyệt đối cho khách hàng."
    },
    {
      name: "Phạm Quốc Bảo",
      role: "Backend & Database Engineer",
      skills: "Node.js, MSSQL, API Security, Cloud Deploy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      quote: "Cơ sở dữ liệu tối ưu và hệ thống backend ổn định là nền tảng của mọi ứng dụng lớn."
    }
  ];

  const techStack = [
    { name: "Next.js 16 / React 19", category: "Frontend Framework", color: "bg-slate-900 text-white" },
    { name: "TypeScript", category: "Programming Language", color: "bg-blue-600 text-white" },
    { name: "Microsoft SQL Server", category: "Database System", color: "bg-red-700 text-white" },
    { name: "Tailwind CSS", category: "Styling & UI Design", color: "bg-cyan-500 text-white" },
    { name: "Figma & Adobe CC", category: "UI/UX & Graphics", color: "bg-purple-600 text-white" },
    { name: "Node.js & Express", category: "Backend Runtime", color: "bg-emerald-600 text-white" }
  ];

  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-14 shadow-2xl border border-sky-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            Về Chúng Tôi — 4YouTech Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Đối Tác Công Nghệ & Thiết Kế <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
              Chuyên Nghiệp Hàng Đầu
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            4YouTech là nền tảng tiên phong cung cấp giải pháp lập trình Web/Mobile, phân tích hệ thống CSDL ERD và thiết kế UI/UX đồ họa dành cho Sinh viên, CLB và Doanh nghiệp vừa & nhỏ. Chúng tôi biến mọi ý tưởng phức tạp thành sản phẩm thực tế hoàn hảo.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSwitchToWorkspace && onSwitchToWorkspace()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 hover:opacity-95 transition flex items-center gap-2"
            >
              <span>Trải Nghiệm Đặt Dịch Vụ Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cam kết bảo mật & đúng hẹn 100%
            </div>
          </div>
        </div>
      </div>

      {/* Impressive Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2 text-center"
          >
            <div className="text-3xl sm:text-4xl font-black text-sky-600">{st.number}</div>
            <div className="text-xs font-extrabold text-slate-900">{st.label}</div>
            <div className="text-[11px] text-slate-500 font-medium">{st.desc}</div>
          </div>
        ))}
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Sứ Mệnh Của Chúng Tôi</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mang đến giải pháp lập trình chất lượng cao, thiết kế chuẩn mực với mức chi phí hợp lý nhất. Hỗ trợ các bạn sinh viên và doanh nghiệp trẻ hiện thực hóa dự án công nghệ một cách chuyên nghiệp, đúng quy chuẩn báo cáo và đạt điểm số tối đa.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Tầm Nhìn Phát Triển</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Trở thành hệ sinh thái dịch vụ IT & Design uy tín số 1 Việt Nam, là cầu nối vững chắc giữa công nghệ hiện đại và nhu cầu thực tế. Xây dựng môi trường cộng tác minh bạch, nâng tầm sản phẩm số của từng khách hàng.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">Giá Trị Cốt Lõi</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Tại Sao Khách Hàng Tin Chọn 4YouTech?</h2>
          <p className="text-xs text-slate-200">Những cam kết làm nên uy tín và thương hiệu của chúng tôi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl inline-block">{val.icon}</div>
              <h3 className="font-extrabold text-slate-900 text-sm">{val.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Team Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">Đội Ngũ Chuyên Gia</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Nhân Sự Phụ Trách Dự Án</h2>
          <p className="text-xs text-slate-200">Đội ngũ kỹ sư & designer tài năng luôn sẵn sàng đồng hành cùng bạn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs space-y-4 p-5">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-44 object-cover rounded-2xl border border-slate-100"
              />
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-sm">{member.name}</h3>
                <div className="text-xs font-bold text-sky-600">{member.role}</div>
                <div className="text-[11px] text-slate-500 font-medium">{member.skills}</div>
              </div>
              <div className="text-[11px] text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{member.quote}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Công Nghệ Sử Dụng</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Tech Stack Tiêu Chuẩn Hiện Đại</h2>
          </div>
          <span className="text-xs text-slate-400">Đảm bảo ứng dụng chạy nhanh, bảo mật & dễ mở rộng</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-slate-900 text-xs">{tech.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{tech.category}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${tech.color}`}>
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Office & Contact Info Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
            Thông Tin Liên Hệ Official
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Kết Nối Với 4YouTech Hôm Nay</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp kỹ thuật tốt nhất cho dự án của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs pt-4 border-t border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <MapPin className="w-4 h-4" /> Địa chỉ văn phòng:
            </div>
            <div className="text-slate-300">Khu Công Nghệ Cao, Thành phố Thủ Đức, TP. Hồ Chí Minh</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Phone className="w-4 h-4" /> Hotline Zalo:
            </div>
            <div className="text-slate-300 font-bold text-sm">0999.888.777 (24/7)</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Mail className="w-4 h-4" /> Email liên hệ:
            </div>
            <div className="text-slate-300 font-mono">support@4youtech.com</div>
          </div>
        </div>
      </div>

    </div>
  );
}
