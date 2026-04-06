import { useState, useMemo } from "react";
import { Table2, ChevronUp, ChevronDown, Search } from "lucide-react";
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

    // Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((emp) => emp.id_or_name.toLowerCase().includes(term));
    }

    // Sort
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
      return <ChevronUp className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-primary-800" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-primary-800" />
    );
  };

  return (
    <div className="w-full rounded-3xl bg-white shadow-premium overflow-hidden border border-surface-container-high">
      {/* Header */}
      <div className="px-8 py-6 border-b border-surface-container-high bg-surface-container-low">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary-800 p-3 text-white shadow-premium">
              <Table2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-800 tracking-tight">สมุดบัญชีการกระจายเงิน</h3>
              <p className="text-sm font-bold text-on-surface-variant/60 mt-1 uppercase tracking-widest">
                {individual_breakdown.length} รายการรายบุคคล
              </p>
            </div>
          </div>
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-800/40 group-focus-within:text-primary-800 transition-colors" />
            <input
              id="search-employees"
              type="text"
              placeholder="ค้นหารายการ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 w-full sm:w-80 rounded-2xl border-none bg-surface-container-high 
                text-sm font-bold text-primary-800 placeholder-primary-800/20 
                focus:ring-2 focus:ring-primary-800/20 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-medium" id="results-table">
          <thead>
            <tr className="bg-surface-container-high/50">
              <th
                className="group px-8 py-4 text-left cursor-pointer hover:bg-primary-800/5 transition-colors whitespace-nowrap"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary-800/40">
                  ผู้รับเงิน
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                className="group px-8 py-4 text-right cursor-pointer hover:bg-primary-800/5 transition-colors whitespace-nowrap"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary-800/40">
                  จำนวนเงินสุทธิ
                  <SortIcon column="amount" />
                </div>
              </th>
              {DENOMINATIONS.map((denom) => (
                <th
                  key={denom}
                  className="group px-6 py-4 text-right cursor-pointer hover:bg-primary-800/5 transition-colors whitespace-nowrap"
                  onClick={() => handleSort(denom)}
                >
                  <div className="flex items-center justify-end gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary-800/40">
                    ฿{denom}
                    <SortIcon column={denom} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td
                  colSpan={2 + DENOMINATIONS.length}
                  className="px-8 py-20 text-center font-bold text-primary-800/20 uppercase tracking-widest text-xs"
                >
                  {searchTerm ? "ไม่พบข้อมูลที่ตรงเงื่อนไข" : "ไม่มีข้อมูลในสมุดบัญชี"}
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((emp, idx) => (
                <tr
                  key={idx}
                  className="transition-colors even:bg-surface-container-low/30 odd:bg-white hover:bg-primary-800/5"
                >
                  <td className="px-8 py-5 font-bold text-primary-800 whitespace-nowrap">
                    {emp.id_or_name}
                  </td>
                  <td className="px-8 py-5 text-right font-extrabold text-primary-800 whitespace-nowrap">
                    ฿{formatNumber(emp.amount)}
                  </td>
                  {DENOMINATIONS.map((denom) => (
                    <td key={denom} className="px-6 py-5 text-right whitespace-nowrap">
                      <span
                        className={`text-base font-extrabold tracking-tight ${
                          emp.breakdown[denom] > 0
                            ? "text-primary-800"
                            : "text-primary-800/10"
                        }`}
                      >
                        {emp.breakdown[denom] || 0}
                      </span>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredAndSorted.length > 0 && (
        <div className="px-8 py-4 bg-surface-container-low border-t border-surface-container-high">
          <p className="text-[10px] font-extrabold text-primary-800/40 uppercase tracking-[0.2em]">
            การควบคุมมุมมองบัญชี • กำลังแสดง {filteredAndSorted.length} รายการ
          </p>
        </div>
      )}

    </div>

  );
}
