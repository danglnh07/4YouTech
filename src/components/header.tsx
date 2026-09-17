"use client";

import React, { useState } from "react";
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
  Lock
} from "lucide-react";

export function Header({
  activeTab,
  setActiveTab,
  onOpenAuth
}: {
  activeTab: "catalog" | "projects" | "workspace";
  setActiveTab: (tab: "catalog" | "projects" | "workspace") => void;
  onOpenAuth?: (portal: "customer" | "management") => void;
}) {
  const { currentUser, logout, resetToDefaultSeed, orders } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const isAuthenticated = currentUser.role !== "guest";

  const userOrders = orders.filter((o) => {
    if (currentUser.role === "customer") return o.customerId === currentUser.id;
    if (currentUser.role === "staff") return o.assignedStaffId === currentUser.id;
    return true; // Admin sees all
  });

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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("catalog")}>
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center font-bold text-xl shadow-md">
              4Y
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-lg tracking-tight text-slate-900">
                4YouTech <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500 animate-pulse" />
              </div>
              <div className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                Dịch vụ IT & Design Sinh Viên
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

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative transition"
                >
                  <Bell className="w-5 h-5" />
                  {userOrders.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
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
              <div className="relative">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth && onOpenAuth("customer")}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng Nhập Khách Hàng
                </button>

                <button
                  onClick={() => onOpenAuth && onOpenAuth("management")}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                  title="Dành riêng cho Admin & Staff IT/Design"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" /> Cổng Admin / Staff
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
