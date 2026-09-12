const fs = require('fs');
let html = fs.readFileSync('c:/Users/Laptop Duhok/Desktop/mamosta1010-main/mamosta1010-main/index.html', 'utf8');

// 1. We completely replace renderTimetableGrid() function with the correct one.
const startSig = '    function renderTimetableGrid() {';
const endSig = '    function initSortables() {';

const startIndex = html.indexOf(startSig);
const endIndex = html.indexOf(endSig);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find boundaries.");
    process.exit(1);
}

const newRenderFunc = `    function renderTimetableGrid() {
        const mode = document.querySelector('input[name="ttViewMode"]:checked').value;
        const schedule = allSchedules[activeScheduleName];
        const container = document.getElementById('timetableGridContainer');
        const days = schedule.settings.workDays || ['ئێك شەمب', 'دوو شەمب', 'سێ شەمب', 'چوار شەمب', 'پێنج شەمب'];
        const periodsCount = schedule.settings.periodsPerDay || 7;
        
        sortables.forEach(s => s.destroy()); sortables = [];

        if (mode === 'class') {
            const className = document.getElementById('timetableClassSelect').value;
            if (!className) return;
            if (className === "all_classes") {
                document.getElementById('unassignedCol').classList.remove('d-none');
                document.getElementById('gridCol').className = 'col-md-9';

                let periodHeaders = '<th style="width: 12%;">الروژ \\\\ حەسە</th>';
                for(let p=1; p<=periodsCount; p++) periodHeaders += '<th style="width: ' + (88/periodsCount) + '%;">'+p+'</th>';

                let finalHTML = '<div class="d-flex justify-content-between align-items-center mb-4 px-3"><h3 class="text-primary mb-0">خشتێ هەمی پولان</h3>' +
'<div class="no-print d-flex align-items-center">' +
    '<label class="fw-bold me-2 small text-muted">ژمارا خشتان د هەر رێزەکێ دا:</label>' +
    '<div class="btn-group" role="group">' +
        '<input type="radio" class="btn-check" name="gcols" id="gc1" value="12" onchange="changeGridCols(12)">' +
        '<label class="btn btn-outline-primary btn-sm" for="gc1">1</label>' +
        '<input type="radio" class="btn-check" name="gcols" id="gc2" value="6" onchange="changeGridCols(6)" checked>' +
        '<label class="btn btn-outline-primary btn-sm" for="gc2">2</label>' +
        '<input type="radio" class="btn-check" name="gcols" id="gc3" value="4" onchange="changeGridCols(4)">' +
        '<label class="btn btn-outline-primary btn-sm" for="gc3">3</label>' +
    '</div>' +
'</div></div><div class="row" id="multiGridContainer">';
                
                schedule.columns.forEach(cName => {
                    let h = '<div class="col-md-6 mb-4 grid-wrapper"><h5 class="text-center mt-4 mb-2 text-secondary fw-bold">پولا '+cName+'</h5>' +
                                '<table class="table table-bordered text-center align-middle" style="page-break-inside: avoid;">' +
                                '<thead class="table-secondary"><tr>'+periodHeaders+'</tr></thead><tbody>';
                    for (let d = 0; d < days.length; d++) {
                        h += '<tr><td class="fw-bold bg-light align-middle">'+days[d]+'</td>';
                        for (let p = 1; p <= periodsCount; p++) {
                            h += '<td class="timetable-cell bg-white" data-day="'+d+'" data-period="'+p+'" data-class="'+cName+'" style="height: 60px; min-width: 60px;">';
                            const item = schedule.timetables?.[cName]?.[d]?.[p];
                            if (item) {
                                h += '<div class="timetable-item mb-0 bg-white border border-secondary rounded shadow-sm text-center" style="cursor: grab;" data-subject="'+item.subject+'" data-teacher="'+item.teacher+'" data-id="'+item.id+'" data-class="'+cName+'"><div class="fw-bold text-primary" style="font-size: 0.85rem;">'+item.subject+'</div><div class="text-muted" style="font-size: 0.75rem;">'+item.teacher+'</div></div>';
                            }
                            h += '</td>';
                        }
                        h += '</tr>';
                    }
                    h += '</tbody></table></div>';
                    finalHTML += h;
                });
                finalHTML += '</div>';
                container.innerHTML = finalHTML;
            } else {
                document.getElementById('unassignedCol').classList.remove('d-none');
                document.getElementById('gridCol').className = 'col-md-9';

                if (!schedule.timetables) schedule.timetables = {};
                if (!schedule.timetables[className]) schedule.timetables[className] = {};

                let periodHeaders = '<th style="width: 12%;">الروژ \\\\ حەسە</th>';
                for(let p=1; p<=periodsCount; p++) periodHeaders += '<th style="width: ' + (88/periodsCount) + '%;">'+p+'</th>';

                let h = '<h4 class="text-center mb-3 text-primary" id="timetableGridTitle">خشتێ حەفتیانە بو پولا '+className+'</h4>' +
                            '<table class="table table-bordered text-center align-middle" id="timetableGridTable">' +
                                '<thead class="table-secondary"><tr>'+periodHeaders+'</tr></thead>' +
                                '<tbody id="timetableGridBody">';
                for (let d = 0; d < days.length; d++) {
                    h += '<tr><td class="fw-bold bg-light align-middle">' + days[d] + '</td>';
                    for (let p = 1; p <= periodsCount; p++) {
                        h += '<td class="timetable-cell bg-white" data-day="'+d+'" data-period="'+p+'" data-class="'+className+'">';
                        const item = schedule.timetables[className]?.[d]?.[p];
                        if (item) {
                            h += '<div class="timetable-item mb-0 bg-white border border-secondary rounded shadow-sm text-center" style="cursor: grab;" data-subject="'+item.subject+'" data-teacher="'+item.teacher+'" data-id="'+item.id+'" data-class="'+className+'"><div class="fw-bold text-primary" style="font-size: 0.85rem;">'+item.subject+'</div><div class="text-muted" style="font-size: 0.75rem;">'+item.teacher+'</div></div>';
                        }
                        h += '</td>';
                    }
                    h += '</tr>';
                }
                h += '</tbody></table>';
                container.innerHTML = h;
            }

            const unassignedList = document.getElementById('unassignedSubjectsList');
            let unassignedHTML = '';
            let requiredItems = [];
            let classesToProcess = className === "all_classes" ? schedule.columns : [className];
            
            classesToProcess.forEach(cName => {
                schedule.teachers.forEach(teacher => {
                    if (teacher.classes?.[cName]) {
                        Object.entries(teacher.classes[cName]).forEach(([subject, periods]) => {
                            for(let i=0; i<periods; i++) { requiredItems.push({ id: 't_'+teacher.id+'_'+cName+'_'+subject+'_'+i, subject: subject, teacher: teacher.name, className: cName }); }
                        });
                    }
                });
            });

            const assignedItems = [];
            classesToProcess.forEach(cName => {
                if (schedule.timetables?.[cName]) {
                    Object.values(schedule.timetables[cName]).forEach(dayObj => { Object.values(dayObj).forEach(item => assignedItems.push({...item, className: cName})); });
                }
            });

            let remainingItems = [...requiredItems];
            assignedItems.forEach(assigned => {
                const index = remainingItems.findIndex(req => req.teacher === assigned.teacher && req.subject === assigned.subject && req.className === assigned.className);
                if (index !== -1) remainingItems.splice(index, 1);
            });
            
            if (remainingItems.length === 0) {
                unassignedHTML = '<div class="text-center text-success mt-5"><i class="fas fa-check-circle fa-3x mb-2"></i><h6>هەمی وانە هاتنە دابەشكرن و جهێ وان دیار بوو!</h6></div>';
            } else {
                remainingItems.forEach(item => {
                    unassignedHTML += '<div class="timetable-item mb-2 bg-white border border-primary rounded shadow-sm" style="cursor: grab;" data-subject="'+item.subject+'" data-teacher="'+item.teacher+'" data-id="'+item.id+'" data-class="'+item.className+'"><div class="d-flex justify-content-between align-items-center"><span class="fw-bold text-primary">'+item.subject+'</span><span class="badge bg-secondary">'+item.teacher+'</span></div><div class="text-muted small text-start">پولا '+item.className+'</div></div>';
                });
            }
            unassignedList.innerHTML = unassignedHTML;
            initSortables();
        } 
        else if (mode === 'teacher') {
            const teacherName = document.getElementById('timetableTeacherSelect').value;
            if (!teacherName) return;
            
            if (teacherName === "all_teachers") {
                let finalHTML = '<div class="d-flex justify-content-between align-items-center mb-4 px-3"><h3 class="text-primary mb-0">خشتێ هەمی ماموستایان</h3>' +
'<div class="no-print d-flex align-items-center">' +
    '<label class="fw-bold me-2 small text-muted">ژمارا خشتان د هەر رێزەکێ دا:</label>' +
    '<div class="btn-group" role="group">' +
        '<input type="radio" class="btn-check" name="gtcols" id="gt1" value="12" onchange="changeGridCols(12)">' +
        '<label class="btn btn-outline-primary btn-sm" for="gt1">1</label>' +
        '<input type="radio" class="btn-check" name="gtcols" id="gt2" value="6" onchange="changeGridCols(6)" checked>' +
        '<label class="btn btn-outline-primary btn-sm" for="gt2">2</label>' +
        '<input type="radio" class="btn-check" name="gtcols" id="gt3" value="4" onchange="changeGridCols(4)">' +
        '<label class="btn btn-outline-primary btn-sm" for="gt3">3</label>' +
    '</div>' +
'</div></div><div class="row" id="multiGridContainer">';
                let hasAny = false;
                schedule.teachers.forEach(t => {
                    let hasClasses = schedule.columns.some(c => t.classes?.[c] && Object.values(t.classes[c]).some(v => v > 0));
                    if (!hasClasses) return;
                    hasAny = true;
                    let periodHeaders = '<th style="width: 12%;">الروژ \\\\ حەسە</th>';
                    for(let p=1; p<=periodsCount; p++) periodHeaders += '<th style="width: '+(88/periodsCount)+'%;">'+p+'</th>';
                    
                    let h = '<div class="col-md-6 mb-4 grid-wrapper"><h5 class="text-center mt-4 mb-2 text-secondary fw-bold">ماموستا: '+t.name+'</h5>' +
                                '<table class="table table-bordered text-center align-middle" style="page-break-inside: avoid;">' +
                                '<thead class="table-light"><tr>'+periodHeaders+'</tr></thead><tbody>';
                    for (let d = 0; d < days.length; d++) {
                        h += '<tr><td class="fw-bold bg-light align-middle">'+days[d]+'</td>';
                        for (let p = 1; p <= periodsCount; p++) {
                            let foundClass = '', foundSubject = '';
                            for(const cName of schedule.columns) {
                                const item = schedule.timetables?.[cName]?.[d]?.[p];
                                if (item && item.teacher === t.name) { foundClass = cName; foundSubject = item.subject; break; }
                            }
                            h += '<td style="height: 60px;">' + (foundClass ? '<span class="fw-bold text-danger d-block">پولا '+foundClass+'</span><span class="text-muted small">'+foundSubject+'</span>' : '') + '</td>';
                        }
                        h += '</tr>';
                    }
                    h += '</tbody></table></div>';
                    finalHTML += h;
                });
                if (!hasAny) finalHTML += '<div class="text-center p-4 text-muted">هیچ ماموستایەك وانە نینە!</div>';
                finalHTML += '</div>';
                container.innerHTML = finalHTML;
                return;
            }
            
            let periodHeaders = '<th style="width: 12%;">الروژ \\\\ حەسە</th>';
            for(let p=1; p<=periodsCount; p++) periodHeaders += '<th style="width: '+(88/periodsCount)+'%;">'+p+'</th>';

            let h = '<h4 class="text-center mb-3 text-primary" id="timetableGridTitle">خشتێ حەفتیانە یێ ماموستا: '+teacherName+'</h4>' +
                        '<table class="table table-bordered text-center align-middle" id="timetableGridTable">' +
                            '<thead class="table-light"><tr>'+periodHeaders+'</tr></thead><tbody>';
            for (let d = 0; d < days.length; d++) {
                h += '<tr><td class="fw-bold bg-light align-middle">'+days[d]+'</td>';
                for (let p = 1; p <= periodsCount; p++) {
                    let foundClass = '', foundSubject = '';
                    for(const cName of schedule.columns) {
                        const item = schedule.timetables?.[cName]?.[d]?.[p];
                        if (item && item.teacher === teacherName) { foundClass = cName; foundSubject = item.subject; break; }
                    }
                    h += '<td style="height: 80px;">'+(foundClass ? '<span class="fw-bold text-danger d-block">پولا '+foundClass+'</span><span class="text-muted small">'+foundSubject+'</span>' : '')+'</td>';
                }
                h += '</tr>';
            }
            h += '</tbody></table>';
            container.innerHTML = h;
        }
        else if (mode === 'master') {
            let h = '<h4 class="text-center mb-3 text-danger">خشتێ گشتی یێ پولان (الماستر)</h4>';
            h += '<table class="table table-bordered text-center align-middle bg-white" style="font-size: 0.75rem; min-width: '+(periodsCount * days.length * 40)+'px;">' +
                        '<thead class="table-light">' +
                            '<tr>' +
                                '<th rowspan="2" class="align-middle bg-secondary text-white" style="width: 80px; position: sticky; right: 0; z-index: 2;">پول \\\\ حەسە</th>';
            for(let d=0; d<days.length; d++) h += '<th colspan="'+periodsCount+'" class="border-start border-end border-dark bg-dark text-white">'+days[d]+'</th>';
            h += '</tr><tr>';
            for(let d=0; d<days.length; d++) {
                for(let p=1; p<=periodsCount; p++) h += '<th class="'+(p===1?'border-start border-dark':'')+' '+(p===periodsCount?'border-end border-dark':'')+' bg-secondary text-white">'+p+'</th>';
            }
            h += '</tr></thead><tbody>';

            schedule.columns.forEach(className => {
                h += '<tr><td class="fw-bold bg-light text-nowrap" style="position: sticky; right: 0; z-index: 1;">'+className+'</td>';
                for (let d = 0; d < days.length; d++) {
                    for (let p = 1; p <= periodsCount; p++) {
                        const item = schedule.timetables?.[className]?.[d]?.[p];
                        const borderClass = (p===1 ? 'border-start border-dark ' : '') + (p===periodsCount ? 'border-end border-dark ' : '');
                        h += '<td class="'+borderClass+'" style="overflow:hidden; vertical-align: middle;">'+(item ? getSvgFormattedText(getDisplaySubjectName(item.subject, true), true, 'text-primary', 11) + getSvgFormattedText(item.teacher, false, 'text-muted', 9.5) : '')+'</td>';
                    }
                }
                h += '</tr>';
            });
            h += '</tbody></table>';
            container.innerHTML = h;
        }
        else if (mode === 'master_teacher') {
            const activeTeachers = schedule.teachers.filter(t => schedule.columns.reduce((s, c) => s + (t.classes?.[c] ? Object.values(t.classes[c]).reduce((a, b) => a + parseInt(b, 10), 0) : 0), 0) > 0);
            let h = '<h4 class="text-center mb-3 text-warning">خشتێ گشتی یێ ماموستایان (ماستر المعلمين)</h4>';
            h += '<table class="table table-bordered text-center align-middle bg-white" style="font-size: 0.75rem; min-width: '+(periodsCount * days.length * 45)+'px;">' +
                        '<thead class="table-light">' +
                            '<tr>' +
                                '<th rowspan="2" class="align-middle bg-secondary text-white" style="width: 120px; position: sticky; right: 0; z-index: 2;">ماموستا \\\\ حەسە</th>';
            for(let d=0; d<days.length; d++) h += '<th colspan="'+periodsCount+'" class="border-start border-end border-dark bg-dark text-white">'+days[d]+'</th>';
            h += '</tr><tr>';
            for(let d=0; d<days.length; d++) {
                for(let p=1; p<=periodsCount; p++) h += '<th class="'+(p===1?'border-start border-dark':'')+' '+(p===periodsCount?'border-end border-dark':'')+' bg-secondary text-white">'+p+'</th>';
            }
            h += '</tr></thead><tbody>';

            activeTeachers.forEach(teacher => {
                h += '<tr><td class="fw-bold bg-light text-nowrap" style="position: sticky; right: 0; z-index: 1;">'+teacher.name+'</td>';
                for (let d = 0; d < days.length; d++) {
                    for (let p = 1; p <= periodsCount; p++) {
                        let foundClass = '', foundSubject = '';
                        for(const cName of schedule.columns) {
                            const item = schedule.timetables?.[cName]?.[d]?.[p];
                            if (item && item.teacher === teacher.name) { foundClass = cName; foundSubject = item.subject; break; }
                        }
                        const borderClass = (p===1 ? 'border-start border-dark ' : '') + (p===periodsCount ? 'border-end border-dark ' : '');
                        h += '<td class="'+borderClass+'" style="overflow:hidden; vertical-align: middle;">'+(foundClass ? getSvgFormattedText(foundClass, true, 'text-danger', 11) + getSvgFormattedText(getDisplaySubjectName(foundSubject, true), false, 'text-muted', 9.5) : '')+'</td>';
                    }
                }
                h += '</tr>';
            });
            h += '</tbody></table>';
            container.innerHTML = h;
        }
    }

    function changeGridCols(colSize) {
        document.querySelectorAll('#multiGridContainer .grid-wrapper').forEach(el => {
            el.className = 'col-md-' + colSize + ' mb-4 grid-wrapper';
        });
    }

`;

