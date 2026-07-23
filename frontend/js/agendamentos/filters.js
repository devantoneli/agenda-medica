import {
    extrairAno,
    extrairMes,
    formatarISO,
    deslocarData,
    normalizarTexto,
    valoresUnicos
} from './utils.js';

export function filtrarPorPeriodo(listaAgendamentos, periodo) {
    if (periodo === 'todos') {
        return listaAgendamentos;
    }

    const hoje = new Date();
    const alvo =
        periodo === 'ontem' ? deslocarData(hoje, -1) :
        periodo === 'amanha' ? deslocarData(hoje, 1) :
        hoje;

    return listaAgendamentos.filter(agendamento => agendamento.dataIso === formatarISO(alvo));
}

export function filtrarPorFiltroAvancado(listaAgendamentos, filtroAvancadoTipo, filtroAvancadoValor) {
    if (!filtroAvancadoValor) {
        return listaAgendamentos;
    }

    if (filtroAvancadoTipo === 'dia') {
        return listaAgendamentos.filter(agendamento => agendamento.dataIso === filtroAvancadoValor);
    }

    if (filtroAvancadoTipo === 'mes') {
        return listaAgendamentos.filter(agendamento => extrairMes(agendamento.dataIso) === filtroAvancadoValor);
    }

    if (filtroAvancadoTipo === 'ano') {
        return listaAgendamentos.filter(agendamento => extrairAno(agendamento.dataIso) === filtroAvancadoValor);
    }

    if (filtroAvancadoTipo === 'status') {
        const alvo = normalizarTexto(filtroAvancadoValor);
        return listaAgendamentos.filter(agendamento => normalizarTexto(agendamento.status) === alvo);
    }

    if (filtroAvancadoTipo === 'especialidade') {
        const alvo = normalizarTexto(filtroAvancadoValor);
        return listaAgendamentos.filter(agendamento => normalizarTexto(agendamento.especialidade) === alvo);
    }

    if (filtroAvancadoTipo === 'convenio') {
        const alvo = normalizarTexto(filtroAvancadoValor);
        return listaAgendamentos.filter(agendamento => normalizarTexto(agendamento.convenio) === alvo);
    }

    return listaAgendamentos;
}

export function existeFiltroAtivo({ termoBusca, periodoAtual, filtroAvancadoValor }) {
    return Boolean((termoBusca || '').trim() || periodoAtual !== 'todos' || filtroAvancadoValor);
}

export function obterOpcoesFiltro(listaAgendamentos, chave) {
    return valoresUnicos(listaAgendamentos, chave);
}
