import os
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS

def create_app():
    # Inicializa a aplicação Flask
    app = Flask(__name__)
    
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

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

    from .routes import medicos
    app.register_blueprint(medicos.bp)

    from .routes import pacientes
    app.register_blueprint(pacientes.bp)

    # Configuração do Swagger UI via Flasgger no endpoint raiz (/)
    from flasgger import Swagger
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/"
    }

    template = {
        "swagger": "2.0",
        "info": {
            "title": "Agenda Médica API",
            "description": "Documentação interativa da API REST da Agenda Médica (Desafio TimeSaver)",
            "version": "1.0.0"
        },
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "Cole o Token JWT gerado no endpoint /api/auth/login (aceita o token direto ou 'Bearer <token>')"
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ]
    }
    Swagger(app, config=swagger_config, template=template)

    return app