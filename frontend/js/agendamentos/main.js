import { normalizarAgendamentos } from './utils.js';
import { filtrarPorPeriodo, filtrarPorFiltroAvancado, existeFiltroAtivo, obterOpcoesFiltro } from './filters.js';
import { criarTabelaAgendamentos, substituirDadosTabela } from './table.js';

const token = localStorage.getItem('token_agenda');

const estado = {
    tabela: null,
    agendamentosOriginais: [],
    periodoAtual: 'todos',
    filtroAvancadoTipo: 'dia',
    filtroAvancadoValor: '',
    filtroAvancadoAberto: false
};

const elementos = {
    campoBusca: document.getElementById('filtro-agendamentos'),
    botaoAtualizar: document.getElementById('btn-atualizar'),
    botaoFiltroAvancado: document.getElementById('btn-filtro-avancado'),
    botaoLimparFiltros: document.getElementById('btn-limpar-filtros'),
    botaoSair: document.getElementById('btn-sair'),
    painelFiltroAvancado: document.getElementById('filtro-avancado-panel'),
    tipoFiltroAvancado: document.getElementById('filtro-avancado-tipo'),
    valorFiltroAvancado: document.getElementById('filtro-avancado-valor'),
    containerTabela: document.getElementById('lista-agendamentos')
};

if (!token) {
    window.location.href = 'index.html';
}

function atualizarVisibilidadeBotaoLimpar() {
    if (!elementos.botaoLimparFiltros) {
        return;
    }

    elementos.botaoLimparFiltros.hidden = !existeFiltroAtivo({
        termoBusca: elementos.campoBusca?.value || '',
        periodoAtual: estado.periodoAtual,
        filtroAvancadoValor: estado.filtroAvancadoValor
    });
}

