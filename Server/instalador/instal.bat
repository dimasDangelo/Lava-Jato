@echo off
echo Instalando Node.js, MariaDB e MySQL Workbench...

:: Baixa e instala o Node.js (versão LTS)
echo Baixando Node.js...
curl -o nodejs.msi https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi
msiexec /i nodejs.msi /quiet /norestart

:: Baixa e instala o MariaDB (versão mais recente)
echo Baixando MariaDB...
curl -o mariadb.msi https://downloads.mariadb.com/MariaDB/mariadb-11.3.2-winx64.msi
msiexec /i mariadb.msi /quiet /norestart

:: Baixa e instala o MySQL Workbench Community
echo Baixando MySQL Workbench...
curl -o mysqlwb.msi https://dev.mysql.com/get/Downloads/MySQLGUITools/mysql-workbench-community-8.0.36-winx64.msi
msiexec /i mysqlwb.msi /quiet /norestart

:: Limpa os arquivos de instalação
del nodejs.msi
del mariadb.msi
del mysqlwb.msi

echo Instalacao concluída!
pause
