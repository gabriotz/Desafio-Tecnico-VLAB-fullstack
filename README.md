# 🎓 Hub Inteligente de Recursos Educacionais

Aplicação Fullstack para gerenciamento de materiais didáticos com geração automática de conteúdo via Inteligência Artificial usando Google Gemini.

![CI](https://github.com/gabriotz/Desafio-Tecnico-VLAB-fullstack/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

---

## 🎬 Demonstração

![Demo do Hub Educacional](docs/assets/demo.gif)

> Fluxo completo: listagem com paginação → cadastro com **Smart Assist** (IA gerando descrição e tags) → busca por título.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Decisões Técnicas](#decisões-técnicas)
- [Como Rodar](#como-rodar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rodando com Docker](#rodando-com-docker)
- [Rodando Localmente](#rodando-localmente)
- [Testes](#testes)
- [Endpoints da API](#endpoints-da-api)
- [CI/CD](#cicd)
- [Logs Estruturados](#logs-estruturados)

---

## Visão Geral

O Hub Educacional é um repositório centralizado para materiais de aprendizagem digital. Permite que conteudistas cadastrem, editem e excluam recursos educacionais como vídeos, PDFs e links. O sistema conta com um botão de **Smart Assist** alimentado pelo Google Gemini, que gera automaticamente descrições e tags com base no título e tipo do recurso.

---

## Funcionalidades

- ✅ CRUD completo de recursos educacionais
- ✅ Paginação, busca por título e ordenação dinâmica
- ✅ Smart Assist — descrições e tags geradas por IA via Gemini API
- ✅ Linhas expansíveis com prévia de descrição e tags
- ✅ Logs JSON estruturados com métricas de requisição à IA (Título, TokenUsage, Latência)
- ✅ Endpoint de Health Check
- ✅ GitHub Actions CI com lint e testes automatizados
- ✅ Docker Compose para desenvolvimento local

---

## Tecnologias

**Backend**
- Python 3.12
- FastAPI + Uvicorn
- SQLAlchemy (async) + asyncpg
- PostgreSQL 16
- Pydantic v2
- Google Gemini API (`gemini-2.5-flash`)
- httpx

**Frontend**
- React 18 + TypeScript
- Vite + SWC
- Tailwind CSS v4
- shadcn/ui
- Axios

**DevOps**
- Docker + Docker Compose
- GitHub Actions CI (black, flake8, eslint, pytest)
- Render (PostgreSQL na nuvem)

---

## Arquitetura

```
backend/
├── main.py                        # App FastAPI, lifespan, CORS, routers
├── core/
│   ├── config.py                  # Configurações via pydantic-settings
│   └── logging.py                 # Log estruturado em JSON
├── models/
│   ├── base.py                    # Engine async e Base declarativa
│   └── resource.py                # ORM model Resource
├── schemas/
│   ├── resource.py                # DTOs Pydantic
│   └── ai.py                      # Schemas de request/response da IA
├── repositories/
│   └── resource_repository.py    # Queries ao banco
├── services/
│   ├── resource.py                # Regras de negócio
│   └── gemini_service.py          # Integração com a API Gemini
├── api/v1/endpoints/
│   ├── resources.py               # Rotas CRUD
│   └── ai.py                      # Rota Smart Assist
└── tests/
    ├── conftest.py
    ├── test_resources.py
    └── test_gemini_service.py

frontend/
├── src/
│   ├── components/
│   │   ├── ResourceList.tsx       # Tabela com linhas expansíveis
│   │   ├── ResourceModal.tsx      # Modal de criação/edição com botão IA
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   └── SortControls.tsx
│   ├── pages/
│   │   └── Home.tsx               # Página principal, orquestra os estados
│   ├── services/
│   │   ├── api.ts                 # Instância do Axios
│   │   └── resources.ts           # Funções de chamada à API
│   └── types/
│       └── resources.ts           # Interfaces TypeScript
```

### Fluxo de dados

```
Frontend (React)
     │
     ▼
API REST (FastAPI)
     │
     ├──▶ Repository Layer (SQLAlchemy async)
     │         │
     │         ▼
     │    PostgreSQL 16
     │
     └──▶ Service Layer
               │
               ▼
         Gemini API (IA)
```

---

## Decisões Técnicas

**Por que SQLAlchemy async + asyncpg?**
FastAPI é construído sobre ASGI e tira proveito máximo de I/O assíncrono. Usar o driver síncrono criaria bloqueios desnecessários em operações de banco — o async permite que o servidor atenda outras requisições enquanto aguarda queries.

**Por que Repository Pattern?**
Isola a lógica de acesso a dados da regra de negócio. Se o banco mudar (ex: de PostgreSQL para MySQL), apenas o repositório precisa de alteração, sem tocar nos serviços.

**Por que Gemini `gemini-2.5-flash`?**
Latência menor que modelos maiores para uma tarefa focada (geração de descrição + 3 tags), e possui free tier generoso para desenvolvimento.

**Por que Pydantic v2?**
Validação de entrada e saída tipada em todas as rotas, com serialização ~5x mais rápida que a v1 graças ao core em Rust.

---

## Como Rodar

### Pré-requisitos

- Docker e Docker Compose instalados
- Ou: Python 3.12+ e Node 20+

### Clone o repositório

```bash
git clone https://github.com/gabriotz/Desafio-Tecnico-VLAB-fullstack.git
cd Desafio-Tecnico-VLAB-fullstack
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` baseado no `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Preencha os valores:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
GEMINI_API_KEY=sua_chave_aqui
ENVIRONMENT=development
```

> Obtenha sua chave gratuita do Gemini em [aistudio.google.com](https://aistudio.google.com)

---

## Rodando com Docker

A forma mais simples de rodar o projeto completo:

```bash
docker-compose up --build
```

Isso vai subir:
- **PostgreSQL** → `localhost:5432`
- **Backend FastAPI** → `localhost:8000`
- **Frontend React** → `localhost:5173`

As tabelas do banco são criadas automaticamente na inicialização.

---

## Rodando Localmente

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

API disponível em: `http://localhost:8000`  
Documentação Swagger: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

---

## Testes

```bash
cd backend

# Windows
venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate

pytest tests/ -v
```

### Cobertura dos testes

| Teste | Descrição |
|-------|-----------|
| `test_health_check` | GET /health retorna 200 |
| `test_create_resource` | POST /api/resources/ cria um recurso |
| `test_list_resources` | GET /api/resources/ retorna lista paginada |
| `test_generate_ai_suggestion` | Serviço Gemini retorna descrição e tags (mockado) |

---

## Endpoints da API

### Recursos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/resources/` | Listar recursos (paginação, busca, ordenação) |
| GET | `/api/resources/{id}` | Buscar recurso por ID |
| POST | `/api/resources/` | Criar recurso |
| PUT | `/api/resources/{id}` | Atualizar recurso |
| DELETE | `/api/resources/{id}` | Excluir recurso |

### Parâmetros de Query — `GET /api/resources/`

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | int | 1 | Número da página |
| `size` | int | 10 | Itens por página (máx 50) |
| `order_by` | string | created_at | Campo de ordenação |
| `order_dir` | string | desc | Direção (asc/desc) |
| `search` | string | null | Busca por título |

### Smart Assist

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/ai/suggest` | Gera descrição e tags com Gemini |

**Requisição:**
```json
{
  "title": "Introdução ao React",
  "type": "Video"
}
```

**Resposta:**
```json
{
  "description": "Este vídeo apresenta os conceitos fundamentais do React...",
  "tags": ["react", "javascript", "front-end"]
}
```

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Retorna o status da API |

---

## CI/CD

O pipeline roda automaticamente a cada **push** e **pull request** para a branch `main`.

```
Push / PR para main
        │
        ├── Job: lint-backend
        │     ├── black --check
        │     └── flake8
        │
        ├── Job: test-backend
        │     └── pytest tests/ -v
        │
        └── Job: lint-frontend
              └── npm run lint
```

Todos os jobs rodam em **paralelo**. O merge só é permitido quando todos passam.

Configuração completa: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## Logs Estruturados

Cada requisição à IA é registrada em formato JSON com métricas de observabilidade:

```json
{
  "timestamp": "2026-03-03T21:34:59",
  "level": "INFO",
  "message": "AI Request: Title=\"React Hooks\", Type=\"Video\", TokenUsage=120, Latency=1.4s",
  "module": "gemini_service"
}
```

Os logs incluem **título do recurso**, **tokens consumidos** e **latência da chamada**, facilitando auditoria e monitoramento de custos da API de IA.