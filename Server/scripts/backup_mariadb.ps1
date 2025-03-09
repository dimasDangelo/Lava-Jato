$User = "seu_usuario"
$Password = "sua_senha"
$Database = "seu_banco"
$BackupDir = "C:\caminho\para\backup"

# Obtém a data no formato YYYY-MM-DD_HH-MM-SS
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFile = "$BackupDir\backup_$Database`_$Date.sql"

# Cria o diretório de backup se não existir
if (!(Test-Path -Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

# Caminho do mysqldump.exe
$MySQLDump = "C:\Program Files\MariaDB 10.5\bin\mysqldump.exe"

# Executa o mysqldump
$Command = "& `"$MySQLDump`" -u$User -p$Password $Database > `"$BackupFile`""
Invoke-Expression $Command

if (Test-Path -Path $BackupFile) {
    Write-Output "Backup realizado com sucesso: $BackupFile"
} else {
    Write-Output "Erro ao realizar o backup!"
}
