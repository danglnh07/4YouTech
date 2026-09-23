"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/lib/app-context";
import { Header } from "@/components/header";
import { GuestView } from "@/components/guest-view";
import { CustomerView } from "@/components/customer-view";
import { StaffView } from "@/components/staff-view";
import { AdminView } from "@/components/admin-view";
import { UnifiedAuthPage } from "@/components/auth-pages";
import { AboutView } from "@/components/about-view";
import { Sparkles, Heart, ShieldCheck, Mail, Phone, MapPin, Lock, LogOut } from "lucide-react";

function MainAppContent() {
  const { currentUser, logout, switchRole } = useApp();
  const [activeTab, setActiveTab] = useState<"catalog" | "projects" | "about" | "workspace" | "auth">("catalog");
  const [preselectedBookingServiceId, setPreselectedBookingServiceId] = useState<string | string[] | undefined>(undefined);

  const handleSelectServiceToBook = (serviceId: string | string[]) => {
    setPreselectedBookingServiceId(serviceId);
    if (currentUser.role === "guest") {
      switchRole("customer");
    }
    setActiveTab("workspace");
  };

  const handleOpenAuth = () => {
    setActiveTab("auth");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab === "catalog" || activeTab === "projects" || activeTab === "about" || activeTab === "workspace" ? activeTab : "catalog"}
        setActiveTab={(t) => setActiveTab(t)}
        onOpenAuth={handleOpenAuth}
        onSelectServiceToBook={handleSelectServiceToBook}
      />

      {/* Main Content Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Unified Auth Page (Single Login Portal for Customer, Staff & Admin) */}
        {activeTab === "auth" && (
          <UnifiedAuthPage
            onAuthSuccess={() => setActiveTab("workspace")}
          />
        )}

        {/* Catalog Dịch vụ */}
        {activeTab === "catalog" && (
          <GuestView
            onSelectServiceToBook={handleSelectServiceToBook}
            onSwitchToWorkspace={() => setActiveTab("workspace")}
            activeTab="catalog"
          />
        )}

        {/* Public Projects Showcase */}
        {activeTab === "projects" && (
          <GuestView
            onSelectServiceToBook={handleSelectServiceToBook}
            onSwitchToWorkspace={() => setActiveTab("workspace")}
            activeTab="projects"
          />
        )}

        {/* About Us (Về Chúng Tôi) */}
        {activeTab === "about" && (
          <AboutView
            onSelectServiceToBook={handleSelectServiceToBook}
            onSwitchToWorkspace={() => setActiveTab("workspace")}
          />
        )}

        {/* Workspace according strictly to active User Role */}
        {activeTab === "workspace" && (
          <>
            {currentUser.role === "guest" && (
              <UnifiedAuthPage
                onAuthSuccess={() => setActiveTab("workspace")}
              />
            )}

            {currentUser.role === "customer" && (
              <CustomerView preselectedServiceId={preselectedBookingServiceId} />
            )}

            {currentUser.role === "staff" && <StaffView />}

            {currentUser.role === "admin" && <AdminView />}
          </>
        )}

      </main>

      {/* Dark Futuristic Footer */}
      <footer className="border-t border-blue-500/20 bg-[#060b1e]/90 backdrop-blur-xl mt-20 pt-14 pb-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Social */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center font-black text-lg shadow-md">
                  4Y
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg text-white tracking-tight leading-none">4YouTech</span>
                  <span className="text-[10px] text-cyan-400 font-bold leading-tight mt-0.5">Ideas for a better tomorrow</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                Giải pháp IT & Design cho ý tưởng của bạn. Hệ thống hỗ trợ sinh viên, cá nhân và CLB toàn diện.
              </p>

              <div className="flex items-center gap-3 text-slate-300 pt-1">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500 transition">
                  <span className="font-bold text-xs">f</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500 transition">
                  <span className="font-bold text-xs">🌐</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500 transition">
                  <span className="font-bold text-xs">🎵</span>
                </a>
                <a href="mailto:support@4youtech.com" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500 transition">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Column 2: Dịch vụ */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-xs">Dịch vụ</div>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><a href="#catalog" className="hover:text-cyan-400 transition">Website & Portfolio</a></li>
                <li><a href="#catalog" className="hover:text-cyan-400 transition">UI/UX Design</a></li>
                <li><a href="#catalog" className="hover:text-cyan-400 transition">Thiết kế đồ họa</a></li>
                <li><a href="#catalog" className="hover:text-cyan-400 transition">Video & Motion</a></li>
              </ul>
            </div>

            {/* Column 3: Khám phá */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-xs">Khám phá</div>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><button onClick={() => setActiveTab("about")} className="hover:text-cyan-400 transition">Về chúng tôi</button></li>
                <li><button onClick={() => setActiveTab("projects")} className="hover:text-cyan-400 transition">Sản phẩm mẫu</button></li>
                <li><a href="#catalog" className="hover:text-cyan-400 transition">Quy trình làm việc</a></li>
                <li><button onClick={() => setActiveTab("about")} className="hover:text-cyan-400 transition">Câu hỏi thường gặp</button></li>
              </ul>
            </div>

            {/* Column 4: Kết nối */}
            <div className="space-y-4">
              <div className="font-bold text-white uppercase tracking-wider text-xs">Kết nối với chúng tôi</div>
              <button
                onClick={() => setActiveTab("auth")}
                className="w-full py-3 px-4 rounded-xl gradient-btn font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                Tư vấn dự án <span className="text-sm">→</span>
              </button>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sẵn sàng đồng hành cùng bạn trên mọi hành trình số hóa.
              </p>
            </div>

          </div>

          {/* Bottom Copyright line */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>© 2026 4YouTech. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300 transition">Điều khoản sử dụng</a>
              <span>|</span>
              <a href="#" className="hover:text-slate-300 transition">Chính sách bảo mật</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export function BookingSite({ services }: { services?: any }) {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
