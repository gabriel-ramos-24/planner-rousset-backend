export async function buscarTodasContas(env) {
    try {

        const contas = await env.DB.prepare("SELECT * FROM contas").all();
        return { dados: contas.results, mensagem: "Consulta realizada com sucesso!", status: 200 };

    } catch (error) {
        console.error("Log de erro dentro da pasta database ao buscar todas as contas: ", error);
        return { mensagem: "Conexão com banco de dados realizada. Porém, erro ao consultar todas as contas.", status: 500 };
    }
}