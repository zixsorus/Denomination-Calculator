import { useState, useMemo } from "react";
import { Table2, ChevronUp, ChevronDown, Search, Banknote, Coins } from "lucide-react";
import { DENOMINATIONS } from "../utils/denominationCalculator";

function formatNumber(num) {
  return num.toLocaleString("en-US");
}

export default function ResultsTable({ result }) {
  const { individual_breakdown } = result;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSorted = useMemo(() => {
    let data = [...individual_breakdown];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((emp) => emp.id_or_name.toLowerCase().includes(term));
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === "name") {
          valA = a.id_or_name.toLowerCase();
          valB = b.id_or_name.toLowerCase();
        } else if (sortConfig.key === "amount") {
          valA = a.amount;
          valB = b.amount;
        } else {
          valA = a.breakdown[sortConfig.key] || 0;
          valB = b.breakdown[sortConfig.key] || 0;
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [individual_breakdown, searchTerm, sortConfig]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity print:hidden" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-primary-800 print:hidden" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-primary-800 print:hidden" />
    );
  };

  return (
    <div className="w-full rounded-3xl bg-white shadow-premium overflow-hidden border border-surface-container-high flex flex-col print:border-none print:shadow-none print:rounded-none">
      
      {/* Header สำหรับหน้าจอ (ซ่อนตอนพิมพ์) */}
      <div className="px-6 py-5 border-b border-surface-container-high bg-surface-container-low shrink-0 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary-800 p-2.5 text-white shadow-sm">
              <Table2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-800 tracking-tight">สมุดกระจายเงินรายบุคคล</h3>
              <p className="text-xs font-bold text-primary-800/60 mt-0.5 tracking-wide">
                ใช้สำหรับจัดเตรียมเงินใส่ซอง ({individual_breakdown.length} รายการ)
              </p>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-800/40 group-focus-within:text-primary-800 transition-colors" />
            <input
              type="text"
              placeholder="ค้นหาพนักงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl border border-surface-container-high bg-white text-sm font-medium focus:ring-2 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Header สำหรับตอนพิมพ์ (ซ่อนบนหน้าจอ) */}
      <div className="hidden print:block text-center mb-4">
        <h2 className="text-xl font-bold text-black">ตารางแจกแจงเงินสดรายบุคคล (Cash Breakdown)</h2>
        <p className="text-sm text-gray-600">จำนวนทั้งหมด {filteredAndSorted.length} รายการ</p>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] print:max-h-none print:overflow-visible relative">
        <table className="w-full text-sm print:text-[11px] print:border-collapse print:border print:border-black" id="results-table">
          <thead className="sticky top-0 z-10 bg-surface-container-low shadow-sm print:shadow-none print:static print:bg-gray-100">
            <tr>
              <th
                className="group px-4 py-3 text-left cursor-pointer border-b border-surface-container-high print:border-black print:border"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1.5 text-xs print:text-[11px] font-bold text-primary-800/70 print:text-black whitespace-nowrap">
                  ชื่อผู้รับเงิน <SortIcon column="name" />
                </div>
              </th>
              <th
                className="group px-4 py-3 text-right cursor-pointer border-b border-surface-container-high border-r-2 border-r-surface-container-high/50 print:border-black print:border"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end gap-1.5 text-xs print:text-[11px] font-bold text-primary-800/70 print:text-black whitespace-nowrap">
                  ยอดสุทธิ <SortIcon column="amount" />
                </div>
              </th>
              {DENOMINATIONS.map((denom) => (
                <th
                  key={denom}
                  className="group px-1 py-3 text-center cursor-pointer border-b border-surface-container-high print:border-black print:border"
                  onClick={() => handleSort(denom)}
                >
                  <div className="flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-primary-800/70 print:text-black">
                    {denom >= 20 ? (
                      <Banknote className="w-4 h-4 text-primary-800/40 print:text-black print:w-3 print:h-3 print:hidden" />
                    ) : (
                      <Coins className="w-4 h-4 text-primary-800/40 print:text-black print:w-3 print:h-3 print:hidden" />
                    )}
                    <div className="flex items-center gap-1">
                      {denom} <SortIcon column={denom} />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/50 print:divide-y-0 bg-white">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={2 + DENOMINATIONS.length} className="px-8 py-16 text-center text-primary-800/40 print:border print:border-black">
                  {searchTerm ? "ไม่พบข้อมูลพนักงานที่ค้นหา" : "ไม่มีข้อมูลในสมุดบัญชี"}
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((emp, idx) => (
                <tr key={idx} className="hover:bg-primary-800/5 print:hover:bg-transparent print:break-inside-avoid">
                  <td className="px-4 py-2 print:py-1.5 font-medium text-primary-800 print:text-black whitespace-nowrap print:border print:border-black">
                    {emp.id_or_name}
                  </td>
                  <td className="px-4 py-2 print:py-1.5 text-right font-bold text-primary-800 print:text-black border-r-2 border-r-surface-container-high/50 print:border print:border-black">
                    {formatNumber(emp.amount)}
                  </td>
                  {DENOMINATIONS.map((denom) => {
                    const count = emp.breakdown[denom] || 0;
                    return (
                      <td key={denom} className="px-1 py-2 print:py-1.5 text-center print:border print:border-black">
                        {count > 0 ? (
                          <span className="inline-block min-w-[28px] px-1.5 py-0.5 rounded text-[13px] print:text-[12px] font-bold bg-primary-800/10 text-primary-800 print:bg-transparent print:text-black">
                            {count}
                          </span>
                        ) : (
                          <span className="text-primary-800/20 print:text-gray-300 text-xs print:text-[10px]">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer สำหรับหน้าจอ (ซ่อนตอนพิมพ์) */}
      {filteredAndSorted.length > 0 && (
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container-high shrink-0 text-right print:hidden">
          <p className="text-xs font-medium text-primary-800/50">
            แสดง {filteredAndSorted.length} รายการ
          </p>
        </div>
      )}
    </div>
  );
}