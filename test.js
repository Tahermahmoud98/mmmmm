const schedule = {
    columns: ["2A"],
    teachers: [
        { name: "Dlovan", classes: { "2A": { "Science": 5 } } },
        { name: "Samira", classes: { "2A": { "Math": 5 } } }
    ],
    timetables: {
        "2A": {}
    }
};

const days = [0, 1, 2, 3, 4];
const periodsCount = 7;

let unassigned = [];
schedule.columns.forEach(className => {
    schedule.teachers.forEach(teacher => {
        if (teacher.classes?.[className]) {
            Object.entries(teacher.classes[className]).forEach(([subject, periods]) => {
                for(let i=0; i<periods; i++) {
                    unassigned.push({ className, id: `t_${teacher.name}_${subject}_${i}`, subject, teacher: teacher.name });
                }
            });
        }
    });
});

let placedCount = 0;
unassigned.forEach(item => {
    let placed = false;
    
    let totalTeacherPeriodsInClass = 0;
    let teacherObj = schedule.teachers.find(t => t.name === item.teacher);
    if (teacherObj && teacherObj.classes?.[item.className]) {
        Object.values(teacherObj.classes[item.className]).forEach(p => totalTeacherPeriodsInClass += parseInt(p, 10));
    }
    const maxTeacherPerDay = Math.ceil(totalTeacherPeriodsInClass / days.length);

    console.log(`Processing ${item.subject} (${item.teacher}). Max/day: ${maxTeacherPerDay}`);

    for(let d=0; d<days.length && !placed; d++) {
        let teacherSameDayCount = 0;
        for(let checkP=1; checkP<=periodsCount; checkP++) {
            if(schedule.timetables[item.className]?.[d]?.[checkP]?.teacher === item.teacher) teacherSameDayCount++;
        }
        
        if(teacherSameDayCount >= maxTeacherPerDay) {
            console.log(` - Day ${d} full for ${item.teacher} (${teacherSameDayCount} >= ${maxTeacherPerDay})`);
            continue;
        }

        for(let p=1; p<=periodsCount && !placed; p++) {
            if (!schedule.timetables[item.className]) schedule.timetables[item.className] = {};
            if (!schedule.timetables[item.className][d]) schedule.timetables[item.className][d] = {};
            
            if (!schedule.timetables[item.className][d][p]) {
                let teacherFree = true;
                // mock checking other classes
                
                if (teacherFree) {
                    schedule.timetables[item.className][d][p] = {
                        id: item.id, subject: item.subject, teacher: item.teacher
                    };
                    console.log(` > Placed at Day ${d}, Period ${p}`);
                    placed = true;
                    placedCount++;
                }
            }
        }
    }
});

console.log("\nFinal grid:");
for(let d=0; d<days.length; d++) {
    let row = `Day ${d}: `;
    for(let p=1; p<=periodsCount; p++) {
        row += schedule.timetables["2A"][d]?.[p]?.subject || "[  ]";
        row += " | ";
    }
    console.log(row);
}
