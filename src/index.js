import routeContas from './routes/contas.js';
import routeProdutos from './routes/produtos.js';
import routeFornecedores from './routes/fornecedores.js';
import routeContratos from './routes/contratos.js';
import routeLancamentos from './routes/lancamentos.js';
import routeAutenticacao from './routes/autenticacao.js';
import routeConvidados from './routes/convidados.js';
import { validarToken } from './services/autenticacao.js';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const routes = [
  { prefix: "/contas", handler: routeContas },
  { prefix: "/produtos", handler: routeProdutos },
  { prefix: "/fornecedores", handler: routeFornecedores },
  { prefix: "/contratos", handler: routeContratos },
  { prefix: "/lancamentos", handler: routeLancamentos },
  { prefix: "/autenticacao", handler: routeAutenticacao },
  { prefix: "/convidados", handler: routeConvidados },
];

export default {

  async fetch(request, env) {

    if (request.method === "OPTIONS") {

      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });

    }

    const url = new URL(request.url);

    for (const route of routes) {

      if (
        url.pathname === route.prefix ||
        url.pathname.startsWith(route.prefix + "/")
      ) {

        const subPath = url.pathname.slice(route.prefix.length) || "/";

        // Se não estiver pedindo a rota autenticacao ou convidados, cobra o token!!!
        if (route.prefix !== "/autenticacao" || route.prefix !== "/convidados") {

          const authorization =
            request.headers.get("Authorization");

          if (!authorization?.startsWith("Bearer ")) {
            return Response.json(
              {
                mensagem: "Token não informado"
              },
              {
                status: 401
              }
            );
          }

          const token = authorization.substring(7);

          const autorizado =
            await validarToken(env, token);

          if (!autorizado) {
            return Response.json(
              {
                mensagem: "Não autorizado!"
              },
              {
                status: 403
              }
            );
          }

        }


        // Aqui ele vai para as rotas
        const response =
          await route.handler(
            request,
            env,
            subPath
          );

        Object.entries(corsHeaders)
          .forEach(([key, value]) => {
            response.headers.set(key, value);
          });

        return response;

      }

    }

    return Response.json(
      {
        mensagem: "Rota inexistente"
      },
      {
        status: 404,
        headers: corsHeaders
      }
    );

  }

};