const token = localStorage.getItem('token_agenda');

if (!token) {
    window.location.href = 'index.html';
}

const elementos = {
    campoBusca: document.getElementById('filtro-medicos'),
    botaoAtualizar: document.getElementById('btn-atualizar'),
    botaoLimparFiltros: document.getElementById('btn-limpar-filtros'),
    botaoSair: document.getElementById('btn-sair'),
    containerTabela: document.getElementById('lista-medicos')
};

let estado = {
    tabela: null,
    medicosOriginais: []
};

function atualizarVisibilidadeBotaoLimpar() {
    if (!elementos.botaoLimparFiltros) return;
    const termo = (elementos.campoBusca?.value || '').trim();
    elementos.botaoLimparFiltros.hidden = !termo;
}

function aplicarFiltros() {
    if (!estado.tabela) return;
    const termo = (elementos.campoBusca?.value || '').trim().toLowerCase();

    if (!termo) {
        estado.tabela.replaceData(estado.medicosOriginais);
    } else {
        const filtrados = estado.medicosOriginais.filter(m => 
            [m.nome, m.crm, m.especialidade].join(' ').toLowerCase().includes(termo)
        );
        estado.tabela.replaceData(filtrados);
    }
    atualizarVisibilidadeBotaoLimpar();
}

function criarTabelaMedicos(container, dados) {
    if (typeof window.Tabulator === 'undefined') {
        container.innerHTML = '<p>Biblioteca da tabela não foi carregada.</p>';
        return null;
    }

    return new window.Tabulator(container, {
        data: dados,
        layout: 'fitColumns',
        height: '100%',
        placeholder: 'Nenhum médico encontrado.',
        responsiveLayout: 'collapse',
        selectable: 1,
        columns: [
            { title: 'Médico', field: 'nome', sorter: 'string', headerSort: true, minWidth: 180 },
            { title: 'CRM', field: 'crm', sorter: 'string', headerSort: true, width: 140 },
            { title: 'Especialidade', field: 'especialidade', sorter: 'string', headerSort: true, minWidth: 150 },
            { 
                title: 'Agendados', 
                field: 'agendados', 
                sorter: 'number', 
                headerSort: true, 
                width: 120,
                formatter: cell => `<span class="status-pill" style="background:#1fa1c0">${cell.getValue()}</span>`
            },
            { 
                title: 'Realizados', 
                field: 'realizados', 
                sorter: 'number', 
                headerSort: true, 
                width: 120,
                formatter: cell => `<span class="status-pill" style="background:#28a745">${cell.getValue()}</span>`
            },
            { 
                title: 'Cancelados', 
                field: 'cancelados', 
                sorter: 'number', 
                headerSort: true, 
                width: 120,
                formatter: cell => `<span class="status-pill" style="background:#dc3545">${cell.getValue()}</span>`
            },
            { 
                title: 'Total', 
                field: 'total_agendamentos', 
                sorter: 'number', 
                headerSort: true, 
                width: 100,
                formatter: cell => `<span class="status-pill" style="background:#6c757d">${cell.getValue()}</span>`
            }
        ]
    });
}

async function carregarMedicos() {
    if (!elementos.containerTabela) return;

    elementos.containerTabela.innerHTML = '<p>Carregando médicos...</p>';

    try {
        const resposta = await fetch('http://127.0.0.1:5000/api/medicos/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem('token_agenda');
            window.location.href = 'index.html';
            return;
        }

        const dados = await resposta.json();
        estado.medicosOriginais = Array.isArray(dados) ? dados : (dados?.medicos || []);
        estado.tabela = criarTabelaMedicos(elementos.containerTabela, estado.medicosOriginais);
        atualizarVisibilidadeBotaoLimpar();
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        elementos.containerTabela.innerHTML = '<p>Erro ao carregar os médicos. Verifique a conexão com o servidor.</p>';
    }
}

function configurarEventos() {
    if (elementos.campoBusca) {
        elementos.campoBusca.addEventListener('input', aplicarFiltros);
    }

    if (elementos.botaoAtualizar) {
        elementos.botaoAtualizar.addEventListener('click', () => carregarMedicos());
    }

    if (elementos.botaoLimparFiltros) {
        elementos.botaoLimparFiltros.addEventListener('click', () => {
            if (elementos.campoBusca) elementos.campoBusca.value = '';
            aplicarFiltros();
        });
    }

    if (elementos.botaoSair) {
        elementos.botaoSair.addEventListener('click', () => {
            localStorage.removeItem('token_agenda');
            window.location.href = 'index.html';
        });
    }
}

configurarEventos();
carregarMedicos();
