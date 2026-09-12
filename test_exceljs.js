const ExcelJS = require('exceljs');
const fs = require('fs');

async function test() {
    try {
        const fileBuffer = fs.readFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/فورما_رێكخستنا_ميلاكى‌_بنه‌ره‌ت.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        
        const pezSheet = workbook.worksheets[0];
        const milakSheet = workbook.worksheets[1];
        
        console.log('Sheet 1 Name:', pezSheet.name);
        console.log('Sheet 2 Name:', milakSheet.name);
        
        // Let's try writing to D6
        const cellD6 = pezSheet.getCell('D6');
        console.log('D6 Old Value:', cellD6.value);
        cellD6.value = 'Test School Name';
        console.log('D6 New Value:', pezSheet.getCell('D6').value);
        
        // Save to a test file
        const buffer = await workbook.xlsx.writeBuffer();
        fs.writeFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/test_output.xlsx', buffer);
        console.log('Test file written successfully!');
    } catch (e) {
        console.error('Error during ExcelJS operation:', e);
    }
}

test();
