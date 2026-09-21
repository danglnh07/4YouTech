"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { formatPriceRange, formatDaysRange } from "@/lib/store";
import {
  X,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckSquare,
  Square,
  Info
} from "lucide-react";

export function CartDrawerModal({
  onClose,
  onOpenWorkspace
}: {
  onClose: () => void;
  onOpenWorkspace: (serviceId?: string) => void;
}) {
  const { cart, removeFromCart, clearCart, currentUser, switchRole } = useApp();

  // List of selected cart item IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize all cart items as selected when cart updates
  useEffect(() => {
    setSelectedIds(cart.map((item) => item.id));
  }, [cart]);

  const selectedItems = cart.filter((item) => selectedIds.includes(item.id));
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const removeSelectedItems = () => {
    selectedIds.forEach((id) => removeFromCart(id));
    setSelectedIds([]);
  };

  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + (item.estimatedPrice || 0),
    0
  );
  const selectedDeposit50 = Math.round(selectedTotalPrice * 0.5);

  const handleProceedToBooking = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng tích chọn ít nhất 1 dịch vụ trong giỏ hàng để tiến hành đặt đơn.");
      return;
    }

    if (currentUser.role === "guest") {
      switchRole("customer");
    }

    const firstServiceId = selectedItems[0].serviceId;
    onClose();
    onOpenWorkspace(firstServiceId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">Giỏ Hàng Dịch Vụ</h2>
                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
                  {cart.length} sản phẩm
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Tích chọn các dịch vụ bạn muốn tiến hành đặt đơn</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 50% Deposit Rule Banner */}
        <div className="mx-6 mt-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed text-[11px]">
            <span className="font-extrabold text-amber-950">Quy định 50% - 50%:</span> Đặt cọc 50% sau khi chốt Báo giá để bắt đầu triển khai & 50% còn lại thanh toán sau khi kiểm tra nghiệm thu!
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {/* Controls Bar: Select All / Delete Selected */}
          {cart.length > 0 && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-2 font-bold text-slate-700 hover:text-sky-600 transition"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-sky-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Chọn tất cả ({cart.length})</span>
              </button>

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={removeSelectedItems}
                  className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa ({selectedIds.length}) mục đã chọn
                </button>
              )}
            </div>
          )}

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Giỏ hàng của bạn đang trống!</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Hãy tham khảo danh sách Dịch vụ tại Trang Chủ hoặc Catalog để thêm vào giỏ hàng.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition"
              >
                Khám phá Dịch vụ ngay
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelectItem(item.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? "bg-sky-50/50 border-sky-300 shadow-xs"
                        : "bg-white border-slate-200 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-sky-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm truncate">{item.serviceName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-sky-800 shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-slate-500 text-xs">
                          Giá tham khảo:{" "}
                          <span className="font-bold text-emerald-600">
                            {formatPriceRange(item.estimatedPrice, item.maxPrice)}
                          </span>
                          {item.estimatedDays && ` • ${formatDaysRange(item.estimatedDays, item.maxDays)}`}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition shrink-0"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4 shrink-0">
            {/* Price Summary */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-800">
                  Đã chọn: <span className="text-sky-600">{selectedItems.length} / {cart.length}</span> gói dịch vụ
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Ước tính cọc 50%: <strong className="text-amber-700">{selectedDeposit50.toLocaleString("vi-VN")} ₫</strong>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">Tổng giá trị ước tính</div>
                <div className="text-xl font-black text-sky-700">
                  {selectedTotalPrice.toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleProceedToBooking}
              disabled={selectedItems.length === 0}
              className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition ${
                selectedItems.length > 0
                  ? "gradient-btn hover:opacity-95 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>Tiến Hành Đặt Đơn ({selectedItems.length} dịch vụ đã chọn)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
