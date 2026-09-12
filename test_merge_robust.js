const ExcelJS = require('exceljs');
const fs = require('fs');

async function testMerge() {
    try {
        const fileBuffer = fs.readFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/فورما_رێكخستنا_ميلاكى‌_بنه‌ره‌ت.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        
        const pezSheet = workbook.worksheets[0];
        const milakSheet = workbook.worksheets[1];
        
        console.log('Original Sheets:', workbook.worksheets.map(w => w.name));
        
        const offset = 65; // row 1 in milakSheet becomes row 66 in pezSheet
        
        // 1. Copy rows and styles
        for (let r = 1; r <= milakSheet.rowCount; r++) {
            const targetRowNumber = offset + r;
            const sourceRow = milakSheet.getRow(r);
            const targetRow = pezSheet.getRow(targetRowNumber);
            
            if (sourceRow.height) {
                targetRow.height = sourceRow.height;
            }
            
            for (let c = 1; c <= milakSheet.columnCount; c++) {
                const sourceCell = sourceRow.getCell(c);
                const targetCell = targetRow.getCell(c);
                
                // Construct standard formulas or copy plain values
                if (r >= 4 && c === 1) { // Column A
                    targetCell.value = { formula: `IF(B${targetRowNumber}="", "", COUNTA($B$69:B${targetRowNumber}))` };
                } else if (r >= 4 && c === 21) { // Column U
                    targetCell.value = { formula: `IF(SUM(I${targetRowNumber}:T${targetRowNumber})=0, "", SUM(I${targetRowNumber}:T${targetRowNumber}))` };
                } else {
                    let val = sourceCell.value;
                    if (val && typeof val === 'object' && (val.formula || val.sharedFormula)) {
                        // Ignore formula templates, we write actual value or we don't copy the formula object itself
                        targetCell.value = null;
                    } else {
                        targetCell.value = val;
                    }
                }
                
                // Copy style
                if (sourceCell.style) {
                    targetCell.style = JSON.parse(JSON.stringify(sourceCell.style));
                }
            }
        }
        
        // 2. Copy merges
        if (milakSheet.model && milakSheet.model.merges) {
            milakSheet.model.merges.forEach(mergeRange => {
                const parts = mergeRange.split(':');
                if (parts.length === 2) {
                    const startCell = milakSheet.getCell(parts[0]);
                    const endCell = milakSheet.getCell(parts[1]);
                    
                    const newStartRow = startCell.row + offset;
                    const newEndRow = endCell.row + offset;
                    
                    const newStartColStr = parts[0].replace(/[0-9]/g, '');
                    const newEndColStr = parts[1].replace(/[0-9]/g, '');
                    
                    const newMergeRange = `${newStartColStr}${newStartRow}:${newEndColStr}${newEndRow}`;
                    try {
                        pezSheet.mergeCells(newMergeRange);
                    } catch (err) {
                        // Ignore
                    }
                }
            });
        }
        
        // 3. Populate a test teacher at row 69 (which is index 0)
        pezSheet.getCell('B69').value = 'Test Teacher';
        pezSheet.getCell('C69').value = 'Job';
        pezSheet.getCell('D69').value = 'M';
        pezSheet.getCell('I69').value = 10;
        pezSheet.getCell('J69').value = 5;
        
        // 4. Remove milakSheet from workbook
        workbook.removeWorksheet(milakSheet.id);
        
        console.log('Sheets after removal:', workbook.worksheets.map(w => w.name));
        
        const buffer = await workbook.xlsx.writeBuffer();
        fs.writeFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/scratch/merged_robust_output.xlsx', buffer);
        console.log('Successfully wrote merged output without errors!');
    } catch (err) {
        console.error('Error in robust merge:', err);
    }
}

testMerge();
