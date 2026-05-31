import { gerarToken } from "../services/autenticacao.js";

export default async function routeAutenticacao(request, env, subPath) {

    try {

        // Criar token
        if (request.method === "POST") {
            const body = await request.json();
            const result = await gerarToken(env, body.senha);
            return result;

        }

        return Response.json({ mensagem: "Rota inexistente." }, { status: 404 });
    } catch (error) {
        console.log(error);
        return Response.json({ mensagem: "Erro interno." }, { status: 500 });
    }
}