export async function buscarTodosProdutos(env, ordernar) {
    try {
        const orderBy = ordernar === "produto"
            ? "p.nome ASC, f.nome ASC"
            : "f.nome ASC, p.nome ASC";

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
            GROUP BY p.id
            ORDER BY ${orderBy}
        `).all();

        return { dados: produtos.results, mensagem: "Consulta realizada com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao buscar todos os produtos: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar todos os produtos.", status: 500 };
    }
}

export async function getValorRestanteContrato(env, contratoId, produtoId = null) {
    try {
        let resultado;

        if (produtoId) {
            // UPDATE: Desconsidera o produto atual na soma para não bloquear a própria edição
            resultado = await env.DB.prepare(`
                SELECT
                    c.valor_contratado -
                    COALESCE(SUM(p.quantidade_contrato * p.valor_unitario), 0) AS resultado
                FROM contratos c
                LEFT JOIN produtos p
                    ON p.contrato_id = c.id
                    AND p.id <> ?
                WHERE c.id = ?
                GROUP BY c.id
            `)
            .bind(produtoId, contratoId)
            .first();
        } else {
            // CREATE: Soma todos os produtos atrelados a este contrato
            resultado = await env.DB.prepare(`
                SELECT
                    c.valor_contratado -
                    COALESCE(SUM(p.quantidade_contrato * p.valor_unitario), 0) AS resultado
                FROM contratos c
                LEFT JOIN produtos p
                    ON p.contrato_id = c.id
                WHERE c.id = ?
                GROUP BY c.id
            `)
            .bind(contratoId)
            .first();
        }

        return resultado?.resultado ?? null;

    } catch (error) {
        console.error(
            "Log de erro dentro da pasta database ao buscar o valor restante do contrato:",
            error
        );
        throw error;
    }
}

export async function criarProduto(env, produtoData) {
    try {

        const contrato = await env.DB.prepare(`
            SELECT id
            FROM contratos
            WHERE id = ?
        `).bind(produtoData.contratoId).first();

        if (!contrato) {
            return {
                mensagem: "Este produto não possui contratos vinculados.",
                status: 400
            };
        }

        await env.DB.prepare("INSERT INTO produtos (contrato_id, nome, unidade, quantidade_contrato, valor_unitario) VALUES (?, ?, ?, ?, ?)").bind(produtoData.contratoId, produtoData.nome.toUpperCase(), produtoData.unidade, produtoData.quantidadeContrato, produtoData.valorUnitario).run();
        return { mensagem: "Produto criado com sucesso!", status: 201 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao criar um produto: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao criar um produto.", status: 500 };
    }
}

export async function atualizarProduto(env, produtoData) {
    try {

        const contrato = await env.DB.prepare(`
            SELECT id
            FROM contratos
            WHERE id = ?
        `).bind(produtoData.contratoId).first();

        if (!contrato) {
            return {
                mensagem: "Este produto não possui contratos vinculados.",
                status: 400
            };
        }

        const result = await env.DB.prepare("UPDATE produtos SET contrato_id = ?, nome = ?, unidade = ?, quantidade_contrato = ?, valor_unitario = ? WHERE id = ?").bind(produtoData.contratoId, produtoData.nome.toUpperCase(), produtoData.unidade, produtoData.quantidadeContrato, produtoData.valorUnitario, produtoData.id).run();

        if (result.meta.changes === 0) {
            return { mensagem: "Nenhum produto encontrado para atualizar.", status: 404 };
        }

        return { mensagem: "Produto atualizado com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao atualizar um produto: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao atualizar um produto.", status: 500 };
    }
}

export async function deletarProduto(env, produtoId) {
    try {

        const result = await env.DB
            .prepare("DELETE FROM produtos WHERE id = ?")
            .bind(produtoId.id)
            .run();

        if (result.meta.changes === 0) {
            return {
                mensagem: "Nenhum produto encontrado para excluir.",
                status: 404
            };
        }

        return {
            mensagem: "Produto excluído com sucesso!",
            status: 200
        };

    } catch (error) {

        console.error(
            "Log de erro dentro da pasta database ao excluir um produto:",
            error
        );

        return {
            mensagem: "Erro ao excluir produto.",
            status: 500
        };
    }
}