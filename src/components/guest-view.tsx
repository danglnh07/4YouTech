"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "@/lib/app-context";
import { getPasswordRules } from "./auth-pages";
import { ServiceItem, SampleProject, ServiceCategory, formatPriceRange, formatDaysRange } from "@/lib/store";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  UserPlus,
  LogIn,
  KeyRound,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  X,
  FileCode,
  Laptop,
  Palette,
  ShoppingCart,
  ShoppingBag,
  Plus,
  Check,
  Info,
  Eye,
  Mail,
  RefreshCw,
  Maximize2,
  ChevronLeft,
  CheckSquare,
  Square
} from "lucide-react";

function AnimatedShowcaseBanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: "web-portfolio",
      title: "Lập Trình Web & Portfolio",
      badge: "IT & Software",
      subTitle: "Build Create Together",
      desc: "Lập trình Website & Portfolio cá nhân tối ưu SEO, giao diện cá tính, chuẩn Mobile & Web.",
      type: "code",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: "test-software",
      title: "Test Lỗi Phần Mềm",
      badge: "IT Quality Control",
      subTitle: "Manual & Automation Testing",
      desc: "Kiểm thử phần mềm, rà soát lỗi UI/UX, bảo mật, hiệu năng & lập báo cáo chi tiết.",
      type: "test",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: "ui-logo-design",
      title: "Thiết Kế UI & Logo",
      badge: "Branding & UI/UX",
      subTitle: "Good Ideas Brighter Tomorrow",
      desc: "Thiết kế Giao diện người dùng UI Figma sắc nét & Logo nhận diện thương hiệu độc quyền.",
      type: "graphic",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: "banner-poster",
      title: "Banner & Poster",
      badge: "Media Design",
      subTitle: "Truyền thông & Quảng cáo",
      desc: "Thiết kế Banner truyền thông, poster sự kiện, ấn phẩm quảng cáo thu hút lượt nhấp.",
      type: "banner",
      image: "/images/banner-y-te.png"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#091026]/90 shadow-[0_0_40px_rgba(0,150,255,0.25)] flex flex-col justify-between h-[390px] sm:h-[440px] group select-none backdrop-blur-xl"
    >
      {/* Top Banner Header Info */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-blue-500/20 bg-slate-950/70 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-extrabold text-cyan-300 tracking-wider uppercase">Showcase Dịch Vụ 4YouTech</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/30">
          <span className="text-cyan-400">{activeSlide + 1}</span> / <span>{slides.length}</span>
        </div>
      </div>

      {/* Main Slide Content Presentation Area */}
      <div className="relative flex-1 p-5 overflow-hidden flex flex-col justify-center">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/90 via-slate-950/40 to-cyan-900/40 pointer-events-none"></div>

        {/* Visual Mockups based on slide type */}
        {current.type === "code" && (
          <div className="relative z-10 space-y-3 animate-fade-in">
            <div className="rounded-xl overflow-hidden border border-blue-500/40 bg-slate-950/95 shadow-2xl p-3 sm:p-4 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="ml-2 font-sans font-bold text-slate-300">Web_Portfolio_Design.tsx</span>
                </div>
                <span className="text-cyan-400 font-sans">4YouTech Code</span>
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                <span className="text-cyan-400">const</span> <span className="text-amber-300">PortfolioApp</span> = () =&gt; &#123;<br />
                &nbsp;&nbsp;<span className="text-cyan-400">return</span> (<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">WebServices</span> <span className="text-purple-300">responsive</span>=<span className="text-emerald-300">true</span> /&gt;<br />
                &nbsp;&nbsp;);<br />
                &#125;;
              </div>
            </div>
          </div>
        )}

        {current.type === "test" && (
          <div className="relative z-10 space-y-3 animate-fade-in">
            <div className="bg-slate-950/95 rounded-xl p-4 border border-emerald-500/40 text-xs shadow-xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] font-bold text-emerald-400">
                <span>⚡ Test Case Report: PASS 98.5%</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-500/30 text-[10px]">Zero Critical Bug</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono space-y-1">
                <div>✓ UI/UX Responsiveness: Passed</div>
                <div>✓ Performance & Speed Test: 99/100</div>
                <div>✓ Security & Form Validation: Verified</div>
              </div>
            </div>
          </div>
        )}

        {current.type === "graphic" && (
          <div className="relative z-10 space-y-3 animate-fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-pink-900/80 border border-purple-500/40 shadow-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 px-2.5 py-0.5 rounded bg-purple-950/80 border border-pink-500/30">Good Ideas Brighter Tomorrow</span>
              <div className="text-xl font-black text-white leading-tight">Thiết Kế UI & Logo Thương Hiệu</div>
              <p className="text-xs text-purple-200">Giao diện người dùng sắc nét, Logo nhận diện độc quyền.</p>
            </div>
          </div>
        )}

        {current.type === "banner" && (
          <div className="relative z-10 space-y-3 animate-fade-in">
            <div className="bg-slate-950/95 rounded-xl border border-blue-500/40 p-3 space-y-2 shadow-2xl">
              <div className="h-28 bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                <img src={current.image} alt="banner preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 px-1">
                <span>Banner Quảng Cáo & Poster truyền thông</span>
                <span className="px-2 py-0.5 bg-blue-900/80 rounded text-[10px] text-white font-bold">HD Vector</span>
              </div>
            </div>
          </div>
        )}

        {/* Slide Overlay Text */}
        <div className="mt-3 relative z-10 bg-slate-950/80 p-3.5 rounded-2xl border border-blue-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white">{current.title}</h4>
            <span className="text-[10px] font-bold text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">{current.badge}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1">{current.desc}</p>
        </div>
      </div>

      {/* Slide Controls Footer */}
      <div className="p-4 flex items-center justify-between border-t border-blue-500/20 bg-slate-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx ? "w-7 bg-cyan-400" : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 transition"
            title="Slide trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 transition"
            title="Slide tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function GuestView({
  onSelectServiceToBook,
  onSwitchToWorkspace,
  activeTab
}: {
  onSelectServiceToBook: (serviceId: string | string[]) => void;
  onSwitchToWorkspace: () => void;
  activeTab?: string;
}) {
  const {
    services,
    projects,
    users,
    currentUser,
    switchRole,
    login,
    registerCustomerWithOtp,
    activateAccountWithOtp,
    sendOtp,
    resetPasswordWithOtp,
    addToCart
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeDetailService, setActiveDetailService] = useState<ServiceItem | null>(null);

  // Horizontal Scroll ref & helpers for Services Catalog
  const serviceScrollRef = useRef<HTMLDivElement>(null);

  const scrollServicesLeft = () => {
    if (serviceScrollRef.current) {
      serviceScrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollServicesRight = () => {
    if (serviceScrollRef.current) {
      serviceScrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  // Multi-selection for Services Catalog
  const [selectedCatalogServiceIds, setSelectedCatalogServiceIds] = useState<string[]>([]);

  const handleBatchAddToCart = () => {
    if (selectedCatalogServiceIds.length === 0) return;
    const selectedSrvs = services.filter((s) => selectedCatalogServiceIds.includes(s.id));
    selectedSrvs.forEach((srv) => addToCart(srv));
    setToastMsg(`🛒 Đã thêm thành công ${selectedSrvs.length} dịch vụ vào giỏ hàng!`);
    setSelectedCatalogServiceIds([]);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleBatchBookNow = () => {
    if (selectedCatalogServiceIds.length === 0) return;
    const idsToBook = [...selectedCatalogServiceIds];
    if (currentUser.role === "guest") {
      setAuthModalOpen(true);
    } else {
      onSelectServiceToBook(idsToBook);
    }
  };

  // Projects Showcase filter, pagination & preview modal state
  const [projectSubCategory, setProjectSubCategory] = useState<string>("all");
  const [previewProject, setPreviewProject] = useState<SampleProject | null>(null);

  // Pagination for Sample Projects Showcase (8 items per page)
  const PROJECTS_PER_PAGE = 8;
  const [currentProjectPage, setCurrentProjectPage] = useState<number>(1);

  // Reset page to 1 when subcategory filter changes
  useEffect(() => {
    setCurrentProjectPage(1);
  }, [projectSubCategory]);

  // Auto scroll to sample projects slide showcase if activeTab is "projects"
  useEffect(() => {
    if (activeTab === "projects") {
      const el = document.getElementById("sample-projects-section");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }
  }, [activeTab]);

  const filteredProjects = useMemo(() => {
    if (projectSubCategory === "all") return projects;
    return projects.filter(
      (p) =>
        p.subCategory === projectSubCategory ||
        p.category === projectSubCategory ||
        (projectSubCategory === "Banner" && (p.subCategory === "Banner" || p.subCategory === "Poster"))
    );
  }, [projects, projectSubCategory]);

  const totalProjectPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE) || 1;
  }, [filteredProjects]);

  const paginatedProjects = useMemo(() => {
    const start = (currentProjectPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentProjectPage]);

  // Cart toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAddToCart = (srv: ServiceItem) => {
    addToCart(srv);
    setToastMsg(`Đã thêm "${srv.name}" vào giỏ hàng!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Auth modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register" | "forgot">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [authMessage, setAuthMessage] = useState("");

  // OTP Verification states for registration
  const [otpStep, setOtpStep] = useState(false);
  const [activationEmail, setActivationEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [simulatedOtpCode, setSimulatedOtpCode] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(60);

  // Forgot Password states
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtpInput, setForgotOtpInput] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirmPass, setForgotConfirmPass] = useState("");
  const [forgotSimulatedOtp, setForgotSimulatedOtp] = useState<string | null>(null);
  const [forgotTimer, setForgotTimer] = useState(60);

  // OTP Countdown timer effects
  useEffect(() => {
    let interval: any;
    if (simulatedOtpCode && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [simulatedOtpCode, otpTimer]);

  useEffect(() => {
    let interval: any;
    if (forgotSimulatedOtp && forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgotSimulatedOtp, forgotTimer]);

  // Visible services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (srv.hidden) return false;
      const matchesSearch =
        srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || srv.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  const categoryBadgeClass = (cat: ServiceCategory) => {
    if (cat === "IT") return "badge-it";
    if (cat === "Design") return "badge-design";
    return "badge-mixed";
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    const res = login(loginEmail, loginPass, "customer");
    if (res.success) {
      setAuthModalOpen(false);
      onSwitchToWorkspace();
    } else {
      setAuthMessage(res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    if (!regForm.name || !regForm.email || !regForm.phone || !regForm.password) {
      setAuthMessage("Vui lòng điền đầy đủ họ tên, email, sđt và mật khẩu.");
      return;
    }

    const rules = getPasswordRules(regForm.password);
    if (!rules.isStrong) {
      setAuthMessage("Mật khẩu chưa đủ mạnh. Bắt buộc từ 8 ký tự, có chữ hoa, chữ số và ký tự đặc biệt (@, #, $, !).");
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setAuthMessage("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    try {
      const { otpCode } = registerCustomerWithOtp({
        name: regForm.name,
        email: regForm.email,
        phone: regForm.phone,
        password: regForm.password
      });

      setActivationEmail(regForm.email);
      setSimulatedOtpCode(otpCode);
      setOtpTimer(60);
      setOtpInput("");
      setOtpStep(true);
      setAuthMessage("");
    } catch (err: any) {
      setAuthMessage(err.message || "Đã xảy ra lỗi khi tạo tài khoản.");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    const res = activateAccountWithOtp(activationEmail, otpInput);
    if (res.success) {
      setAuthMessage(res.message);
      setTimeout(() => {
        setAuthModalOpen(false);
        setOtpStep(false);
        setSimulatedOtpCode(null);
        onSwitchToWorkspace();
      }, 1000);
    } else {
      setAuthMessage(res.message);
    }
  };

  const handleResendOtp = () => {
    const code = sendOtp(activationEmail, "activation");
    setSimulatedOtpCode(code);
    setOtpTimer(60);
    setAuthMessage(`📧 Đã gửi lại mã OTP kích hoạt mới tới email ${activationEmail}!`);
  };

  const handleForgotStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthMessage("Vui lòng nhập Email tài khoản đã đăng ký.");
      return;
    }

    const targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!targetUser) {
      setAuthMessage(`Không tìm thấy tài khoản với email "${forgotEmail}". Vui lòng kiểm tra lại địa chỉ email.`);
      return;
    }

    const code = sendOtp(cleanEmail, "reset_password");
    setForgotSimulatedOtp(code);
    setForgotTimer(60);
    setForgotStep(2);
  };

  const handleForgotStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    if (forgotOtpInput.trim() !== forgotSimulatedOtp) {
      setAuthMessage("Mã OTP khôi phục không chính xác.");
      return;
    }
    setForgotStep(3);
  };

  const handleForgotStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    const rules = getPasswordRules(forgotNewPass);
    if (!rules.isStrong) {
      setAuthMessage("Mật khẩu mới chưa đạt độ mạnh yêu cầu.");
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setAuthMessage("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    const res = resetPasswordWithOtp(forgotEmail, forgotOtpInput, forgotNewPass);
    if (res.success) {
      setAuthMessage(res.message);
      setTimeout(() => {
        setAuthTab("login");
        setForgotStep(1);
        setForgotSimulatedOtp(null);
        setLoginEmail(forgotEmail);
        setLoginPass(forgotNewPass);
      }, 1200);
    } else {
      setAuthMessage(res.message);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b132e] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up border border-cyan-500/40 backdrop-blur-xl">
          <ShoppingBag className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden dark-glass rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-blue-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide select-none">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              SÁNG TẠO • THỰC TIỄN • ĐỒNG HÀNH CÙNG BẠN
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] text-white select-none">
              Biến ý tưởng thành <br />
              <span className="gradient-title-cyan">
                Sản phẩm số.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal select-none">
              Giải pháp IT & Design dành cho sinh viên, cá nhân và câu lạc bộ. Lập trình Website Portfolio, thiết kế UI/UX, Kiểm thử phần mềm, Logo, Banner & Poster chuyên nghiệp.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3.5 rounded-full gradient-btn font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                Khám phá dịch vụ <ArrowRight className="w-4 h-4" />
              </a>
              
              <a
                href="#sample-projects-section"
                className="px-6 py-3.5 rounded-full gradient-btn-secondary font-bold text-sm flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-cyan-400" /> Xem showreel
              </a>
            </div>

            {/* Trust Checkmarks */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-blue-500/20 text-xs text-slate-300 select-none">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Tư vấn tận tâm</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Triển khai chuyên nghiệp</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Đồng hành lâu dài</span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Showcase Banner */}
          <div className="lg:col-span-5 w-full">
            <AnimatedShowcaseBanner />
          </div>

        </div>
      </section>

      {/* Quick Category Highlights Bar Below Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl dark-glass-card flex items-center gap-3.5 border border-blue-500/20">
          <div className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white">Website & Portfolio</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Hiện thực hóa ý tưởng của bạn trên web</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl dark-glass-card flex items-center gap-3.5 border border-blue-500/20">
          <div className="w-10 h-10 rounded-xl bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white">UI/UX Design</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Giao diện đẹp, trải nghiệm tốt</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl dark-glass-card flex items-center gap-3.5 border border-blue-500/20">
          <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white">Branding</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Xây dựng dấu ấn riêng</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl dark-glass-card flex items-center gap-3.5 border border-blue-500/20">
          <div className="w-10 h-10 rounded-xl bg-pink-900/60 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white">Banner & Poster</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ấn phẩm truyền thông chuyên nghiệp</div>
          </div>
        </div>
      </div>

      {/* Payment Policy Notice Banner */}
      <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 text-amber-200 shadow-md backdrop-blur-md select-none cursor-default">
        <div className="p-2.5 bg-amber-900/60 rounded-xl shrink-0 border border-amber-500/30">
          <Info className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-0.5 flex-1">
          <div className="font-extrabold text-xs sm:text-sm flex items-center gap-2 text-amber-300">
            ⚠️ Quy Định Đặt Đơn & Thanh Toán 50% - 50% tại 4YouTech:
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            1. Quý khách có thể <strong>Đặt Dịch Vụ ngay</strong> hoặc <strong>Thêm vào Giỏ hàng</strong> để book cùng lúc nhiều dịch vụ.<br />
            2. Sau khi Admin xem xét yêu cầu & chốt báo giá, quý khách <strong>thanh toán đặt cọc 50%</strong> trước để bắt đầu thực hiện.<br />
            3. Khi sản phẩm hoàn thành, quý khách kiểm tra <strong>Nghiệm Thu thành công</strong> rồi thanh toán <strong>50% còn lại</strong> để nhận bàn giao chính thức.
          </p>
        </div>
      </div>

      {/* Services Catalog Section ("Dịch vụ dành cho bạn") */}
      <section id="catalog" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-blue-500/20 pb-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/30">DỊCH VỤ CỦA CHÚNG TÔI</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Dịch vụ <span className="gradient-title-cyan">dành cho bạn</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Từ ý tưởng đến sản phẩm hoàn chỉnh – 4YouTech đồng hành cùng bạn ở mọi giai đoạn.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm dịch vụ..."
                className="w-full pl-9 pr-3 py-2 bg-[#091026] border border-blue-500/30 rounded-full text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-[#091026] p-1.5 rounded-full border border-blue-500/30">
              {["all", "IT", "Design", "IT/Design"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-selection Floating / Sticky Action Bar */}
        {selectedCatalogServiceIds.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/90 via-cyan-950/90 to-slate-950/90 border border-cyan-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-black text-sm">
                {selectedCatalogServiceIds.length}
              </div>
              <div>
                <div className="font-extrabold text-sm text-white">Đã chọn {selectedCatalogServiceIds.length} dịch vụ</div>
                <div className="text-[11px] text-slate-300">Tích chọn nhiều dịch vụ để thêm vào giỏ hoặc đặt đơn hàng cùng lúc</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleBatchAddToCart}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-400" /> Thêm {selectedCatalogServiceIds.length} dịch vụ vào giỏ hàng
              </button>
              <button
                type="button"
                onClick={handleBatchBookNow}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl gradient-btn font-extrabold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/30 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" /> Đặt ngay {selectedCatalogServiceIds.length} dịch vụ
              </button>
              <button
                type="button"
                onClick={() => setSelectedCatalogServiceIds([])}
                className="px-3 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 text-xs font-semibold cursor-pointer"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}

        {/* Scroll Control Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 select-none">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Hiển thị 6 dịch vụ trên khung nhìn • Trượt ngang để xem tiếp ({filteredServices.length} dịch vụ)</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={scrollServicesLeft}
              className="p-2.5 rounded-full bg-[#091026] hover:bg-cyan-950 border border-blue-500/30 text-slate-300 hover:text-cyan-400 transition cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
              title="Trượt sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollServicesRight}
              className="p-2.5 rounded-full bg-[#091026] hover:bg-cyan-950 border border-blue-500/30 text-slate-300 hover:text-cyan-400 transition cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
              title="Trượt sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Services Grid with Horizontal Scroll */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 dark-glass rounded-2xl border border-blue-500/20 p-8">
            <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <div className="font-bold text-white">Không tìm thấy dịch vụ phù hợp</div>
            <div className="text-xs text-slate-400 mt-1">Vui lòng thay đổi từ khóa hoặc bộ lọc tìm kiếm.</div>
          </div>
        ) : (
          <div
            ref={serviceScrollRef}
            className="grid grid-rows-1 md:grid-rows-2 grid-flow-col auto-cols-[88vw] sm:auto-cols-[calc(50%-12px)] lg:auto-cols-[calc(33.333%-16px)] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          >
            {filteredServices.map((srv) => {
              const isCheckedInCatalog = selectedCatalogServiceIds.includes(srv.id);
              return (
                <div
                  key={srv.id}
                  className={`dark-glass-card rounded-2xl border transition-all overflow-hidden flex flex-col justify-between group relative snap-start ${
                    isCheckedInCatalog
                      ? "border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-950/20"
                      : "border-blue-500/20 hover:border-blue-500/40"
                  }`}
                >
                  {/* Top Checkbox Button for Multi-selection */}
                  {currentUser.role !== "admin" && currentUser.role !== "staff" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCatalogServiceIds((prev) =>
                          prev.includes(srv.id) ? prev.filter((id) => id !== srv.id) : [...prev, srv.id]
                        );
                      }}
                      className={`absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl border backdrop-blur-md transition flex items-center gap-1.5 text-[11px] font-extrabold cursor-pointer ${
                        isCheckedInCatalog
                          ? "bg-cyan-400 text-slate-950 border-cyan-300 shadow-md"
                          : "bg-slate-950/80 text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-white"
                      }`}
                      title={isCheckedInCatalog ? "Bỏ chọn dịch vụ này" : "Tích chọn dịch vụ này"}
                    >
                      {isCheckedInCatalog ? (
                        <>
                          <CheckSquare className="w-4 h-4 text-slate-950" />
                          <span>Đã chọn</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4 text-slate-400" />
                          <span>Chọn</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Demo Image Thumbnail */}
                  <div className="h-44 bg-slate-900 relative overflow-hidden">
                    <img
                      src={srv.demoImages[0]}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091026] via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase ${categoryBadgeClass(srv.category)}`}>
                        {srv.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                      {srv.supportType}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition line-clamp-1">
                        {srv.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-blue-500/15 items-center">
                      <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate font-medium">{formatDaysRange(srv.estimatedDays, srv.maxDays)}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-semibold min-w-0">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="whitespace-nowrap text-[11px] sm:text-xs font-bold">{formatPriceRange(srv.estimatedPrice, srv.maxPrice)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {currentUser.role === "admin" || currentUser.role === "staff" ? (
                      <div className="pt-1">
                        <button
                          onClick={() => setActiveDetailService(srv)}
                          className="w-full py-2.5 px-3 rounded-xl border border-blue-500/30 bg-blue-950/50 hover:bg-blue-900/60 font-bold text-xs text-slate-200 transition flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" /> Xem chi tiết Dịch Vụ
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveDetailService(srv)}
                            className="flex-1 py-2 px-2.5 rounded-xl border border-blue-500/30 hover:bg-white/5 font-semibold text-xs text-slate-300 transition"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => handleAddToCart(srv)}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-cyan-300 font-bold text-xs transition flex items-center justify-center gap-1 border border-cyan-500/30"
                          >
                            <Plus className="w-3.5 h-3.5 text-cyan-400" /> Giỏ hàng
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (currentUser.role === "guest") {
                              setAuthModalOpen(true);
                            } else {
                              onSelectServiceToBook(srv.id);
                            }
                          }}
                          className="w-full py-2.5 px-3 rounded-xl gradient-btn font-bold text-xs shadow-md transition flex items-center justify-center gap-1"
                        >
                          Đặt ngay dịch vụ này <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Projects Gallery & Showcase Section */}
      <section id="sample-projects-section" className="space-y-6 pt-10 border-t border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/30">DỰ ÁN MẪU</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Ý tưởng thật. <span className="gradient-title-cyan">Sản phẩm thật.</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-normal">
              Một số dự án tiêu biểu mà 4YouTech đã thực hiện cho khách hàng.
            </p>
          </div>

          {/* SubCategory Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setProjectSubCategory("all")}
              className={`px-3.5 py-1.5 rounded-full transition ${
                projectSubCategory === "all"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                  : "bg-slate-900/80 text-slate-300 border border-blue-500/30 hover:bg-slate-900"
              }`}
            >
              Tất cả Mẫu
            </button>
            <button
              onClick={() => setProjectSubCategory("Logo")}
              className={`px-3.5 py-1.5 rounded-full transition ${
                projectSubCategory === "Logo"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                  : "bg-slate-900/80 text-slate-300 border border-blue-500/30 hover:bg-slate-900"
              }`}
            >
              🎨 Logo & Brand
            </button>
            <button
              onClick={() => setProjectSubCategory("Banner")}
              className={`px-3.5 py-1.5 rounded-full transition ${
                projectSubCategory === "Banner"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                  : "bg-slate-900/80 text-slate-300 border border-blue-500/30 hover:bg-slate-900"
              }`}
            >
              🖼️ Banner & Poster
            </button>
            <button
              onClick={() => setProjectSubCategory("Website")}
              className={`px-3.5 py-1.5 rounded-full transition ${
                projectSubCategory === "Website"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                  : "bg-slate-900/80 text-slate-300 border border-blue-500/30 hover:bg-slate-900"
              }`}
            >
              💻 Website & Portfolio
            </button>
            <button
              onClick={() => setProjectSubCategory("UI/UX")}
              className={`px-3.5 py-1.5 rounded-full transition ${
                projectSubCategory === "UI/UX"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-bold"
                  : "bg-slate-900/80 text-slate-300 border border-blue-500/30 hover:bg-slate-900"
              }`}
            >
              📱 App UI/UX
            </button>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProjects.map((proj) => (
            <div
              key={proj.id}
              className="dark-glass-card rounded-3xl border border-blue-500/25 overflow-hidden shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div
                className="h-56 bg-slate-950 relative overflow-hidden cursor-pointer"
                onClick={() => setPreviewProject(proj)}
              >
                <img
                  src={proj.image}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <span className="px-3.5 py-2 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4" /> Xem phóng to
                  </span>
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                    Dự án mẫu
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${categoryBadgeClass(proj.category)}`}>
                    {proj.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-extrabold text-white text-base group-hover:text-cyan-400 transition line-clamp-1">
                    {proj.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-blue-500/15 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setPreviewProject(proj)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {proj.link && proj.link.startsWith("http") && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-extrabold text-[11px] hover:bg-cyan-900 transition flex items-center gap-1 shadow-sm"
                        title="Mở link demo sản phẩm thực tế"
                      >
                        <ExternalLink className="w-3 h-3 text-cyan-400" /> Demo
                      </a>
                    )}
                    <button
                      onClick={() => {
                        const matchedSrv = services.find((s) => s.category === proj.category);
                        if (matchedSrv) onSelectServiceToBook(matchedSrv.id);
                        else onSwitchToWorkspace();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-cyan-300 font-bold text-xs hover:bg-blue-900/80 transition shrink-0"
                    >
                      Đặt mẫu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Pagination Bar */}
        {totalProjectPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-blue-500/20">
            <div className="text-xs text-slate-400 font-medium">
              Đang xem trang <span className="text-cyan-400 font-bold">{currentProjectPage}</span> / <span className="text-white font-bold">{totalProjectPages}</span> (Hiển thị <span className="text-white font-bold">{Math.min(filteredProjects.length, (currentProjectPage - 1) * PROJECTS_PER_PAGE + 1)}</span> - <span className="text-white font-bold">{Math.min(filteredProjects.length, currentProjectPage * PROJECTS_PER_PAGE)}</span> trên tổng số <span className="text-cyan-400 font-bold">{filteredProjects.length}</span> dự án mẫu)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentProjectPage > 1) {
                    setCurrentProjectPage((prev) => prev - 1);
                    document.getElementById("sample-projects-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                disabled={currentProjectPage === 1}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentProjectPage === 1
                    ? "bg-slate-900/50 text-slate-600 cursor-not-allowed border border-slate-800"
                    : "bg-blue-950/80 text-cyan-300 border border-blue-500/30 hover:bg-blue-900 hover:text-white"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Trang trước
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalProjectPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentProjectPage(pageNum);
                      document.getElementById("sample-projects-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition ${
                      currentProjectPage === pageNum
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/50 scale-105"
                        : "bg-slate-900/80 text-slate-400 border border-blue-500/20 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (currentProjectPage < totalProjectPages) {
                    setCurrentProjectPage((prev) => prev + 1);
                    document.getElementById("sample-projects-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                disabled={currentProjectPage === totalProjectPages}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentProjectPage === totalProjectPages
                    ? "bg-slate-900/50 text-slate-600 cursor-not-allowed border border-slate-800"
                    : "bg-blue-950/80 text-cyan-300 border border-blue-500/30 hover:bg-blue-900 hover:text-white"
                }`}
              >
                Trang sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Working Process Section ("Quy trình làm việc") */}
      <section className="space-y-8 pt-10 border-t border-blue-500/20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/30">QUY TRÌNH LÀM VIỆC</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Đơn giản nhưng hiệu quả</h2>
          <p className="text-slate-400 text-xs">Chúng tôi tối ưu quy trình để mang lại trải nghiệm tốt nhất cho bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl dark-glass-card border border-blue-500/25 relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-cyan-400">01</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-900/60 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                <Mail className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Chia sẻ ý tưởng</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Trao đổi nhu cầu, mục tiêu và định hướng dự án để chốt phạm vi công việc.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark-glass-card border border-blue-500/25 relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-cyan-400">02</span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Laptop className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Thiết kế & phát triển</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Lên ý tưởng, thiết kế, lập trình và thường xuyên cập nhật tiến độ cho bạn.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark-glass-card border border-blue-500/25 relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-cyan-400">03</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Bàn giao & hỗ trợ</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Hoàn thiện, bàn giao sản phẩm chính thức và đồng hành hỗ trợ sau dự án.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section ("LET'S BUILD TOGETHER") */}
      <section className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-blue-950 via-[#0a1435] to-cyan-950 border border-blue-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">LET'S BUILD TOGETHER</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Bạn có ý tưởng. <span className="gradient-title-cyan">Chúng tôi giúp hiện thực hóa.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dù là một bài tập, dự án cá nhân hay dự án cho câu lạc bộ – 4YouTech luôn sẵn sàng đồng hành cùng bạn.
          </p>
        </div>

        <div className="space-y-2 text-center shrink-0">
          <button
            onClick={() => {
              if (currentUser.role === "guest") setAuthModalOpen(true);
              else onSwitchToWorkspace();
            }}
            className="px-8 py-4 rounded-full gradient-btn font-extrabold text-sm shadow-xl shadow-cyan-500/30 hover:scale-105 transition"
          >
            Trao đổi cùng 4YouTech →
          </button>
          <div className="text-[11px] text-slate-400 font-medium">Tư vấn miễn phí • Phản hồi nhanh chóng</div>
        </div>
      </section>

      {/* Project Image Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setPreviewProject(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${categoryBadgeClass(previewProject.category)}`}>
                {previewProject.category}
              </span>
              {previewProject.subCategory && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
                  #{previewProject.subCategory}
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900">{previewProject.name}</h3>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={previewProject.image} alt={previewProject.name} className="w-full max-h-96 object-cover" />
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{previewProject.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {previewProject.link ? (
                <a
                  href={previewProject.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  Xem Demo Trực Tiếp <ExternalLink className="w-4 h-4" />
                </a>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewProject(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    const matchedSrv = services.find((s) => s.category === previewProject.category);
                    setPreviewProject(null);
                    if (matchedSrv) onSelectServiceToBook(matchedSrv.id);
                    else onSwitchToWorkspace();
                  }}
                  className="px-5 py-2 gradient-btn text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Đặt Dịch Vụ Tương Tự
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {activeDetailService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-fade-in space-y-6">
            <button
              onClick={() => setActiveDetailService(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${categoryBadgeClass(activeDetailService.category)}`}>
                {activeDetailService.category}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-md">
                Hình thức: {activeDetailService.supportType}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">{activeDetailService.name}</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{activeDetailService.description}</p>
            </div>

            {/* Gallery Images */}
            {activeDetailService.demoImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh tham khảo</span>
                <div className="grid grid-cols-2 gap-3">
                  {activeDetailService.demoImages.map((imgUrl, idx) => (
                    <img key={idx} src={imgUrl} alt="demo" className="rounded-xl h-36 w-full object-cover border border-slate-200" />
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Parameters */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div>
                <div className="text-xs text-slate-500 font-medium">Giá tham khảo</div>
                <div className="text-sm font-bold text-emerald-600 mt-1">
                  {formatPriceRange(activeDetailService.estimatedPrice, activeDetailService.maxPrice)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Thời gian dự kiến</div>
                <div className="text-sm font-bold text-sky-600 mt-1">
                  {formatDaysRange(activeDetailService.estimatedDays, activeDetailService.maxDays)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Số lần chỉnh sửa</div>
                <div className="text-sm font-bold text-purple-600 mt-1">
                  Tối đa {activeDetailService.maxRevisions} lần
                </div>
              </div>
            </div>

            {/* Scope & Output */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phạm vi & Sản phẩm bàn giao</span>
              <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 text-xs text-sky-950 font-medium leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-sky-600 inline mr-2" />
                {activeDetailService.scopeOutput}
              </div>
            </div>

            {/* Payment Policy Alert */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Quy định thanh toán:</span> Đặt cọc <strong>50%</strong> sau khi chốt báo giá để thực hiện. Thanh toán <strong>50% còn lại</strong> sau khi kiểm tra & nghiệm thu hoàn tất!
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveDetailService(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
              {currentUser.role !== "admin" && currentUser.role !== "staff" ? (
                <>
                  <button
                    onClick={() => {
                      handleAddToCart(activeDetailService);
                      setActiveDetailService(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200"
                  >
                    <Plus className="w-4 h-4 text-sky-600" /> Thêm vào Giỏ hàng
                  </button>
                  <button
                    onClick={() => {
                      const srvId = activeDetailService.id;
                      setActiveDetailService(null);
                      if (currentUser.role === "guest") setAuthModalOpen(true);
                      else onSelectServiceToBook(srvId);
                    }}
                    className="px-5 py-2.5 rounded-xl gradient-btn font-bold text-xs shadow-md"
                  >
                    Tiến hành Đặt ngay
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register / Forgot Password) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in space-y-5">
            <button
              onClick={() => {
                setAuthModalOpen(false);
                setOtpStep(false);
                setAuthMessage("");
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Auth Header Tabs */}
            {!otpStep && (
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => { setAuthTab("login"); setAuthMessage(""); setOtpStep(false); }}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition ${
                    authTab === "login" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-400"
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => { setAuthTab("register"); setAuthMessage(""); setOtpStep(false); }}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition ${
                    authTab === "register" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-400"
                  }`}
                >
                  Tạo tài khoản
                </button>
              </div>
            )}

            {authMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-semibold text-center leading-relaxed">
                {authMessage}
              </div>
            )}

            {/* LOGIN FORM */}
            {authTab === "login" && !otpStep && (
              <div className="space-y-4">
                <form onSubmit={handleGuestLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email tài khoản *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="student@edu.vn"
                        className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Mật khẩu *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab("forgot");
                          setForgotStep(1);
                          setForgotEmail(loginEmail);
                          setAuthMessage("");
                        }}
                        className="text-xs font-bold text-sky-600 hover:underline"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="Mật khẩu của bạn"
                        className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md mt-1"
                  >
                    Đăng Nhập Khách Hàng
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500">Hoặc đăng nhập nhanh tài khoản mẫu:</div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        switchRole("customer");
                        setAuthModalOpen(false);
                        onSwitchToWorkspace();
                      }}
                      className="w-full p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/80 text-blue-900 font-bold text-xs flex items-center justify-between transition"
                    >
                      <span>🎓 Khách hàng Demo (Nguyễn Văn An)</span>
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() => {
                        switchRole("staff");
                        setAuthModalOpen(false);
                        onSwitchToWorkspace();
                      }}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/80 text-purple-900 font-bold text-xs flex items-center justify-between transition"
                    >
                      <span>🛠️ Nhân viên Demo (Trần Bảo IT)</span>
                      <ChevronRight className="w-4 h-4 text-purple-600" />
                    </button>

                    <button
                      onClick={() => {
                        switchRole("admin");
                        setAuthModalOpen(false);
                        onSwitchToWorkspace();
                      }}
                      className="w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/80 text-amber-900 font-bold text-xs flex items-center justify-between transition"
                    >
                      <span>👑 Admin Demo (Quản trị viên)</span>
                      <ChevronRight className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REGISTER FORM STEP 1: FILL FORM */}
            {authTab === "register" && !otpStep && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email sinh viên / nhận OTP hệ thống *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="student@edu.vn"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại Zalo *</label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu *</label>
                  <input
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Mật khẩu bảo mật"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    required
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md mt-2"
                >
                  Đăng Ký & Gửi Mã OTP Qua Email Hệ Thống
                </button>
              </form>
            )}

            {/* REGISTER FORM STEP 2: VERIFY OTP */}
            {authTab === "register" && otpStep && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                
                {/* System Email Sent Notification Banner */}
                <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs space-y-1.5 border border-cyan-400/40">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-bold text-cyan-300">📧 Email Hệ Thống Đã Gửi Mã OTP</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed text-[11px]">
                    Hệ thống đã phát mã OTP 6 chữ số tới hòm thư: <strong className="text-white">{activationEmail}</strong>. Vui lòng kiểm tra <strong>Hộp thư đến</strong> (bao gồm cả thư rác / Spam).
                  </div>
                  {simulatedOtpCode && (
                    <button
                      type="button"
                      onClick={() => setOtpInput(simulatedOtpCode)}
                      className="mt-1 px-3 py-1.5 bg-cyan-400 text-slate-950 font-bold text-[11px] rounded-xl hover:bg-cyan-300 transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Tự Động Điền OTP ({simulatedOtpCode})
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                    Nhập mã OTP 6 chữ số *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 border-2 border-sky-500 rounded-xl text-center font-mono font-black text-xl tracking-widest outline-none font-bold text-slate-900 bg-white"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Thời gian hiệu lực: <strong className="text-rose-600">{otpTimer}s</strong></span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Gửi lại OTP
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpStep(false); setAuthMessage(""); }}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Quay lại
                  </button>
                  <button type="submit" className="flex-1 py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                    Xác Nhận OTP & Kích Hoạt
                  </button>
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD FLOW */}
            {authTab === "forgot" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">Khôi Phục Mật Khẩu Tài Khoản</h3>
                  <button
                    type="button"
                    onClick={() => { setAuthTab("login"); setAuthMessage(""); }}
                    className="text-xs text-sky-600 font-bold hover:underline"
                  >
                    Quay lại Đăng nhập
                  </button>
                </div>

                {/* STEP 1: Enter Email */}
                {forgotStep === 1 && (
                  <form onSubmit={handleForgotStep1} className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Nhập Email tài khoản của bạn. Hệ thống sẽ gửi Mã OTP 6 chữ số đến hòm thư của bạn.
                    </p>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email đăng ký *</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="student@edu.vn"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                      />
                    </div>
                    <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                      Gửi Mã OTP Khôi Phục Qua Email
                    </button>
                  </form>
                )}

                {/* STEP 2: Enter OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleForgotStep2} className="space-y-3">
                    {forgotSimulatedOtp && (
                      <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs space-y-1.5 border border-cyan-400/40">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                          <Mail className="w-3.5 h-3.5" /> Email Hệ Thống Đã Gửi OTP Khôi Phục
                        </div>
                        <div className="text-slate-200 text-[11px]">
                          Đã phát OTP đến <strong className="text-white">{forgotEmail}</strong>. Vui lòng kiểm tra Hộp thư.
                        </div>
                        <button
                          type="button"
                          onClick={() => setForgotOtpInput(forgotSimulatedOtp)}
                          className="mt-1 px-3 py-1 bg-cyan-400 text-slate-950 font-bold text-[10px] rounded-xl hover:bg-cyan-300 transition flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Tự Động Điền OTP ({forgotSimulatedOtp})
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                        Nhập mã OTP 6 chữ số *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={forgotOtpInput}
                        onChange={(e) => setForgotOtpInput(e.target.value)}
                        placeholder="123456"
                        className="w-full px-4 py-2.5 border-2 border-sky-500 rounded-xl text-center font-mono font-black text-lg tracking-widest outline-none font-bold text-slate-900 bg-white"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                      Xác Nhận OTP & Đặt Mật Khẩu Mới
                    </button>
                  </form>
                )}

                {/* STEP 3: Enter New Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleForgotStep3} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
                      <input
                        type="password"
                        required
                        value={forgotNewPass}
                        onChange={(e) => setForgotNewPass(e.target.value)}
                        placeholder="Mật khẩu mới"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                      <input
                        type="password"
                        required
                        value={forgotConfirmPass}
                        onChange={(e) => setForgotConfirmPass(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                      Hoàn Tất Đặt Lại Mật Khẩu
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
