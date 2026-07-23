from flask import Blueprint, jsonify
from app.db import get_db
from app.routes.auth import token_obrigatorio

bp = Blueprint('medicos', __name__, url_prefix='/api/medicos')

@bp.route('/', methods=['GET', 'OPTIONS'], strict_slashes=False)
@token_obrigatorio
def listar_medicos():
    """
    Listagem de Médicos com contagem estatística de agendamentos
    ---
    tags:
      - Médicos
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de médicos com totais por status recuperada com sucesso
      401:
        description: Token inválido ou não fornecido
    """
    db = get_db()
    
    query = """
        SELECT 
            m.id,
            m.crm,
            m.nome,
            e.nome AS especialidade,
            COUNT(CASE WHEN a.status = 'Realizado' THEN 1 END) AS realizados,
            COUNT(CASE WHEN a.status = 'Cancelado' THEN 1 END) AS cancelados,
            COUNT(CASE WHEN a.status = 'Agendado' THEN 1 END) AS agendados,
            COUNT(a.id) AS total_agendamentos
        FROM medicos m
        JOIN especialidades e ON m.id_especialidade = e.id
        LEFT JOIN agendamentos a ON a.id_medico = m.id
        GROUP BY m.id, m.crm, m.nome, e.nome
        ORDER BY m.nome ASC
    """
    
    try:
        cursor = db.execute(query)
        medicos = cursor.fetchall()
        resultados = [dict(row) for row in medicos]
        return jsonify(resultados), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao buscar médicos", "detalhes": str(e)}), 500
