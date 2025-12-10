@echo off
REM ============================================
REM Script para instalar dependencias
REM ============================================

echo ============================================
echo  Instalando Dependencias Python
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo.
    echo Por favor, instale Python 3.11 ou superior:
    echo https://www.python.org/downloads/
    echo.
    echo Certifique-se de marcar "Add Python to PATH" durante a instalacao.
    pause
    exit /b 1
)

echo [INFO] Python encontrado:
python --version
echo.

REM Verificar pip
python -m pip --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] pip nao encontrado!
    echo [INFO] Tentando instalar pip...
    python -m ensurepip --default-pip
)

echo [INFO] Instalando dependencias...
echo.

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao instalar dependencias!
    echo.
    echo Tente manualmente:
    echo   python -m pip install fastapi uvicorn[standard] pydantic scikit-learn imbalanced-learn pandas numpy joblib requests
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Instalacao Concluida com Sucesso!
echo ============================================
echo.
echo Agora voce pode:
echo   1. Treinar o modelo: python train_and_export_model.py
echo   2. Iniciar a API: python api_model_server.py
echo   3. Ou usar: start_api.bat (faz tudo automaticamente)
echo.
pause
