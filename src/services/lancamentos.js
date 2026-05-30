import * as database from '../db/dblancamentos.js';

async function validarLancamento(lancamentoData) {

    // Verifica existência do objeto
    if (!lancamentoData) {
        return "Dados do lançamento não enviados.";
    }

    // Formatação padrão
    const dataIso = lancamentoData.data?.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataIso)) return "Data deve estar no formato YYYY-MM-DD.";

    const produtoId = Number(lancamentoData.produtoId);
    if (!Number.isInteger(quantidade) || quantidade <= 0) return "Produto inválido.";

    const quantidade = Number(lancamentoData.quantidade);
    if (!Number.isInteger(quantidade) || quantidade <= 0) return "Quantidade inválida. Apenas números inteiros positivos.";

    // Campos obrigatórios
    if (!dataIso || !produtoId || !quantidade) {
        return "Todos os campos são obrigatórios.";
    }

    const quantidadeDisponivel = await database.getQuantidadeProduto(lancamentoData.produtoId);

    if (quantidadeDisponivel < quantidade) return "O produto informado não tem quantidade suficiente disponível no contrato.";

    return null;
}

export async function getTodosLancamentos(env, contratoId) {
    try {

        const resultado = await database.buscarTodosLancamentos(env, contratoId);
        return {
            body: resultado.status === 200
                ? {
                    dados: resultado.dados,
                    mensagem: resultado.mensagem
                }
                : {
                    mensagem: resultado.mensagem
                },

            status: resultado.status
        };

    } catch (error) {

        console.error('Log de erro dentro da pasta services método GET módulo LANÇAMENTOS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function createLancamento(env, lancamentoData) {
    try {

        const erro = await validarLancamento(lancamentoData);

        if (erro) {
            return {
                body: { mensagem: erro },
                status: 400
            };
        }

        const resultado = await database.criarLancamento(env, lancamentoData);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.error('Log de erro dentro da pasta services método POST módulo lancamentos: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function updateLancamento(env, lancamentoData) {
    try {

        const erro = await validarLancamento(lancamentoData);

        if (erro) {
            return {
                body: { mensagem: erro },
                status: 400
            };
        }

        const resultado = await database.atualizarLancamento(env, lancamentoData);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.error('Log de erro dentro da pasta services método PUT módulo LANÇAMENTOS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function deleteLancamento(env, lancamentoId) {
    try {

        // Id no corpo da requisição
        if (!lancamentoId.id) return { body: { mensagem: "Sem id para excluir lançamento." }, status: 400 };

        const resultado = await database.deletarLancamento(env, lancamentoId);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.error('Log de erro dentro da pasta services método DELETE módulo LANÇAMENTOS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}