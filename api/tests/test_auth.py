def test_login_sucesso(client):
    resposta = client.post('/api/auth/login', json={
        'usuario': 'recepcao',
        'senha': 'senha123'
    })
    assert resposta.status_code == 200
    dados = resposta.get_json()
    assert 'token' in dados
    assert dados['mensagem'] == 'Login realizado com sucesso!'
    assert 'usuario' in dados

def test_login_senha_invalida(client):
    resposta = client.post('/api/auth/login', json={
        'usuario': 'recepcao',
        'senha': 'senha_errada'
    })
    assert resposta.status_code == 401
    dados = resposta.get_json()
    assert 'erro' in dados
    assert dados['erro'] == 'Credenciais inválidas'

def test_login_usuario_inexistente(client):
    resposta = client.post('/api/auth/login', json={
        'usuario': 'usuario_nao_existe',
        'senha': 'senha123'
    })
    assert resposta.status_code == 401
    dados = resposta.get_json()
    assert dados['erro'] == 'Credenciais inválidas'

def test_login_campos_faltantes(client):
    resposta = client.post('/api/auth/login', json={
        'usuario': 'admin'
    })
    assert resposta.status_code == 400
    dados = resposta.get_json()
    assert 'erro' in dados
