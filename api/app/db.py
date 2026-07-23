import os
import glob
import sqlite3
import click
from flask import current_app, g

def get_db():
    """Abre uma nova conexão com o banco de dados se não houver uma."""
    if 'db' not in g:
        # Usa o caminho do banco configurado no app, ou o padrão 'agenda-medica.db'
        g.db = sqlite3.connect(
            current_app.config.get('DATABASE', 'agenda-medica.db')
        )
        g.db.execute("PRAGMA foreign_keys = ON")
        g.db.row_factory = sqlite3.Row

    return g.db

def close_connection(e=None):
    """Fecha a conexão com o banco de dados ao final de cada requisição."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    """Lê o schema e os seeds para inicializar o banco."""
    db = get_db()
    
    # root_path do Flask aponta para a pasta /app. Precisamos voltar um nível (..)
    # para chegar na raiz e acessar a pasta /database
    base_dir = os.path.dirname(current_app.root_path)
    db_dir = os.path.join(base_dir, 'database')
    
    schema_path = os.path.join(db_dir, 'schema.sql')
    
    # 1. Executa o schema
    with open(schema_path, 'r', encoding='utf-8') as f:
        db.executescript(f.read())
    print("✅ Schema criado com sucesso!")
    
    # 2. Executa as seeds
    seeds_pattern = os.path.join(db_dir, 'seeds', '*.sql')
    seed_files = sorted(glob.glob(seeds_pattern))
    
    for seed_file in seed_files:
        with open(seed_file, 'r', encoding='utf-8') as f:
            db.executescript(f.read())
        print(f"✅ Arquivo de seed executado: {os.path.basename(seed_file)}")

@click.command('init-db')
def init_db_command():
    """Comando de terminal: Limpa os dados existentes e cria novas tabelas populadas."""
    init_db()
    click.echo('🎉 Banco de dados inicializado e populado com sucesso!')

def init_app(app):
    """Registra as funções do banco de dados na aplicação Flask."""
    # Diz ao Flask para chamar close_connection após cada resposta
    app.teardown_appcontext(close_connection)
    # Adiciona o comando 'init-db' ao CLI do Flask
    app.cli.add_command(init_db_command)