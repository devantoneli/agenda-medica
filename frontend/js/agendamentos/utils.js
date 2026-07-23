export function obterValor(agendamento, chaves) {
    for (const chave of chaves) {
        const valor = agendamento?.[chave];
        if (valor !== undefined && valor !== null && valor !== '') {
            return valor;
        }
    }

    return '';
}

export function formatarData(valor) {
    if (!valor) return 'Data não informada';

    if (typeof valor === 'string' && valor.includes('T')) {
        const [data] = valor.split('T');
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    return typeof valor === 'string' ? valor : valor;
}

export function ordenarTextos(a, b) {
    return String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base' });
}

export function normalizarDataISO(valor) {
    if (!valor || typeof valor !== 'string') {
        return '';
    }

    return valor.includes('T') ? valor.split('T')[0] : valor;
}

export function deslocarData(base, dias) {
    const data = new Date(base);
    data.setDate(data.getDate() + dias);
    return data;
}

export function formatarISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

export function obterCorStatus(status) {
    const valorStatus = String(status || '').trim().toLowerCase();

    if (valorStatus.includes('cancel')) return '#ff4d4d';
    if (valorStatus.includes('agend') || valorStatus.includes('pend')) return '#f2b84b';
    return '#38d39f';
}

export function valoresUnicos(lista, chave) {
    return [...new Set(lista.map(item => item[chave]).filter(Boolean))].sort(ordenarTextos);
}

export function extrairAno(valor) {
    return valor ? String(valor).slice(0, 4) : '';
}

export function extrairMes(valor) {
    return valor ? String(valor).slice(0, 7) : '';
}

export function normalizarTexto(valor) {
    return String(valor || '').trim().toLowerCase();
}

export function normalizarAgendamentos(listaAgendamentos) {
    return listaAgendamentos.map(agendamento => ({
        id: agendamento.id,
        dataIso: normalizarDataISO(obterValor(agendamento, ['data', 'data_agendamento', 'data_consulta'])),
        data: formatarData(obterValor(agendamento, ['data', 'data_agendamento', 'data_consulta'])),
        horario: obterValor(agendamento, ['horario', 'hora', 'horario_agendamento']),
        paciente: obterValor(agendamento, ['paciente', 'nome_paciente', 'paciente_nome']),
        cpf: obterValor(agendamento, ['paciente_cpf', 'cpf_paciente']),
        medico: obterValor(agendamento, ['medico', 'nome_medico', 'medico_nome']),
        especialidade: obterValor(agendamento, ['especialidade', 'nome_especialidade']),
        convenio: obterValor(agendamento, ['convenio', 'nome_convenio']),
        status: obterValor(agendamento, ['status', 'situacao']) || 'Pendente'
    }));
}
