const ExcelJS = require('exceljs');
const fs = require('fs');

async function test() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('?????_????????_??????_??????.xlsx');
    const sheet = workbook.worksheets[0];
    
    // insert a row after 18
    sheet.insertRow(19, []);
    
    await workbook.xlsx.writeFile('test_insert.xlsx');
    console.log('done');
}
test();
