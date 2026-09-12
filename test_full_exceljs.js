const ExcelJS = require('exceljs');
const fs = require('fs');

async function test() {
    try {
        const fileBuffer = fs.readFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/فورما_رێكخستنا_ميلاكى‌_بنه‌ره‌ت.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        
        const pezSheet = workbook.worksheets[0];
        const milakSheet = workbook.worksheets[1];
        
        // Populate school name
        pezSheet.getCell('D6').value = 'قوتابخانەیا تاقیکاری';
        
        // Write active teachers in Sheet 2
        const teachers = [
            { name: 'إسماعيل عبدالله حسين', jobTitle: 'ماموستا', gender: 'نێر', certificate: 'بكالوريوس', specialization: 'عربی', phone: '07504809414', notes: 'ملاحظة 1' },
            { name: 'بيشنگ إدريس محمد', jobTitle: 'هاریكار', gender: 'مێ', certificate: 'دبلوم', specialization: 'كوردی', phone: '07501234567', notes: '' }
        ];
        
        teachers.forEach((teacher, idx) => {
            const tr = 4 + idx;
            milakSheet.getCell('B' + tr).value = teacher.name;
            milakSheet.getCell('C' + tr).value = teacher.jobTitle;
            milakSheet.getCell('D' + tr).value = teacher.gender;
            milakSheet.getCell('E' + tr).value = teacher.certificate;
            milakSheet.getCell('F' + tr).value = teacher.specialization;
            milakSheet.getCell('H' + tr).value = teacher.phone;
            milakSheet.getCell('V' + tr).value = teacher.notes;
        });
        
        const buffer = await workbook.xlsx.writeBuffer();
        fs.writeFileSync('c:/Users/Laptop Duhok/Desktop/ماموستا/mamosta1010-main/test_output.xlsx', buffer);
        console.log('Success! ExcelJS successfully wrote values in Sheet 1 and Sheet 2!');
    } catch (e) {
        console.error('Error during ExcelJS test:', e);
    }
}

test();
