/**
 * File Parser Utility
 * Handles parsing of .xlsx and .csv files.
 */
import * as XLSX from "xlsx";
import Papa from "papaparse";

/**
 * Parse an uploaded file and return headers + rows.
 * @param {File} file - The uploaded file
 * @returns {Promise<{ headers: string[], rows: any[][] }>}
 */
export async function parseFile(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  if (extension === "csv") {
    return parseCSV(file);
  } else if (extension === "xlsx" || extension === "xls") {
    return parseExcel(file);
  } else {
    throw new Error("Unsupported file format. Please upload .xlsx or .csv files.");
  }
}

/**
 * Parse pasted raw text (usually TSV from Excel/Sheets) and return headers + rows.
 * @param {string} text - The pasted text
 * @returns {Promise<{ headers: string[], rows: any[][] }>}
 */
export async function parseText(text) {
  return new Promise((resolve, reject) => {
    // Trim to avoid completely empty parsing if they just paste spaces
    const trimmed = text.trim();
    if (!trimmed) {
      reject(new Error("ไม่มีข้อมูลให้ประมวลผล (Empty data)"));
      return;
    }

    Papa.parse(trimmed, {
      delimiter: "\t", // Default from Excel/Sheets pasting
      complete: (results) => {
        if (results.data.length === 0) {
          reject(new Error("The text data is empty."));
          return;
        }
        
        // If length is 1 and it doesn't look like TSV, try auto-detect (CSV)
        let dataToUse = results.data;
        if (dataToUse.length > 0 && dataToUse[0].length === 1 && trimmed.includes(',')) {
          const autoRes = Papa.parse(trimmed);
          dataToUse = autoRes.data;
        }

        const headers = dataToUse[0];
        const rows = dataToUse.slice(1).filter((row) =>
          row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "")
        );
        resolve({ headers, rows });
      },
      error: (error) => {
        reject(new Error(`Text parsing error: ${error.message}`));
      },
    });
  });
}

function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.data.length === 0) {
          reject(new Error("The CSV file is empty."));
          return;
        }
        const headers = results.data[0];
        const rows = results.data.slice(1).filter((row) =>
          row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "")
        );
        resolve({ headers, rows });
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}

function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        if (jsonData.length === 0) {
          reject(new Error("The Excel file is empty."));
          return;
        }

        const headers = jsonData[0].map((h) => (h !== undefined && h !== null ? String(h) : ""));
        const rows = jsonData.slice(1).filter((row) =>
          row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "")
        );
        resolve({ headers, rows });
      } catch (err) {
        reject(new Error(`Excel parsing error: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract employee data from parsed rows using column mappings.
 * Validates that the amount column contains numeric values.
 * @param {string[]} headers - Column headers
 * @param {any[][]} rows - Data rows
 * @param {number} nameColIndex - Index of the employee name/ID column
 * @param {number} amountColIndex - Index of the amount column
 * @returns {{ validEmployees: Array, skippedRows: Array }}
 */
export function extractEmployeeData(rows, nameColIndex, amountColIndex) {
  const validEmployees = [];
  const skippedRows = [];

  rows.forEach((row, index) => {
    const nameValue = row[nameColIndex];
    const rawAmount = row[amountColIndex];

    // Skip if name is empty
    if (nameValue === null || nameValue === undefined || String(nameValue).trim() === "") {
      skippedRows.push({ row: index + 2, reason: "Empty employee name/ID" });
      return;
    }

    // Parse amount - strip commas and whitespace
    const cleanedAmount = String(rawAmount).replace(/,/g, "").trim();
    const amount = Number(cleanedAmount);

    // Validate numeric
    if (isNaN(amount) || cleanedAmount === "" || amount < 0) {
      skippedRows.push({
        row: index + 2,
        reason: `Non-numeric or invalid amount: "${rawAmount}"`,
        name: String(nameValue).trim(),
      });
      return;
    }

    validEmployees.push({
      id_or_name: String(nameValue).trim(),
      amount: Math.round(amount), // Round to nearest integer (Thai Baht)
    });
  });

  return { validEmployees, skippedRows };
}
