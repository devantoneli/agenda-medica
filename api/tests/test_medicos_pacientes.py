def test_listar_medicos_com_sucesso(client, auth_headers):
    resposta = client.get('/api/medicos/', headers=auth_headers)
    assert resposta.status_code == 200
    dados = resposta.get_json()
    assert isinstance(dados, list)
    assert len(dados) > 0
    primeiro = dados[0]
    assert 'nome' in primeiro
    assert 'crm' in primeiro
    assert 'especialidade' in primeiro
    assert 'realizados' in primeiro
    assert 'cancelados' in primeiro
    assert 'agendados' in primeiro
    assert 'total_agendamentos' in primeiro

def test_listar_pacientes_com_sucesso(client, auth_headers):
    resposta = client.get('/api/pacientes/', headers=auth_headers)
    assert resposta.status_code == 200
    dados = resposta.get_json()
    assert isinstance(dados, list)
    assert len(dados) > 0
    primeiro = dados[0]
    assert 'nome' in primeiro
    assert 'cpf' in primeiro
    assert 'realizados' in primeiro
    assert 'cancelados' in primeiro
    assert 'agendados' in primeiro
    assert 'total_agendamentos' in primeiro