html = html.substring(0, startIndex) + newRenderFunc + html.substring(endIndex);

// Also fix handleTimetableDrop safely
const dropStart = '    function handleTimetableDrop(evt) {';
const dropEnd = '    function saveTimetableState(className) {';

const dropInd = html.indexOf(dropStart);
const dropEndInd = html.indexOf(dropEnd);

if(dropInd !== -1 && dropEndInd !== -1) {
    const newDrop = `    function handleTimetableDrop(evt) {
        const itemEl = evt.item;
        const toEl = evt.to;
        const fromEl = evt.from;
        const schedule = allSchedules[activeScheduleName];

        const toDay = toEl.getAttribute('data-day');
        const toPeriod = toEl.getAttribute('data-period');
        const teacherName = itemEl.getAttribute('data-teacher');
        
        const targetClassName = toEl.getAttribute('data-class') || document.getElementById('timetableClassSelect').value;
        const itemClassName = itemEl.getAttribute('data-class');

        if (itemClassName && targetClassName && itemClassName !== targetClassName) {
            showToast("نەشێی وانەیەکا پولەکێ ببەیە پولەکا دی!", "error");
            fromEl.appendChild(itemEl);
            return;
        }

        const className = targetClassName;

        if (toDay && toPeriod) {
            Array.from(toEl.children).forEach(child => {
                if (child !== itemEl) {
                    document.getElementById('unassignedSubjectsList').appendChild(child);
                }
            });

            let hasConflict = false;
            let conflictClass = '';
            for (const cName in schedule.timetables) {
                if (cName !== className && schedule.timetables[cName]?.[toDay]?.[toPeriod]) {
                    if (schedule.timetables[cName][toDay][toPeriod].teacher === teacherName) {
                        hasConflict = true;
                        conflictClass = cName;
                        break;
                    }
                }
            }

            if (hasConflict) {
                Swal.fire('ماموستا یێ مژویلە!', 'ماموستا "'+teacherName+'" ل ڤی دەمی وانە ل پولا "'+conflictClass+'" هەیە. نابت دوو پولان د ئێك دەم دا بێژت.', 'error');
                fromEl.appendChild(itemEl);
                saveTimetableState(className);
                return;
            }
        }
        
        if (!itemClassName) {
            itemEl.setAttribute('data-class', className);
        }
        saveTimetableState(className);
    }
`;
    html = html.substring(0, dropInd) + newDrop + html.substring(dropEndInd);
}

