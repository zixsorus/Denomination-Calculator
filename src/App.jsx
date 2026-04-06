import { useState, useCallback } from "react";
import {
  Calculator,
  RotateCcw,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Table2,
} from "lucide-react";
import FileUpload from "./components/FileUpload";
import ColumnMapping from "./components/ColumnMapping";
import SummaryCard from "./components/SummaryCard";
import ResultsTable from "./components/ResultsTable";
import SkippedRowsAlert from "./components/SkippedRowsAlert";
import { extractEmployeeData } from "./utils/fileParser";
import {
  calculateAllDenominations,
  DENOMINATIONS,
} from "./utils/denominationCalculator";
import BankWithdrawalSlip from "./components/BankWithdrawalSlip";

// Steps for the stepper UI
const STEPS = [
  { label: "อัปโหลดไฟล์", description: "อัปโหลดรายการเงินเดือน" },
  { label: "เลือกคอลัมน์", description: "ตั้งค่าข้อมูลที่ต้องการ" },
  { label: "สรุปผล", description: "ตรวจสอบรายการเงินย่อย" },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileData, setFileData] = useState(null);
  const [result, setResult] = useState(null);
  const [skippedRows, setSkippedRows] = useState([]);
  const [showSkipped, setShowSkipped] = useState(true);
  const [printMode, setPrintMode] = useState("all"); // 'all' | 'slip' | 'table'

  const handleFileProcessed = useCallback(({ fileName, headers, rows }) => {
    setFileData({ fileName, headers, rows });
    setCurrentStep(1);
  }, []);

  const handleMappingComplete = useCallback(
    ({ nameColIndex, amountColIndex }) => {
      const { validEmployees, skippedRows: skipped } = extractEmployeeData(
        fileData.rows,
        nameColIndex,
        amountColIndex
      );

      if (validEmployees.length === 0) {
        alert(
          "ไม่พบข้อมูลพนักงานที่ถูกต้อง กรุณาตรวจสอบการเลือกคอลัมน์และแน่ใจว่าคอลัมน์จำนวนเงินเป็นตัวเลข"
        );
        return;
      }

      const calculationResult = calculateAllDenominations(validEmployees);
      setResult(calculationResult);
      setSkippedRows(skipped);
      setShowSkipped(true);
      setCurrentStep(2);
    },
    [fileData]
  );

  const handleReset = () => {
    setCurrentStep(0);
    setFileData(null);
    setResult(null);
    setSkippedRows([]);
    setShowSkipped(true);
  };

  const handleExportCSV = () => {
    if (!result) return;

    const headers = ["พนักงาน", "จำนวนเงิน", ...DENOMINATIONS.map((d) => `฿${d}`)];
    const rows = result.individual_breakdown.map((emp) => [
      emp.id_or_name,
      emp.amount,
      ...DENOMINATIONS.map((d) => emp.breakdown[d] || 0),
    ]);

    // Add grand total row
    rows.push([
      "ยอดรวมทั้งหมด",
      result.summary_total_amount,
      ...DENOMINATIONS.map((d) => result.grand_total_breakdown[d] || 0),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    // Add BOM for Excel Thai UTF-8 support
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "รายการแบ่งเงินย่อย.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerPrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
      setPrintMode("all");
    }, 200);
  };

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <header className="text-center mb-16 print:hidden">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-800 tracking-tight leading-tight mb-4">
            ระบบคำนวณ{" "}
            <span className="bg-gradient-to-br from-primary-800 to-primary-600 bg-clip-text text-transparent">
              เงินย่อยพนักงาน
            </span>
          </h1>
        </header>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-16 px-4" id="stepper">
          {STEPS.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold transition-all duration-300
                    ${
                      index < currentStep
                        ? "bg-success-500 text-white shadow-premium"
                        : index === currentStep
                        ? "bg-primary-800 text-white shadow-premium scale-110"
                        : "bg-surface-container-high text-on-surface-variant"
                    }
                  `}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="hidden sm:block text-center absolute translate-y-16">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                      index <= currentStep
                        ? "text-primary-800"
                        : "text-on-surface-variant/60"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-1 mx-4 rounded-full transition-all duration-300 ${
                    index < currentStep
                      ? "bg-success-500"
                      : "bg-surface-container-high"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <main className="space-y-8 mt-8">
          {/* Step 0: File Upload */}
          {currentStep === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <FileUpload onFileProcessed={handleFileProcessed} />
            </div>
          )}

          {/* Step 1: Column Mapping */}
          {currentStep === 1 && fileData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ColumnMapping
                headers={fileData.headers}
                onMappingComplete={handleMappingComplete}
              />
              <button
                onClick={() => setCurrentStep(0)}
                className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors px-2 py-1 uppercase tracking-wider"
                id="btn-back-upload"
              >
                <RotateCcw className="w-4 h-4" />
                เปลี่ยนไฟล์ใหม่
              </button>
            </div>
          )}

          {/* Step 2: Results */}
          {currentStep === 2 && result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-4 bg-surface-container-low p-3 rounded-2xl print:hidden">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-xl bg-white border border-surface-container-high
                    px-5 py-3 text-sm font-bold text-on-surface uppercase tracking-wider
                    hover:bg-surface-container-high transition-all shadow-sm"
                  id="btn-new-calculation"
                >
                  <RotateCcw className="w-4 h-4" />
                  เริ่มใหม่
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary-800 to-primary-700
                    px-6 py-3 text-sm font-bold text-white shadow-premium
                    hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider"
                  id="btn-export-csv"
                >
                  <Download className="w-4 h-4" />
                  ส่งออกข้อมูล
                </button>
                <div className="h-8 w-px bg-surface-container-high mx-2"></div>
                <button
                  onClick={() => triggerPrint('slip')}
                  className="flex items-center gap-2 rounded-xl bg-white border border-surface-container-high
                    px-5 py-3 text-sm font-bold text-on-surface uppercase tracking-wider
                    hover:bg-surface-container-high transition-all shadow-sm"
                  id="btn-print-slip"
                >
                  <Printer className="w-4 h-4" />
                  พิมพ์ใบเบิกเงินย่อย
                </button>
                <button
                  onClick={() => triggerPrint('table')}
                  className="flex items-center gap-2 rounded-xl bg-white border border-surface-container-high
                    px-5 py-3 text-sm font-bold text-on-surface uppercase tracking-wider
                    hover:bg-surface-container-high transition-all shadow-sm"
                  id="btn-print-table"
                >
                  <Table2 className="w-4 h-4" />
                  พิมพ์สมุดกระจายเงิน
                </button>
                {fileData && (
                  <span className="ml-auto text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest px-4">
                    ไฟล์อ้างอิง: {fileData.fileName}
                  </span>
                )}
              </div>

              {/* Skipped Rows Warning */}
              {showSkipped && (
                <SkippedRowsAlert
                  skippedRows={skippedRows}
                  onDismiss={() => setShowSkipped(false)}
                />
              )}

              <div className={printMode === 'table' ? 'print:hidden' : ''}>
                <BankWithdrawalSlip result={result} fileData={fileData} />
              </div>

              {printMode === 'table' && (
                <style>{`
                  @page {
                    size: A4 landscape !important;
                    margin: 1cm;
                  }
                `}</style>
              )}

              {/* Summary (Page 1) - ซ่อนตอนพิมพ์เพราะเราใช้ BankWithdrawalSlip แทนแล้ว */}
              <div className="print:hidden">
                <SummaryCard result={result} />
              </div>

              {/* Individual Breakdown Table (Page 2) */}
              <div className={`print-page-break ${printMode === 'slip' ? 'print:hidden' : ''}`}>
                <ResultsTable result={result} />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-24 text-center">
          <div className="w-12 h-1 bg-surface-container-high mx-auto mb-8 rounded-full" />
          <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">
            ระบบจัดการเงินย่อยพนักงาน &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
