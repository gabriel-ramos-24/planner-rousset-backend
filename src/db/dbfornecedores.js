export async function buscarTodosFornecedores(env) {
    try {

        const fornecedores = await env.DB.prepare("SELECT * FROM fornecedores").all();
        return { dados: fornecedores.results, mensagem: "Consulta realizada com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao buscar todos os fornecedores: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar todos os fornecedores.", status: 500 };
    }
}

export async function criarFornecedor(env, fornecedorData) {
    try {

        await env.DB.prepare("INSERT INTO fornecedores (nome, cnpj, email, celular) VALUES (?, ?, ?, ?)").bind(fornecedorData.nome, fornecedorData.cnpj, fornecedorData.email, fornecedorData.celular).run();
        return { mensagem: "Fornecedor criado com sucesso!", status: 201 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao criar um fornecedor: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao criar um fornecedor.", status: 500 };
    }
}

export async function atualizarFornecedor(env, fornecedorData) {
    try {

        const result = await env.DB.prepare("UPDATE fornecedores SET nome = ?, cnpj = ?, email = ?, celular = ? WHERE id = ?").bind(fornecedorData.nome, fornecedorData.cnpj, fornecedorData.email, fornecedorData.celular, fornecedorData.id).run();

        if (result.meta.changes === 0) {
            return { mensagem: "Nenhum fornecedor encontrado para atualizar.", status: 404 };
        }

        return { mensagem: "Fornecedor atualizado com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao atualizar um fornecedor: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao atualizar um fornecedor.", status: 500 };
    }
}

export async function deletarFornecedor(env, fornecedorId) {
    try {

        const result = await env.DB
            .prepare("DELETE FROM fornecedores WHERE id = ?")
            .bind(fornecedorId.id)
            .run();

        if (result.meta.changes === 0) {
            return {
                mensagem: "Nenhum fornecedor encontrado para excluir.",
                status: 404
            };
        }

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao excluir um fornecedor: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao excluir um fornecedor.", status: 500 };
    }
}