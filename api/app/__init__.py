import os
from flask import Flask
from flask_cors import CORS

def create_app():
    # Inicializa a aplicação Flask
    app = Flask(__name__)
    
    CORS(app)

    app.json.ensure_ascii = False
    app.config['SECRET_KEY'] = 'fg5jkifd5hghgnd214@gr89'

    # Define onde o arquivo do banco de dados será salvo (na raiz do projeto)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app.config.from_mapping(
        DATABASE=os.path.join(base_dir, 'agenda-medica.db')
    )

    # 1. Importa e registra os comandos de banco de dados
    from . import db
    db.init_app(app)

    # 2. Importa e registra os Blueprints (as rotas da API)
    from .routes import agendamentos
    app.register_blueprint(agendamentos.bp)

    from .routes import auth
    app.register_blueprint(auth.bp)

    return app