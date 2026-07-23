def test_listar_agendamentos_sem_token(client):
    resposta = client.get('/api/agendamentos/')
    assert resposta.status_code == 401
    dados = resposta.get_json()
    assert 'erro' in dados

def test_listar_agendamentos_com_sucesso(client, auth_headers):
    resposta = client.get('/api/agendamentos/', headers=auth_headers)
    assert resposta.status_code == 200
    dados = resposta.get_json()
    assert isinstance(dados, list)
    assert len(dados) > 0
    PRIMEIRO = dados[0]
    assert 'paciente' in PRIMEIRO
    assert 'paciente_cpf' in PRIMEIRO
    assert 'medico' in PRIMEIRO
    assert 'especialidade' in PRIMEIRO
    assert 'convenio' in PRIMEIRO
    assert 'status' in PRIMEIRO
    assert 'data' in PRIMEIRO
    assert 'horario' in PRIMEIRO

def test_buscar_agendamentos_pesquisa_existente(client, auth_headers):
    resposta = client.get('/api/agendamentos/?pesquisa=Carlos', headers=auth_headers)
    assert resposta.status_code == 200
    dados = resposta.get_json()
    assert len(dados) > 0

def test_buscar_agendamentos_pesquisa_inexistente(client, auth_headers):
    resposta = client.get('/api/agendamentos/?pesquisa=NomeQueNaoExiste12345', headers=auth_headers)
    assert resposta.status_code == 200
    dados = resposta.get_json()
    assert isinstance(dados, list)
    assert len(dados) == 0
