"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { Role } from "@/lib/store";
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  Wrench,
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronRight,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Copy,
  Check,
  X,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

// Password strength validator helper
export function getPasswordRules(pass: string) {
  const minLength = pass.length >= 8;
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

  const score = [minLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  const isStrong = minLength && hasUpper && hasNumber && hasSymbol;

  return { minLength, hasUpper, hasLower, hasNumber, hasSymbol, score, isStrong };
}

// Email format validator helper (Realtime)
export function isValidEmailFormat(email: string) {
  if (!email || !email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function UnifiedAuthPage({
  onAuthSuccess
}: {
  onAuthSuccess: () => void;
  onSwitchToManagement?: () => void;
  onSwitchToCustomer?: () => void;
}) {
  const {
    login,
    users,
    registerCustomerWithOtp,
    activateAccountWithOtp,
    sendOtp,
    resetPasswordWithOtp,
    activeOtpSession
  } = useApp();

  const [tab, setTab] = useState<"login" | "register">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);
  const [regError, setRegError] = useState("");

  // OTP Activation Step state
  const [activationEmail, setActivationEmail] = useState("");
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const [simulatedOtpCode, setSimulatedOtpCode] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(60);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtpInput, setForgotOtpInput] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirmPass, setForgotConfirmPass] = useState("");
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);
  const [forgotSimulatedOtp, setForgotSimulatedOtp] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState("");
  const [forgotTimer, setForgotTimer] = useState(60);

  // SMTP Config Modal State
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpUserForm, setSmtpUserForm] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("4youtech_smtp_user") || "";
    return "";
  });
  const [smtpPassForm, setSmtpPassForm] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("4youtech_smtp_pass") || "";
    return "";
  });

  // Countdown timer effect for OTP
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

  // Unified login handler for ANY role (Customer, Staff, Admin)
  const handleUnifiedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!isValidEmailFormat(loginEmail)) {
      setLoginError("Vui lòng nhập Email hợp lệ đúng định dạng (Ví dụ: name@domain.com).");
      return;
    }

    const res = login(loginEmail, loginPass);
    if (res.success) {
      onAuthSuccess();
    } else {
      setLoginError(res.message);
    }
  };

  const handleStartRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regForm.name.trim() || regForm.name.trim().length < 2) {
      setRegError("Vui lòng nhập đầy đủ Họ và Tên (tối thiểu 2 ký tự).");
      return;
    }

    if (!regForm.email.trim() || !isValidEmailFormat(regForm.email)) {
      setRegError("Vui lòng nhập địa chỉ Email đúng định dạng (Ví dụ: student@edu.vn).");
      return;
    }

    const phoneDigits = regForm.phone.replace(/\D/g, "");
    if (!regForm.phone.trim() || phoneDigits.length < 9) {
      setRegError("Vui lòng nhập Số điện thoại liên hệ chính xác (tối thiểu 9-10 chữ số).");
      return;
    }

    const passRules = getPasswordRules(regForm.password);
    if (!passRules.isStrong) {
      setRegError("Mật khẩu chưa đủ độ mạnh. Bắt buộc từ 8 ký tự, có chữ hoa, chữ số và ký tự đặc biệt (@, #, $, !).");
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setRegError("Mật khẩu nhập lại không khớp.");
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
      setOtpCodeInput("");
    } catch (err: any) {
      setRegError(err.message || "Đã xảy ra lỗi khi tạo tài khoản.");
    }
  };

  const handleVerifyActivationOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    const res = activateAccountWithOtp(activationEmail, otpCodeInput);
    if (res.success) {
      alert(res.message);
      setSimulatedOtpCode(null);
      onAuthSuccess();
    } else {
      setRegError(res.message);
    }
  };

  const handleResendActivationOtp = () => {
    const newCode = sendOtp(activationEmail, "activation", regForm.name);
    setSimulatedOtpCode(newCode);
    setOtpTimer(60);
    alert(`📧 Đã phát mã OTP 6 chữ số kích hoạt mới gửi đến hòm thư ${activationEmail}!`);
  };

  // Forgot Password Steps
  const handleForgotStep1SendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !isValidEmailFormat(cleanEmail)) {
      setForgotError("Vui lòng nhập địa chỉ Email chính xác đúng định dạng (Ví dụ: student@edu.vn).");
      return;
    }

    const targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!targetUser) {
      setForgotError(`Không tìm thấy tài khoản với email "${forgotEmail}". Vui lòng kiểm tra lại địa chỉ email hoặc Đăng Ký Tài Khoản Mới.`);
      return;
    }

    const code = sendOtp(cleanEmail, "reset_password", targetUser.name);
    setForgotSimulatedOtp(code);
    setForgotTimer(60);
    setForgotStep(2);
  };

  const handleForgotStep2VerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (forgotOtpInput.trim() !== forgotSimulatedOtp) {
      setForgotError("Mã OTP khôi phục không chính xác.");
      return;
    }
    setForgotStep(3);
  };

  const handleForgotStep3SetNewPass = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    const passRules = getPasswordRules(forgotNewPass);
    if (!passRules.isStrong) {
      setForgotError("Mật khẩu mới chưa đạt độ mạnh yêu cầu.");
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setForgotError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    const res = resetPasswordWithOtp(forgotEmail, forgotOtpInput, forgotNewPass);
    if (res.success) {
      alert(res.message);
      setShowForgotModal(false);
      setForgotStep(1);
      setTab("login");
      setLoginEmail(forgotEmail);
      setLoginPass(forgotNewPass);
    } else {
      setForgotError(res.message);
    }
  };

  const passRules = getPasswordRules(regForm.password);

  // Realtime email validation states
  const loginEmailValid = isValidEmailFormat(loginEmail);
  const showLoginEmailErr = loginEmail.length > 0 && !loginEmailValid;
  const showLoginEmailOk = loginEmail.length > 0 && loginEmailValid;

  const regEmailValid = isValidEmailFormat(regForm.email);
  const showRegEmailErr = regForm.email.length > 0 && !regEmailValid;
  const showRegEmailOk = regForm.email.length > 0 && regEmailValid;

  const forgotEmailValid = isValidEmailFormat(forgotEmail);
  const showForgotEmailErr = forgotEmail.length > 0 && !forgotEmailValid;
  const showForgotEmailOk = forgotEmail.length > 0 && forgotEmailValid;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      
      {/* Email OTP Dispatch & Simulation Banner Notification */}
      {simulatedOtpCode && (
        <div className="mb-6 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-cyan-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-lg shrink-0">
              <Mail className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>📧 Email Hệ Thống Đã Gửi Mã OTP Thành Công</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono">
                  Gửi tới: {activationEmail}
                </span>
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">
                Vui lòng kiểm tra Hộp thư đến để lấy mã OTP 6 chữ số.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOtpCodeInput(simulatedOtpCode)}
            className="px-4 py-2.5 bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs shadow-md hover:bg-cyan-300 transition shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Tự Động Điền OTP ({simulatedOtpCode})
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side Graphic Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-sky-600 via-sky-700 to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl">
              4Y
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              Cổng Đăng Nhập <br />
              <span className="text-cyan-300">Dùng Chung Hệ Thống</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Một cổng duy nhất cho tất cả tài khoản <strong>Khách Hàng</strong>, <strong>Staff IT/Design</strong> & <strong>Quản Trị Viên (Admin)</strong>.
            </p>
          </div>

          <div className="space-y-2 pt-8 border-t border-white/10 relative z-10 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Tự động nhận diện giao diện theo Vai Trò
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Bắt lỗi Email đúng định dạng thời gian thực
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Nút con mắt ẩn/hiện xem mật khẩu linh hoạt
            </div>
          </div>
        </div>

        {/* Right Side Auth Form */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Header Tabs */}
          {!simulatedOtpCode && (
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex gap-4">
                <button
                  onClick={() => { setTab("login"); setRegError(""); setLoginError(""); }}
                  className={`text-sm font-bold pb-2 border-b-2 transition ${
                    tab === "login" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-400"
                  }`}
                >
                  🔑 Đăng Nhập Hệ Thống
                </button>
                <button
                  onClick={() => { setTab("register"); setRegError(""); setLoginError(""); }}
                  className={`text-sm font-bold pb-2 border-b-2 transition ${
                    tab === "register" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-400"
                  }`}
                >
                  📝 Đăng Ký Khách Hàng Mới
                </button>
              </div>
            </div>
          )}

          {/* Error alerts */}
          {(loginError || regError) && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
              {loginError || regError}
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === "login" && !simulatedOtpCode && (
            <form onSubmit={handleUnifiedLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email đăng nhập *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 border rounded-xl text-xs outline-none font-bold text-slate-900 transition ${
                      showLoginEmailErr
                        ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 text-rose-900"
                        : showLoginEmailOk
                        ? "border-emerald-400 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-400 text-slate-900"
                        : "border-slate-200 focus:ring-2 focus:ring-sky-500 text-slate-900 bg-white"
                    }`}
                  />
                </div>
                {showLoginEmailErr && (
                  <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Email chưa đúng định dạng (Ví dụ: name@domain.com)
                  </div>
                )}
                {showLoginEmailOk && (
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Email chuẩn định dạng hợp lệ
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotEmail(loginEmail);
                      setForgotStep(1);
                      setForgotError("");
                    }}
                    className="text-xs text-sky-600 font-bold hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPass ? "text" : "password"}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Mật khẩu của bạn"
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition"
                    title={showLoginPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Đăng Nhập Vào Hệ Thống
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowSmtpModal(true)}
                  className="text-[11px] text-slate-400 hover:text-sky-600 font-medium underline flex items-center justify-center gap-1 mx-auto"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-500" /> Cấu hình Gmail phát mã OTP thực tế
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && !simulatedOtpCode && (
            <form onSubmit={handleStartRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên khách hàng *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email liên hệ & nhận OTP *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="student@edu.vn"
                    className={`w-full pl-9 pr-3.5 py-2.5 border rounded-xl text-xs outline-none font-bold text-slate-900 transition ${
                      showRegEmailErr
                        ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 text-rose-900"
                        : showRegEmailOk
                        ? "border-emerald-400 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-400 text-slate-900"
                        : "border-slate-200 focus:ring-2 focus:ring-sky-500 text-slate-900 bg-white"
                    }`}
                  />
                </div>
                {showRegEmailErr && (
                  <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Email chưa đúng định dạng (Ví dụ: student@edu.vn)
                  </div>
                )}
                {showRegEmailOk && (
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Email hợp lệ đúng định dạng
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu bảo mật *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPass ? "text" : "password"}
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition"
                    title={showRegPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Checklist */}
                {regForm.password && (
                  <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                    <div className="font-bold text-slate-700">Độ mạnh mật khẩu:</div>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <span className={passRules.minLength ? "text-emerald-600 font-bold" : "text-slate-400"}>
                        {passRules.minLength ? "✓" : "○"} Tối thiểu 8 ký tự
                      </span>
                      <span className={passRules.hasUpper ? "text-emerald-600 font-bold" : "text-slate-400"}>
                        {passRules.hasUpper ? "✓" : "○"} Ký tự in hoa (A-Z)
                      </span>
                      <span className={passRules.hasNumber ? "text-emerald-600 font-bold" : "text-slate-400"}>
                        {passRules.hasNumber ? "✓" : "○"} Chứa chữ số (0-9)
                      </span>
                      <span className={passRules.hasSymbol ? "text-emerald-600 font-bold" : "text-slate-400"}>
                        {passRules.hasSymbol ? "✓" : "○"} Ký tự đặc biệt (@, #...)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegConfirmPass ? "text" : "password"}
                    required
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition"
                    title={showRegConfirmPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showRegConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Tạo Tài Khoản & Nhận OTP
              </button>
            </form>
          )}

          {/* OTP ACTIVATION FORM */}
          {simulatedOtpCode && (
            <form onSubmit={handleVerifyActivationOtp} className="space-y-4">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 space-y-2">
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>Nhập mã OTP kích hoạt 6 chữ số</span>
                  <button
                    type="button"
                    onClick={() => setShowSmtpModal(true)}
                    className="text-[11px] font-bold text-sky-700 hover:text-sky-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    ⚙️ Cấu hình Gmail gửi thư thật
                  </button>
                </div>
                <div>Mã OTP đã được phát tới Email: <strong>{activationEmail}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã OTP 6 chữ số *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCodeInput}
                  onChange={(e) => setOtpCodeInput(e.target.value)}
                  placeholder="------"
                  className="w-full text-center tracking-widest font-mono text-xl py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Kích Hoạt Tài Khoản ngay
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={handleResendActivationOtp}
                  className="text-sky-600 font-bold hover:underline disabled:opacity-50"
                >
                  {otpTimer > 0 ? `Gửi lại mã sau (${otpTimer}s)` : "Gửi lại mã OTP mới"}
                </button>

                <button
                  type="button"
                  onClick={() => setSimulatedOtpCode(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 relative animate-fade-in">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-sky-600" /> Khôi Phục Mật Khẩu qua OTP
              </h3>
              <p className="text-xs text-slate-500">Bước {forgotStep}/3: {forgotStep === 1 ? "Nhập Email" : forgotStep === 2 ? "Xác nhận OTP" : "Mật khẩu mới"}</p>
            </div>

            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                {forgotError}
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleForgotStep1SendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email đăng ký tài khoản *</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@edu.vn"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none font-bold text-slate-900 transition ${
                      showForgotEmailErr
                        ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 text-rose-900"
                        : showForgotEmailOk
                        ? "border-emerald-400 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-400 text-slate-900"
                        : "border-slate-200 focus:ring-2 focus:ring-sky-500 text-slate-900 bg-white"
                    }`}
                  />
                  {showForgotEmailErr && (
                    <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1 animate-fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Email chưa đúng định dạng
                    </div>
                  )}
                  {showForgotEmailOk && (
                    <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1 animate-fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Email hợp lệ đúng định dạng
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                  Gửi Mã OTP Khôi Phục Mật Khẩu
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotStep2VerifyOtp} className="space-y-4">
                {forgotSimulatedOtp && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1">
                    <div className="font-bold text-cyan-300">📧 OTP Khôi phục đã gửi: {forgotEmail}</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-cyan-300 font-extrabold">{forgotSimulatedOtp}</span>
                      <button
                        type="button"
                        onClick={() => setForgotOtpInput(forgotSimulatedOtp)}
                        className="px-2.5 py-1 bg-cyan-400 text-slate-950 font-bold rounded-lg text-[10px]"
                      >
                        Tự Điền OTP
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nhập mã OTP 6 chữ số *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtpInput}
                    onChange={(e) => setForgotOtpInput(e.target.value)}
                    placeholder="------"
                    className="w-full text-center tracking-widest font-mono text-xl py-2.5 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 bg-white"
                  />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                  Xác Nhận OTP
                </button>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleForgotStep3SetNewPass} className="space-y-4">
                <p className="text-xs text-slate-500">Mã OTP đã được xác thực! Vui lòng nhập mật khẩu mới bảo mật.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
                  <div className="relative">
                    <input
                      type={showForgotNewPass ? "text" : "password"}
                      required
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      placeholder="Mật khẩu mới"
                      className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition"
                      title={showForgotNewPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showForgotNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                  <div className="relative">
                    <input
                      type={showForgotConfirmPass ? "text" : "password"}
                      required
                      value={forgotConfirmPass}
                      onChange={(e) => setForgotConfirmPass(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPass(!showForgotConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition"
                      title={showForgotConfirmPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showForgotConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                  Hoàn Tất Đặt Lại Mật Khẩu
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* SMTP CONFIG MODAL */}
      {showSmtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 relative animate-fade-in">
            <button
              onClick={() => setShowSmtpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-600" /> Cấu Hình Gmail Gửi OTP Thực Tế
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Điền tài khoản Gmail và <strong>Mật khẩu ứng dụng (App Password 16 ký tự)</strong> của bạn để hệ thống phát thư OTP trực tiếp tới bất kỳ hòm thư thực tế nào!
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Gmail phát thư (SMTP User) *</label>
                <input
                  type="email"
                  value={smtpUserForm}
                  onChange={(e) => setSmtpUserForm(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu ứng dụng Gmail (16 ký tự) *</label>
                <input
                  type="password"
                  value={smtpPassForm}
                  onChange={(e) => setSmtpPassForm(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none font-mono focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold">🔑 Hướng dẫn lấy Mật khẩu ứng dụng Gmail (30s):</div>
                <ol className="list-decimal pl-4 space-y-0.5 text-amber-800">
                  <li>Vào <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="font-bold text-sky-600 underline">myaccount.google.com/apppasswords</a></li>
                  <li>Tạo Mật khẩu ứng dụng cho tên "Mail 4YouTech"</li>
                  <li>Copy 16 ký tự vừa tạo dán vào ô trên</li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!smtpUserForm.trim() || !smtpPassForm.trim()) {
                  alert("Vui lòng điền đầy đủ Email và Mật khẩu ứng dụng 16 ký tự!");
                  return;
                }
                if (typeof window !== "undefined") {
                  localStorage.setItem("4youtech_smtp_user", smtpUserForm.trim());
                  localStorage.setItem("4youtech_smtp_pass", smtpPassForm.trim());
                }
                setShowSmtpModal(false);
                alert(`🎉 Đã kích hoạt cấu hình Gmail (${smtpUserForm.trim()})! Bây giờ các mã OTP sẽ được gửi thực tế về hòm thư recipient!`);
              }}
              className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md"
            >
              Lưu & Kích Hoạt Gửi Email Thực Tế
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Export aliases for backward compatibility
export const CustomerAuthPage = UnifiedAuthPage;
export const ManagementAuthPage = UnifiedAuthPage;
