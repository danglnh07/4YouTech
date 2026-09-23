/* =========================================================
   CONFIGURABLE SEED DATA
   Edit this file to change services or categories.
   Email settings are loaded from the project .env file.
   ========================================================= */

// Each service keeps the structure agreed for the app:
// name, description, category, estimated_days, estimated_price, demo_images
// (camelCase here since this is plain JS, same fields otherwise.)
export const SERVICES = [
  // --- IT ---
  {
    id: "it-lap-trinh-portfolio",
    name: "Lập trình Portfolio",
    description: "Lập trình website portfolio cá nhân tối ưu SEO, giao diện cá tính, responsive chuẩn di động & web.",
    category: "IT",
    estimatedDays: 3,
    estimatedPrice: 1000000,
    demoImages: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"]
  },
  {
    id: "it-thiet-ke-web",
    name: "Thiết kế Web",
    description: "Xây dựng & lập trình website doanh nghiệp, trang bán hàng, landing page hiện đại, chuẩn SEO & tối ưu tốc độ.",
    category: "IT",
    estimatedDays: 5,
    estimatedPrice: 1500000,
    demoImages: ["https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80"]
  },
  {
    id: "it-ui-ux",
    name: "UI/UX",
    description: "Nghiên cứu hành vi người dùng, vẽ Wireframe, thiết kế Prototype tương tác & lập trình giao diện Web/App mượt mà.",
    category: "IT",
    estimatedDays: 4,
    estimatedPrice: 1200000,
    demoImages: ["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"]
  },
  {
    id: "it-test-loi-phan-mem",
    name: "Test lỗi phần mềm",
    description: "Kiểm thử phần mềm (Manual & Automation Testing), rà soát lỗi UI/UX, bảo mật, hiệu năng & xuất báo cáo chi tiết.",
    category: "IT",
    estimatedDays: 2,
    estimatedPrice: 500000,
    demoImages: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"]
  },

  // --- Design ---
  {
    id: "design-thiet-ke-ui",
    name: "Thiết kế UI",
    description: "Thiết kế Giao diện người dùng (User Interface) sắc nét, hiện đại trên Figma dành cho Website & Mobile App.",
    category: "Design",
    estimatedDays: 3,
    estimatedPrice: 1000000,
    demoImages: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"]
  },
  {
    id: "design-logo",
    name: "Logo",
    description: "Thiết kế Logo nhận diện thương hiệu độc quyền, sáng tạo ấn tượng, kèm Brand Guidelines & file Vector gốc.",
    category: "Design",
    estimatedDays: 2,
    estimatedPrice: 600000,
    demoImages: ["/images/logo-phin-coffee.png"]
  },
  {
    id: "design-banner",
    name: "Banner",
    description: "Thiết kế Banner quảng cáo, banner website, mạng xã hội (Facebook/Zalo/Instagram) bắt mắt, chuẩn tỷ lệ.",
    category: "Design",
    estimatedDays: 1,
    estimatedPrice: 300000,
    demoImages: ["/images/banner-y-te.png"]
  },
  {
    id: "design-poster",
    name: "Poster",
    description: "Thiết kế Poster sự kiện, poster truyền thông, nghệ thuật độ phân giải cao dành cho in ấn & đăng tải truyền thông.",
    category: "Design",
    estimatedDays: 2,
    estimatedPrice: 400000,
    demoImages: ["/images/poster-avocado.png"]
  }
];

export const PROJECT_REFERENCES = [
  {
    id: "portfolio-ca-nhan",
    name: "Lập trình Portfolio cá nhân",
    category: "IT",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "thiet-ke-web",
    name: "Thiết kế Website doanh nghiệp",
    category: "IT",
    image: "https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "ui-ux",
    name: "Giao diện UI/UX App Mobile & Web",
    category: "IT",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "test-loi-phan-mem",
    name: "Kiểm thử & Rà soát Bug phần mềm",
    category: "IT",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "thiet-ke-ui",
    name: "Thiết kế UI Figma sắc nét",
    category: "Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "logo-brand",
    name: "Logo & Bộ nhận diện thương hiệu",
    category: "Design",
    image: "/images/logo-phin-coffee.png"
  },
  {
    id: "banner-quang-cao",
    name: "Banner truyền thông & Quảng cáo",
    category: "Design",
    image: "/images/banner-y-te.png"
  },
  {
    id: "poster-su-kien",
    name: "Poster nghệ thuật & Sự kiện",
    category: "Design",
    image: "/images/poster-avocado.png"
  }
];

