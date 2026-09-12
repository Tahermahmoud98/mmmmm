const ExcelJS = require('exceljs');
const fs = require('fs');

async function dump() {
    try {
        const fileBuffer = fs.readFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/فورما_رێكخستنا_ميلاكى‌_بنه‌ره‌ت.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        
        const sheet = workbook.worksheets[0];
        console.log(`--- Sheet 1: ${sheet.name} ---`);
        for (let r = 41; r <= 47; r++) {
            let rowValues = [];
            for (let c = 1; c <= 25; c++) {
                let cell = sheet.getCell(r, c);
                if (cell && cell.value !== null && cell.value !== undefined) {
                    rowValues.push(`${c}/${String.fromCharCode(64 + c)}${r}:${JSON.stringify(cell.value)}`);
                }
            }
            if (rowValues.length > 0) {
                console.log(`Row ${r}: ${rowValues.join(' | ')}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
dump();
