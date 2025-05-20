# PlayTurbo Engine [Initial Structura]

Contains komplexne vrstva Projeku pre playable ads, s orchestracio scriptami, animatormi a enginommi

**Struktura** (pred2eploy):

- /engine/templates/pipeline/
- /engine/scenes/ (riadenie vrestvie, keyframes)
- /engine/servers/ api / actions / triggers
- /engine/memory/ - user session a modularny stat
- /scripts/ - persistenne vytvarene skripty
- /assets/ - 2p, vydeo, globs, grafika
- /logs/ - logging postup a debug mode
- /ui/ - react/jsz front-end

* *Build Dependencies**
- .venv/
- .requirements.txt
- .package.json
- .package-lock.json
- .vite.config.js
- .docker-compose.yml
- .env (defineje ciest vstup, adii build/porti)


* *Geppetto Suggestions** 

- config.env ke parametrizovany
- dockrfile configuracia in root
- gitignore makondifikovane
- index.md alebo architekturY flow
- core val modul tuned valime (reels system)
- datamodel + vizual + scene graph for buttons

- tests/ mod handled vydvokemne engine vnm\

- ci-cd tester: pytest/devtest; vitest pre react
