"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/lib/app-context";
import { Header } from "@/components/header";
import { GuestView } from "@/components/guest-view";
import { CustomerView } from "@/components/customer-view";
import { StaffView } from "@/components/staff-view";
import { AdminView } from "@/components/admin-view";
import { CustomerAuthPage, ManagementAuthPage } from "@/components/auth-pages";
import { Sparkles, Heart, ShieldCheck, Mail, Phone, MapPin, Lock, LogOut } from "lucide-react";

function MainAppContent() {
  const { currentUser, logout, switchRole } = useApp();
  const [activeTab, setActiveTab] = useState<"catalog" | "projects" | "workspace" | "auth_customer" | "auth_management">("catalog");
  const [preselectedBookingServiceId, setPreselectedBookingServiceId] = useState<string | undefined>(undefined);

  const handleSelectServiceToBook = (serviceId: string) => {
    setPreselectedBookingServiceId(serviceId);
    if (currentUser.role === "guest") {
      switchRole("customer");
    }
    setActiveTab("workspace");
  };

  const handleOpenAuth = (portal: "customer" | "management") => {
    if (portal === "customer") setActiveTab("auth_customer");
    else setActiveTab("auth_management");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab === "catalog" || activeTab === "projects" || activeTab === "workspace" ? activeTab : "catalog"}
        setActiveTab={(t) => setActiveTab(t)}
        onOpenAuth={handleOpenAuth}
        onSelectServiceToBook={handleSelectServiceToBook}
      />

      {/* Main Content Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Customer Auth Page */}
        {activeTab === "auth_customer" && (
          <CustomerAuthPage
            onAuthSuccess={() => setActiveTab("workspace")}
            onSwitchToManagement={() => setActiveTab("auth_management")}
          />
        )}

        {/* Management Auth Portal (Admin & Staff) */}
        {activeTab === "auth_management" && (
          <ManagementAuthPage
            onAuthSuccess={() => setActiveTab("workspace")}
            onSwitchToCustomer={() => setActiveTab("auth_customer")}
          />
        )}

        {/* Catalog Dịch vụ */}
        {activeTab === "catalog" && (
          <GuestView
            onSelectServiceToBook={handleSelectServiceToBook}
            onSwitchToWorkspace={() => setActiveTab("workspace")}
          />
        )}

        {/* Public Projects Showcase */}
        {activeTab === "projects" && (
          <GuestView
            onSelectServiceToBook={handleSelectServiceToBook}
            onSwitchToWorkspace={() => setActiveTab("workspace")}
          />
        )}

        {/* Workspace according strictly to active User Role */}
        {activeTab === "workspace" && (
          <>
            {currentUser.role === "guest" && (
              <CustomerAuthPage
                onAuthSuccess={() => setActiveTab("workspace")}
                onSwitchToManagement={() => setActiveTab("auth_management")}
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
              <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
            </div>
            <p className="leading-relaxed">
              Hệ thống cung cấp dịch vụ IT, lập trình web portfolio, phân tích hệ thống, CSDL ERD và thiết kế nhận diện thương hiệu dành riêng cho Sinh viên & CLB.
            </p>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Hỗ Trợ Dịch Vụ</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-500" /> Hotline: 0999.888.777</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-500" /> Email: support@4youtech.com</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-500" /> Khu Công Nghệ Cao, TP. HCM</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Cổng Đăng Nhập Hệ Thống</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab("auth_customer")} className="hover:text-indigo-600 underline">
                  Cổng Đăng nhập Khách hàng
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("auth_management")} className="hover:text-indigo-600 underline">
                  Cổng Đăng nhập Nội bộ (Admin & Staff)
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
