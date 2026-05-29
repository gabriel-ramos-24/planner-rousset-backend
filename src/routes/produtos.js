import * as produtosService from "../services/produtos.js";

export default async function routeProdutos(request, env, subPath) {

    try {

        // Retorna todas os produtos cadastrados
        if (request.method === "GET") {
            const result = await produtosService.getTodosProdutos(env);
            return Response.json(result.body, { status: result.status });

        }

        // Criar um produto
        if (request.method === "POST") {
            const produtoData = await request.json();
            const result = await produtosService.createProduto(env, produtoData);
            return Response.json(result.body, { status: result.status });

        }

        // Atualizar um produto
        if (request.method === "PUT") {
            const produtoData = await request.json();
            const result = await produtosService.updateProduto(env, produtoData);
            return Response.json(result.body, { status: result.status });

        }

        // Deletar um produto
        if (request.method === "DELETE") {
            const produtoId = await request.json();
            const result = await produtosService.deleteProduto(env, produtoId);
            return Response.json(result.body, { status: result.status });

        }

        return Response.json({ mensagem: "Rota inexistente." }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno." }, { status: 500 });
    }
}