export async function buscarTodosContratos(env) {
    try {

        const contratos = await env.DB.prepare("SELECT * FROM contratos").all();
        return { dados: contratos.results, mensagem: "Consulta realizada com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao buscar todos os contratos: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar todos os contratos.", status: 500 };
    }
}

export async function criarContrato(env, contratoData) {
    try {

        await env.DB.prepare("INSERT INTO contratos (fornecedor_id, conta_id, nome, valor_contratado) VALUES (?, ?, ?, ?)").bind(contratoData.fornecedor_id, contratoData.conta_id, contratoData.nome, contratoData.valor_contratado).run();
        return { mensagem: "Contrato criado com sucesso!", status: 201 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao criar um contrato: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao criar um contrato.", status: 500 };
    }
}

export async function atualizarContrato(env, contratoData) {
    try {

        const result = await env.DB.prepare("UPDATE contratos SET nome = ?, cnpj = ?, email = ?, celular = ? WHERE id = ?").bind(contratoData.fornecedor_id, contratoData.conta_id, contratoData.nome, contratoData.valor_contratado, contratoData.id).run();

        if (result.meta.changes === 0) {
            return { mensagem: "Nenhum contrato encontrado para atualizar.", status: 404 };
        }

        return { mensagem: "Contrato atualizado com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao atualizar um contrato: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao atualizar um contrato.", status: 500 };
    }
}

export async function deletarContrato(env, contratoId) {
    try {

        const result = await env.DB
            .prepare("DELETE FROM contratos WHERE id = ?")
            .bind(contratoId.id)
            .run();

        if (result.meta.changes === 0) {
            return {
                mensagem: "Nenhum contrato encontrado para excluir.",
                status: 404
            };
        }

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao excluir um contrato: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao excluir um contrato.", status: 500 };
    }
}