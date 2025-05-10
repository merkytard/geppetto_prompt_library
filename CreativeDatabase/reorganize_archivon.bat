@echo off
echo [REORGANIZE] Presúvam súbory Archivon projektu...

REM Vytvor nové cieľové priečinky
mkdir deploy
mkdir logic
mkdir cycles
mkdir mirror
mkdir vector

REM Presuň súbory
move g.py deploy\
move deploy_bit_dashboard.bat deploy\

move naming_convention.yml logic\
move fallback_logic.yml logic\

move knowledge_cycles.yml cycles\
move autodeploy_circle.py cycles\

move mirror_log.jsonl mirror\
move mirror_demon.py mirror\

move vector_embedder.py vector\
move phi_weight_log.json vector\

echo [OK] Archivon systém bol uprataný.
pause
