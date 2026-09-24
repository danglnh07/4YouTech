import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      to_email,
      otp_code,
      type,
      customer_name,
      custom_smtp_user,
      custom_smtp_pass
    } = body;

    const smtpUser = custom_smtp_user || process.env.SMTP_USER || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "danglenguyenhai2907@gmail.com";
    const smtpPass = custom_smtp_pass || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    // Check if real SMTP password is set
    const isSmtpConfigured = Boolean(smtpUser && smtpPass && !smtpPass.startsWith("YOUR_"));

    if (otp_code) {
      const isActivation = type === "activation";
      const subjectTitle = isActivation
        ? "[4YouTech] Mã OTP kích hoạt tài khoản mới"
        : "[4YouTech] Mã OTP khôi phục mật khẩu tài khoản";

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">4YouTech</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Giải Pháp IT & Thiết Kế Giao Diện Chuyên Nghiệp</p>
          </div>
          <div style="padding: 32px 24px; color: #1e293b; font-size: 14px; line-height: 1.6;">
            <p style="margin-top: 0;">Xin chào <strong>${customer_name || to_email}</strong>,</p>
            <p>Bạn đang thực hiện thao tác <strong>${isActivation ? "đăng ký kích hoạt tài khoản" : "khôi phục mật khẩu"}</strong> trên hệ thống 4YouTech.</p>
            
            <div style="margin: 24px 0; background: #f8fafc; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; text-align: center;">
              <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">MÃ MẬT KHẨU OTP XÁC THỰC</div>
              <div style="font-size: 36px; font-weight: 900; color: #4f46e5; font-family: monospace; letter-spacing: 8px;">${otp_code}</div>
              <div style="font-size: 12px; color: #ef4444; margin-top: 8px; font-weight: bold;">⚡ Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã cho ai.</div>
            </div>

            <p style="color: #64748b; font-size: 13px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email hoặc liên hệ bộ phận hỗ trợ 4YouTech.</p>
          </div>
          <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            © 2026 4YouTech. Tất cả quyền được bảo lưu.
          </div>
        </div>
      `;

      if (isSmtpConfigured) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          });

          await transporter.sendMail({
            from: `"4YouTech Support" <${smtpUser}>`,
            to: to_email,
            subject: subjectTitle,
            html: htmlContent
          });

          console.log(`✅ [SMTP SUCCESS] Đã gửi mail OTP thực tế tới: ${to_email}`);
          return NextResponse.json({
            success: true,
            sent: true,
            message: `Đã gửi mã OTP thực tế thành công tới hòm thư ${to_email}! Vui lòng kiểm tra hộp thư (hoặc Thư rác/Spam).`
          });
        } catch (sendErr: any) {
          console.error("❌ [SMTP ERROR] Gửi mail thất bại:", sendErr);
          return NextResponse.json({
            success: false,
            sent: false,
            message: `Gửi mail thất bại: ${sendErr.message}. Vui lòng kiểm tra lại Email và Mật khẩu ứng dụng 16 ký tự!`
          });
        }
      } else {
        console.log(`ℹ️ [SIMULATION MODE] Chưa có SMTP Password. OTP=${otp_code} cho ${to_email}`);
        return NextResponse.json({
          success: true,
          sent: false,
          simulated: true,
          message: `Chưa cài đặt Mật khẩu ứng dụng Gmail (SMTP_PASS). Mã OTP thử nghiệm là ${otp_code}. Hãy bấm nút 'Cấu hình Gmail gửi thư thật' bên dưới để nhận thư thật.`
        });
      }
    }

    return NextResponse.json({ success: false, message: "Yêu cầu không hợp lệ" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in /api/send-email:", error);
    return NextResponse.json({ success: false, message: error.message || "Lỗi xử lý mail" }, { status: 500 });
  }
}
