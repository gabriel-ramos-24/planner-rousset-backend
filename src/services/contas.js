import * as database from '../db/database.js';

export async function getTodasContas(env) {
    try {

        const resultado = await database.buscarTodasContas(env);
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

        console.log('Log de erro dentro da pasta services método GET módulo CONTAS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function createConta(env, contaData) {
    try {

        // Apelido (Texto) e Conta (Número)
        if (!contaData.apelido || !contaData.conta) return { body: { mensagem: "Não recebemos o apelido ou o número da conta para criá-la." }, status: 400 };

        // Apenas números na Conta 
        if (!/^\d+$/.test(contaData)) {
            return {
                body: {
                    mensagem: "A conta deverá conter apenas números."
                },
                status: 400
            };
        }

        const resultado = await database.criarConta(env, contaData);
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

        console.log('Log de erro dentro da pasta services método POST módulo CONTAS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}