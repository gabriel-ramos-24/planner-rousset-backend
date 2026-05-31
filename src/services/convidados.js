import { validarToken } from '../services/autenticacao';

export async function getInfoConvidados(env, tokenConvidado) {

    const publico = true;

    const payload = await validarToken(env, tokenConvidado, publico);

    if (!payload) return { body: { mensagem: "Token inválido!" }, status: 403 };

    if (!payload.contratoId) return { body: { mensagem: "Token válido, mas sem as informações necessárias" }, status: 400 }

    try {

        const produtos = await env.DB.prepare(`
            SELECT
                p.id,
                f.nome AS fornecedor,
                c.nome AS contrato,
                p.nome AS produto,
                p.unidade,
                p.quantidade_contrato AS quantidadeContrato,
                p.valor_unitario AS valorUnitario,
                (p.quantidade_contrato - COALESCE(SUM(l.quantidade), 0)) AS estoque
            FROM produtos p
            INNER JOIN contratos c
                ON c.id = p.contrato_id
            INNER JOIN fornecedores f
                ON f.id = c.fornecedor_id
            LEFT JOIN lancamentos l
                ON l.produto_id = p.id
            WHERE p.contrato_id = ?
            GROUP BY p.id
        `).bind(payload.contratoId).all();

        const lancamentos = await env.DB.prepare("SELECT l.id, l.data, p.nome, l.quantidade, p.valor_unitario, l.quantidade * p.valor_unitario AS valor_total FROM lancamentos l INNER JOIN produtos p ON p.id = l.produto_id WHERE p.contrato_id = ? ORDER BY l.data ASC").bind(payload.contratoId).all();
        return { body: { produtos: produtos.results, lancamentos: lancamentos.results, mensagem: "Consulta realizada com sucesso!" }, status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao buscar todos os lancamentos: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar todos os lancamentos.", status: 500 };
    }

}