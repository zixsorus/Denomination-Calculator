import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // เพิ่มลิมิตการเตือนขนาดไฟล์จาก 500kb เป็น 1500kb (1.5MB)
    chunkSizeWarningLimit: 1500,
    
    // ตั้งค่า Code Splitting หั่นไฟล์ Library ให้โหลดแยกกัน
    rollupOptions: { 
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // แยกกลุ่มไอคอน
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // แยกกลุ่มไลบรารีอ่านไฟล์ Excel/CSV ที่มักจะไฟล์ใหญ่
            if (id.includes('xlsx') || id.includes('papaparse')) {
              return 'vendor-parser';
            }
            // ไลบรารีพื้นฐานอื่นๆ (React, ReactDOM)
            return 'vendor-core';
          }
        }
      }
    }
  }
})