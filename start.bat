@echo off
cd /d %~dp0

:: Inicia o backend sem abrir a janela
wscript.exe star_bat.vbs

:: Aguarda alguns segundos para garantir que o backend está rodando
timeout /t 3 /nobreak >nul

:: Abre o navegador na URL do frontend
start "" "http://localhost:3000/#"

exit