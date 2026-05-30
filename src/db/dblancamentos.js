export async function buscarTodosLancamentos(env, contratoId) {
    try {

        const lancamentos = await env.DB.prepare("SELECT l.id, l.data, p.nome, l.quantidade, p.valor_unitario, l.quantidade * p.valor_unitario AS valor_total FROM lancamentos l INNER JOIN produtos p ON p.id = l.produto_id WHERE p.contrato_id = ? ORDER BY l.data ASC").bind(contratoId).all();
        return { dados: lancamentos.results, mensagem: "Consulta realizada com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao buscar todos os lancamentos: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar todos os lancamentos.", status: 500 };
    }
}

export async function getQuantidadeProduto(env, produtoId) {

    try {

        const quantidadeDisponivel = await env.DB.prepare("SELECT p.quantidade_contrato - COALESCE(SUM(l.quantidade), 0) AS resultado FROM produtos p LEFT JOIN lancamentos l ON l.produto_id = p.id WHERE p.id = ? GROUP BY p.id").bind(produtoId).first();
        return quantidadeDisponivel.resultado;

    } catch (error) {

        console.error("Log de erro dentro da pasta database ao buscar a quantidade do produto dísponível: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar a quantidade do produto dísponível.", status: 500 };
    }

}


export async function criarLancamento(env, lancamentoData) {
    try {

        await env.DB.prepare("INSERT INTO lancamentos (data, produto_id, quantidade) VALUES (?, ?, ?").bind(lancamentoData.data, lancamentoData.produtoId, lancamentoData.quantidade).run();
        return { mensagem: "Lancamento criado com sucesso!", status: 201 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao criar um lancamento: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao criar um lancamento.", status: 500 };
    }
}

export async function atualizarLancamento(env, lancamentoData) {
    try {

        const result = await env.DB.prepare("UPDATE lancamentos SET data = ?, produto_id = ?, quantidade = ? WHERE id = ?").bind(lancamentoData.data, lancamentoData.produtoId, lancamentoData.quantidade, lancamentoData.id).run();

        if (result.meta.changes === 0) {
            return { mensagem: "Nenhum lancamento encontrado para atualizar.", status: 404 };
        }

        return { mensagem: "Lancamento atualizado com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao atualizar um lancamento: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao atualizar um lancamento.", status: 500 };
    }
}


export async function deletarLancamento(env, lancamentoId) {
    try {

        const result = await env.DB
            .prepare("DELETE FROM lancamentos WHERE id = ?")
            .bind(lancamentoId.id)
            .run();

        if (result.meta.changes === 0) {
            return {
                mensagem: "Nenhum lancamento encontrado para excluir.",
                status: 404
            };
        }

        return {
            mensagem: "lancamento excluído com sucesso!",
            status: 200
        };

    } catch (error) {

        console.error(
            "Log de erro dentro da pasta database ao excluir um lancamento:",
            error
        );

        return {
            mensagem: "Erro ao excluir lancamento.",
            status: 500
        };
    }
}
