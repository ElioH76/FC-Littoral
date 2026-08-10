@echo off
chcp 65001 >nul
REM Lanceur de la synchro FFF pour la tache planifiee Windows.
REM Se place a la racine du projet (dossier parent de \scripts) puis lance npm.
cd /d "%~dp0.."
echo ==== %DATE% %TIME% ==== >> "%LOCALAPPDATA%\fcl-sync-fff.log"
call npm run sync:fff >> "%LOCALAPPDATA%\fcl-sync-fff.log" 2>&1
