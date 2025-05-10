@echo off
echo [REORGANIZE] Presúvam súbory Archivon projektu...

REM Prepneme sa do podadresára CreativeDatabase ak existuje
IF EXIST "CreativeDatabase" (
    cd CreativeDatabase
)

REM Vytvor nové cieľové priečinky
mkdir deploy
mkdir logic
mkdir cycles
mkdir mirror
mkdir vector

REM Funkcia na presun súboru s kontrolou
setlocal EnableDelayedExpansion

for %%F in (
    "g.py deploy"
    "deploy_bit_dashboard.bat deploy"
    "naming_convention.yml logic"
    "fallback_logic.yml logic"
    "knowledge_cycles.yml cycles"
    "autodeploy_circle.py cycles"
    "mirror_log.jsonl mirror"
    "mirror_demon.py mirror"
    "vector_embedder.py vector"
    "phi_weight_log.json vector"
) do (
    for /f "tokens=1,2" %%A in ("%%F") do (
        if exist "%%A" (
            move "%%A" "%%B\\"
            echo Presunuté: %%A → %%B\
        ) else (
            echo ⚠️ Súbor nenájdený: %%A
        )
    )
)

echo [OK] Archivon systém bol uprataný.
pause
