from flask import Blueprint, jsonify, request
from app.db import get_db
from app.routes.auth import token_obrigatorio

bp = Blueprint('agendamentos', __name__, url_prefix='/api/agendamentos')

@bp.route('/', methods=['GET'])
@token_obrigatorio
def listar_agendamentos():
    db = get_db()
    
    # Captura os parâmetros enviados na URL
    # Se não forem enviados, o valor será None
    medico_id = request.args.get('medico_id')
    status = request.args.get('status')
    data = request.args.get('data')

    pesquisa = request.args.get('pesquisa')
    
    # O "WHERE 1=1" facilita a concatenação dinâmica dos filtros
    query = """
        SELECT 
            a.id, 
            a.data, 
            a.horario, 
            a.status,
            p.nome AS paciente,
            p.cpf AS paciente_cpf,
            m.nome AS medico,
            e.nome AS especialidade,
            m.crm AS medico_crm,
            c.nome AS convenio
        FROM agendamentos a
        JOIN pacientes p ON a.id_paciente = p.id
        JOIN medicos m ON a.id_medico = m.id
        JOIN especialidades e ON m.id_especialidade = e.id
        JOIN convenios c ON a.id_convenio = c.id
        WHERE 1=1
    """
    
    parametros = []
    
    # Pesquisa global
    if pesquisa:
        # O % diz ao SQL para buscar o texto em qualquer lugar da string (antes ou depois)
        termo = f"%{pesquisa}%" 
        
        # O parênteses aqui é OBRIGATÓRIO, senão o OR vai anular os outros filtros (como data e status)
        query += """ 
            AND (
                p.nome LIKE ? OR 
                p.cpf LIKE ? OR 
                m.nome LIKE ? OR 
                m.especialidade LIKE ? OR 
                m.crm LIKE ?
            )
        """
        # Como temos 5 pontos de interrogação (?), precisamos passar o termo 5 vezes
        parametros.extend([termo, termo, termo, termo, termo])


    # Filtro exato
    # Se o parâmetro existir, adicionamos a condição na query e o valor na lista
    if medico_id:
        query += " AND a.id_medico = ?"
        parametros.append(medico_id)
        
    if status:
        query += " AND a.status = ?"
        parametros.append(status)
        
    if data:
        query += " AND a.data = ?"
        parametros.append(data)
        
    # Mantém a ordenação cronológica
    query += " ORDER BY a.data ASC, a.horario ASC"
    
    try:
        # Passa a lista de parâmetros para a execução (proteção contra SQL Injection)
        cursor = db.execute(query, parametros)
        agendamentos = cursor.fetchall()
        
        resultados = [dict(row) for row in agendamentos]
        
        return jsonify(resultados), 200
        
    except Exception as e:
        return jsonify({"erro": "Erro ao buscar agendamentos", "detalhes": str(e)}), 500