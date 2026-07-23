# 🏥 Agenda Médica

Aplicação web completa de **Agenda Médica**, uma solução simples para consulta de agendamentos pré-cadastrados. A aplicação possui autenticação segura com JWT, exibição e filtragem de agendamentos médicos em tempo real com a biblioteca **Tabulator**, mini relatórios de médicos e pacientes com contadores de consultas por status, além de suíte de testes automatizados e containerização completa em Docker.

---

## 🚀 Tecnologias Utilizadas

### Backend (API REST)
- **Python 3.11+** com **Flask** (Arquitetura modular em Blueprints e Application Factory)
- **SQLite** (Banco de dados relacional com `PRAGMA foreign_keys = ON`)
- **PyJWT** (Autenticação baseada em Tokens JWT)
- **Flasgger / Swagger UI** (Documentação interativa OpenAPI 2.0)
- **Werkzeug** (Criptografia de senhas com algoritmo `scrypt`)
- **Flask-CORS** (Habilitação de requisições Cross-Origin de forma segura)
- **Pytest & Unittest** (18 testes automatizados cobrindo rotas, autenticação e cenários de exceção)

### Frontend
- **HTML5, CSS3 & JavaScript Vanilla (ES6+)** (Design moderno, responsivo com suporte a glassmorphism, consumo assíncrono direto via `fetch` e sem sobrecarga de frameworks)
- **Tabulator v6.2.1** (Biblioteca interativa para renderização de tabelas, ordenação e busca em tempo real)

### Infraestrutura & DevOps
- **Docker & Docker Compose** (Execução unificada do Backend Flask e Frontend Nginx com um único comando)

---

## 🔑 Credenciais do Usuário de Teste

Para realizar o login e testar a aplicação:

- **Usuário:** `recepcao`
- **Senha:** `senha123`

---

## 🛠️ Como Executar o Projeto

### Opção 1: Execução via Docker (Recomendado)

Com o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/) rodando na máquina:

1. Na raiz do projeto, execute:
   ```bash
   docker compose up --build
   ```
2. O Docker iniciará automaticamente:
   - **Frontend Web App:** `http://127.0.0.1:8000`
   - **API & Swagger UI:** `http://127.0.0.1:5000`
3. Acesse `http://127.0.0.1:8000` no seu navegador para utilizar a aplicação.

---

### Opção 2: Execução Local (Sem Docker)

#### 1. Iniciar a API Backend
```bash
cd api
pip install -r requirements.txt
python -m flask init-db
python run.py
```
A API estará rodando em `http://127.0.0.1:5000`.

#### 2. Abrir o Frontend
Dê dois cliques no arquivo `frontend/index.html` ou suba um servidor estático:
```bash
python -m http.server 8000 --directory frontend
```
Acesse `http://127.0.0.1:8000` no navegador.

---

## 🧪 Testes Automatizados

A aplicação contém 18 testes automatizados cobrindo autenticação (sucesso, senha incorreta, usuário inexistente), proteção de rotas JWT, consulta e filtragem de agendamentos e estatísticas de médicos e pacientes.

Para executar os testes:

```bash
cd api
python -m pytest
```

Resultados esperados: **`18 passed` (100% de aprovação)**.

---

## 📌 Endpoints da API

| Método | Rota | Descrição | Requer Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | **Documentação Interativa Swagger UI** (OpenAPI Spec). | ❌ |
| `POST` | `/api/auth/login` | Realiza o login do usuário e retorna o Token JWT. | ❌ |
| `GET` | `/api/agendamentos/` | Retorna a lista de agendamentos (suporta parâmetros `pesquisa`, `status`, `data`, `medico_id`). | ✅ |
| `GET` | `/api/medicos/` | Retorna médicos e a contagem de agendamentos (*realizados, cancelados, agendados*). | ✅ |
| `GET` | `/api/pacientes/` | Retorna pacientes e a contagem de agendamentos (*realizados, cancelados, agendados*). | ✅ |

---

## 💡 Decisões Técnicas e Arquiteturais

1. **Modelagem de Banco de Dados Relacional e Normalização**:
   - Decisão de estruturar o banco de dados em tabelas normalizadas e dedicadas (`pacientes`, `medicos`, `especialidades`, `convenios`, `agendamentos` e `usuarios`).
   - Essa abordagem garante integridade referencial via `FOREIGN KEY`, evita a duplicação de dados, simplifica as consultas de junção (`JOIN`) e permite extrair contagens e relatórios estatísticos por entidade com facilidade.

2. **Execução Unificada em Docker (Comando Único)**:
   - Orquestração completa do Backend (API Flask) e do Frontend (servidor Nginx) através do `docker-compose.yml`.
   - Essa decisão permite a execução do sistema inteiro em segundos rodando (`docker compose up --build`), dispensando a necessidade de configurar ambientes virtuais Python ou servidores estáticos locais.

3. **Arquitetura Frontend com HTML5, CSS3 e JavaScript Vanilla**:
   - Escolha por construir o frontend sem frameworks pesados (como React, Angular ou Vue), utilizando **Vanilla JavaScript (ES6+)** e **CSS3 moderno**.
   - Proporciona tempo de carregamento praticamente instantâneo, consumo assíncrono limpo das APIs REST via `fetch`, controle total sobre a responsividade e leveza para a aplicação.

4. **Documentação Interativa com Swagger UI**:
   - Para inspecionar os esquemas de dados, parâmetros aceitos e testar a autenticação com Token JWT de forma interativa sem precisar importar coleções no Postman ou Insomnia.

5. **Uso da Biblioteca Tabulator v6.2.1**:
   - Para renderização de tabelas dinâmicas e ordenação rápida por colunas.

6. **Estrutura Modular no Flask (Blueprints & Factory Pattern)**:
   - Organização do backend por domínios (`auth.py`, `agendamentos.py`, `medicos.py`, `pacientes.py`), facilitando a manutenção e extensibilidade do projeto.

7. **Segurança e Criptografia**:
   - Armazenamento de senhas com hashes seguros via `scrypt` e proteção contra SQL Injection através de consultas parametrizadas.
