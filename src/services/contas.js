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