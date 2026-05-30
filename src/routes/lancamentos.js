import * as lancamentosServices from "../services/lancamentos.js";

export default async function routeLancamentos(request, env, subPath) {

    try {

        // Retorna todas os lancamentos de um contrato cadastrado ou todos lancamentos
        if (request.method === "GET") {
            const url = new URL(request.url);
            const contratoId = url.searchParams.get("contratoid");
            const result = await lancamentosServices.getTodosLancamentos(env, contratoId);
            return Response.json(result.body, { status: result.status });

        }

        // Criar um lancamento
        if (request.method === "POST") {
            const lancamentoData = await request.json();
            const result = await lancamentosServices.createLancamento(env, lancamentoData);
            return Response.json(result.body, { status: result.status });

        }

        // Atualizar um lancamento
        if (request.method === "PUT") {
            const lancamentoData = await request.json();
            const result = await lancamentosServices.updateLancamento(env, lancamentoData);
            return Response.json(result.body, { status: result.status });

        }

        // Deletar um lancamento
        if (request.method === "DELETE") {
            const lancamentoId = await request.json();
            const result = await lancamentosServices.deleteLancamento(env, lancamentoId);
            return Response.json(result.body, { status: result.status });

        }

        return Response.json({ mensagem: "Rota inexistente." }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno." }, { status: 500 });
    }
}