export async function buscarTodasContas(env) {
    try {

        const contas = await env.DB.prepare("SELECT * FROM contas").all();
        return { dados: contas.results, mensagem: "Consulta realizada com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao buscar todas as contas: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar todas as contas.", status: 500 };
    }
}

export async function criarConta(env, contaData) {
    try {

        await env.DB.prepare("INSERT INTO contas (apelido, conta) VALUES (?, ?)").bind(contaData.apelido.toUpperCase(), contaData.conta).run();
        return { mensagem: "Conta criada com sucesso!", status: 201 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao criar uma conta: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao criar uma conta.", status: 500 };
    }
}

export async function atualizarConta(env, contaData) {
    try {

        const result = await env.DB.prepare("UPDATE contas SET apelido = ?, conta = ? WHERE id = ?").bind(contaData.apelido.toUpperCase(), contaData.conta, contaData.id).run();

        if (result.meta.changes === 0) {
            return { mensagem: "Nenhuma conta encontrada para atualizar.", status: 404 };
        }

        return { mensagem: "Conta atualizada com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao atualizar uma conta: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao atualizar uma conta.", status: 500 };
    }
}

export async function deletarConta(env, contaId) {
    try {

        await env.DB.prepare("DELETE FROM contas WHERE id = ?").bind(contaId.id).run();
        return { mensagem: "Conta excluída com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao excluir uma conta: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao excluir uma conta.", status: 500 };
    }
}