import { obterCorStatus } from './utils.js';

export function criarTabelaAgendamentos(container, dados, onRowClick) {
    if (typeof window.Tabulator === 'undefined') {
        container.innerHTML = '<p>Biblioteca da tabela não foi carregada.</p>';
        return null;
    }

    return new window.Tabulator(container, {
        data: dados,
        layout: 'fitColumns',
        height: '100%',
        placeholder: 'Nenhum agendamento disponível.',
        responsiveLayout: 'collapse',
        selectable: 1,
        columns: [
            { title: 'Data', field: 'data', sorter: 'string', headerSort: true, width: 120 },
            { title: 'Horário', field: 'horario', sorter: 'string', headerSort: true, width: 110 },
            { title: 'Paciente', field: 'paciente', sorter: 'string', headerSort: true, minWidth: 160 },
            { title: 'CPF', field: 'cpf', sorter: 'string', headerSort: true, width: 140 },
            { title: 'Médico', field: 'medico', sorter: 'string', headerSort: true, minWidth: 160 },
            { title: 'Especialidade', field: 'especialidade', sorter: 'string', headerSort: true, minWidth: 140 },
            { title: 'Convênio', field: 'convenio', sorter: 'string', headerSort: true, minWidth: 120 },
            {
                title: 'Status',
                field: 'status',
                sorter: 'string',
                headerSort: true,
                width: 130,
                formatter: cell => {
                    const valor = cell.getValue();
                    const cor = obterCorStatus(valor);
                    return `<span class="status-pill" style="background:${cor}">${valor}</span>`;
                }
            }
        ],
        rowClick: (event, row) => {
            if (typeof onRowClick === 'function') {
                onRowClick(row.getData(), row);
            }
        }
    });
}

export function substituirDadosTabela(tabela, dados) {
    if (!tabela) {
        return;
    }

    tabela.replaceData(dados);
}
