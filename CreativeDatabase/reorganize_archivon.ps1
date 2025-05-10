# reorganize_archivon.ps1
# Archivon Folder Manager – čistá PowerShell verzia

Write-Host ""
Write-Host "Archivon Folder Manager - Spustam reorganizaciu..." -ForegroundColor Cyan

# Cielove struktury
$structure = @{
    "g.py"                    = "deploy"
    "deploy_bit_dashboard.bat" = "deploy"
    "naming_convention.yml"  = "logic"
    "fallback_logic.yml"     = "logic"
    "knowledge_cycles.yml"   = "cycles"
    "autodeploy_circle.py"   = "cycles"
    "mirror_log.jsonl"       = "mirror"
    "mirror_demon.py"        = "mirror"
    "vector_embedder.py"     = "vector"
    "phi_weight_log.json"    = "vector"
}

# Vytvor priecinky ak chybaju
foreach ($folder in $structure.Values | Select-Object -Unique) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "Vytvoreny priecinok: $folder"
    }
}

# Presun suborov
foreach ($file in $structure.Keys) {
    $target = $structure[$file]
    $found = Get-ChildItem -Path . -Recurse -Filter $file -ErrorAction SilentlyContinue | Select-Object -First 1

    if ($found) {
        $newPath = Join-Path -Path $target -ChildPath $found.Name
        Move-Item -Path $found.FullName -Destination $newPath -Force
        Write-Host "Presunute: $($found.Name) do $target"
    } else {
        Write-Host "Súbor nenajdeny: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Hotovo. Archivon system bol usporiadany." -ForegroundColor Green
