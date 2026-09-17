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
