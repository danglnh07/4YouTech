"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { ServiceItem, SampleProject, ServiceCategory } from "@/lib/store";
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
  Info
} from "lucide-react";

export function GuestView({
  onSelectServiceToBook,
  onSwitchToWorkspace
}: {
  onSelectServiceToBook: (serviceId: string) => void;
  onSwitchToWorkspace: () => void;
}) {
  const { services, projects, currentUser, switchRole, registerCustomerWithOtp, addToCart } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupportType, setSelectedSupportType] = useState<string>("all");
  const [activeDetailService, setActiveDetailService] = useState<ServiceItem | null>(null);

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
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "" });
  const [authMessage, setAuthMessage] = useState("");

  // Visible services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (srv.hidden) return false;
      const matchesSearch =
        srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || srv.category === selectedCategory;
      const matchesSupport =
        selectedSupportType === "all" || srv.supportType === selectedSupportType;
      return matchesSearch && matchesCategory && matchesSupport;
    });
  }, [services, searchTerm, selectedCategory, selectedSupportType]);

  const categoryBadgeClass = (cat: ServiceCategory) => {
    if (cat === "IT") return "badge-it";
    if (cat === "Design") return "badge-design";
    return "badge-mixed";
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.phone) {
      setAuthMessage("Vui lòng điền đầy đủ họ tên, email và số điện thoại.");
      return;
    }
    registerCustomerWithOtp({ ...regForm, password: "Customer@123" });
    setAuthMessage("Tạo tài khoản thành công! Đã đăng nhập tự động.");
    setTimeout(() => {
      setAuthModalOpen(false);
      onSwitchToWorkspace();
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up border border-slate-700">
          <ShoppingBag className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-cyan-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Nền tảng hỗ trợ Đồ án & Dịch vụ IT/Design Chất Lượng Cao
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Giải pháp IT & Design <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              Chuyên Nghiệp cho Sinh Viên & CLB
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            Nhận thiết kế Website Portfolio, UI/UX App, Sơ đồ CSDL ERD, Phân tích Hệ thống SRS và Ấn phẩm truyền thông với chi phí tối ưu, quy trình nghiệm thu rõ ràng.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#catalog"
              className="px-6 py-3.5 rounded-xl gradient-btn font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              Khám phá Dịch vụ <ArrowRight className="w-4 h-4" />
            </a>
            
            {currentUser.role === "guest" ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Đăng ký / Đăng nhập
              </button>
            ) : (
              <button
                onClick={onSwitchToWorkspace}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition flex items-center gap-2 shadow-md shadow-emerald-900/30"
              >
                <Layers className="w-4 h-4" /> Đã đăng nhập: Vào Workspace ({currentUser.name})
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs">
            <div>
              <div className="text-2xl font-black text-white">100+</div>
              <div className="text-slate-400">Dự án hoàn thành</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400">99.8%</div>
              <div className="text-slate-400">Đánh giá 5 sao</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-400">100%</div>
              <div className="text-slate-400">Bảo mật & Đúng hạn</div>
            </div>
            <div>
              <div className="text-2xl font-black text-teal-400">24/7</div>
              <div className="text-slate-400">Hỗ trợ kỹ thuật</div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Policy Notice Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 text-amber-900 shadow-xs">
        <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
          <Info className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-0.5 flex-1">
          <div className="font-extrabold text-xs sm:text-sm flex items-center gap-2">
            ⚠️ Quy Định Đặt Đơn & Thanh Toán 50% - 50% tại 4YouTech:
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            1. Quý khách có thể <strong>Đặt Dịch Vụ ngay</strong> hoặc <strong>Thêm vào Giỏ hàng</strong> để book cùng lúc nhiều dịch vụ.<br />
            2. Sau khi Admin xem xét yêu cầu & chốt báo giá, quý khách <strong>thanh toán đặt cọc 50%</strong> trước để bắt đầu thực hiện.<br />
            3. Khi sản phẩm hoàn thành, quý khách kiểm tra <strong>Nghiệm Thu thành công</strong> rồi thanh toán <strong>50% còn lại</strong> để nhận bàn giao chính thức.
          </p>
        </div>
      </div>

      {/* Services Catalog Section */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Catalog Dịch vụ</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Danh mục Gói Dịch Vụ 4YouTech</h2>
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
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {["all", "IT", "Design", "IT/Design"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </button>
              ))}
            </div>

            {/* Support Type Filter */}
            <select
              value={selectedSupportType}
              onChange={(e) => setSelectedSupportType(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-medium rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">Hình thức: Tất cả</option>
              <option value="Online">Hỗ trợ Online</option>
              <option value="Direct">Trực tiếp</option>
              <option value="Hybrid">Kết hợp Hybrid</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="font-bold text-slate-700">Không tìm thấy dịch vụ phù hợp</div>
            <div className="text-xs text-slate-400 mt-1">Vui lòng thay đổi từ khóa hoặc bộ lọc tìm kiếm.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col overflow-hidden group"
              >
                {/* Demo Image Thumbnail */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  <img
                    src={srv.demoImages[0]}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase ${categoryBadgeClass(srv.category)}`}>
                      {srv.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-semibold">
                    {srv.supportType}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition line-clamp-1">
                      {srv.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  {/* Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{srv.estimatedDays ? `${srv.estimatedDays} ngày` : "Liên hệ báo giá"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{srv.estimatedPrice ? `${srv.estimatedPrice.toLocaleString("vi-VN")} ₫` : "Báo giá linh hoạt"}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveDetailService(srv)}
                        className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 transition"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleAddToCart(srv)}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1 border border-slate-200"
                      >
                        <Plus className="w-3.5 h-3.5 text-indigo-600" /> Giỏ hàng
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
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1"
                    >
                      Đặt Dịch Vụ Ngay <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sample Projects Gallery Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div>
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Showcase Công Khai</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Sản Phẩm & Mẫu Đồ Án Tiêu Biểu</h2>
          <p className="text-slate-500 text-sm mt-1">
            Các dự án thực tế do 4YouTech thiết kế & lập trình đã được cho phép công khai.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-extrabold ${categoryBadgeClass(proj.category)}`}>
                  {proj.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition">
                    {proj.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-3"
                  >
                    Xem sản phẩm mẫu <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

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
                  {activeDetailService.estimatedPrice ? `${activeDetailService.estimatedPrice.toLocaleString("vi-VN")} ₫` : "Báo giá linh hoạt"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Thời gian dự kiến</div>
                <div className="text-sm font-bold text-indigo-600 mt-1">
                  {activeDetailService.estimatedDays ? `${activeDetailService.estimatedDays} ngày` : "Thỏa thuận"}
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
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 inline mr-2" />
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
              <button
                onClick={() => {
                  handleAddToCart(activeDetailService);
                  setActiveDetailService(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200"
              >
                <Plus className="w-4 h-4 text-indigo-600" /> Thêm vào Giỏ hàng
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
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register / Forgot Password) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in space-y-6">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Auth Header Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => { setAuthTab("login"); setAuthMessage(""); }}
                className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition ${
                  authTab === "login" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => { setAuthTab("register"); setAuthMessage(""); }}
                className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition ${
                  authTab === "register" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"
                }`}
              >
                Tạo tài khoản
              </button>
            </div>

            {authMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl font-medium text-center">
                {authMessage}
              </div>
            )}

            {/* Login Form */}
            {authTab === "login" && (
              <div className="space-y-4">
                <div className="text-xs text-slate-500">
                  Chọn nhanh tài khoản thử nghiệm hoặc đăng nhập bằng tài khoản của bạn:
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      switchRole("customer");
                      setAuthModalOpen(false);
                      onSwitchToWorkspace();
                    }}
                    className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/80 text-blue-900 font-bold text-xs flex items-center justify-between transition"
                  >
                    <span>🎓 Đăng nhập Demo: Khách hàng (Nguyễn Văn An)</span>
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                  </button>

                  <button
                    onClick={() => {
                      switchRole("staff");
                      setAuthModalOpen(false);
                      onSwitchToWorkspace();
                    }}
                    className="w-full p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/80 text-purple-900 font-bold text-xs flex items-center justify-between transition"
                  >
                    <span>🛠️ Đăng nhập Demo: Nhân viên (Trần Bảo IT)</span>
                    <ChevronRight className="w-4 h-4 text-purple-600" />
                  </button>

                  <button
                    onClick={() => {
                      switchRole("admin");
                      setAuthModalOpen(false);
                      onSwitchToWorkspace();
                    }}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/80 text-amber-900 font-bold text-xs flex items-center justify-between transition"
                  >
                    <span>👑 Đăng nhập Demo: Quản trị viên (Admin)</span>
                    <ChevronRight className="w-4 h-4 text-amber-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Register Form */}
            {authTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email sinh viên / liên hệ *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="student@edu.vn"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md mt-2"
                >
                  Đăng Ký Tài Khoản Khách Hàng
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
