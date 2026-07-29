#  Amigo — Como Executar o Projeto

Guia simples e direto para configurar e rodar a aplicação.

---

##  Pré-requisitos

* **Node.js** (v16+) e **npm** (ou yarn)
* **PostgreSQL** em execução na máquina (porta `5432`)

---
## 1. Rodar o Backend com Docker

Caso prefira utilizar o Docker para rodar o banco de dados e a API, siga os passos abaixo na raiz do projeto:

1. **Configure as variaveis de ambiente:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Nao e necessario alterar a senha no arquivo .env se estiver usando apenas o Docker, pois o docker-compose ja configura o banco.*

2. **Inicie os servicos (Banco de Dados e API):**
   ```bash
   docker-compose up -d
   ```

3. **Rode as migrations do banco de dados:**
   ```bash
   docker-compose exec api npx sequelize-cli db:migrate
   ```

*(A API estara rodando em `http://localhost:3333` e com hot-reload ativo para desenvolvimento)*

---

##  2. Rodar o Frontend

1. **Sirva os arquivos da pasta `frontend`:**
   ```bash
   # Opção 1: Usando npx
   npx http-server ./frontend -p 8080

   # Opção 2: Usando Python (dentro da pasta frontend)
   cd frontend && python3 -m http.server 8080
   ```
   *(Ou abra com a extensão **Live Server** do VS Code clicando em `frontend/index.html`)*

2. **Acesse no navegador:**
   [http://localhost:8080](http://localhost:8080)

---

## 3. Rodar o Backend com Docker

Caso prefira utilizar o Docker para rodar o banco de dados e a API, siga os passos abaixo na raiz do projeto:

1. **Configure as variaveis de ambiente:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Nao e necessario alterar a senha no arquivo .env se estiver usando apenas o Docker, pois o docker-compose ja configura o banco.*

2. **Inicie os servicos (Banco de Dados e API):**
   ```bash
   docker-compose up -d
   ```

3. **Rode as migrations do banco de dados:**
   ```bash
   docker-compose exec api npx sequelize-cli db:migrate
   ```

*(A API estara rodando em `http://localhost:3333` e com hot-reload ativo para desenvolvimento)*

---
##  3. Rodar o Backend sem Docker

1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Crie o arquivo `.env`:**
   ```bash
   cp .env.example .env
   ```
   *Abra o arquivo `.env` e coloque a sua senha do PostgreSQL em `DB_PASS`.*

4. **Crie o banco de dados e rode as migrations:**
   ```bash
   # Crie o banco "db_test_api" no seu PostgreSQL e depois rode:
   npx sequelize-cli db:migrate
   ```

5. **Inicie o servidor backend:**
   ```bash
   npm run dev
   ```
   *(O servidor rodará em `http://localhost:3333`)*

