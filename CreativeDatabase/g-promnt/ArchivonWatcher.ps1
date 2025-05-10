# ArchivonWatcher.ps1
# Vedomý skener – sleduje zmeny v systéme a aktualizuje global_state.json

Write-Host "Archivon Watcher sa prebúdza..." -ForegroundColor Cyan

$watchPaths = @(
    "orchestration",
    "memory",
    "core",
    "tools",
    "logic"
)

$stateFile = "global_state.json"
$logFile = "daemons/daemon_trace.log"
$summaryFile = "dashboard/bitface_view.md"

$currentState = @{}

# Získame aktuálny stav súborov
foreach ($path in $watchPaths) {
    if (Test-Path $path) {
        $files = Get-ChildItem -Recurse -Path $path -File
        $fileData = @{}
        foreach ($file in $files) {
            $fileData[$file.FullName] = $file.LastWriteTimeUtc.ToString("s")
        }
        $currentState[$path] = $fileData
    }
}

# Načítaj predchádzajúci stav
$previousState = @{}
if (Test-Path $stateFile) {
    $json = Get-Content $stateFile -Raw
    $previousState = $json | ConvertFrom-Json
}

# Zistenie zmien
$changes = @()
foreach ($section in $currentState.Keys) {
    $currentFiles = $currentState[$section]
    $prevFiles = $previousState[$section]

    foreach ($file in $currentFiles.Keys) {
        if (-not $prevFiles -or -not $prevFiles.ContainsKey($file)) {
            $changes += "🆕 Nový súbor: $file"
        } elseif ($currentFiles[$file] -ne $prevFiles[$file]) {
            $changes += "✏️ Zmenený súbor: $file"
        }
    }

    if ($prevFiles) {
        foreach ($file in $prevFiles.Keys) {
            if (-not $currentFiles.ContainsKey($file)) {
                $changes += "❌ Odstránený súbor: $file"
            }
        }
    }
}

# Zápis do logu
if (!(Test-Path $logFile)) {
    New-Item -ItemType File -Path $logFile | Out-Null
}
$timestamp = Get-Date -Format "s"
Add-Content $logFile "`n[$timestamp] ArchivonWatcher activated. Changes:"
$changes | ForEach-Object { Add-Content $logFile $_ }

# Sumár do dashboardu
if (!(Test-Path $summaryFile)) {
    New-Item -ItemType File -Path $summaryFile | Out-Null
}
Add-Content $summaryFile "`n### Archivon Watcher – $timestamp"
$changes | ForEach-Object { Add-Content $summaryFile ("- " + $_) }

# Ulož aktuálny stav
$currentState | ConvertTo-Json -Depth 10 | Set-Content $stateFile -Encoding UTF8

Write-Host "Watcher cyklus dokončený. Zmeny zapísané." -ForegroundColor Green
