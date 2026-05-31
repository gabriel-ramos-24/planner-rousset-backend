import { getInfoConvidados } from "../services/convidados.js";

export default async function routeConvidados(request, env, subPath) {

    try {

        // Retorna todas os convidados cadastrados
        if (request.method === "GET") {
            const url = new URL(request.url);
            const tokenConvidado = url.searchParams.get("token");
            const result = await getInfoConvidados(env, tokenConvidado);
            return Response.json(result.body, { status: result.status });

        }

        return Response.json({ mensagem: "Rota inexistente." }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno." }, { status: 500 });
    }
}