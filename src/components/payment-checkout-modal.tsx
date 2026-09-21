"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import { ServiceOrder } from "@/lib/store";
import {
  X,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Upload,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function PaymentCheckoutModal({
  order,
  onClose
}: {
  order: ServiceOrder;
  onClose: () => void;
}) {
  const { submitPaymentTransaction, submitVNPaySandboxPayment } = useApp();

  const totalQuotedAmount = order.quotation?.amount || 1000000;
  const amountAlreadyPaid = order.paymentInfo?.amountPaid || 0;
  const remainingBalance = Math.max(0, totalQuotedAmount - amountAlreadyPaid);
  const deposit50 = Math.round(totalQuotedAmount * 0.5);

  const isSecondPayment = amountAlreadyPaid > 0 && remainingBalance > 0;

  const [method, setMethod] = useState<"vnpay" | "vietqr">("vnpay");
  const [paymentType, setPaymentType] = useState<"deposit" | "full" | "remaining">(
    isSecondPayment ? "remaining" : "deposit"
  );

  // VNPay Sandbox Form State
  const [vnpBank, setVnpBank] = useState<string>("NCB");
  const [vnpStep, setVnpStep] = useState<"bank" | "card" | "otp">("bank");
  const [cardNumber, setCardNumber] = useState("9704 1985 2619 1432 198");
  const [cardHolder, setCardHolder] = useState("NGUYEN VAN A");
  const [cardExpiry, setCardExpiry] = useState("07/15");
  const [otpInput, setOtpInput] = useState("123456");

  // VietQR Form State
  const [receiptImage, setReceiptImage] = useState<string>(
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80"
  );
  const [noteText, setNoteText] = useState("");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const payAmount =
    paymentType === "remaining"
      ? remainingBalance
      : paymentType === "deposit"
      ? deposit50
      : totalQuotedAmount;
  const transferMemo = `4YOUTECH ${order.id}`;

  // VietQR Link
  const vietQrUrl = `https://img.vietqr.io/image/MB-0999888777-compact2.png?amount=${payAmount}&addInfo=${encodeURIComponent(
    transferMemo
  )}&accountName=4YOUTECH%20OFFICIAL`;

  const copyToClipboard = (text: string, type: "account" | "memo") => {
    navigator.clipboard.writeText(text);
    if (type === "account") {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 1500);
    } else {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 1500);
    }
  };

  const isEditingLocked = order.isBeingEdited || ["submitted", "under_review"].includes(order.status);

  const handleVNPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingLocked) {
      alert("⚠️ Đơn hàng đang được Admin chỉnh sửa báo giá / dịch vụ! Tạm thời không thể thanh toán.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        submitVNPaySandboxPayment(order.id, payAmount, paymentType, vnpBank);
        setIsSubmitting(false);
        alert(
          `💳 [VNPay Sandbox Success] Thanh toán ${payAmount.toLocaleString(
            "vi-VN"
          )} ₫ thành công qua ngân hàng ${vnpBank}! Mã phản hồi 00. Đơn hàng đã tự động chuyển sang trạng thái Đang thực hiện.`
        );
        onClose();
      } catch (err: any) {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const handleSubmitVietQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingLocked) {
      alert("⚠️ Đơn hàng đang được Admin chỉnh sửa báo giá / dịch vụ! Tạm thời không thể thanh toán.");
      return;
    }
    if (!receiptImage) {
      alert("Vui lòng tải hoặc cung cấp link ảnh biên lai thanh toán.");
      return;
    }
    setIsSubmitting(true);
    try {
      submitPaymentTransaction(order.id, payAmount, paymentType, receiptImage, noteText);
      setTimeout(() => {
        setIsSubmitting(false);
        alert(`Gửi biên lai giao dịch ${payAmount.toLocaleString("vi-VN")} ₫ thành công! Admin sẽ xác minh sớm.`);
        onClose();
      }, 600);
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-fade-in space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isEditingLocked && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3">
            <Lock className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <div className="font-bold text-rose-900">Đơn hàng / Báo giá đang được Admin chỉnh sửa!</div>
              <p className="mt-0.5 text-rose-700">Tạm thời hệ thống khóa tính năng thanh toán để đảm bảo tính nhất quán dữ liệu. Vui lòng thử lại sau.</p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Cổng Thanh Toán An Toàn
            </span>
            <span className="text-xs font-bold text-slate-400">{order.id}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">Thanh Toán Dịch Vụ: {order.serviceName}</h2>
        </div>

        {/* Payment Amount Type Toggle */}
        {isSecondPayment ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-1">
            <div className="font-bold text-amber-900 flex items-center justify-between">
              <span>Thanh Toán 50% Số Tiền Còn Lại (Sau Nghiệm Thu)</span>
              <span className="text-base font-black text-amber-700">{remainingBalance.toLocaleString("vi-VN")} ₫</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Đơn hàng đã đặt cọc 50% trước đó ({amountAlreadyPaid.toLocaleString("vi-VN")} ₫). Bạn đang thực hiện thanh toán 50% số tiền còn lại sau khi đã nghiệm thu sản phẩm để hoàn tất 100%.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setPaymentType("deposit")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                paymentType === "deposit"
                  ? "bg-white text-sky-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Đặt Cọc 50%</span>
              <span className="text-sm font-black mt-0.5">{deposit50.toLocaleString("vi-VN")} ₫</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType("full")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                paymentType === "full"
                  ? "bg-white text-sky-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Thanh Toán Full 100%</span>
              <span className="text-sm font-black mt-0.5">{totalQuotedAmount.toLocaleString("vi-VN")} ₫</span>
            </button>
          </div>
        )}

        {/* Payment Method Selector Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setMethod("vnpay")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
              method === "vnpay"
                ? "border-blue-600 text-blue-600 bg-blue-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Cổng VNPay Sandbox (Tự động 100%)
          </button>
          <button
            type="button"
            onClick={() => setMethod("vietqr")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
              method === "vietqr"
                ? "border-emerald-600 text-emerald-600 bg-emerald-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <QrCode className="w-4 h-4" />
            Chuyển Khoản VietQR (Duyệt qua Biên Lai)
          </button>
        </div>

        {/* TAB 1: VNPAY SANDBOX SIMULATOR */}
        {method === "vnpay" && (
          <div className="space-y-5 bg-gradient-to-br from-blue-950 via-slate-900 to-sky-950 p-6 rounded-3xl text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500 text-white font-black text-[10px] rounded tracking-wider uppercase">
                  VNPAY SANDBOX
                </span>
                <span className="text-xs text-blue-200 font-medium">Mô Phỏng Cổng Thanh Toán VNPay</span>
              </div>
              <span className="text-sm font-black text-amber-400">{payAmount.toLocaleString("vi-VN")} ₫</span>
            </div>

            {vnpStep === "bank" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 font-medium">
                  Chọn Ngân hàng phát hành thẻ / tài khoản để tiến hành giao dịch thử nghiệm:
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                  {[
                    { code: "NCB", name: "NCB Bank (Khuyên dùng)", icon: "🏛️" },
                    { code: "VCB", name: "Vietcombank", icon: "🟢" },
                    { code: "CTG", name: "VietinBank", icon: "🔵" },
                    { code: "TCB", name: "Techcombank", icon: "🔴" },
                    { code: "BIDV", name: "BIDV", icon: "🔷" },
                    { code: "VISA", name: "Visa / Mastercard", icon: "💳" }
                  ].map((b) => (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => setVnpBank(b.code)}
                      className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between h-20 ${
                        vnpBank === b.code
                          ? "border-blue-400 bg-blue-500/20 text-white shadow-md shadow-blue-500/10"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-lg">{b.icon}</span>
                      <div>
                        <div className="text-xs font-bold leading-tight">{b.code}</div>
                        <div className="text-[10px] text-slate-400 truncate">{b.name}</div>
                      </div>
                      {vnpBank === b.code && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 absolute top-2 right-2" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setVnpStep("card")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition mt-4"
                >
                  <span>Tiếp tục Nhập Thông Tin Thẻ Sandbox</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {vnpStep === "card" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Ngân hàng đã chọn: <strong className="text-white">{vnpBank}</strong></span>
                  <button
                    type="button"
                    onClick={() => setVnpStep("bank")}
                    className="text-blue-400 hover:underline text-[11px]"
                  >
                    Đổi ngân hàng
                  </button>
                </div>

                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Số Thẻ Thử Nghiệm (NCB Sandbox)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Tên Chủ Thẻ</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Ngày Phát Hành</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setVnpStep("bank")}
                    className="px-4 py-2.5 bg-white/10 text-slate-300 rounded-xl text-xs font-semibold hover:bg-white/20"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setVnpStep("otp")}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Xác Thực OTP Cổng VNPay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {vnpStep === "otp" && (
              <form onSubmit={handleVNPaySubmit} className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex items-start gap-2 text-amber-200 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    Mã OTP thử nghiệm Sandbox là <strong className="text-white">123456</strong>. Hệ thống VNPay sẽ trả về kết quả mã phản hồi thành công <strong className="text-emerald-400 font-mono">00</strong> lập tức.
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Nhập mã xác thực OTP (6 chữ số):</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full bg-slate-950/80 border border-blue-500/50 rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] font-mono font-bold text-cyan-300 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span>Số tiền GD: <strong className="text-white">{payAmount.toLocaleString("vi-VN")} ₫</strong></span>
                  <span>Ngân hàng: <strong className="text-white">{vnpBank}</strong></span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setVnpStep("card")}
                    className="px-4 py-2.5 bg-white/10 text-slate-300 rounded-xl text-xs font-semibold hover:bg-white/20"
                  >
                    Sửa thông tin thẻ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Đang kết nối cổng VNPay...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Xác Nhận Thanh Toán {payAmount.toLocaleString("vi-VN")} ₫</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: VIETQR MANUAL TRANSFER */}
        {method === "vietqr" && (
          <div className="space-y-5">
            {/* VietQR Barcode & Bank Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 bg-slate-900 text-white p-6 rounded-3xl shadow-inner items-center">
              {/* QR Image */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center bg-white p-3 rounded-2xl">
                <img
                  src={vietQrUrl}
                  alt="Mã VietQR Chuyển Khoản"
                  className="w-44 h-44 object-contain rounded-xl"
                />
                <span className="text-[10px] text-slate-500 font-bold mt-1">Quét mã bằng App Ngân Hàng</span>
              </div>

              {/* Transfer Info */}
              <div className="sm:col-span-7 space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400">Ngân hàng thụ hưởng:</div>
                  <div className="font-bold text-white text-sm">MBBank (Ngân Hàng Quân Đội)</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">Số tài khoản:</div>
                  <div className="flex items-center justify-between font-mono font-bold text-base text-cyan-400 bg-white/10 px-3 py-1.5 rounded-xl mt-1">
                    <span>0999 888 777</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("0999888777", "account")}
                      className="p-1 hover:text-white text-cyan-300"
                      title="Sao chép STK"
                    >
                      {copiedAccount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">Chủ tài khoản:</div>
                  <div className="font-bold text-white">4YOUTECH OFFICIAL</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">Nội dung chuyển khoản (bắt buộc):</div>
                  <div className="flex items-center justify-between font-mono font-bold text-xs text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1.5 rounded-xl mt-1">
                    <span>{transferMemo}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(transferMemo, "memo")}
                      className="p-1 hover:text-white text-amber-300"
                      title="Sao chép cú pháp"
                    >
                      {copiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Receipt Proof Form */}
            <form onSubmit={handleSubmitVietQr} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Ảnh Biên Lai / Hóa Đơn Chuyển Khoản *
                </label>
                <input
                  type="url"
                  required
                  value={receiptImage}
                  onChange={(e) => setReceiptImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Dán link ảnh screenshot giao diện chuyển khoản thành công trên App ngân hàng của bạn.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú giao dịch (tùy chọn)</label>
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ghi chú thêm nếu có..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl gradient-btn font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi Biên Lai Xác Nhận Thanh Toán"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
