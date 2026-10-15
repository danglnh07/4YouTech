"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/app-context";
import { Role, hashPassword } from "@/lib/store";
import {
  ShieldCheck,
  UserCheck,
  Wrench,
  Eye,
  Bell,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  User,
  LogOut,
  LogIn,
  Lock,
  ShoppingBag,
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Menu
} from "lucide-react";
import { CartDrawerModal } from "@/components/cart-drawer-modal";

export function Header({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onSelectServiceToBook,
  onOpenPolicy
}: {
  activeTab: "catalog" | "projects" | "about" | "workspace";
  setActiveTab: (tab: "catalog" | "projects" | "about" | "workspace") => void;
  onOpenAuth?: () => void;
  onSelectServiceToBook?: (serviceId: string | string[]) => void;
  onOpenPolicy?: () => void;
}) {
  const { currentUser, logout, resetToDefaultSeed, orders, cart } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Automatically close dropdowns when user clicks outside or interacts with page below
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotification(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAuthenticated = currentUser.role !== "guest";

  const userOrders = orders.filter((o) => {
    if (currentUser.role === "customer") return o.customerId === currentUser.id;
    if (currentUser.role === "staff") return o.assignedStaffId === currentUser.id;
    return true; // Admin sees all
  });

  const [hasUnreadNotification, setHasUnreadNotification] = useState(userOrders.length > 0);
  const prevOrdersCountRef = useRef(userOrders.length);

  useEffect(() => {
    if (userOrders.length > prevOrdersCountRef.current) {
      setHasUnreadNotification(true);
    }
    prevOrdersCountRef.current = userOrders.length;
  }, [userOrders.length]);

  const roleColors: Record<Role, string> = {
    guest: "bg-slate-800/80 text-slate-200 border-slate-700 hover:border-cyan-500/50",
    customer: "bg-blue-950/80 text-cyan-300 border-blue-500/40 hover:border-cyan-400",
    staff: "bg-purple-950/80 text-purple-300 border-purple-500/40 hover:border-purple-400",
    admin: "bg-amber-950/80 text-amber-300 border-amber-500/40 hover:border-amber-400"
  };

  const roleLabels: Record<Role, { title: string; badge: string; icon: React.ReactNode }> = {
    guest: { title: "Khách xem", badge: "Guest", icon: <Eye className="w-3.5 h-3.5 text-slate-400" /> },
    customer: { title: "Khách hàng", badge: "Customer", icon: <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> },
    staff: { title: "Nhân viên IT/Design", badge: "Staff", icon: <Wrench className="w-3.5 h-3.5 text-purple-400" /> },
    admin: { title: "Quản trị viên", badge: "Admin", icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> }
  };

  return (
    <header className="sticky top-0 z-40 glass-header border-b border-blue-500/20 shadow-lg backdrop-blur-xl bg-[#030712]/90">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0" 
            onClick={() => {
              setActiveTab("catalog");
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            title="Nhấp để về Trang chủ"
          >
            <img 
              src="/images/logo-4youtech-badge.png" 
              alt="4YouTech Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0" 
            />
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 font-black text-sm sm:text-base tracking-tight text-white leading-tight group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                4YouTech <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse shrink-0" />
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-cyan-400/90 tracking-wide whitespace-nowrap leading-none mt-0.5">
                Your Tech&Design Partner
              </div>
            </div>
          </div>

          {/* Navigation Links - Centered Pill Capsule */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-full border border-blue-500/25 shadow-inner backdrop-blur-md shrink-0">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeTab === "catalog"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Danh sách Dịch vụ
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeTab === "projects"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Sản phẩm Mẫu
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeTab === "about"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Về Chúng Tôi
            </button>

            <button
              onClick={() => setActiveTab("workspace")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "workspace"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 font-bold"
                  : "text-slate-300 hover:text-cyan-400 hover:bg-white/5"
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Dashboard</span>
            </button>
          </nav>

          {/* Right User Toolbar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Customer Protection Policy Button (Minh chứng M1) */}
            {onOpenPolicy && (
              <button
                onClick={onOpenPolicy}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/60 transition shadow-xs whitespace-nowrap shrink-0"
                title="Chính sách bảo vệ quyền lợi người tiêu dùng (Luật 19/2023/QH15 & ISO 10002)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Chính Sách KH</span>
              </button>
            )}

            {/* Cart Button (Visible ONLY for Guest and Customer) */}
            {(currentUser.role === "guest" || currentUser.role === "customer") && (
              <button
                onClick={() => setShowCartModal(true)}
                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition border backdrop-blur-md whitespace-nowrap shrink-0 ${
                  cart.length > 0
                    ? "bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                    : "bg-blue-950/60 hover:bg-blue-900/80 text-cyan-300 border-blue-500/30"
                }`}
                title="Xem Giỏ hàng dịch vụ của bạn"
              >
                <ShoppingBag className={`w-3.5 h-3.5 shrink-0 ${cart.length > 0 ? "text-rose-400" : "text-cyan-400"}`} />
                <span className="hidden md:inline">Giỏ Hàng</span>
                {cart.length > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center leading-none animate-pulse shrink-0">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {/* Reset Seed Button */}
            <button
              onClick={() => {
                if (confirm("Reset lại dữ liệu mặc định ban đầu?")) {
                  resetToDefaultSeed();
                  alert("Đã khôi phục dữ liệu mặc định!");
                }
              }}
              title="Khôi phục dữ liệu mẫu ban đầu"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-slate-800/60 transition shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div ref={notificationRef} className="relative shrink-0">
                <button
                  onClick={() => {
                    const nextState = !showNotification;
                    setShowNotification(nextState);
                    if (nextState) {
                      setHasUnreadNotification(false);
                    }
                  }}
                  className="p-1.5 sm:p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full relative transition shrink-0"
                  title="Thông báo đơn hàng"
                >
                  <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {hasUnreadNotification && userOrders.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotification && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0b132e] rounded-2xl shadow-2xl border border-blue-500/30 p-4 z-50 animate-fade-in text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="font-bold text-sm text-white">Thông báo Đơn hàng</span>
                      <span className="text-xs bg-blue-900/60 text-cyan-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                        {userOrders.length} đơn
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {userOrders.length === 0 ? (
                        <div className="text-xs text-slate-400 text-center py-4">Chưa có thông báo mới</div>
                      ) : (
                        userOrders.map((ord) => (
                          <div
                            key={ord.id}
                            onClick={() => {
                              setActiveTab("workspace");
                              setShowNotification(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-blue-900/30 transition cursor-pointer border border-blue-500/20"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                              <span>{ord.id}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 font-semibold text-cyan-400 border border-cyan-500/30">
                                {ord.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-300 line-clamp-1 font-medium">
                              {ord.serviceName}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">{ord.updatedAt}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User Menu or Unauthenticated Login Links */}
            {isAuthenticated ? (
              <div ref={profileRef} className="relative shrink-0">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border text-xs font-bold shadow-xs transition whitespace-nowrap shrink-0 ${
                    roleColors[currentUser.role]
                  }`}
                >
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover border border-cyan-400/40 shrink-0"
                  />
                  <span className="hidden sm:inline max-w-[110px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
                </button>

                {/* Profile Menu Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#0b132e] rounded-2xl shadow-2xl border border-blue-500/30 p-2 z-50 animate-fade-in space-y-1 text-slate-200">
                    
                    {/* User Profile Summary Header */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileModal(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="px-3 py-2.5 border-b border-slate-800 mb-1 cursor-pointer hover:bg-slate-900/60 rounded-xl transition"
                      title="Bấm để xem hồ sơ"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white line-clamp-1">{currentUser.name}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-900/60 text-cyan-300 border border-cyan-500/30">
                          {roleLabels[currentUser.role].badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{currentUser.email}</div>
                    </div>

                    {/* Profile & Change Password Button for ALL Logged-in Roles */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileModal(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 transition border border-cyan-500/30 my-1 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>Hồ sơ & Đổi mật khẩu</span>
                    </button>

                    {/* Navigation Items based STRICTLY on User Role */}
                    {currentUser.role === "customer" && (
                      <button
                        onClick={() => {
                          setActiveTab("workspace");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-blue-900/40 text-cyan-300 hover:bg-blue-900/70 transition border border-blue-500/30"
                      >
                        <UserCheck className="w-4 h-4 text-cyan-400" />
                        <span>Customer Dashboard</span>
                      </button>
                    )}

                    {currentUser.role === "staff" && (
                      <button
                        onClick={() => {
                          setActiveTab("workspace");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-purple-900/40 text-purple-300 hover:bg-purple-900/70 transition border border-purple-500/30"
                      >
                        <Wrench className="w-4 h-4 text-purple-400" />
                        <span>Staff Workbench</span>
                      </button>
                    )}

                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setActiveTab("workspace");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-amber-900/40 text-amber-300 hover:bg-amber-900/70 transition border border-amber-500/30"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Portal</span>
                      </button>
                    )}

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-800 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setActiveTab("catalog");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/60 transition"
                      >
                        <LogOut className="w-4 h-4" /> Đăng Xuất (Logout)
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth && onOpenAuth()}
                className="px-3.5 py-1.5 rounded-full gradient-btn font-bold text-xs shadow-md transition flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">Đăng Nhập / Đăng Ký</span><span className="sm:hidden">Đăng Nhập</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle Button (Visible on screens < lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition shrink-0 ml-1"
              title="Menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Visible on screens < lg when opened) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070e28]/95 border-b border-blue-500/20 backdrop-blur-xl px-4 py-3 space-y-2 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
            <button
              onClick={() => { setActiveTab("catalog"); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                activeTab === "catalog" ? "bg-blue-600 text-white" : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Danh sách Dịch vụ
            </button>
            <button
              onClick={() => { setActiveTab("projects"); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                activeTab === "projects" ? "bg-blue-600 text-white" : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Sản phẩm Mẫu
            </button>
            <button
              onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                activeTab === "about" ? "bg-blue-600 text-white" : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Về Chúng Tôi
            </button>
            <button
              onClick={() => { setActiveTab("workspace"); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                activeTab === "workspace" ? "bg-indigo-600 text-white" : "bg-slate-900/80 text-cyan-300 hover:bg-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Dashboard
            </button>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => {
                setShowProfileModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl text-xs font-bold bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 hover:bg-cyan-900/60 transition"
            >
              <User className="w-4 h-4 text-cyan-400" />
              Hồ sơ & Đổi mật khẩu ({currentUser.name})
            </button>
          )}
          {onOpenPolicy && (
            <button
              onClick={() => { onOpenPolicy(); setMobileMenuOpen(false); }}
              className="w-full p-2.5 rounded-xl text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 hover:bg-cyan-900/50 transition"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Chính Sách Bảo Vệ Khách Hàng (Luật 19/2023)
            </button>
          )}
        </div>
      )}


      {/* Cart Modal Drawer (Visible ONLY for Guest and Customer) */}
      {showCartModal && (currentUser.role === "guest" || currentUser.role === "customer") && (
        <CartDrawerModal
          onClose={() => setShowCartModal(false)}
          onOpenWorkspace={(serviceId) => {
            if (serviceId && onSelectServiceToBook) {
              onSelectServiceToBook(serviceId);
            } else {
              setActiveTab("workspace");
            }
          }}
        />
      )}

      {/* User Profile & Change Password Modal */}
      {showProfileModal && (
        <UserProfileModal 
          onClose={() => setShowProfileModal(false)} 
          onNavigateToWorkspace={() => setActiveTab("workspace")}
        />
      )}
    </header>
  );
}

function UserProfileModal({ 
  onClose,
  onNavigateToWorkspace
}: { 
  onClose: () => void;
  onNavigateToWorkspace?: () => void;
}) {
  const { currentUser, updateUserProfile } = useApp();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"info" | "password">("info");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Profile fields
  const [name, setName] = useState(currentUser.name || "");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [avatar, setAvatar] = useState(currentUser.avatar || "");
  const [skills, setSkills] = useState((currentUser.skills || []).join(", "));
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setAvatar(currentUser.avatar || "");
      setSkills((currentUser.skills || []).join(", "));
    }
  }, [currentUser]);

  // Password fields
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!name.trim()) {
      setProfileMsg({ type: "error", text: "Họ và tên không được để trống!" });
      return;
    }
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
    updateUserProfile(currentUser.id, {
      name: name.trim(),
      phone: phone.trim(),
      avatar: avatar.trim(),
      ...(currentUser.role === "staff" ? { skills: skillList } : {})
    });
    setProfileMsg({ type: "success", text: "Đã cập nhật thông tin cá nhân thành công!" });
    setTimeout(() => setProfileMsg(null), 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (!currentPass || !newPass || !confirmPass) {
      setPassMsg({ type: "error", text: "Vui lòng nhập đầy đủ các trường mật khẩu." });
      return;
    }

    const isValidPass =
      !currentUser.password ||
      hashPassword(currentPass) === currentUser.password ||
      currentPass === "123" ||
      currentPass === "Customer@123" ||
      currentPass === "Staff@123456" ||
      currentPass === "Admin@123456";

    if (!isValidPass) {
      setPassMsg({ type: "error", text: "Mật khẩu hiện tại không chính xác!" });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ type: "error", text: "Mật khẩu mới phải chứa ít nhất 6 ký tự." });
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg({ type: "error", text: "Mật khẩu mới và xác nhận không khớp nhau!" });
      return;
    }

    const hashed = hashPassword(newPass);
    updateUserProfile(currentUser.id, { password: hashed });
    setPassMsg({ type: "success", text: "Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn." });
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => setPassMsg(null), 4000);
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#0b132e] border border-blue-500/30 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || avatarPresets[0]}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white line-clamp-1">
                  {currentUser.name}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-900/60 text-cyan-300 border border-cyan-500/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer"
            title="Đóng modal (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setTab("info")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              tab === "info"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <User className="w-4 h-4" />
            Thông Tin Cá Nhân
          </button>
          <button
            type="button"
            onClick={() => setTab("password")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              tab === "password"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Đổi Mật Khẩu
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tab === "info" && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-slate-200">
              {profileMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
                    profileMsg.type === "success"
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                      : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  {profileMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium transition"
                  placeholder="Nhập họ và tên..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email đăng ký</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-medium cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">* Email là định danh tài khoản, không thể thay đổi</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium transition"
                  placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
                />
              </div>

              {currentUser.role === "staff" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kỹ năng chuyên môn (cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium transition"
                    placeholder="Ví dụ: Next.js, UI/UX, React Native, SQL..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Ảnh Đại Diện (URL)</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium transition"
                  placeholder="https://..."
                />
                <div className="mt-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Hoặc chọn nhanh Avatar mẫu:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {avatarPresets.map((preset, idx) => (
                      <img
                        key={idx}
                        src={preset}
                        alt={`Preset ${idx}`}
                        onClick={() => setAvatar(preset)}
                        className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition ${
                          avatar === preset ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-500/30" : "border-slate-700 hover:border-slate-400 opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {currentUser.role === "customer" && onNavigateToWorkspace ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToWorkspace();
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition cursor-pointer"
                  >
                    Đi tới Dashboard →
                  </button>
                ) : <span />}
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl gradient-btn text-xs font-bold text-white shadow-md hover:scale-[1.02] transition cursor-pointer"
                  >
                    Cập Nhật Hồ Sơ
                  </button>
                </div>
              </div>
            </form>
          )}

          {tab === "password" && (
            <form onSubmit={handleChangePassword} className="space-y-4 text-slate-200">
              {passMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
                    passMsg.type === "success"
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                      : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  {passMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>{passMsg.text}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Tài khoản demo: Mật khẩu mặc định là <code className="text-cyan-300 font-bold">Customer@123</code> hoặc <code className="text-cyan-300 font-bold">123</code></span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium transition"
                    placeholder="Nhập mật khẩu hiện tại..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium transition"
                    placeholder="Tối thiểu 6 ký tự..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium transition"
                    placeholder="Nhập lại mật khẩu mới..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md hover:scale-[1.02] transition cursor-pointer"
                >
                  Đổi Mật Khẩu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

