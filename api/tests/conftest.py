import os
import tempfile
import pytest
from app import create_app
from app.db import init_db

@pytest.fixture
def app():
    # Cria arquivo temporário para o banco de testes
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app()
    app.config.update({
        'TESTING': True,
        'DATABASE': db_path
    })

    with app.app_context():
        init_db()

    yield app

    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    res = client.post('/api/auth/login', json={
        'usuario': 'recepcao',
        'senha': 'senha123'
    })
    data = res.get_json()
    token = data['token']
    return {'Authorization': f'Bearer {token}'}
