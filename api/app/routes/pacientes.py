from flask import Blueprint, jsonify
from app.db import get_db
from app.routes.auth import token_obrigatorio

bp = Blueprint('pacientes', __name__, url_prefix='/api/pacientes')

@bp.route('/', methods=['GET', 'OPTIONS'], strict_slashes=False)
@token_obrigatorio
def listar_pacientes():
    """
    Listagem de Pacientes com contagem estatística de agendamentos
    ---
    tags:
      - Pacientes
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de pacientes com totais por status recuperada com sucesso
      401:
        description: Token inválido ou não fornecido
    """
    db = get_db()
    
    query = """
        SELECT 
            p.id,
            p.nome,
            p.cpf,
            COUNT(CASE WHEN a.status = 'Realizado' THEN 1 END) AS realizados,
            COUNT(CASE WHEN a.status = 'Cancelado' THEN 1 END) AS cancelados,
            COUNT(CASE WHEN a.status = 'Agendado' THEN 1 END) AS agendados,
            COUNT(a.id) AS total_agendamentos
        FROM pacientes p
        LEFT JOIN agendamentos a ON a.id_paciente = p.id
        GROUP BY p.id, p.nome, p.cpf
        ORDER BY p.nome ASC
    """
    
    try:
        cursor = db.execute(query)
        pacientes = cursor.fetchall()
        resultados = [dict(row) for row in pacientes]
        return jsonify(resultados), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao buscar pacientes", "detalhes": str(e)}), 500
