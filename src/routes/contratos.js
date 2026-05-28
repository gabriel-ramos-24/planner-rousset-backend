import * as contratosServices from "../services/contratos.js";

export default async function routeContratos(request, env, subPath) {

    try {

        // Retorna todas os contratos cadastrados
        if (request.method === "GET") {
            const result = await contratosServices.getTodosContratos(env);
            return Response.json(result.body, { status: result.status });

        }

        // Criar um contrato
        if (request.method === "POST") {
            const contratoData = await request.json();
            const result = await contratosServices.createContrato(env, contratoData);
            return Response.json(result.body, { status: result.status });

        }

        // Atualizar um contrato
        if (request.method === "PUT") {
            const contratoData = await request.json();
            const result = await contratosServices.updateContrato(env, contratoData);
            return Response.json(result.body, { status: result.status });

        }

        // Deletar um contrato
        if (request.method === "DELETE") {
            const contratoId = await request.json();
            const result = await contratosServices.deleteContrato(env, contratoId);
            return Response.json(result.body, { status: result.status });

        }

        return Response.json({ mensagem: "Rota inexistente." }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno." }, { status: 500 });
    }
}