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
  const [preselectedBookingServiceId, setPreselectedBookingServiceId] = useState<string | undefined>(undefined);

  const handleSelectServiceToBook = (serviceId: string) => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f172a] via-[#1e3a8a] to-[#0f172a] selection:bg-sky-500 selection:text-white">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab === "catalog" || activeTab === "projects" || activeTab === "about" || activeTab === "workspace" ? activeTab : "catalog"}
        setActiveTab={(t) => setActiveTab(t)}
        onOpenAuth={handleOpenAuth}
        onSelectServiceToBook={handleSelectServiceToBook}
      />

      {/* Main Content Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
              4YouTech Platform
              <Sparkles className="w-4 h-4 text-sky-500 fill-sky-500" />
            </div>
            <p className="leading-relaxed">
              Hệ thống cung cấp dịch vụ IT, lập trình web portfolio, phân tích hệ thống, CSDL ERD và thiết kế nhận diện thương hiệu dành riêng cho Sinh viên & CLB.
            </p>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Hỗ Trợ Dịch Vụ</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sky-500" /> Hotline: 0999.888.777</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sky-500" /> Email: support@4youtech.com</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-500" /> Khu Công Nghệ Cao, TP. HCM</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Cổng Đăng Nhập Hệ Thống</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab("auth")} className="hover:text-sky-600 underline font-medium">
                  🔑 Cổng Đăng nhập Dùng chung (Khách hàng, Staff & Admin)
                </button>
              </li>
              <li>✓ Bàn giao đúng hẹn 100%</li>
              <li>✓ Bảo mật tuyệt đối thông tin khách hàng</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Bản Quyền</div>
            <p className="leading-relaxed">
              © 2026 4YouTech. Đã đăng ký bản quyền. Phát triển bởi Đội ngũ IT & Design 4YouTech.
            </p>
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
