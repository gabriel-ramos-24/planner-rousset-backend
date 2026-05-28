import * as database from '../db/dbcontratos.js';

function validarContrato(contratoData) {

    // Verifica existência do objeto
    if (!contratoData) {
        return "Dados do contrato não enviados.";
    }

    // Formatação Padrão
    const nome = contratoData.nome?.trim();
    const fornecedorId = contratoData.fornecedorId?.trim();
    const contaId = contratoData.contaId?.replace(/\D/g, '');
    const valorContratado = Number(
        contratoData.valorContratado
            ?.replace(/\./g, '')
            .replace(',', '.')
            .replace(/[^\d.]/g, '')
    );

    // Campos obrigatórios
    if (!nome || !fornecedorId || !contaId || !valorContratado) {
        return "Todos os campos são obrigatórios.";
    }

    // Nome
    if (nome.length < 3) {
        return "O nome deve possuir no mínimo 3 caracteres.";
    }

    if (nome.length > 100) {
        return "O nome deve possuir no máximo 100 caracteres.";
    }

    return null;
}

export async function getTodosContratos(env) {
    try {

        const resultado = await database.buscarTodosContratos(env);
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

        console.error('Log de erro dentro da pasta services método GET módulo CONTRATOS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function createContrato(env, contratoData) {
    try {

        const erro = validarContrato(contratoData);

        if (erro) {
            return {
                body: { mensagem: erro },
                status: 400
            };
        }

        const resultado = await database.criarContrato(env, contratoData);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.error('Log de erro dentro da pasta services método POST módulo CONTRATOS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function updateContrato(env, contratoData) {
    try {

        const erro = validarContrato(contratoData);

        if (erro) {
            return {
                body: { mensagem: erro },
                status: 400
            };
        }

        const resultado = await database.atualizarContrato(env, contratoData);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.error('Log de erro dentro da pasta services método PUT módulo contratos: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function deleteContrato(env, contratoId) {
    try {

        // Id no corpo da requisição
        if (!contratoId.id) return { body: { mensagem: "Sem id para excluir contrato." }, status: 400 };

        const resultado = await database.deletarContrato(env, contratoId);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.error('Log de erro dentro da pasta services método DELETE módulo contratos: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}