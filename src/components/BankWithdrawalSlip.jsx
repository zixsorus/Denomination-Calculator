import { Banknote, Coins } from "lucide-react";
import { DENOMINATIONS } from "../utils/denominationCalculator";

function formatNumber(num) {
  return num.toLocaleString("en-US");
}

export default function BankWithdrawalSlip({ result, fileData }) {
  if (!result) return null;

  const { summary_total_amount, grand_total_breakdown } = result;
  
  // วันที่ปัจจุบันสำหรับออกเอกสาร
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="hidden print:block bg-white text-black p-8 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">ใบแจ้งขอเบิกเงินสดย่อย</h1>
        <p className="text-gray-600">สำหรับเจ้าหน้าที่ฝ่ายบุคคลนำไปเบิกจ่ายเงินย่อยกับแคชเชียร์</p>
      </div>

      {/* Info Section */}
      <div className="flex justify-between items-end mb-6 border-b-2 border-black pb-4">
        <div>
          <p className="mb-2"><span className="font-bold">อ้างอิงชุดข้อมูล:</span> {fileData?.fileName || "ไม่ระบุ"}</p>
          <p><span className="font-bold">วันที่สั่งพิมพ์:</span> {today}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-500 mb-1">ยอดรวมที่ต้องเบิกสุทธิ (Total Amount)</p>
          <p className="text-4xl font-extrabold underline decoration-double">
            ฿{formatNumber(summary_total_amount)}
          </p>
        </div>
      </div>

      {/* Denomination Table */}
      <table className="w-full border-collapse border border-black mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-3 text-center w-1/3">ชนิดธนบัตร / เหรียญ<br/><span className="text-xs font-normal text-gray-600">(Denomination)</span></th>
            <th className="border border-black p-3 text-center w-1/3">จำนวนชิ้น<br/><span className="text-xs font-normal text-gray-600">(Quantity)</span></th>
            <th className="border border-black p-3 text-right w-1/3">รวมเป็นเงิน (บาท)<br/><span className="text-xs font-normal text-gray-600">(Total Value)</span></th>
          </tr>
        </thead>
        <tbody>
          {DENOMINATIONS.map((denom) => {
            const count = grand_total_breakdown[denom] || 0;
            if (count === 0) return null; // ไม่พิมพ์แบงก์ที่จำนวนเป็น 0 เพื่อความสะอาดตา
            const totalValue = count * denom;
            
            return (
              <tr key={denom}>
                <td className="border border-black p-3 font-bold">
                  <div className="flex items-center justify-center gap-2">
                    {denom >= 20 ? <Banknote className="w-5 h-5 text-gray-700" /> : <Coins className="w-5 h-5 text-gray-700" />}
                    <span>฿{formatNumber(denom)}</span>
                  </div>
                </td>
                <td className="border border-black p-3 text-center text-lg">{formatNumber(count)}</td>
                <td className="border border-black p-3 text-right font-bold">{formatNumber(totalValue)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100">
            <td colSpan="2" className="border border-black p-3 text-right font-bold">รวมทั้งสิ้น (Grand Total)</td>
            <td className="border border-black p-3 text-right font-extrabold text-xl">฿{formatNumber(summary_total_amount)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 mt-8 pt-4 break-inside-avoid">
        <div className="text-center">
          <div className="border-b border-black border-dashed mx-4 mb-2 h-8"></div>
          <p className="font-bold">ผู้ขอเบิกเงิน</p>
          <p className="text-sm text-gray-500">(Requestor)</p>
        </div>
        <div className="text-center">
          <div className="border-b border-black border-dashed mx-4 mb-2 h-8"></div>
          <p className="font-bold">ผู้อนุมัติ</p>
          <p className="text-sm text-gray-500">(Authorized Signature)</p>
        </div>
        <div className="text-center">
          <div className="border-b border-black border-dashed mx-4 mb-2 h-8"></div>
          <p className="font-bold">แคชเชียร์ / ผู้จ่ายเงิน</p>
          <p className="text-sm text-gray-500">(Cashier)</p>
        </div>
      </div>
    </div>
  );
}