"use client";

import React, { useState } from "react";
import { getDeliverablePreviewImage, normalizeImageUrl } from "@/lib/image-utils";
import { Image as ImageIcon, ExternalLink, ZoomIn, X, AlertTriangle } from "lucide-react";

interface DeliverableImageProps {
  previewUrl?: string | null;
  fileLink?: string | null;
  title: string;
  className?: string;
  allowZoom?: boolean;
}

export function DeliverableImage({
  previewUrl,
  fileLink,
  title,
  className = "h-48 w-full object-cover rounded-xl border border-slate-800",
  allowZoom = true
}: DeliverableImageProps) {
  const initialUrl = getDeliverablePreviewImage(previewUrl, fileLink);
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [triedAlt, setTriedAlt] = useState<boolean>(false);

  // Update image source when props change
  React.useEffect(() => {
    const updated = getDeliverablePreviewImage(previewUrl, fileLink);
    setImgSrc(updated);
    setHasError(false);
    setTriedAlt(false);
  }, [previewUrl, fileLink]);

  if (!imgSrc || hasError) {
    // If no image or failed to load, show a clean fallback UI with direct link
    return (
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-dashed border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <div className="p-2 rounded-xl bg-slate-800 text-sky-400 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">{title}</div>
            <div className="text-[11px] text-slate-400">
              {hasError ? "Không thể hiển thị ảnh xem trước trực tiếp" : "Chưa có ảnh xem trước"}
            </div>
          </div>
        </div>

        {fileLink && (
          <a
            href={normalizeImageUrl(fileLink) || fileLink}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 font-bold text-xs inline-flex items-center gap-1.5 transition shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Mở File Bàn Giao
          </a>
        )}
      </div>
    );
  }

  const handleImageError = () => {
    // If lh3.googleusercontent.com failed, try drive.google.com/thumbnail format
    if (!triedAlt && imgSrc.includes("lh3.googleusercontent.com/d/")) {
      const fileId = imgSrc.split("/d/")[1];
      if (fileId) {
        setTriedAlt(true);
        setImgSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`);
        return;
      }
    }

    // If still failing, mark as error
    setHasError(true);
  };

  return (
    <>
      <div className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70">
        <img
          src={imgSrc}
          alt={title}
          onError={handleImageError}
          onClick={() => allowZoom && setIsZoomed(true)}
          className={`${className} transition-transform duration-300 group-hover:scale-[1.02]`}
          loading="lazy"
        />

        {allowZoom && (
          <div
            onClick={() => setIsZoomed(true)}
            className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs pointer-events-none"
          >
            <span className="p-2 rounded-xl bg-slate-900/90 border border-white/20 shadow-lg flex items-center gap-1.5">
              <ZoomIn className="w-4 h-4 text-cyan-400" /> Bấm để phóng to xem chi tiết
            </span>
          </div>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={imgSrc}
              alt={title}
              className="max-h-[85vh] max-w-full rounded-2xl border border-slate-700 shadow-2xl object-contain bg-slate-900"
            />
            <div className="mt-3 text-center text-xs font-semibold text-slate-300">
              {title} • <a href={fileLink || imgSrc} target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300 ml-1">Mở link gốc <ExternalLink className="w-3 h-3 inline" /></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
