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
  X
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

export function CustomerAuthPage({
  onAuthSuccess,
  onSwitchToManagement
}: {
  onAuthSuccess: () => void;
  onSwitchToManagement: () => void;
}) {
  const {
    login,
    users,
    registerCustomerWithOtp,
    activateAccountWithOtp,
    sendOtp,
    resetPasswordWithOtp,
    activeOtpSession,
    switchRole
  } = useApp();

  const [tab, setTab] = useState<"login" | "register">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("an.nguyen@student.edu.vn");
  const [loginPass, setLoginPass] = useState("Customer@123");
  const [loginError, setLoginError] = useState("");

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [regError, setRegError] = useState("");

  // OTP Activation Step state
  const [activationEmail, setActivationEmail] = useState("");
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const [simulatedOtpCode, setSimulatedOtpCode] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(60);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: New Pass
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtpInput, setForgotOtpInput] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirmPass, setForgotConfirmPass] = useState("");
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

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = login(loginEmail, loginPass, "customer");
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

    if (!regForm.email.trim() || !/.+@.+\..+/.test(regForm.email.trim())) {
      setRegError("Vui lòng nhập Email hợp lệ (ví dụ: student@edu.vn).");
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
    const newCode = sendOtp(activationEmail, "activation");
    setSimulatedOtpCode(newCode);
    setOtpTimer(60);
    alert(`📧 Đã phát mã OTP kích hoạt mới đến hòm thư ${activationEmail}!`);
  };

  // Forgot Password Steps
  const handleForgotStep1SendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setForgotError("Vui lòng nhập Email tài khoản đã đăng ký.");
      return;
    }

    const targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!targetUser) {
      setForgotError(`Không tìm thấy tài khoản với email "${forgotEmail}". Vui lòng kiểm tra lại địa chỉ email hoặc Đăng Ký Tài Khoản Mới.`);
      return;
    }

    const code = sendOtp(cleanEmail, "reset_password");
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
                Vui lòng kiểm tra Hộp thư đến (bao gồm cả thư rác / Spam) để lấy mã OTP 6 chữ số.
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
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl">
              4Y
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              Portal Khách Hàng <br />
              <span className="text-cyan-300">Bảo Mật OTP & Email</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Đăng ký tài khoản kích hoạt qua mã OTP 6 chữ số, mã hóa mật khẩu và khôi phục mật khẩu an toàn.
            </p>
          </div>

          <div className="space-y-2 pt-8 border-t border-white/10 relative z-10 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Kích hoạt OTP 6 chữ số qua Email
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Mã hóa mật khẩu bảo mật chuẩn hash
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Khôi phục mật khẩu 2 bước qua OTP
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
                    tab === "login" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"
                  }`}
                >
                  Đăng Nhập Khách Hàng
                </button>
                <button
                  onClick={() => { setTab("register"); setRegError(""); setLoginError(""); }}
                  className={`text-sm font-bold pb-2 border-b-2 transition ${
                    tab === "register" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"
                  }`}
                >
                  Đăng Ký Tài Khoản Mới
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Fill Buttons for Evaluator */}
          {!simulatedOtpCode && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
              <div className="font-bold text-slate-700">Đăng nhập thử tài khoản mẫu (Quick Demo):</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail("an.nguyen@student.edu.vn");
                    setLoginPass("Customer@123");
                    login("an.nguyen@student.edu.vn", "Customer@123", "customer");
                    onAuthSuccess();
                  }}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-xl font-bold transition text-[11px]"
                >
                  🎓 Nguyễn Văn An (Customer@123)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail("tuan.le@clbit.org");
                    setLoginPass("Customer@123");
                    login("tuan.le@clbit.org", "Customer@123", "customer");
                    onAuthSuccess();
                  }}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-xl font-bold transition text-[11px]"
                >
                  🎓 Lê Minh Tuấn (Customer@123)
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
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email đăng ký *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Mật khẩu *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setShowForgotModal(true);
                      setForgotStep(1);
                      setForgotError("");
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Quên mật khẩu? (Xác thực OTP)
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                Đăng Nhập Khách Hàng
              </button>
            </form>
          )}

          {/* REGISTER FORM STEP 1 */}
          {tab === "register" && !simulatedOtpCode && (
            <form onSubmit={handleStartRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email sinh viên *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="student@edu.vn"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
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
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Password & Rules Meter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Mật khẩu bảo mật"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />

                {/* Strength checklist */}
                {regForm.password && (
                  <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] grid grid-cols-2 gap-1 font-medium">
                    <div className={passRules.minLength ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {passRules.minLength ? "✓" : "○"} Ít nhất 8 ký tự
                    </div>
                    <div className={passRules.hasUpper ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {passRules.hasUpper ? "✓" : "○"} Có chữ hoa (A-Z)
                    </div>
                    <div className={passRules.hasNumber ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {passRules.hasNumber ? "✓" : "○"} Có chữ số (0-9)
                    </div>
                    <div className={passRules.hasSymbol ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {passRules.hasSymbol ? "✓" : "○"} Ký tự đặc biệt (@#$!)
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nhập lại mật khẩu *</label>
                <input
                  type="password"
                  required
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  placeholder="Xác nhận lại mật khẩu"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md mt-2">
                Đăng Ký & Nhận Mã OTP Kích Hoạt
              </button>
            </form>
          )}

          {/* REGISTER STEP 2: OTP VERIFICATION SCREEN */}
          {simulatedOtpCode && (
            <form onSubmit={handleVerifyActivationOtp} className="space-y-4 animate-fade-in">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-2">
                <Clock className="w-8 h-8 text-indigo-600 mx-auto" />
                <h3 className="font-black text-slate-900 text-base">Nhập Mã OTP 6 Chữ Số Đã Gửi</h3>
                <p className="text-xs text-slate-600">
                  Mã OTP kích hoạt đã được gửi tới email <span className="font-bold text-slate-900">{activationEmail}</span>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                  Nhập mã OTP 6 chữ số *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCodeInput}
                  onChange={(e) => setOtpCodeInput(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 border-2 border-indigo-500 rounded-xl text-center font-mono font-black text-xl tracking-widest outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Thời gian hiệu lực: <strong className="text-rose-600">{otpTimer}s</strong></span>
                <button
                  type="button"
                  onClick={handleResendActivationOtp}
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Gửi lại OTP
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSimulatedOtpCode(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs text-slate-600"
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                  Xác Nhận OTP & Kích Hoạt
                </button>
              </div>
            </form>
          )}

          {/* Switch to Management Portal Link & SMTP Setup */}
          {!simulatedOtpCode && (
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-center">
              <button
                type="button"
                onClick={() => setShowSmtpModal(true)}
                className="w-full py-2.5 px-3 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-200/80 transition shadow-xs"
              >
                <Mail className="w-4 h-4 text-indigo-600" />
                ⚙️ Cấu Hình Gmail Gửi Email OTP Thực Tế Về Hòm Thư
              </button>

              <div>
                <button
                  onClick={onSwitchToManagement}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-bold inline-flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Cổng đăng nhập dành cho Admin & Staff IT/Design <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FORGOT PASSWORD MODAL WITH OTP VERIFICATION */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in space-y-5">
            
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Khôi Phục Mật Khẩu OTP</span>
              <h3 className="font-black text-slate-900 text-lg">Quên Mật Khẩu Tài Khoản</h3>
            </div>

            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                {forgotError}
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleForgotStep1SendOtp} className="space-y-4">
                <p className="text-xs text-slate-500">
                  Nhập Email đăng ký của bạn. Hệ thống sẽ gửi Mã OTP 6 chữ số để xác minh chính chủ.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email tài khoản *</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@edu.vn"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                  Gửi Mã OTP Khôi Phục
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP Code */}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotStep2VerifyOtp} className="space-y-4">
                
                {/* Notification Banner for Reset OTP */}
                {forgotSimulatedOtp && (
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs space-y-1.5 border border-cyan-400/40">
                    <div className="text-cyan-300 font-bold text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-cyan-400" /> 📧 Email Hệ Thống Đã Gửi OTP Khôi Phục</span>
                      <span className="text-[10px] text-cyan-300 font-mono">{forgotEmail}</span>
                    </div>
                    <div className="text-slate-200 text-[11px] leading-relaxed">
                      Mã OTP 6 chữ số đã được hệ thống gửi tới hòm thư <strong>{forgotEmail}</strong>. Vui lòng kiểm tra Hộp thư đến (bao gồm cả thư rác / Spam).
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotOtpInput(forgotSimulatedOtp)}
                      className="mt-1 px-3 py-1.5 bg-cyan-400 text-slate-950 font-bold text-[11px] rounded-xl hover:bg-cyan-300 transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Tự Động Điền Mã OTP ({forgotSimulatedOtp})
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nhập mã OTP 6 chữ số *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={forgotOtpInput}
                    onChange={(e) => setForgotOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 border-2 border-indigo-500 rounded-xl text-center font-mono font-black text-lg tracking-widest outline-none"
                  />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-bold text-xs shadow-md">
                  Xác Nhận OTP & Đặt Mật Khẩu Mới
                </button>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleForgotStep3SetNewPass} className="space-y-4">
                <p className="text-xs text-slate-500">Mã OTP đã được xác thực! Vui lòng nhập mật khẩu mới bảo mật.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    placeholder="Mật khẩu mới"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
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
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none"
                  />
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
              <Mail className="w-5 h-5 text-indigo-600" /> Cấu Hình Gmail Gửi OTP Thực Tế
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
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu ứng dụng Gmail (16 ký tự) *</label>
                <input
                  type="password"
                  value={smtpPassForm}
                  onChange={(e) => setSmtpPassForm(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold">🔑 Hướng dẫn lấy Mật khẩu ứng dụng Gmail (30s):</div>
                <ol className="list-decimal pl-4 space-y-0.5 text-amber-800">
                  <li>Vào <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="font-bold text-indigo-600 underline">myaccount.google.com/apppasswords</a></li>
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

export function ManagementAuthPage({
  onAuthSuccess,
  onSwitchToCustomer
}: {
  onAuthSuccess: () => void;
  onSwitchToCustomer: () => void;
}) {
  const { login, switchRole } = useApp();

  const [roleTab, setRoleTab] = useState<"staff" | "admin">("admin");
  const [email, setEmail] = useState("admin@4youtech.com");
  const [pass, setPass] = useState("Admin@123456");
  const [errorMsg, setErrorMsg] = useState("");

  const handleManagementLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const res = login(email, pass, roleTab);
    if (res.success) {
      onAuthSuccess();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold text-xl mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Cổng Đăng Nhập Quản Trị & Staff</h2>
          <p className="text-xs text-slate-400">Đăng nhập tài khoản nội bộ 4YouTech</p>
        </div>

        {/* Role Filter Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => {
              setRoleTab("admin");
              setEmail("admin@4youtech.com");
              setPass("Admin@123456");
              setErrorMsg("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              roleTab === "admin" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Portal Admin
          </button>

          <button
            onClick={() => {
              setRoleTab("staff");
              setEmail("bao.it@4youtech.com");
              setPass("Staff@123456");
              setErrorMsg("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              roleTab === "staff" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> Staff IT / Design
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* Demo Quick Buttons */}
        <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2 text-xs">
          <div className="text-[11px] font-bold text-slate-400">Đăng nhập nhanh thử nghiệm (Quick Demo):</div>
          <div className="space-y-1.5">
            {roleTab === "admin" ? (
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@4youtech.com");
                  setPass("Admin@123456");
                  login("admin@4youtech.com", "Admin@123456", "admin");
                  onAuthSuccess();
                }}
                className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs transition"
              >
                👑 Admin 4YouTech (Admin@123456)
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("bao.it@4youtech.com");
                    setPass("Staff@123456");
                    login("bao.it@4youtech.com", "Staff@123456", "staff");
                    onAuthSuccess();
                  }}
                  className="py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl font-bold text-[11px] transition"
                >
                  🛠️ Trần Bảo IT
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("ha.design@4youtech.com");
                    setPass("Staff@123456");
                    login("ha.design@4youtech.com", "Staff@123456", "staff");
                    onAuthSuccess();
                  }}
                  className="py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl font-bold text-[11px] transition"
                >
                  🎨 Phạm Hà Design
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleManagementLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Email công việc *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Mật khẩu *</label>
            <input
              type="password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition ${
              roleTab === "admin" ? "bg-amber-500 text-slate-950 hover:bg-amber-400" : "bg-purple-600 text-white hover:bg-purple-500"
            }`}
          >
            Đăng Nhập Về Workbench {roleTab.toUpperCase()}
          </button>
        </form>

        {/* Switch back to Customer */}
        <div className="pt-2 text-center border-t border-slate-800">
          <button
            onClick={onSwitchToCustomer}
            className="text-xs text-slate-400 hover:text-cyan-300 font-medium"
          >
            Quay lại Cổng Đăng nhập Khách hàng
          </button>
        </div>

      </div>
    </div>
  );
}
