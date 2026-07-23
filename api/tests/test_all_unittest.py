import os
import tempfile
import unittest
from app import create_app
from app.db import init_db

class TestAgendaMedicaAPI(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp()
        self.app = create_app()
        self.app.config.update({
            'TESTING': True,
            'DATABASE': self.db_path
        })
        self.client = self.app.test_client()

        with self.app.app_context():
            init_db()

        # Faz login de teste
        res = self.client.post('/api/auth/login', json={
            'usuario': 'recepcao',
            'senha': 'senha123'
        })
        data = res.get_json()
        self.token = data.get('token')
        self.headers = {'Authorization': f'Bearer {self.token}'}

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)

    # 1. Testes de Autenticação
    def test_login_sucesso(self):
        res = self.client.post('/api/auth/login', json={
            'usuario': 'recepcao',
            'senha': 'senha123'
        })
        self.assertEqual(res.status_code, 200)
        dados = res.get_json()
        self.assertIn('token', dados)
        self.assertEqual(dados['mensagem'], 'Login realizado com sucesso!')

    def test_login_senha_invalida(self):
        res = self.client.post('/api/auth/login', json={
            'usuario': 'recepcao',
            'senha': 'errada'
        })
        self.assertEqual(res.status_code, 401)
        dados = res.get_json()
        self.assertEqual(dados.get('erro'), 'Credenciais inválidas')

    def test_login_usuario_inexistente(self):
        res = self.client.post('/api/auth/login', json={
            'usuario': 'desconhecido',
            'senha': 'senha123'
        })
        self.assertEqual(res.status_code, 401)

    # 2. Testes de Agendamentos
    def test_listar_agendamentos_sem_token(self):
        res = self.client.get('/api/agendamentos/')
        self.assertEqual(res.status_code, 401)

    def test_listar_agendamentos_com_sucesso(self):
        res = self.client.get('/api/agendamentos/', headers=self.headers)
        self.assertEqual(res.status_code, 200)
        dados = res.get_json()
        self.assertIsInstance(dados, list)
        self.assertGreater(len(dados), 0)
        primeiro = dados[0]
        self.assertIn('paciente', primeiro)
        self.assertIn('paciente_cpf', primeiro)
        self.assertIn('medico', primeiro)
        self.assertIn('especialidade', primeiro)
        self.assertIn('status', primeiro)

    def test_buscar_paciente_inexistente(self):
        res = self.client.get('/api/agendamentos/?pesquisa=Inexistente999', headers=self.headers)
        self.assertEqual(res.status_code, 200)
        dados = res.get_json()
        self.assertIsInstance(dados, list)
        self.assertEqual(len(dados), 0)

    # 3. Testes de Médicos e Pacientes
    def test_listar_medicos(self):
        res = self.client.get('/api/medicos/', headers=self.headers)
        self.assertEqual(res.status_code, 200)
        dados = res.get_json()
        self.assertIsInstance(dados, list)
        self.assertGreater(len(dados), 0)
        self.assertIn('realizados', dados[0])
        self.assertIn('cancelados', dados[0])
        self.assertIn('agendados', dados[0])

    def test_listar_pacientes(self):
        res = self.client.get('/api/pacientes/', headers=self.headers)
        self.assertEqual(res.status_code, 200)
        dados = res.get_json()
        self.assertIsInstance(dados, list)
        self.assertGreater(len(dados), 0)
        self.assertIn('realizados', dados[0])
        self.assertIn('cancelados', dados[0])
        self.assertIn('agendados', dados[0])

if __name__ == '__main__':
    unittest.main()
