[System.IO.File]::WriteAllText("clean_block.txt", @'
    // Dynamic button label & tooltip based on active section
    let autoBtnLabel = 'دانانا ئۆتۆماتیکی یا شواغران';
    let autoBtnTitle = 'دانانا ئۆتۆماتیکی بێی چ تێکچوون';
    let clearBtnTitle = 'پاقژکرنا جهگران (مسح الكل)';

    if (substituteSubViewMode === 'grid') {
        autoBtnLabel = absentTeacherName ? `دانانا ئۆتۆماتیکی (${absentTeacherName})` : 'دانانا ئۆتۆماتیکی یا شواغران';
        autoBtnTitle = absentTeacherName ? `توزيع البدلاء تلقائياً لـ (${absentTeacherName}) بدون أي تعارض` : 'توزيع البدلاء تلقائياً بدون تعارض';
        clearBtnTitle = absentTeacherName ? `پاقژکرنا جهگرێن (${absentTeacherName})` : 'پاقژکرنا هەموو جهگران';
    } else if (substituteSubViewMode === 'weekly_master') {
        autoBtnLabel = 'دانانا ئۆتۆماتیکی (بۆ هەمی مامۆستایان)';
        autoBtnTitle = 'توزيع البدلاء لكافة الشواغر في جدول الأسبوع كاملاً بدون أي تعارض';
        clearBtnTitle = 'پاقژکرنا هەموو جهگران لە خشتەی حەفتیانە دا';
    } else if (substituteSubViewMode === 'master_teachers') {
        autoBtnLabel = 'دانانا ئۆتۆماتیکی (ماسترێ شواغران)';
        autoBtnTitle = 'توزيع البدلاء لكافة الشواغر تلقائياً بدون أي تعارض';
    } else if (substituteSubViewMode === 'table') {
        autoBtnLabel = 'دانانا ئۆتۆماتیکی یا تۆمارێ';
        autoBtnTitle = 'توزيع البدلاء في سجل التكليف تلقائياً بدون تعارض';
    }

    // Build the Top Sub-View Bar
    const subViewBarHtml = `
        <div class="card border-0 shadow-sm rounded-4 mb-3 bg-white p-3">
            <!-- Tier 1: Teacher Title Info & Action Buttons -->
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-3 border-bottom">
                <div class="d-flex align-items-center gap-3">
                    <span class="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle shadow-sm" style="width: 48px; height: 48px; min-width: 48px;">
                        <i class="fas fa-user-clock fs-4"></i>
                    </span>
                    <div>
                        <div class="d-flex align-items-center gap-2 flex-wrap">
                            <h5 class="mb-0 fw-bold text-dark">${t('absent_teacher_col')}:</h5>
                            <span class="badge ${absentTeacherName ? 'bg-danger text-white' : 'bg-primary text-white'} px-2.5 py-1.5 fs-6 shadow-sm">
                                ${absentTeacherName || 'ماستری گشتی (کافة المعلمين)'}
                            </span>
                        </div>
                        <div class="text-muted small mt-1">
                            ${absentTeacherName ? `
                                <span><i class="fas fa-graduation-cap me-1 text-primary"></i>${translateSubjectName(absentSpec) || t('col_teacher')}</span>
                                <span class="mx-2">•</span>
                                <span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="fas fa-book-reader me-1"></i>${totalSlotsCount} وانە</span>
                                <span class="badge ${assignedCount === totalSlotsCount && totalSlotsCount > 0 ? 'bg-success' : 'bg-warning-subtle text-dark border border-warning-subtle'} ms-1">
                                    <i class="fas fa-user-check me-1"></i>${assignedCount} / ${totalSlotsCount} هاتنە دیاریکرن
                                </span>
                            ` : `
                                <span><i class="fas fa-users me-1 text-primary"></i>ماستری گشتی یێ هەمی مامۆستایان د حەفتیێ دا ل گەل دانانا جهگران</span>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Action Buttons Toolbar -->
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <button type="button" class="btn btn-warning btn-sm fw-bold rounded-pill px-3 shadow-sm text-dark" onclick="autoAssignAllSubstitutes()" title="${autoBtnTitle}">
                        <i class="fas fa-bolt me-1 text-danger"></i>${autoBtnLabel}
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm fw-bold rounded-pill px-2.5 shadow-sm" onclick="clearSubstituteAssignments()" title="${clearBtnTitle}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-sm fw-bold rounded-pill px-3 shadow-sm" onclick="promptSelectAbsentTeacher()">
                        <i class="fas fa-exchange-alt me-1 text-primary"></i>مامۆستایەکێ دی
                    </button>
                    <button type="button" class="btn btn-success btn-sm fw-bold rounded-pill px-3 shadow-sm text-white" onclick="downloadSubstituteHTML('current')" title="فایلی HTML یێ دیمەنێ نها (حفظ العرض الحالي)">
                        <i class="fas fa-file-code me-1"></i>فایلی HTML
                    </button>
                    <button type="button" class="btn btn-primary btn-sm fw-bold rounded-pill px-3 shadow-sm text-white" onclick="printDailySubstitutionReport('current')" title="چاپکرنا دیمەنێ نها (طباعة العرض الحالي)">
                        <i class="fas fa-print me-1"></i>${t('print_substitute_btn')}
                    </button>
                </div>
            </div>

            <!-- Tier 2: Responsive Sub-View Tab Navigation -->
            <div class="row g-2 pt-3">
                <div class="col-12 col-sm-6 col-lg-3">
                    <button type="button" class="btn w-100 ${substituteSubViewMode === 'grid' ? 'btn-primary shadow' : 'btn-light border'} fw-bold py-2 text-truncate rounded-3" onclick="switchSubstituteSubView('grid')">
                        <i class="fas fa-th me-1.5 ${substituteSubViewMode === 'grid' ? 'text-warning' : 'text-primary'}"></i>خشتێ گشتی (المصفوفة)
                    </button>
                </div>
                <div class="col-12 col-sm-6 col-lg-3">
                    <button type="button" class="btn w-100 ${substituteSubViewMode === 'weekly_master' ? 'btn-primary shadow' : 'btn-light border'} fw-bold py-2 text-truncate rounded-3" onclick="switchSubstituteSubView('weekly_master')">
                        <i class="fas fa-calendar-week me-1.5 ${substituteSubViewMode === 'weekly_master' ? 'text-warning' : 'text-primary'}"></i>ماستری گشتی یێ هەفتیانە
                    </button>
                </div>
                <div class="col-12 col-sm-6 col-lg-3">
                    <button type="button" class="btn w-100 ${substituteSubViewMode === 'master_teachers' ? 'btn-primary shadow' : 'btn-light border'} fw-bold py-2 text-truncate rounded-3" onclick="switchSubstituteSubView('master_teachers')">
                        <i class="fas fa-users-cog me-1.5 ${substituteSubViewMode === 'master_teachers' ? 'text-warning' : 'text-primary'}"></i>ماسترێ شواغران (المعلمون)
                    </button>
                </div>
                <div class="col-12 col-sm-6 col-lg-3">
                    <button type="button" class="btn w-100 ${substituteSubViewMode === 'table' ? 'btn-primary shadow' : 'btn-light border'} fw-bold py-2 text-truncate rounded-3" onclick="switchSubstituteSubView('table')">
                        <i class="fas fa-list-alt me-1.5 ${substituteSubViewMode === 'table' ? 'text-warning' : 'text-primary'}"></i>تۆمارا جهگران (السجل)
                    </button>
                </div>
            </div>
        </div>
    `;
'@, [System.Text.Encoding]::UTF8)

$content = [System.IO.File]::ReadAllText("app.js", [System.Text.Encoding]::UTF8).Replace("`r`n", "`n")
$block = [System.IO.File]::ReadAllText("clean_block.txt", [System.Text.Encoding]::UTF8).Replace("`r`n", "`n")

$from = "    // Dynamic button label & tooltip based on active section"
$to = "    let mainContentHtml = '';"

$idx1 = $content.IndexOf($from)
$idx2 = $content.IndexOf($to)

if ($idx1 -ge 0 -and $idx2 -gt $idx1) {
    $content = $content.Substring(0, $idx1) + $block + "`n`n" + $content.Substring($idx2)
    [System.IO.File]::WriteAllText("app.js", $content, (New-Object System.Text.UTF8Encoding($False)))
    Write-Host "PERFECT_UTF8_RESTORE"
}
