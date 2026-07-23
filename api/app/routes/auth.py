import jwt
import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash
from app.db import get_db
from functools import wraps

# Cria o Blueprint para rotas de autenticação
bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/login', methods=['POST'])
def login():
    # Recebe os dados do corpo da requisição (JSON)
    dados = request.get_json()
    
    # Validação básica de entrada
    if not dados or not dados.get('usuario') or not dados.get('senha'):
        return jsonify({"erro": "Usuário e senha são obrigatórios"}), 400
        
    usuario = dados.get('usuario')
    senha = dados.get('senha')
    
    db = get_db()
    
    try:
        # Busca o usuário no banco de dados
        user = db.execute(
            "SELECT * FROM usuarios WHERE usuario = ?", 
            (usuario,)
        ).fetchone()
        
        # check_password_hash compara a senha digitada com o hash salvo no banco
        if user and check_password_hash(user['senha_hash'], senha):
            
            # Payload são os dados que vão "viajar" dentro do token
            payload = {
                'id': user['id'],
                'usuario': user['usuario'],
                'nome': user['nome'],
                # Define a expiração do token para 2 horas
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
            }
            
            # Gera o token assinado usando a SECRET_KEY
            token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                "mensagem": "Login realizado com sucesso!",
                "token": token,
                "usuario": {
                    "nome": user['nome'],
                    "email": user['email']
                }
            }), 200
            
        # Se não achar o usuário ou a senha estiver incorreta
        return jsonify({"erro": "Credenciais inválidas"}), 401
        
    except Exception as e:
        return jsonify({"erro": "Erro ao realizar login", "detalhes": str(e)}), 500

def token_obrigatorio(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        token = None
        
        # Verifica se o header de Autorização foi enviado
        if 'Authorization' in request.headers:
            # O padrão HTTP é enviar "Bearer "
            auth_header = request.headers['Authorization']
            partes = auth_header.split()
            
            if len(partes) == 2 and partes[0] == 'Bearer':
                token = partes[1]

        if not token:
            return jsonify({'erro': 'Token não fornecido ou mal formatado!'}), 401
        
        try:
            # Tenta abrir o token usando a mesma chave secreta
            jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            
        except jwt.ExpiredSignatureError:
            return jsonify({'erro': 'Token expirado. Faça login novamente!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'erro': 'Token inválido!'}), 401
        
        # Se o token for válido, libera o acesso para a rota original
        return f(*args, **kwargs)
    
    return decorador