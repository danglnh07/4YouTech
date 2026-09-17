"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { categories, type FilterCategory, type Service } from "@/data/services";
import { sendBookingEmail, emailConfig, type BookingPayload } from "@/lib/email";

const money = (value: number | null) =>
  value == null ? "Liên hệ để báo giá" : `${value.toLocaleString("vi-VN")} ₫`;

const days = (value: number | null) =>
  value == null ? "Liên hệ để biết chi tiết" : `${value} ngày`;

const categoryClass = (category: Service["category"]) =>
  category === "IT" ? "cat-IT" : category === "Design" ? "cat-Design" : "cat-mixed";

const phonePattern = /^(0|\+84)\d{9,10}$/;

type BookingForm = {
  serviceName: string;
  name: string;
  email: string;
  phone: string;
  requirement: string;
  deadline: string;
};

type BookingSiteProps = {
  services: Service[];
};

export function BookingSite({ services }: BookingSiteProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [form, setForm] = useState<BookingForm>(() => ({
    serviceName: services[0]?.id ?? "",
    name: "",
    email: "",
    phone: "",
    requirement: "",
    deadline: "",
  }));

  const activeService = services.find((service) => service.id === activeServiceId) ?? null;
  const selectedService =
    services.find((service) => service.id === form.serviceName) ?? services[0] ?? null;
  const filteredServices = useMemo(
    () =>
      activeCategory === "all"
        ? services
        : services.filter((service) => service.category === activeCategory),
    [activeCategory, services],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (bookingOpen) setBookingOpen(false);
      else if (detailOpen) setDetailOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [bookingOpen, detailOpen]);

  useEffect(() => {
    const modalOpen = detailOpen || bookingOpen;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailOpen, bookingOpen]);

  function openDetail(serviceId: string) {
    setActiveServiceId(serviceId);
    setDetailOpen(true);
  }

  function openBooking(preselectedId?: string | null) {
    const serviceExists =
      typeof preselectedId === "string" && services.some((service) => service.id === preselectedId);
    setDetailOpen(false);
    setBookingOpen(true);
    setSuccessOpen(false);
    setFormError("");
    setIsSubmitting(false);
    setForm({
      serviceName: serviceExists ? preselectedId : services[0]?.id ?? "",
      name: "",
      email: "",
      phone: "",
      requirement: "",
      deadline: "",
    });
  }

  function updateForm(field: keyof BookingForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function showError(message: string) {
    setFormError(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const service = selectedService;
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const requirement = form.requirement.trim();
    const deadline = form.deadline;

    if (!service || !name || !email || !phone) {
      showError("Vui lòng điền đầy đủ họ tên, email và số điện thoại.");
      return;
    }
    if (!phonePattern.test(phone.replace(/\s/g, ""))) {
      showError("Số điện thoại chưa đúng định dạng (ví dụ: 0912345678).");
      return;
    }

    setIsSubmitting(true);
    const payload: BookingPayload = {
      service_name: service.name,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      requirement: requirement || "(không có)",
      deadline: deadline || "(không yêu cầu)",
      to_email: emailConfig.adminEmail,
    };

    try {
      await sendBookingEmail(payload);
      setSuccessText(
        `Cảm ơn ${name}! Chúng tôi đã ghi nhận yêu cầu cho dịch vụ "${service.name}" và sẽ liên hệ qua ${email} hoặc ${phone} sớm nhất.`,
      );
      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
      showError("Không thể gửi yêu cầu tự động. Vui lòng thử lại hoặc liên hệ trực tiếp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="logo" href="#top">
            4YouTech
          </a>
          <button className="btn btn-accent" type="button" onClick={() => openBooking(activeServiceId)}>
            Đặt dịch vụ
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">Studio IT &amp; Design cho sinh viên</p>
              <h1>Ý tưởng của bạn, chúng tôi dựng thành sản phẩm thật.</h1>
              <p className="hero-sub">
                Portfolio cá nhân, giao diện ứng dụng, hồ sơ hệ thống hay bộ nhận diện
                thương hiệu — chọn dịch vụ, gửi yêu cầu, chúng tôi liên hệ lại trong
                thời gian sớm nhất.
              </p>
              <a href="#catalog" className="btn btn-ink">
                Xem danh mục dịch vụ
              </a>
            </div>
            <div className="hero-panel" aria-hidden="true">
              <div className="panel-row">
                <span className="dot dot-it" /> IT
              </div>
              <div className="panel-row">
                <span className="dot dot-design" /> Design
              </div>
              <div className="panel-row">
                <span className="dot dot-mixed" /> IT / Design
              </div>
              <div className="panel-count">
                <span>{services.length}</span> dịch vụ đang nhận yêu cầu
              </div>
            </div>
          </div>
        </section>

        <section className="catalog" id="catalog">
          <div className="wrap">
            <div className="catalog-head">
              <h2>Danh mục dịch vụ</h2>
              <div className="filters" role="tablist" aria-label="Lọc theo nhóm dịch vụ">
                {categories.map((category) => (
                  <button
                    className={`filter-btn${activeCategory === category ? " is-active" : ""}`}
                    data-category={category}
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === "all" ? "Tất cả" : category}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid">
              {filteredServices.map((service) => {
                const thumb = service.demoImages[0] ? (
                  <img src={service.demoImages[0]} alt={service.name} loading="lazy" />
                ) : (
                  <span className="thumb-placeholder">Chưa có ảnh demo</span>
                );

                return (
                  <article
                    className="card"
                    data-id={service.id}
                    key={service.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Xem chi tiết ${service.name}`}
                    onClick={() => openDetail(service.id)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      openDetail(service.id);
                    }}
                  >
                    <span className={`card-tab ${categoryClass(service.category)}`}>
                      {service.category}
                    </span>
                    <div className="card-thumb">{thumb}</div>
                    <div className="card-body">
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <div className="card-meta">
                        <span>{days(service.estimatedDays)}</span>
                        <span>{money(service.estimatedPrice)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">4YouTech — dịch vụ IT &amp; Design theo yêu cầu.</div>
      </footer>

      <div
        className="modal-overlay"
        id="detail-overlay"
        hidden={!detailOpen}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDetailOpen(false);
        }}
      >
        {activeService && (
          <div className="modal modal-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button
              className="modal-close"
              type="button"
              aria-label="Đóng"
              onClick={() => setDetailOpen(false)}
            >
              &times;
            </button>
            <div className="detail-body">
              <span className={`badge ${categoryClass(activeService.category)}`}>
                {activeService.category}
              </span>
              <h3 id="detail-title">{activeService.name}</h3>
              <p>{activeService.description}</p>
              <div className="detail-stats">
                <div>
                  <span className="stat-label">Thời gian dự kiến</span>
                  <span className="stat-value">{days(activeService.estimatedDays)}</span>
                </div>
                <div>
                  <span className="stat-label">Giá tham khảo</span>
                  <span className="stat-value">{money(activeService.estimatedPrice)}</span>
                </div>
              </div>
              <div className="gallery" id="detail-gallery">
                {activeService.demoImages.length ? (
                  activeService.demoImages.map((image) => (
                    <img key={image} src={image} alt={`${activeService.name} — ảnh demo`} loading="lazy" />
                  ))
                ) : (
                  <span className="gallery-empty">Chưa có ảnh demo cho dịch vụ này.</span>
                )}
              </div>
              <button className="btn btn-accent btn-full" type="button" onClick={() => openBooking(activeService.id)}>
                Đặt dịch vụ này
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="modal-overlay"
        id="booking-overlay"
        hidden={!bookingOpen}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setBookingOpen(false);
        }}
      >
        <div className="modal modal-booking" role="dialog" aria-modal="true" aria-labelledby="booking-title">
          <button
            className="modal-close"
            type="button"
            aria-label="Đóng"
            onClick={() => setBookingOpen(false)}
          >
            &times;
          </button>
          <div id="booking-form-view" hidden={successOpen}>
            <h3 id="booking-title">Đặt dịch vụ</h3>
            <form id="booking-form" noValidate onSubmit={handleSubmit}>
              <label className="field">
                <span>Dịch vụ</span>
                <select
                  id="field-service"
                  required
                  value={form.serviceName}
                  onChange={(event) => updateForm("serviceName", event.target.value)}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Họ và tên</span>
                <input
                  type="text"
                  id="field-name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  id="field-email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Số điện thoại</span>
                <input
                  type="tel"
                  id="field-phone"
                  required
                  autoComplete="tel"
                  placeholder="0xxxxxxxxx"
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Yêu cầu chi tiết</span>
                <textarea
                  id="field-requirement"
                  rows={4}
                  placeholder="Mô tả ngắn gọn nội dung bạn cần hỗ trợ..."
                  value={form.requirement}
                  onChange={(event) => updateForm("requirement", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Thời hạn mong muốn (không bắt buộc)</span>
                <input
                  type="date"
                  id="field-deadline"
                  value={form.deadline}
                  onChange={(event) => updateForm("deadline", event.target.value)}
                />
              </label>
              <p className="form-error" id="form-error" hidden={!formError}>
                {formError}
              </p>
              <button
                type="submit"
                className="btn btn-accent btn-full"
                id="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
            </form>
          </div>
          <div id="booking-success-view" hidden={!successOpen}>
            <p className="success-mark">✓</p>
            <h3>Đã gửi yêu cầu!</h3>
            <p id="success-text">{successText}</p>
            <button className="btn btn-ink btn-full" type="button" onClick={() => setBookingOpen(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
