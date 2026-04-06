import { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { parseFile } from "../utils/fileParser";

export default function FileUpload({ onFileProcessed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) processFile(droppedFile);
    },
    []
  );

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = async (selectedFile) => {
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setError("ไม่รองรับประเภทไฟล์นี้ กรุณาอัปโหลดไฟล์ .xlsx หรือ .csv");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);

    try {
      const { headers, rows } = await parseFile(selectedFile);
      if (rows.length === 0) {
        setError("ไฟล์นี้ไม่มีข้อมูลในแถวรายการ");
        setIsProcessing(false);
        return;
      }
      onFileProcessed({ fileName: selectedFile.name, headers, rows });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        id="file-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed 
          transition-all duration-500 ease-out shadow-premium
          ${
            isDragging
              ? "border-primary-800 bg-primary-800/5 scale-[1.01]"
              : "border-primary-800/10 bg-surface-container-lowest hover:border-primary-800/30 hover:bg-surface-container-low"
          }
          ${file ? "p-8" : "p-12 md:p-24"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />

        {!file ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <div
              className={`
              rounded-3xl p-6 transition-all duration-500
              ${isDragging ? "bg-primary-800 text-white rotate-12 scale-110" : "bg-primary-800/5 text-primary-800"}
            `}
            >
              <Upload className="w-12 h-12" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-800 tracking-tight">
                {isDragging ? "วางเพื่อนำเข้าข้อมูล" : "อัปโหลดข้อมูลรายการเงินเดือน"}
              </p>
              <p className="mt-3 text-on-surface-variant/80 font-medium max-w-md mx-auto leading-relaxed">
                ลากไฟล์ Excel หรือ CSV มาวางที่นี่ หรือคลิกเพื่อ{" "}
                <span className="text-primary-600 font-bold decoration-2 underline-offset-4 hover:underline">
                  เลือกไฟล์จากคอมพิวเตอร์
                </span>
              </p>
              <div className="mt-8 flex items-center justify-center gap-4 text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">
                <span>XLSX</span>
                <div className="w-1 h-1 rounded-full bg-on-surface-variant/20" />
                <span>CSV</span>
                <div className="w-1 h-1 rounded-full bg-on-surface-variant/20" />
                <span>จำกัด 50MB</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6 bg-surface-container-low p-4 rounded-xl">
            <div className="rounded-2xl bg-primary-800 p-4 text-white shadow-premium">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-primary-800 truncate">{file.name}</p>
              <p className="text-sm font-bold text-on-surface-variant/60 mt-1 uppercase tracking-wider">
                {(file.size / 1024).toFixed(1)} KB • พร้อมใช้งาน
              </p>
            </div>
            {isProcessing ? (
              <div className="flex items-center gap-3 text-primary-800 font-bold uppercase tracking-widest text-xs">
                <div className="w-5 h-5 border-3 border-primary-800/20 border-t-primary-800 rounded-full animate-spin" />
                กำลังวิเคราะห์
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="rounded-xl p-3 text-on-surface-variant/40 hover:text-danger-500 hover:bg-danger-500/5 transition-all"
                id="btn-clear-file"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 flex items-start gap-4 rounded-2xl bg-danger-500/5 border border-danger-500/10 p-5" id="upload-error">
          <div className="bg-danger-500 rounded-lg p-1.5 text-white">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-danger-500 uppercase tracking-wider mb-1">เกิดข้อผิดพลาดในการนำเข้า</p>
            <p className="text-sm text-danger-500/80 font-medium">{error}</p>
          </div>
        </div>
      )}


    </div>
  );
}
