@echo off
echo [ORGANIZE] Archivon files reorganizing...

REM Vytvor priečinky
mkdir core
mkdir logic
mkdir cycles
mkdir vector
mkdir mirror
mkdir deploy

REM Presuň súbory
move archivon_agent.py core\
move archivon_manifest.json core\
move archivon_source_map.yml core\

move fallback_logic.yml logic\
move naming_convention.yml logic\

move knowledge_cycles.yml cycles\
move autodeploy_circle.py cycles\

move vector_demon.py vector\
move vector_embedder.py vector\
move phi_weight_log.json vector\

move mirror_demon.py mirror\
move evolution_log.json mirror\
move mirror_log.jsonl mirror\

move g.py deploy\
move deploy_bit_dashboard.bat deploy\

echo [OK] Archivon súbory zoradené.
pause