function renderizarFiltroAvancado() {
    if (!elementos.valorFiltroAvancado || !elementos.tipoFiltroAvancado) {
        return;
    }

    const statusOpcoes = obterOpcoesFiltro(estado.agendamentosOriginais, 'status');
    const especialidadeOpcoes = obterOpcoesFiltro(estado.agendamentosOriginais, 'especialidade');
    const convenioOpcoes = obterOpcoesFiltro(estado.agendamentosOriginais, 'convenio');

    elementos.tipoFiltroAvancado.value = estado.filtroAvancadoTipo;

    if (estado.filtroAvancadoTipo === 'dia') {
        elementos.valorFiltroAvancado.innerHTML = `<input id="filtro-avancado-campo" type="date" value="${estado.filtroAvancadoValor || ''}">`;
    } else if (estado.filtroAvancadoTipo === 'mes') {
        elementos.valorFiltroAvancado.innerHTML = `<input id="filtro-avancado-campo" type="month" value="${estado.filtroAvancadoValor || ''}">`;
    } else if (estado.filtroAvancadoTipo === 'ano') {
        elementos.valorFiltroAvancado.innerHTML = `<input id="filtro-avancado-campo" type="number" min="2000" max="2100" step="1" placeholder="Ano" value="${estado.filtroAvancadoValor || ''}">`;
    } else if (estado.filtroAvancadoTipo === 'status') {
        elementos.valorFiltroAvancado.innerHTML = `
            <select id="filtro-avancado-campo">
                <option value="">Selecione um status</option>
                ${statusOpcoes.map(status => `<option value="${status}" ${estado.filtroAvancadoValor === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
        `;
    } else if (estado.filtroAvancadoTipo === 'convenio') {
        elementos.valorFiltroAvancado.innerHTML = `
            <select id="filtro-avancado-campo">
                <option value="">Selecione um convênio</option>
                ${convenioOpcoes.map(convenio => `<option value="${convenio}" ${estado.filtroAvancadoValor === convenio ? 'selected' : ''}>${convenio}</option>`).join('')}
            </select>
        `;
    } else {
        elementos.valorFiltroAvancado.innerHTML = `
            <select id="filtro-avancado-campo">
                <option value="">Selecione uma especialidade</option>
                ${especialidadeOpcoes.map(especialidade => `<option value="${especialidade}" ${estado.filtroAvancadoValor === especialidade ? 'selected' : ''}>${especialidade}</option>`).join('')}
            </select>
        `;
    }

    const campo = document.getElementById('filtro-avancado-campo');
    if (campo) {
        const evento = campo.tagName === 'INPUT' && campo.type === 'number' ? 'input' : 'change';
        campo.addEventListener(evento, event => {
            estado.filtroAvancadoValor = event.target.value;
            aplicarFiltros();
        });
    }
}

function alternarFiltroAvancado() {
    if (!elementos.painelFiltroAvancado) {
        return;
    }

    estado.filtroAvancadoAberto = !estado.filtroAvancadoAberto;
    elementos.painelFiltroAvancado.classList.toggle('is-open', estado.filtroAvancadoAberto);
    elementos.painelFiltroAvancado.setAttribute('aria-hidden', estado.filtroAvancadoAberto ? 'false' : 'true');

    if (estado.filtroAvancadoAberto) {
        renderizarFiltroAvancado();
    }
}

function limparTodosFiltros() {
    estado.periodoAtual = 'todos';
    estado.filtroAvancadoTipo = 'dia';
    estado.filtroAvancadoValor = '';
    estado.filtroAvancadoAberto = false;

    if (elementos.campoBusca) {
        elementos.campoBusca.value = '';
    }

    document.querySelectorAll('.period-btn[data-period]').forEach(botao => {
        botao.classList.toggle('is-active', botao.dataset.period === 'todos');
    });

    if (elementos.painelFiltroAvancado) {
        elementos.painelFiltroAvancado.classList.remove('is-open');
        elementos.painelFiltroAvancado.setAttribute('aria-hidden', 'true');
    }

    if (elementos.tipoFiltroAvancado) {
        elementos.tipoFiltroAvancado.value = 'dia';
    }

    if (elementos.valorFiltroAvancado) {
        elementos.valorFiltroAvancado.innerHTML = '';
    }

    aplicarFiltros();
}

function aplicarFiltros() {
    if (!estado.tabela) {
        return;
    }

    let dadosFiltrados = [...estado.agendamentosOriginais];
    dadosFiltrados = filtrarPorPeriodo(dadosFiltrados, estado.periodoAtual);
    dadosFiltrados = filtrarPorFiltroAvancado(dadosFiltrados, estado.filtroAvancadoTipo, estado.filtroAvancadoValor);

    const termo = (elementos.campoBusca?.value || '').trim().toLowerCase();
    if (termo) {
        dadosFiltrados = dadosFiltrados.filter(row => [row.paciente, row.cpf, row.medico].join(' ').toLowerCase().includes(termo));
    }

    substituirDadosTabela(estado.tabela, dadosFiltrados);
    atualizarVisibilidadeBotaoLimpar();
}

async function carregarAgendamentos() {
    if (!elementos.containerTabela) {
        return;
    }

    elementos.containerTabela.innerHTML = '<p>Carregando agendamentos...</p>';

    try {
        const resposta = await fetch('http://127.0.0.1:5000/api/agendamentos/', {
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
        const listaAgendamentos = Array.isArray(dados) ? dados : (dados?.agendamentos || dados?.resultados || []);

        estado.agendamentosOriginais = Array.isArray(listaAgendamentos) ? normalizarAgendamentos(listaAgendamentos) : [];
        estado.tabela = criarTabelaAgendamentos(elementos.containerTabela, estado.agendamentosOriginais);
        aplicarFiltros();
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        elementos.containerTabela.innerHTML = '<p>Erro ao carregar os dados. Verifique a conexão com o servidor.</p>';
    }
}

function configurarEventos() {
    if (elementos.campoBusca) {
        elementos.campoBusca.addEventListener('input', aplicarFiltros);
    }

    if (elementos.botaoAtualizar) {
        elementos.botaoAtualizar.addEventListener('click', () => window.location.reload());
    }

    if (elementos.botaoFiltroAvancado) {
        elementos.botaoFiltroAvancado.addEventListener('click', alternarFiltroAvancado);
    }

    if (elementos.botaoLimparFiltros) {
        elementos.botaoLimparFiltros.addEventListener('click', limparTodosFiltros);
    }

    if (elementos.botaoSair) {
        elementos.botaoSair.addEventListener('click', () => {
            localStorage.removeItem('token_agenda');
            window.location.href = 'index.html';
        });
    }

    document.querySelectorAll('.period-btn[data-period]').forEach(botao => {
        botao.addEventListener('click', () => {
            estado.periodoAtual = botao.dataset.period || 'todos';
            document.querySelectorAll('.period-btn[data-period]').forEach(item => item.classList.toggle('is-active', item === botao));
            aplicarFiltros();
        });
    });

    if (elementos.tipoFiltroAvancado) {
        elementos.tipoFiltroAvancado.addEventListener('change', event => {
            estado.filtroAvancadoTipo = event.target.value;
            estado.filtroAvancadoValor = '';
            if (elementos.valorFiltroAvancado) {
                elementos.valorFiltroAvancado.innerHTML = '';
            }
            renderizarFiltroAvancado();
            aplicarFiltros();
        });
    }

    document.addEventListener('click', event => {
        const wrapper = document.querySelector('.filter-wrapper');
        if (!wrapper || !estado.filtroAvancadoAberto) {
            return;
        }

        if (!wrapper.contains(event.target)) {
            estado.filtroAvancadoAberto = false;
            if (elementos.painelFiltroAvancado) {
                elementos.painelFiltroAvancado.classList.remove('is-open');
                elementos.painelFiltroAvancado.setAttribute('aria-hidden', 'true');
            }
        }
    });
}

configurarEventos();
atualizarVisibilidadeBotaoLimpar();
carregarAgendamentos();
