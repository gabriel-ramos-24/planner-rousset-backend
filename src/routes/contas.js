import * as contasService from "../services/contas.js";

export default async function routeContas(request, env, subPath) {

    try {

        // Retorna todas as contas cadastradas
        if (request.method === "GET") {
            const result = await contasService.getTodasContas(env);
            return Response.json(result.body, { status: result.status });

        }

        // Criar uma conta
        if (request.method === "POST") {
            const contaData = await request.json();
            const result = await contasService.createConta(env, contaData);
            return Response.json(result.body, { status: result.status });

        }

        // Atualizar uma conta
        if (request.method === "PUT") {
            const contaData = await request.json();
            const result = await contasService.updateConta(env, contaData);
            return Response.json(result.body, { status: result.status });

        }

        // Deletar uma conta
        if (request.method === "DELETE") {
            const contaId = await request.json();
            const result = await contasService.deleteConta(env, contaId);
            return Response.json(result.body, { status: result.status });

        }

        return Response.json({ mensagem: "Rota inexistente." }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno." }, { status: 500 });
    }
}