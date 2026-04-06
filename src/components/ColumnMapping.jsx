import { useState } from "react";
import { Columns3, ArrowRight, AlertTriangle } from "lucide-react";

export default function ColumnMapping({ headers, onMappingComplete }) {
  const [nameColumn, setNameColumn] = useState("");
  const [amountColumn, setAmountColumn] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (nameColumn === "" || amountColumn === "") {
      setError("Please select both columns before proceeding.");
      return;
    }
    if (nameColumn === amountColumn) {
      setError("Employee Name and Amount columns must be different.");
      return;
    }
    setError(null);
    onMappingComplete({
      nameColIndex: parseInt(nameColumn),
      amountColIndex: parseInt(amountColumn),
    });
  };

  return (
    <div className="w-full rounded-2xl bg-white shadow-premium overflow-hidden border border-surface-container-high">
      {/* Header */}
      <div className="px-8 py-6 border-b border-surface-container-high bg-surface-container-low">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary-800 p-3 text-white shadow-premium">
            <Columns3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary-800 tracking-tight">ตั้งค่าคอลัมน์</h3>
            <p className="text-sm font-bold text-on-surface-variant/60 mt-1 uppercase tracking-wider">
              กำหนดบทบาทโครงสร้างข้อมูล
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-8">
        {/* Detected Columns Preview */}
        <div className="rounded-2xl bg-surface-container-low p-6">
          <p className="text-xs font-extrabold text-primary-800/40 uppercase tracking-[0.2em] mb-4">
            โครงสร้างที่ตรวจพบ ({headers.length} คอลัมน์)
          </p>
          <div className="flex flex-wrap gap-2.5">
            {headers.map((header, i) => (
              <span
                key={i}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-bold text-primary-800 shadow-sm"
              >
                {header || `คอลัมน์ที่ ${i + 1}`}
              </span>
            ))}
          </div>
        </div>

        {/* Mapping Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Employee Name Select */}
          <div className="space-y-3">
            <label
              htmlFor="select-name-column"
              className="block text-sm font-bold text-primary-800 uppercase tracking-wider"
            >
              ชื่อพนักงาน / รหัสพนักงาน
              <span className="text-danger-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                id="select-name-column"
                value={nameColumn}
                onChange={(e) => {
                  setNameColumn(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-xl border-none bg-surface-container-high px-5 py-4 text-sm font-bold text-primary-800
                  focus:ring-2 focus:ring-primary-800/20 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="">เลือกคอลัมน์ชื่อพนักงาน...</option>
                {headers.map((header, i) => (
                  <option key={i} value={i}>
                    {header || `คอลัมน์ที่ ${i + 1}`}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-800/40">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>

          {/* Amount Select */}
          <div className="space-y-3">
            <label
              htmlFor="select-amount-column"
              className="block text-sm font-bold text-primary-800 uppercase tracking-wider"
            >
              จำนวนเงิน (เงินเดือนสุทธิ)
              <span className="text-danger-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                id="select-amount-column"
                value={amountColumn}
                onChange={(e) => {
                  setAmountColumn(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-xl border-none bg-surface-container-high px-5 py-4 text-sm font-bold text-primary-800
                  focus:ring-2 focus:ring-primary-800/20 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="">เลือกคอลัมน์จำนวนเงิน...</option>
                {headers.map((header, i) => (
                  <option key={i} value={i}>
                    {header || `คอลัมน์ที่ ${i + 1}`}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-800/40">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-danger-500/5 border border-danger-500/10 p-5 animate-in shake duration-500">
            <AlertTriangle className="w-5 h-5 text-danger-500 shrink-0" />
            <p className="text-sm font-bold text-danger-500">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          id="btn-calculate"
          onClick={handleSubmit}
          className="w-full h-16 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-primary-800 to-primary-700
            px-8 text-sm font-bold text-white shadow-premium
            hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer uppercase tracking-widest"
        >
          เริ่มการคำนวณ
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>


  );
}
