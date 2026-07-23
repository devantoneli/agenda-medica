# 🏥 Agenda Médica - Desafio Técnico TimeSaver

Aplicação web completa de **Agenda Médica** desenvolvida como solução para o desafio técnico TimeSaver. A aplicação possui autenticação segura com JWT, exibição e filtragem de agendamentos médicos em tempo real com a biblioteca **Tabulator**, relatórios de médicos e pacientes com contadores de consultas por status, além de suíte de testes automatizados e containerização completa em Docker.

---

## 🚀 Tecnologias Utilizadas

### Backend (API REST)
- **Python 3.11+** com **Flask** (Arquitetura modular em Blueprints e Application Factory)
- **SQLite** (Banco de dados relacional com `PRAGMA foreign_keys = ON`)
- **PyJWT** (Autenticação baseada em Tokens JWT)
- **Werkzeug** (Criptografia de senhas com algoritmo `scrypt`)
- **Flask-CORS** (Habilitação de requisições Cross-Origin de forma segura)
- **Pytest & Unittest** (18 testes automatizados cobrindo rotas, autenticação e cenários de exceção)

### Frontend
- **HTML5 & CSS3 Vanilla** (Design moderno, responsivo com suporte a glassmorphism e cores fluidas)
- **JavaScript (ES6+)** (Consumo de APIs REST assíncronas com `fetch` e módulos ES6)
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
   - **API Backend:** `http://127.0.0.1:5000`
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

## 💡 Decisões Técnicas e Soluções Adotadas

1. **Uso do Tabulator v6.2.1**:
   - Tabela de alta performance exigida pelo desafio técnico, com suporte a mensagens amigáveis em resultados vazios (`placeholder`), ordenação rápida de colunas e formatação dinâmica de badges de status.
2. **Estabilidade de Layout e Design Responsivo**:
   - Aplicação de `scrollbar-gutter: stable` para evitar sobressaltos e mudanças de largura no cabeçalho durante a filtragem de dados.
   - Isolamento de rolagem horizontal dentro do card da tabela (`overflow-x: auto`), mantendo a barra lateral, o cabeçalho e os campos de busca fixos e estáticos em telas pequenas e celulares.
3. **Estrutura Modular no Flask (Blueprints)**:
   - Rotas organizadas por domínio (`auth.py`, `agendamentos.py`, `medicos.py`, `pacientes.py`), mantendo o código limpo, legível e de fácil manutenção.
4. **Segurança e Tratamento de Falhas**:
   - Criptografia de senhas com `scrypt`.
   - Consultas SQL protegidas contra *SQL Injection* via *parameterized queries*.
   - Tratamento de exceções com respostas JSON adequadas e tratativa de expiração/ausência de token JWT.
   - Botão **Sair** totalmente integrado limpando o token armazenado e redirecionando à tela de login.
