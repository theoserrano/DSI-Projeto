# API de Machine Learning

Esta pasta contém a API de Machine Learning para classificação de gênero musical.

## Início Rápido

```powershell
# 1. Instalar dependências
.\install_dependencies.bat

# 2. Iniciar API (treina modelo se necessário)
.\start_api.bat
```

A API estará em: http://localhost:8000

## Documentação Completa

Veja [README.md](README.md) para instruções detalhadas.

##  Integração com o App

O app em `my-app/` já está configurado. Basta configurar o `.env`:

```env
EXPO_PUBLIC_ML_API_URL=http://localhost:8000
EXPO_PUBLIC_USE_ML_API=true
```

## O que precisa ser commitado

- ✅ Todos os arquivos `.py`
- ✅ `requirements.txt`
- ✅ Scripts `.bat`
- ✅ `README.md` e `.gitignore`
- ❌ `saved_models/` (muito grande, gerado localmente)

##  Dependência Externa

Esta API usa o dataset do projeto PISI3:
- Localização: `../../PISI3-Projeto/DataSet/spotify_songs.csv`
- Necessário apenas para treinamento
- Modelo treinado pode ser compartilhado separadamente
