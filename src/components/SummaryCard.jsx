import { Banknote, Coins, TrendingUp } from "lucide-react";
import { DENOMINATIONS } from "../utils/denominationCalculator";

const NOTES = [1000, 500, 100, 50, 20];
const COINS = [10, 5, 2, 1];

function formatNumber(num) {
  return num.toLocaleString("en-US");
}

/**
 * Returns label + icon style for each denomination
 */
export default function SummaryCard({ result }) {
  const { summary_total_amount, grand_total_breakdown } = result;

  const totalPieces = Object.values(grand_total_breakdown).reduce((a, b) => a + b, 0);

  const getDenomStyle = (denom) => {
    switch (denom) {
      case 1000: // Grayish Brown
        return "bg-[#7B6D63]/5 text-[#7B6D63] border-[#7B6D63]/10";
      case 500: // Purple
        return "bg-[#8E44AD]/5 text-[#8E44AD] border-[#8E44AD]/10 text-purple-700";
      case 100: // Red
        return "bg-[#E74C3C]/5 text-[#E74C3C] border-[#E74C3C]/10 text-red-600";
      case 50: // Blue
        return "bg-[#3498DB]/5 text-[#3498DB] border-[#3498DB]/10 text-blue-600";
      case 20: // Green
        return "bg-[#27AE60]/5 text-[#27AE60] border-[#27AE60]/10 text-green-600 text-emerald-600";
      case 10: // Two-tone Gold/Silver
        return "bg-[#D35400]/5 text-[#D35400] border-[#D35400]/10 text-orange-700";
      case 5: // Silver
      case 1:
        return "bg-[#7F8C8D]/10 text-[#7F8C8D] border-[#7F8C8D]/10 text-slate-500";
      case 2: // Gold
        return "bg-[#F1C40F]/10 text-[#7D6608] border-[#F1C40F]/20";
      default:
        return "bg-surface-container-high text-on-surface-variant border-surface-container-highest";
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white shadow-premium overflow-hidden border border-surface-container-high">
      {/* Header */}
      <div className="px-8 py-8 bg-surface-container-low border-b border-surface-container-high">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl bg-primary-800 p-4 text-white shadow-premium">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary-800 tracking-tight">สรุปยอดรวมทั้งสิ้น</h3>
              <p className="text-sm font-bold text-on-surface-variant/60 mt-1 uppercase tracking-widest">
                รายการสำรองเงินสดทั้งหมด
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right bg-white p-5 rounded-2xl shadow-sm border border-surface-container-high min-w-[240px]">
            <p className="text-xs font-extrabold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">มูลค่ารวมทั้งหมด</p>
            <p className="text-4xl font-extrabold text-primary-800 tracking-tight">
              <span className="text-2xl mr-1">฿</span>{formatNumber(summary_total_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-10">
        {/* Notes Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Banknote className="w-5 h-5 text-primary-800" />
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary-800">
              รายการธนบัตร
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {NOTES.map((denom) => {
              const styleClass = getDenomStyle(denom);
              const count = grand_total_breakdown[denom] || 0;
              return (
                <div
                  key={denom}
                  className={`rounded-2xl ${styleClass} border p-5 transition-all hover:scale-[1.03] shadow-sm bg-opacity-50`}
                >
                  <p className="text-xs font-extrabold uppercase tracking-widest mb-3 opacity-60">฿{formatNumber(denom)}</p>
                  <p className="text-3xl font-extrabold tracking-tight">{formatNumber(count)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-40">ใบ</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coins Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Coins className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-amber-600">
              รายการเหรียญ
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COINS.map((denom) => {
              const styleClass = getDenomStyle(denom);
              const count = grand_total_breakdown[denom] || 0;
              return (
                <div
                  key={denom}
                  className={`rounded-2xl ${styleClass} border p-5 transition-all hover:scale-[1.03] shadow-sm bg-opacity-50`}
                >
                  <p className="text-xs font-extrabold uppercase tracking-widest mb-3 opacity-60">฿{formatNumber(denom)}</p>
                  <p className="text-3xl font-extrabold tracking-tight">{formatNumber(count)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-40">เหรียญ</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between rounded-2xl bg-surface-container-high px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary-800 animate-pulse" />
            <span className="text-xs font-bold text-primary-800 uppercase tracking-widest">จำนวนหน่วยรวมทั้งหมด</span>
          </div>
          <span className="text-2xl font-extrabold text-primary-800">{formatNumber(totalPieces)} <span className="text-xs font-bold opacity-40 ml-1">หน่วย</span></span>
        </div>
      </div>

    </div>
  );
}

