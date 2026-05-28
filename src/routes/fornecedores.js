import * as fornecedoresService from "../services/fornecedores.js";

export default async function routeFornecedores(request, env, subPath) {

    try {

        // Retorna todas os fornecedores cadastrados
        if (request.method === "GET") {
            const result = await fornecedoresService.getTodosFornecedores(env);
            return Response.json(result.body, { status: result.status });

        }

        // Criar um fornecedor
        if (request.method === "POST") {
            const fornecedorData = await request.json();
            const result = await fornecedoresService.createFornecedor(env, fornecedorData);
            return Response.json(result.body, { status: result.status });

        }

        // Atualizar um fornecedor
        if (request.method === "PUT") {
            const fornecedorData = await request.json();
            const result = await fornecedoresService.updateFornecedor(env, fornecedorData);
            return Response.json(result.body, { status: result.status });

        }

        // Deletar um fornecedor
        if (request.method === "DELETE") {
            const fornecedorId = await request.json();
            const result = await fornecedoresService.deleteFornecedor(env, fornecedorId);
            return Response.json(result.body, { status: result.status });

        }

        return Response.json({ mensagem: "Rota inexistente." }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno." }, { status: 500 });
    }
}