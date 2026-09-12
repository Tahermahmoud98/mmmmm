const ExcelJS = require('exceljs');
const fs = require('fs');

async function testMerge() {
    try {
        const fileBuffer = fs.readFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/فورما_رێكخستنا_ميلاكى‌_بنه‌ره‌ت.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        
        const pezSheet = workbook.worksheets[0];
        const milakSheet = workbook.worksheets[1];
        
        console.log('Sheet 1:', pezSheet.name);
        console.log('Sheet 2:', milakSheet.name);
        
        // Let's copy milakSheet content to pezSheet starting at row 66
        const startRow = 66;
        
        // Copy rows from milakSheet (rows 1 to 77)
        for (let r = 1; r <= milakSheet.rowCount; r++) {
            const targetRowNumber = startRow + r - 1;
            const sourceRow = milakSheet.getRow(r);
            const targetRow = pezSheet.getRow(targetRowNumber);
            
            // Set row height if it is set in source
            if (sourceRow.height) {
                targetRow.height = sourceRow.height;
            }
            
            for (let c = 1; c <= milakSheet.columnCount; c++) {
                const sourceCell = sourceRow.getCell(c);
                const targetCell = targetRow.getCell(c);
                
                // Copy value
                targetCell.value = sourceCell.value;
                
                // Copy styles if they exist
                if (sourceCell.style) {
                    targetCell.style = JSON.parse(JSON.stringify(sourceCell.style));
                }
            }
        }
        
        // Copy merges from milakSheet to pezSheet with row offset
        // In ExcelJS, sheet.model.merges has the merge ranges
        if (milakSheet.model && milakSheet.model.merges) {
            milakSheet.model.merges.forEach(mergeRange => {
                // mergeRange is a string like "A1:B2"
                const parts = mergeRange.split(':');
                if (parts.length === 2) {
                    const startCell = milakSheet.getCell(parts[0]);
                    const endCell = milakSheet.getCell(parts[1]);
                    
                    const newStartRow = startCell.row + startRow - 1;
                    const newEndRow = endCell.row + startRow - 1;
                    
                    const newStartColStr = parts[0].replace(/[0-9]/g, '');
                    const newEndColStr = parts[1].replace(/[0-9]/g, '');
                    
                    const newMergeRange = `${newStartColStr}${newStartRow}:${newEndColStr}${newEndRow}`;
                    try {
                        pezSheet.mergeCells(newMergeRange);
                    } catch (err) {
                        // Ignore overlaps
                    }
                }
            });
        }
        
        // Remove milakSheet
        workbook.removeWorksheet(milakSheet.id);
        
        const buffer = await workbook.xlsx.writeBuffer();
        fs.writeFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/scratch/merged_output.xlsx', buffer);
        console.log('Merged output file written successfully!');
    } catch (e) {
        console.error('Error during merge test:', e);
    }
}
testMerge();
