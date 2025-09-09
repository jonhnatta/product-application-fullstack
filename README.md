# Sistema e Dashboard de Gerenciamento de Produtos

Um sistema completo de gerenciamento de produtos desenvolvido com **FastAPI** (Backend), **Next.js** (Frontend) e **PostgreSQL** (Banco de Dados), totalmente containerizado com **Docker**.

## Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes](#-testes)
- [Deploy](#-deploy)

## Visão Geral

Este projeto é um sistema completo de gerenciamento de produtos que permite:

- **CRUD completo** de produtos
- **Dashboard analítico** com gráficos interativos
- **Interface responsiva** e moderna
- **Validações** de dados robustas
- **API RESTful** documentada

### Características Principais

- ✅ **Full Stack**: Backend + Frontend + Database
- ✅ **Containerizado**: Docker Compose para fácil deployment
- ✅ **Documentação**: Swagger
- ✅ **Dashboard Analytics**: Gráficos com Recharts
- ✅ **Design System**: Shadcn/UI + Tailwind CSS
- ✅ **Validações**: Pydantic + TypeScript
- ✅ **Testes**: Pytest + Jest

## Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para Python
- **Pydantic** - Validação de dados
- **PostgreSQL** - Banco de dados relacional
- **Poetry** - Gerenciamento de dependências
- **Pytest** - Framework de testes

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Superset do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de UI modernos
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **PostgreSQL 15** - Banco de dados

## Funcionalidades

### Gestão de Produtos
-  **Criar** novos produtos
-  **Listar** produtos com paginação
-  **Editar** informações dos produtos
-  **Excluir** produtos com confirmação
-  **Validações** de dados

### Dashboard Analítico
-  **Produtos por Fornecedor** (Gráfico de barras)
-  **Preço Médio por Fornecedor** (Gráfico de barras)
-  **Valor de Estoque por Categoria** (Gráfico de pizza)
-  **Quantidade por Categoria** (Gráfico de barras)
-  **Cards** com estatísticas gerais

### Campos do Produto
- **Nome** *(obrigatório)*
- **Descrição** *(opcional)*
- **Preço** *(obrigatório, ≥ 0)*
- **Categoria** *(obrigatória)*
- **Email do Fornecedor** *(obrigatório, formato de email)*

## Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │────│    (FastAPI)    │────│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Padrões Utilizados
- **Repository Pattern** - Separação da lógica de dados
- **Service Layer** - Regras de negócio
- **DTO/Schema** - Transferência de dados
- **Clean Architecture** - Arquitetura limpa

## Pré-requisitos

- **Docker** (v20+)
- **Docker Compose** (v2+)
- **Git**

## Instalação

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/jonhnatta/product-application-fullstack.git
cd product-application-fullstack
```

### 2️⃣ Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo e configure suas próprias variáveis
cp .env.example .env

# Edite o arquivo .env com suas configurações:
# - Altere as credenciais do PostgreSQL se necessário
# - Ajuste a URL da API se usar um domínio diferente
# - Modifique outras configurações conforme sua necessidade
```

**Exemplo do arquivo `.env`:**
```env
POSTGRES_DB=postgres
POSTGRES_USER=postgres  
POSTGRES_PASSWORD=sua_senha_aqui
POSTGRES_DATABASE_URL=postgresql://postgres:sua_senha_aqui@postgres:5432/postgres
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3️⃣ Execute o projeto
```bash
# Suba todos os serviços
docker-compose up -d --build

# Acompanhe os logs (opcional)
docker-compose logs -f
```

### 4️⃣ Acesse as aplicações

- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Uso

### Interface Web
1. Acesse http://localhost:3000
2. Use o botão "Adicionar Produto" para criar produtos
3. Visualize a lista de produtos na página principal
4. Acesse o "Dashboard" para ver analytics
5. Use os botões de editar/excluir em cada produto

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/products/` | Lista todos os produtos |
| `POST` | `/products/` | Cria um novo produto |
| `GET` | `/products/{id}` | Busca produto por ID |
| `PUT` | `/products/{id}` | Atualiza produto |
| `DELETE` | `/products/{id}` | Remove produto |
| `GET` | `/docs` | Documentação Swagger |
| `GET` | `/redoc` | Documentação ReDoc |


## Estrutura do Projeto

```
bootcamp_python/
├── 🐳 docker-compose.yml        # Orquestração dos containers
├── 📄 .env                      # Variáveis de ambiente
├── 📚 README.md                 # Documentação
├── 🧪 pytest.ini               # Configuração de testes
├── 📜 poetry.lock & pyproject.toml
│
├── 🔧 backend/                  # API FastAPI
│   ├── 🐳 Dockerfile
│   ├── 📋 main.py              # Aplicação principal
│   ├── 💾 database/            # Configuração do banco
│   ├── 📊 models/              # Modelos SQLAlchemy
│   ├── 🛣 routers/             # Rotas da API
│   ├── 📝 schemas/             # Esquemas Pydantic
│   ├── 🔧 services/            # Lógica de negócio
│   └── 🧪 tests/               # Testes automatizados
│
└── 🎨 frontend/                # Aplicação Next.js
    ├── 🐳 Dockerfile
    ├── ⚙️ next.config.js
    ├── 🎨 tailwind.config.js
    └── 📁 src/
        ├── 📱 app/             # App Router (Next.js 14)
        │   ├── 🏠 page.tsx     # Página principal
        │   └── 📊 dashboard/   # Dashboard analytics
        ├── 🧩 components/      # Componentes React
        │   ├── 📝 ProductForm.tsx
        │   ├── 🗑️ DeleteConfirmModal.tsx
        │   ├── 🎭 Modal.tsx
        │   └── 🎨 ui/          # Componentes Shadcn/UI
        └── 🔌 services/        # Integração com API
```

## Testes

### Backend (FastAPI)
```bash
# Executar testes do backend
poetry run pytest
```

## Deploy


### Produção
```bash
# 1. Configure suas variáveis de ambiente para produção
cp .env.example .env
# Edite o .env com suas configurações de produção

# 2. Execute o projeto
docker-compose up -d --build
```

**Para produção, altere no `.env`:**
- `POSTGRES_PASSWORD` - Use uma senha forte
- `NEXT_PUBLIC_API_URL` - URL do seu domínio (ex: https://sua-api.com)

## Scripts Úteis

```bash
# Parar todos os containers
docker-compose down

# Rebuild completo
docker-compose down && docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f
```

### Padrões de Commit
- `Add:` - Nova funcionalidade
- `Fix:` - Correção de bug
- `Update:` - Atualização de código existente
- `Docs:` - Documentação
- `Test:` - Testes

---