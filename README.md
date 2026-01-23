# 🎵 Sound-a-Beat

<p align="center">
  <strong>Aplicativo de música social com classificação de gênero musical usando Machine Learning</strong>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-estrutura-do-projeto">Estrutura</a> •
  <a href="#-licença">Licença</a>
</p>

---

## 📖 Sobre

O **Sound-a-Beat** é um aplicativo móvel social para amantes de música que combina descoberta musical, reviews de músicas, informações sobre shows e uma API de Machine Learning para classificação de gênero musical baseada nas preferências do usuário.

O projeto é composto por dois componentes principais:

1. **my-app**: Aplicativo móvel desenvolvido em React Native com Expo
2. **ml-api**: API de Machine Learning para classificação de gênero musical

## ✨ Funcionalidades

### 📱 Aplicativo Móvel

- **Descoberta Musical**: Explore músicas populares, novas descobertas e recomendações personalizadas
- **Playlists Pessoais**: Crie e gerencie suas próprias playlists
- **Reviews**: Escreva e leia reviews de músicas da comunidade
- **Shows e Eventos**: Descubra shows e eventos musicais
- **Perfil Musical**: Análise do seu gosto musical baseado em Machine Learning
- **Sistema de Amigos**: Conecte-se com outros usuários e veja suas atividades
- **Moderação**: Sistema de denúncias para manter a comunidade saudável
- **Autenticação**: Login seguro com Firebase e Supabase

### 🤖 API de Machine Learning

- **Classificação de Gênero**: Classifica músicas em 6 gêneros principais (Pop, Rap, Rock, Latin, R&B, EDM)
- **Análise de Perfil**: Determina o gênero musical preferido do usuário baseado nas médias de features
- **API REST**: Endpoints documentados com Swagger/OpenAPI
- **Alta Precisão**: Modelo treinado com dataset do Spotify

## 🛠️ Tecnologias

### Frontend (my-app)

| Tecnologia | Descrição |
|------------|-----------|
| [React Native](https://reactnative.dev/) | Framework para desenvolvimento mobile |
| [Expo](https://expo.dev/) | Plataforma para apps React Native |
| [Expo Router](https://docs.expo.dev/router/introduction/) | Navegação baseada em arquivos |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática para JavaScript |
| [Supabase](https://supabase.com/) | Backend as a Service (banco de dados, autenticação) |
| [Firebase](https://firebase.google.com/) | Autenticação e serviços em nuvem |

### Backend - API ML (ml-api)

| Tecnologia | Descrição |
|------------|-----------|
| [Python](https://www.python.org/) | Linguagem de programação |
| [FastAPI](https://fastapi.tiangolo.com/) | Framework web moderno e rápido |
| [scikit-learn](https://scikit-learn.org/) | Biblioteca de Machine Learning |
| [Pydantic](https://pydantic-docs.helpmanual.io/) | Validação de dados |
| [Uvicorn](https://www.uvicorn.org/) | Servidor ASGI |

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Python](https://www.python.org/) (v3.9 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Um dispositivo móvel ou emulador (Android/iOS)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/thydd/Sound-a-beat.git
cd Sound-a-beat
```

### 2. Configure o Aplicativo Mobile

```bash
# Entre na pasta do app
cd my-app

# Instale as dependências
npm install
```

### 3. Configure a API de Machine Learning

```bash
# Entre na pasta da API
cd ml-api

# Crie um ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou
.\venv\Scripts\activate   # Windows

# Instale as dependências
pip install -r requirements.txt

# Ou use o script (Windows)
.\install_dependencies.bat
```

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na pasta `my-app`:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=sua_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

# API de ML
EXPO_PUBLIC_ML_API_URL=http://localhost:8000
EXPO_PUBLIC_USE_ML_API=true
```

## 📱 Uso

### Iniciando a API de Machine Learning

```bash
cd ml-api

# Treinar o modelo (apenas na primeira vez)
python train_and_export_model.py

# Iniciar a API
python api_model_server.py

# Ou use o script (Windows)
.\start_api.bat
```

A API estará disponível em:
- **API**: http://localhost:8000
- **Documentação**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Iniciando o Aplicativo

```bash
cd my-app

# Iniciar o servidor de desenvolvimento
npm start

# Ou para plataformas específicas
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

Use o Expo Go no seu dispositivo móvel para escanear o QR code e testar o aplicativo.

## 📁 Estrutura do Projeto

```
Sound-a-beat/
├── my-app/                    # Aplicativo React Native
│   ├── app/                   # Telas e navegação (Expo Router)
│   │   ├── (auth)/            # Telas de autenticação
│   │   └── (tabs)/            # Telas principais com navegação por abas
│   ├── components/            # Componentes reutilizáveis
│   ├── context/               # Contextos React (Auth, Theme, etc.)
│   ├── services/              # Serviços e integrações
│   ├── types/                 # Definições de tipos TypeScript
│   ├── utils/                 # Funções utilitárias
│   └── assets/                # Recursos estáticos (imagens, fontes)
│
├── ml-api/                    # API de Machine Learning
│   ├── api_model_server.py    # Servidor FastAPI principal
│   ├── train_and_export_model.py  # Script de treinamento do modelo
│   ├── test_api.py            # Testes da API
│   ├── requirements.txt       # Dependências Python
│   └── saved_models/          # Modelos treinados (gerado localmente)
│
├── LICENSE                    # Licença MIT
└── README.md                  # Este arquivo
```

## 🎯 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Informações básicas da API |
| GET | `/info` | Informações sobre o modelo |
| GET | `/genres` | Lista de gêneros disponíveis |
| GET | `/health` | Health check |
| POST | `/classify` | Classifica uma música individual |
| POST | `/classify_profile` | Classifica o perfil musical do usuário |

### Exemplo de Requisição

```bash
curl -X POST "http://localhost:8000/classify_profile" \
  -H "Content-Type: application/json" \
  -d '{
    "danceability": 0.65,
    "energy": 0.70,
    "valence": 0.60,
    "tempo": 120.0,
    "acousticness": 0.25,
    "instrumentalness": 0.05,
    "speechiness": 0.08,
    "loudness": -5.0
  }'
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
