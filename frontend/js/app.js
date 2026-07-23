document.getElementById('form-login').addEventListener('submit', async function(event) {
    // 1. Evita que a página recarregue ao clicar em "Entrar"
    event.preventDefault(); 

    // 2. Captura os valores digitados nos inputs
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagem-erro');

    // Esconde a mensagem de erro antes de tentar uma nova conexão
    mensagemErro.style.display = 'none';
    mensagemErro.innerText = '';

    try {
        // 3. Envia os dados para a sua API Flask
        // (Certifique-se de que o Flask está rodando nesta porta e de que o Flask-CORS está ativado na API)
        const resposta = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario: usuario, senha: senha })
        });

        const dados = await resposta.json();

        // 4. Verifica se o backend autorizou o login (Status 200 OK)
        if (resposta.ok) {
            
            // Salva o token no navegador do usuário
            // IMPORTANTE: 'dados.token' precisa bater com o nome da chave JSON que sua API retorna
            localStorage.setItem('token_agenda', dados.token); 
            
            // Redireciona para a tela de agendamentos
            window.location.href = 'agendamentos.html';
            
        } else {
            // Caso a API retorne um erro (ex: 401 Unauthorized)
            mensagemErro.innerText = dados.erro || dados.mensagem || 'Usuário ou senha incorretos.';
            mensagemErro.style.display = 'block';
        }

    } catch (erro) {
        // 5. Trata erros de rede (ex: se o container do Docker da API estiver desligado)
        console.error('Erro na requisição:', erro);
        mensagemErro.innerText = 'Erro ao conectar com o servidor. Verifique se a API está rodando.';
        mensagemErro.style.display = 'block';
    }
});