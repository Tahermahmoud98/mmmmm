const ExcelJS = require('exceljs');
const fs = require('fs');

async function listSheets() {
    try {
        const fileBuffer = fs.readFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/فورما_رێكخستنا_ميلاكى‌_بنه‌ره‌ت.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        
        console.log("Worksheet names:");
        workbook.worksheets.forEach((sheet, idx) => {
            console.log(`${idx}: ${sheet.name}`);
        });
    } catch (e) {
        console.error(e);
    }
}
listSheets();
