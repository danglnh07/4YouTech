/* =========================================================
   CONFIGURABLE SEED DATA
   Edit this file to change services or categories.
   Email settings are loaded from the project .env file.
   ========================================================= */

// Each service keeps the structure agreed for the app:
// name, description, category, estimated_days, estimated_price, demo_images
// (camelCase here since this is plain JS, same fields otherwise.)
export const SERVICES = [
  {
    id: "portfolio-co-san",
    name: "Portfolio từ thiết kế có sẵn",
    description:
      "Xây dựng website portfolio cá nhân dựa trên file/link thiết kế khách hàng đã có sẵn.",
    category: "IT", // "IT" | "Design" | "IT/Design"
    estimatedDays: 3, // e.g. 7 — leave null to show "Liên hệ để báo giá"
    estimatedPrice: 100000, // VND, e.g. 1500000 — leave null to show "Liên hệ để báo giá"
    demoImages: ["https://cdn-media.sforum.vn/storage/app/media/thanhhuyen/m%E1%BA%ABu%20Portfolio/mau-portfolio-thumb.jpg"], // array of image URLs, e.g. ["https://.../shot1.jpg"]
  },
  {
    id: "portfolio-chua-co-thiet-ke",
    name: "Portfolio chưa có thiết kế",
    description:
      "Tư vấn và xây dựng website portfolio cá nhân từ đầu, bao gồm cả phần thiết kế giao diện theo phong cách và website tham khảo khách cung cấp.",
    category: "IT",
    estimatedDays: 5,
    estimatedPrice: 150000,
    demoImages: ["https://careers.hbr.edu.vn/storage/images/2025/07/29/mau-portfolio-2.webp"],
  },
  {
    id: "ui-design",
    name: "UI Design",
    description:
      "Thiết kế giao diện website hoặc ứng dụng dựa trên danh sách màn hình, luồng sử dụng và nhận diện thương hiệu sẵn có (nếu có).",
    category: "IT/Design",
    estimatedDays: 5,
    estimatedPrice: 200000,
    demoImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReqiyRdORLEmFgPrgiHEWUlF6ldcVfj0tJudcrNzwfcJg8shAnD6Ht4Jxl&s=10",
      "https://cdn.dribbble.com/userupload/47885259/file/8fdd38e5380156785cc4f427fcfd4d7c.png"
    ],
  },
  {
    id: "database-design-support",
    name: "Database Design Support",
    description:
      "Hỗ trợ thiết kế hoặc rà soát cơ sở dữ liệu (ERD/schema) dựa trên mô tả nghiệp vụ và workflow hiện tại.",
    category: "IT",
    estimatedDays: null,
    estimatedPrice: null,
    demoImages: ["https://substackcdn.com/image/fetch/$s_!DTF5!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd7e87813-2921-4379-a1c9-c101092fda5d_1241x1600.png"],
  },
  {
    id: "system-analysis-support",
    name: "System Analysis Support",
    description:
      "Hỗ trợ phân tích hệ thống: actor, use case, sequence diagram dựa trên yêu cầu hệ thống hiện có.",
    category: "IT",
    estimatedDays: null,
    estimatedPrice: null,
    demoImages: ["https://cdn.prod.website-files.com/6529762860f5d2796d4eb495/66cc5478f7467215966986ec_65e85cd00d3fa3f98a476ba9_System%2520analysis%2520and%2520design-system%2520development%2520lifecycle-grorapidlabs.png"],
  },
  {
    id: "nhan-dien-thuong-hieu",
    name: "Nhận diện thương hiệu và ấn phẩm",
    description:
      "Thiết kế các hạng mục nhận diện thương hiệu và ấn phẩm: logo, banner, poster, menu, thiệp, standee, slide.",
    category: "Design",
    estimatedDays: null,
    estimatedPrice: null,
    demoImages: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaRjjrKKecxrJJG-rArfygfBHWx5qkJdeXtRh0ijR1kzXJ4XBgth_xlYa1&s=10"],
  },
];

export const PROJECT_REFERENCES = [
  {
    id: "portfolio-ca-nhan",
    name: "Portfolio cá nhân",
    category: "IT",
    image:
      "https://cdn-media.sforum.vn/storage/app/media/thanhhuyen/m%E1%BA%ABu%20Portfolio/mau-portfolio-thumb.jpg",
  },
  {
    id: "portfolio-thiet-ke-moi",
    name: "Portfolio thiết kế mới",
    category: "IT",
    image:
      "https://careers.hbr.edu.vn/storage/images/2025/07/29/mau-portfolio-2.webp",
  },
  {
    id: "giao-dien-ung-dung",
    name: "Giao diện ứng dụng",
    category: "IT/Design",
    image:
      "https://cdn.dribbble.com/userupload/47885259/file/8fdd38e5380156785cc4f427fcfd4d7c.png",
  },
  {
    id: "co-so-du-lieu",
    name: "Thiết kế cơ sở dữ liệu",
    category: "IT",
    image:
      "https://substackcdn.com/image/fetch/$s_!DTF5!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd7e87813-2921-4379-a1c9-c101092fda5d_1241x1600.png",
  },
  {
    id: "phan-tich-he-thong",
    name: "Phân tích hệ thống",
    category: "IT",
    image:
      "https://cdn.prod.website-files.com/6529762860f5d2796d4eb495/66cc5478f7467215966986ec_65e85cd00d3fa3f98a476ba9_System%2520analysis%2520and%2520design-system%2520development%2520lifecycle-grorapidlabs.png",
  },
  {
    id: "nhan-dien-thuong-hieu",
    name: "Nhận diện thương hiệu",
    category: "Design",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaRjjrKKecxrJJG-rArfygfBHWx5qkJdeXtRh0ijR1kzXJ4XBgth_xlYa1&s=10",
  },
];

