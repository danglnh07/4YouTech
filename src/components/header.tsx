"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { Role } from "@/lib/store";
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
  ShoppingBag
} from "lucide-react";
import { CartDrawerModal } from "@/components/cart-drawer-modal";

export function Header({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onSelectServiceToBook
}: {
  activeTab: "catalog" | "projects" | "about" | "workspace";
  setActiveTab: (tab: "catalog" | "projects" | "about" | "workspace") => void;
  onOpenAuth?: () => void;
  onSelectServiceToBook?: (serviceId: string) => void;
}) {
  const { currentUser, logout, resetToDefaultSeed, orders, cart } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

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
    guest: "bg-slate-100 text-slate-700 border-slate-300",
    customer: "bg-blue-50 text-blue-700 border-blue-300",
    staff: "bg-purple-50 text-purple-700 border-purple-300",
    admin: "bg-amber-50 text-amber-800 border-amber-300"
  };

  const roleLabels: Record<Role, { title: string; badge: string; icon: React.ReactNode }> = {
    guest: { title: "Khách xem", badge: "Guest", icon: <Eye className="w-3.5 h-3.5 text-slate-500" /> },
    customer: { title: "Khách hàng", badge: "Customer", icon: <UserCheck className="w-3.5 h-3.5 text-blue-600" /> },
    staff: { title: "Nhân viên IT/Design", badge: "Staff", icon: <Wrench className="w-3.5 h-3.5 text-purple-600" /> },
    admin: { title: "Quản trị viên", badge: "Admin", icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> }
  };

  return (
    <header className="sticky top-0 z-40 glass-header shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0" 
            onClick={() => {
              setActiveTab("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            title="Nhấp để về Trang chủ"
          >
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
              4Y
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 font-black text-base sm:text-lg tracking-tight text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                4YouTech <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500 animate-pulse shrink-0" />
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-indigo-600 tracking-wide whitespace-nowrap leading-none mt-0.5">
                Your Tech & Design
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "catalog"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Danh sách Dịch vụ
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "projects"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sản phẩm Mẫu
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "about"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Về Chúng Tôi
            </button>

            <button
              onClick={() => setActiveTab("workspace")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "workspace"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-700 hover:text-indigo-600"
              }`}
            >
              <Layers className="w-4 h-4" />
              Dashboard {isAuthenticated && `(${roleLabels[currentUser.role].badge})`}
            </button>
          </nav>

          {/* Right User Toolbar */}
          <div className="flex items-center gap-3">
            
            {/* Reset Seed Button */}
            <button
              onClick={() => {
                if (confirm("Reset lại dữ liệu mặc định ban đầu?")) {
                  resetToDefaultSeed();
                  alert("Đã khôi phục dữ liệu mặc định!");
                }
              }}
              title="Khôi phục dữ liệu mẫu ban đầu"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Cart Button (Visible ONLY for Guest and Customer) */}
            {(currentUser.role === "guest" || currentUser.role === "customer") && (
              <button
                onClick={() => setShowCartModal(true)}
                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition border shadow-xs relative ${
                  cart.length > 0
                    ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                }`}
                title="Xem Giỏ hàng dịch vụ của bạn"
              >
                <ShoppingBag className={`w-4 h-4 ${cart.length > 0 ? "text-rose-600" : "text-indigo-600"}`} />
                <span className="hidden sm:inline">Giỏ Hàng</span>
                {cart.length > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-xs animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {/* Realtime Status Indicator Badge */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold cursor-help"
              title="Hệ thống đang hoạt động ở chế độ Real-time (Đồng bộ tức thì). Bất kỳ thay đổi nào từ Admin/Staff sẽ hiển thị ngay lập tức mà không cần F5/load trang!"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Realtime Sync Active
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div ref={notificationRef} className="relative">
                <button
                  onClick={() => {
                    const nextState = !showNotification;
                    setShowNotification(nextState);
                    if (nextState) {
                      setHasUnreadNotification(false);
                    }
                  }}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative transition"
                  title="Thông báo đơn hàng"
                >
                  <Bell className="w-5 h-5 text-slate-700" />
                  {hasUnreadNotification && userOrders.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotification && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fade-in">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="font-bold text-sm text-slate-800">Thông báo Đơn hàng</span>
                      <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
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
                            className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-slate-100"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                              <span>{ord.id}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                                {ord.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 line-clamp-1 font-medium">
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
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-xs transition ${
                    roleColors[currentUser.role]
                  }`}
                >
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Profile Menu Dropdown (Strictly Enforced Rules per Role) */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fade-in space-y-1">
                    
                    {/* User Profile Summary Header */}
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {roleLabels[currentUser.role].badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{currentUser.email}</div>
                    </div>

                    {/* Navigation Items based STRICTLY on User Role */}
                    {currentUser.role === "customer" && (
                      <button
                        onClick={() => {
                          setActiveTab("workspace");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 transition"
                      >
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <span>Customer Dashboard</span>
                      </button>
                    )}

                    {currentUser.role === "staff" && (
                      <button
                        onClick={() => {
                          setActiveTab("workspace");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 transition"
                      >
                        <Wrench className="w-4 h-4 text-purple-600" />
                        <span>Staff Workbench</span>
                      </button>
                    )}

                    {currentUser.role === "admin" && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab("workspace");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin Portal</span>
                        </button>
                      </>
                    )}

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-100 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setActiveTab("catalog");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
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
                className="px-4 py-2 rounded-xl gradient-btn font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Đăng Nhập / Đăng Ký
              </button>
            )}

          </div>

        </div>
      </div>

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
    </header>
  );
}
