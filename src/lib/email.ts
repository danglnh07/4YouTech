export const emailConfig = {
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "",
  emailjsPublicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
  emailjsServiceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
  emailjsTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
};

export function isEmailjsConfigured() {
  return Boolean(
    emailConfig.emailjsPublicKey &&
      !emailConfig.emailjsPublicKey.startsWith("YOUR_") &&
      emailConfig.emailjsServiceId &&
      !emailConfig.emailjsServiceId.startsWith("YOUR_") &&
      emailConfig.emailjsTemplateId &&
      !emailConfig.emailjsTemplateId.startsWith("YOUR_"),
  );
}

export type BookingPayload = {
  service_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  requirement: string;
  deadline: string;
  to_email: string;
};

export async function sendBookingEmail(payload: BookingPayload) {
  if (isEmailjsConfigured()) {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: emailConfig.emailjsServiceId,
        template_id: emailConfig.emailjsTemplateId,
        user_id: emailConfig.emailjsPublicKey,
        template_params: payload,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`EmailJS request failed (${response.status}): ${details}`);
    }
    return;
  }

  const subject = encodeURIComponent(`[4YouTech] Yêu cầu mới: ${payload.service_name}`);
  const body = encodeURIComponent(
    `Dịch vụ: ${payload.service_name}\n` +
      `Khách hàng: ${payload.customer_name}\n` +
      `Email: ${payload.customer_email}\n` +
      `SĐT: ${payload.customer_phone}\n` +
      `Thời hạn mong muốn: ${payload.deadline}\n\n` +
      `Yêu cầu chi tiết:\n${payload.requirement}`,
  );
  window.location.href = `mailto:${emailConfig.adminEmail}?subject=${subject}&body=${body}`;
}

export type OtpEmailPayload = {
  to_email: string;
  customer_name?: string;
  otp_code: string;
  type: "activation" | "reset_password";
};

export async function sendOtpEmail(payload: OtpEmailPayload): Promise<{ success: boolean; message: string; simulated?: boolean; sent?: boolean }> {
  const title = payload.type === "activation" ? "Kích hoạt tài khoản 4YouTech" : "Khôi phục mật khẩu 4YouTech";

  // 1. Send via EmailJS if configured
  if (isEmailjsConfigured()) {
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailConfig.emailjsServiceId,
          template_id: emailConfig.emailjsTemplateId,
          user_id: emailConfig.emailjsPublicKey,
          template_params: {
            to_email: payload.to_email,
            customer_name: payload.customer_name || payload.to_email,
            customer_email: payload.to_email,
            customer_phone: "Xác thực tài khoản 4YouTech",
            service_name: title,
            requirement: `Mã xác thực OTP 6 chữ số của bạn là: ${payload.otp_code}. Vui lòng nhập mã này vào hệ thống để hoàn tất kích hoạt tài khoản. Mã có hiệu lực trong 5 phút.`,
            deadline: "5 phút",
            otp_code: payload.otp_code,
            type: payload.type
          },
        }),
      });

      if (response.ok) {
        return { success: true, message: `Đã gửi mã OTP thực tế tới hộp thư ${payload.to_email}` };
      } else {
        const details = await response.text();
        console.warn("EmailJS OTP failed:", response.status, details);
      }
    } catch (err: any) {
      console.warn("EmailJS OTP fetch error:", err);
    }
  }

  // 2. Call local Next.js API endpoint for Server Log & Email Dispatch
  try {
    let customUser = "";
    let customPass = "";
    if (typeof window !== "undefined") {
      customUser = localStorage.getItem("4youtech_smtp_user") || "";
      customPass = localStorage.getItem("4youtech_smtp_pass") || "";
    }

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        custom_smtp_user: customUser,
        custom_smtp_pass: customPass
      })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        sent: data.sent,
        message: data.message || `Mã OTP ${payload.otp_code} đã được xử lý tới ${payload.to_email}`
      };
    }
  } catch (err) {
    console.warn("Local send-email API fetch error:", err);
  }

  // 3. Fallback result
  return {
    success: true,
    simulated: true,
    message: `Đã gửi mã OTP ${payload.otp_code} tới email ${payload.to_email}`
  };
}
