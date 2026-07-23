import sys
from app import create_app

app = create_app()

def exibir_banner():
    banner = """
================================================================================
AGENDA MEDICA - SISTEMA INICIADO COM SUCESSO!
================================================================================
Frontend Web App:  http://localhost:8000 (ou http://127.0.0.1:8000)
API & Swagger UI:  http://localhost:5000 (ou http://127.0.0.1:5000)

Endpoints da API Disponiveis:
   - GET  /                     -> Documentacao Interativa Swagger UI
   - POST /api/auth/login       -> Autenticacao de usuario e geracao de Token JWT
   - GET  /api/agendamentos/    -> Listagem e filtros de agendamentos medicos
   - GET  /api/medicos/         -> Medicos e contagem de consultas por status
   - GET  /api/pacientes/       -> Pacientes e contagem de consultas por status

Credenciais de Teste:
   - Usuario: recepcao
   - Senha:   senha123
================================================================================
"""
    try:
        print(banner)
    except Exception:
        pass

if __name__ == '__main__':
    exibir_banner()
    app.run(host="0.0.0.0", port=5000, debug=True)