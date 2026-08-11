# Amigo — Como Executar o Projeto

Guia simples e direto para configurar e rodar a aplicação.

---

## Pré-requisitos

* **Node.js** (v16+) e **npm** (ou yarn)
* **Docker** e **Docker Compose** (recomendado)
* **PostgreSQL** em execução na máquina (apenas se for rodar sem Docker)

---

## 1. Rodar o Backend com Docker (Recomendado)

Caso prefira utilizar o Docker para rodar o banco de dados e a API, siga os passos abaixo:

1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   *Não é necessário alterar a senha no arquivo `.env` se estiver usando apenas o Docker, pois o docker-compose já configura o banco de dados automaticamente.*

3. **Inicie os serviços (Banco de Dados e API):**
   ```bash
   docker compose up -d
   ```

4. **Rode as migrations do banco de dados:**
   ```bash
   docker compose exec api npx sequelize-cli db:migrate
   ```

*(A API estará rodando em `http://localhost:3334` e com hot-reload ativo para desenvolvimento)*

---

## 2. Rodar o Backend sem Docker

Caso prefira rodar localmente no seu computador, siga os passos:

1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou yarn install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   *Abra o arquivo `.env` e coloque a sua senha do PostgreSQL na variável `DB_PASS`.*

4. **Crie o banco de dados e rode as migrations:**
   ```bash
   # Crie o banco "db_test_api" no seu PostgreSQL e depois rode:
   npx sequelize-cli db:migrate
   ```

5. **Inicie o servidor backend:**
   ```bash
   npm run dev
   # ou yarn dev
   ```
   *(O servidor rodará em `http://localhost:3333`)*

---

## 3. Rodar o Frontend

O frontend é composto por arquivos estáticos simples e precisa de um servidor local para funcionar corretamente.

1. **Sirva os arquivos da pasta `frontend`:**
   Abra um novo terminal e rode:
   ```bash
   # Opção 1: Usando live-server (recomendado)
   npx live-server ./frontend --port=8080

   # Opção 2: Usando http-server
   npx http-server ./frontend -p 8080

   # Opção 3: Usando Python (dentro da pasta frontend)
   cd frontend && python3 -m http.server 8080
   ```
   *(Ou abra com a extensão **Live Server** do VS Code clicando em `frontend/index.html` e escolhendo "Open with Live Server")*

2. **Acesse no navegador:**
   [http://localhost:8080](http://localhost:8080)
