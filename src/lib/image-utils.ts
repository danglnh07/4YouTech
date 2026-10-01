/**
 * Utility functions for handling image URLs, file uploads, and Google Drive embeds
 */

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Handle Base64 Data URL or Blob
  if (trimmed.startsWith("data:image/") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Handle Google Drive links:
  // e.g. https://drive.google.com/file/d/1A2B3C.../view?usp=sharing
  // or https://drive.google.com/open?id=1A2B3C...
  // or https://drive.google.com/uc?id=1A2B3C...
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = driveFileMatch?.[1] || driveIdMatch?.[1];

  if (fileId && (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com"))) {
    // Google User Content CDN direct image link
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // Handle Dropbox links
  if (trimmed.includes("dropbox.com") && trimmed.includes("dl=0")) {
    return trimmed.replace("dl=0", "raw=1");
  }

  return trimmed;
}

export function isImageSource(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("data:image/") || trimmed.startsWith("blob:")) return true;
  if (/\.(png|jpe?g|webp|gif|svg|bmp|ico)(\?.*)?$/i.test(trimmed)) return true;
  if (trimmed.includes("images.unsplash.com")) return true;
  if (trimmed.includes("lh3.googleusercontent.com")) return true;
  if (trimmed.includes("drive.google.com")) return true;
  return false;
}

export function getDeliverablePreviewImage(
  previewUrl?: string | null,
  fileLink?: string | null
): string {
  const normPreview = normalizeImageUrl(previewUrl);
  if (normPreview) return normPreview;

  const normFile = normalizeImageUrl(fileLink);
  if (normFile && isImageSource(normFile)) {
    return normFile;
  }

  return "";
}

export const SAMPLE_DELIVERABLE_IMAGES = [
  {
    name: "Web Portfolio UI",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Figma UI/UX Mockup",
    url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Banner Quảng Cáo",
    url: "/images/banner-y-te.png"
  },
  {
    name: "Poster Truyền Thông",
    url: "/images/poster-avocado.png"
  },
  {
    name: "Logo Vector",
    url: "/images/logo-phin-coffee.png"
  }
];
