# 🚗 TáSafe - App de Caronas IFRS

Aplicativo de caronas exclusivo para a comunidade do IFRS Porto Alegre, desenvolvido como projeto da disciplina de Engenharia de Software III.

## 📋 Sobre o Projeto

O TáSafe é uma plataforma que conecta alunos e servidores do IFRS para compartilhar caronas de forma segura, especialmente após o término das aulas no período noturno.

### Modalidades de Carona
- 🚗 **Carro** - Carona tradicional de automóvel
- 🏍️ **Moto** - Carona de motocicleta
- 🚕 **Uber Compartilhado** - Dividir um Uber
- 👥 **Grupo** - Deslocamento coletivo até ponto de ônibus

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT para autenticação
- Arquitetura MVC (Controller → Service → Repository)

### Frontend
- React + Vite
- React Router DOM
- Axios

### DevOps
- Docker + Docker Compose
- Hot reload em desenvolvimento

## 🚀 Como Executar

### Pré-requisitos
- Docker
- Docker Compose
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd tasafe
```

2. **Configure os arquivos .env**

Backend (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```

Frontend (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```

3. **Inicie os containers**
```bash
docker-compose up --build
```

Aguarde a instalação das dependências e a inicialização dos serviços.

4. **Execute as migrações do banco de dados**

Em outro terminal:
```bash
docker-compose exec backend npx prisma migrate dev --name init
```

### Acessar a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Prisma Studio**: 
```bash
docker-compose exec backend npx prisma studio
```

## 📁 Estrutura do Projeto

```
tasafe/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Camada de controle (HTTP)
│   │   ├── services/        # Lógica de negócio
│   │   ├── repositories/    # Acesso ao banco de dados
│   │   ├── middlewares/     # Middlewares (auth, etc)
│   │   ├── routes/          # Definição de rotas
│   │   └── server.js        # Entrada da aplicação
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🔑 Endpoints da API

### Auth
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/profile` - Perfil do usuário logado
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/:id` - Buscar usuário por ID

### Rides
- `GET /api/rides` - Listar caronas disponíveis
- `GET /api/rides/:id` - Detalhes de uma carona
- `POST /api/rides` - Criar nova carona
- `PUT /api/rides/:id` - Atualizar carona
- `DELETE /api/rides/:id` - Cancelar carona
- `GET /api/rides/my/offered` - Minhas caronas oferecidas

### Requests
- `POST /api/requests` - Solicitar carona
- `GET /api/requests/my` - Minhas solicitações
- `PUT /api/requests/:id/accept` - Aceitar solicitação
- `PUT /api/requests/:id/reject` - Rejeitar solicitação
- `DELETE /api/requests/:id` - Cancelar solicitação

### Notifications (Sprint 4)
- Em desenvolvimento

### Messages (Sprint 4)
- Em desenvolvimento

## 📝 Validação de Email

O sistema valida automaticamente que apenas emails do domínio **@poa.ifrs.edu.br** podem se registrar.

## 🗓️ Roadmap (Sprints)

- ✅ **Sprint 1**: Cadastro e Login + Perfil básico
- ✅ **Sprint 2**: Registrar carona com detalhes
- ✅ **Sprint 3**: Visualizar e solicitar caronas
- ⏳ **Sprint 4**: Notificações + Chat interno (MVP)
- 📅 **Sprint 5**: Histórico, botão de segurança, melhorias

## 🔧 Comandos Úteis

### Backend
```bash
# Entrar no container
docker-compose exec backend sh

# Criar migração
docker-compose exec backend npx prisma migrate dev --name nome_da_migracao

# Gerar Prisma Client
docker-compose exec backend npx prisma generate

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio

# Ver logs
docker-compose logs -f backend
```

### Frontend
```bash
# Entrar no container
docker-compose exec frontend sh

# Ver logs
docker-compose logs -f frontend
```

### Parar todos os containers
```bash
docker-compose down
```

### Rebuild completo
```bash
docker-compose down -v
docker-compose up --build
```

## 👥 Equipe

Projeto desenvolvido para a disciplina de Engenharia de Software III - IFRS Porto Alegre

## 📄 Licença

MIT