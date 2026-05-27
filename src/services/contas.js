import * as database from '../db/database.js';

export async function getTodasContas(env) {
    try {

        const resultadoTodasContas = await database.buscarTodasContas(env);
        if (resultadoTodasContas.status === 200) return { body: { dados: resultadoTodasContas.dados, mensagem: resultadoTodasContas.mensagem }, status: resultadoTodasContas.status };
        return { body: { mensagem: resultadoTodasContas.mensagem }, status: resultadoTodasContas.status }

    } catch (error) {

        console.log('Log de erro dentro da pasta services método GET módulo CONTAS: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}