@echo off
echo Verificando dependências...

:: Backend
if exist backend-automation-whatsapp\node_modules (
    echo Dependências do backend já instaladas.
) else (
    echo Instalando dependências do backend...
    cd /d backend-automation-whatsapp
    call npm install
    cd ..
)

:: Frontend
if exist frontend-automation-whatsapp\node_modules (
    echo Dependências do frontend já instaladas.
) else (
    echo Instalando dependências do frontend...
    cd /d frontend-automation-whatsapp
    call npm install
    cd ..
)

if exist frontend-automation-whatsapp\.next (
    echo Build do frontend já feito.
) else (
    echo Iniciando build do frontend...
    cd /d frontend-automation-whatsapp
    call npm run build
    cd ..
)


echo.
echo ✅ Verificação concluída!
echo Iniciando aplicações...

:: Iniciar backend minimizado
start "" /min cmd /c "cd /d backend-automation-whatsapp && npm run start:dev"

:: Iniciar frontend minimizado
start "" /min cmd /c "cd /d frontend-automation-whatsapp && npm run dev"

:: Aguardar frontend subir
timeout /t 15 >nul

:: Abrir navegador
start chrome http://localhost:3000

exit