const saveStart = '    function saveTimetableState(className) {';
const saveEnd = '    function clearClassTimetable() {';
const saveInd = html.indexOf(saveStart);
const saveEndInd = html.indexOf(saveEnd);

if(saveInd !== -1 && saveEndInd !== -1) {
    const newSave = `    function saveTimetableState(className) {
        const schedule = allSchedules[activeScheduleName];
        if (!schedule.timetables[className]) schedule.timetables[className] = {};
        
        for(let d in schedule.timetables[className]) {
             for(let p in schedule.timetables[className][d]) {
                 delete schedule.timetables[className][d][p];
             }
        }
        
        const cells = document.querySelectorAll('.timetable-cell[data-class="'+className+'"]');
        if (cells.length === 0) {
            // fallback for single view without data-class bound tightly
            const fallbackCells = document.querySelectorAll('#timetableGridTable .timetable-cell');
            fallbackCells.forEach(cell => {
                const day = cell.getAttribute('data-day');
                const period = cell.getAttribute('data-period');
                const itemEl = cell.querySelector('.timetable-item');
                if (itemEl) {
                    if (!schedule.timetables[className][day]) schedule.timetables[className][day] = {};
                    schedule.timetables[className][day][period] = {
                        id: itemEl.getAttribute('data-id'),
                        subject: itemEl.getAttribute('data-subject'),
                        teacher: itemEl.getAttribute('data-teacher'),
                        className: className
                    };
                }
            });
        } else {
            cells.forEach(cell => {
                const day = cell.getAttribute('data-day');
                const period = cell.getAttribute('data-period');
                const itemEl = cell.querySelector('.timetable-item');
                
                if (itemEl) {
                    if (!schedule.timetables[className][day]) schedule.timetables[className][day] = {};
                    schedule.timetables[className][day][period] = {
                        id: itemEl.getAttribute('data-id'),
                        subject: itemEl.getAttribute('data-subject'),
                        teacher: itemEl.getAttribute('data-teacher'),
                        className: className
                    };
                }
            });
        }
        saveData();
        renderTimetableGrid();
    }
`;
    html = html.substring(0, saveInd) + newSave + html.substring(saveEndInd);
}


fs.writeFileSync('c:/Users/Laptop Duhok/Desktop/mamosta1010-main/mamosta1010-main/index.html', html);
console.log('Done replacement');
