import { AlertTriangle, X } from "lucide-react";

export default function SkippedRowsAlert({ skippedRows, onDismiss }) {
  if (!skippedRows || skippedRows.length === 0) return null;

  return (
    <div className="w-full rounded-2xl bg-warning-500/5 border border-warning-500/10 overflow-hidden" id="skipped-rows-alert">
      <div className="px-6 py-5 flex items-start gap-4">
        <div className="bg-warning-500 rounded-lg p-1.5 text-white shadow-sm mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-warning-500 uppercase tracking-widest">
            การแจ้งเตือนตรวจสอบข้อมูล
          </p>
          <p className="text-xs font-medium text-on-surface-variant/60 mt-1 mb-4">
            รายการต่อไปนี้ถูกยกเว้นออกจากสมุดบัญชีเนื่องจากข้อมูลไม่ครบถ้วนหรือไม่ถูกต้องตามโครงสร้าง:
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-surface-container-highest">
            {skippedRows.map((skip, i) => (
              <div key={i} className="flex items-center gap-3 text-xs bg-white/50 p-2 rounded-lg border border-warning-500/5">
                <span className="font-bold text-warning-500/40 uppercase tracking-tighter">แถวที่ {skip.row}</span>
                <div className="w-1 h-3 bg-warning-500/10 rounded-full" />
                <span className="font-bold text-primary-800/80 truncate max-w-[120px]">{skip.name || "ไม่ระบุชื่อ"}</span>
                <span className="text-on-surface-variant/40 font-medium">—</span>
                <span className="text-warning-500/80 font-bold tracking-tight italic">{skip.reason}</span>
              </div>
            ))}
          </div>

        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded-xl p-2 text-warning-500/40 hover:text-warning-500 hover:bg-warning-500/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>

  );
}
