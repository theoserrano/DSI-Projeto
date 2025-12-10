@echo off
REM ============================================
REM Script para iniciar a API de ML
REM ============================================

echo ============================================
echo  Iniciando API de Machine Learning
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo Por favor, instale Python 3.11 ou superior
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
echo [1/3] Verificando dependencias...
python -c "import fastapi" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Instalando dependencias...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERRO] Falha ao instalar dependencias
        pause
        exit /b 1
    )
)
echo [OK] Dependencias instaladas

REM Verificar se o modelo foi treinado
echo.
echo [2/3] Verificando modelo treinado...
if not exist "saved_models\genre_classifier_pipeline.joblib" (
    echo [AVISO] Modelo nao encontrado!
    echo [INFO] Treinando modelo... (isso pode levar alguns minutos)
    python train_and_export_model.py
    if errorlevel 1 (
        echo [ERRO] Falha ao treinar modelo
        pause
        exit /b 1
    )
)
echo [OK] Modelo pronto

REM Iniciar a API
echo.
echo [3/3] Iniciando servidor API...
echo.
echo ============================================
echo  API estara disponivel em:
echo  - http://localhost:8000
echo  - Docs: http://localhost:8000/docs
echo ============================================
echo.
python api_model_server.py
