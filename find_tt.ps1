$code = [System.IO.File]::ReadAllText("app.js", [System.Text.Encoding]::UTF8)
$lines = $code -split "`r?`n"

Write-Host "Searching for initTimetableTab and renderTimetable..."
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "initTimetableTab" -or $lines[$i] -match "renderTimetableGrid\(") {
        Write-Host "$($i + 1): $($lines[$i])"
    }
}
