const ExcelJS = require('exceljs');
async function test() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('?????_????????_??????_??????.xlsx');
    const sheet = workbook.worksheets[0];
    
    // check merges intersecting row 14
    const merges = sheet.model.merges;
    console.log('Merges:', merges.filter(m => m.includes('14') || m.includes('15') || m.includes('18')));
}
test();
