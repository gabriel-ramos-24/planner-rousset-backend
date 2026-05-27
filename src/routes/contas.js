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

        /*
        if (request.method === "PATCH") { }
        if (request.method === "DELETE") { }
        */
        return Response.json({ mensagem: "Rota inexistente" }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno" }, { status: 500 });
    }
}