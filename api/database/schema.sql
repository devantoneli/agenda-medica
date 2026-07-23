-- 1. Tabela de Usuários (Autenticação)
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL
);

-- 2. Tabela de Especialidades
CREATE TABLE especialidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Tabela de Convênios
CREATE TABLE convenios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Tabela de Pacientes
CREATE TABLE pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE
);

-- 5. Tabela de Médicos
CREATE TABLE medicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crm VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    id_especialidade INTEGER NOT NULL,
    FOREIGN KEY (id_especialidade) REFERENCES especialidades(id)
);

-- 6. Tabela de Agendamentos
CREATE TABLE agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    id_convenio INTEGER NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    status VARCHAR(30) NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id),
    FOREIGN KEY (id_medico) REFERENCES medicos(id),
    FOREIGN KEY (id_convenio) REFERENCES convenios(id)
);