import routeContas from './routes/contas.js';
import routeProdutos from './routes/produtos.js';
import routeFornecedores from './routes/fornecedores.js';
import routeContratos from './routes/contratos.js';
import routeLancamentos from './routes/lancamentos.js';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const routes = [
  { prefix: "/contas", handler: routeContas },
  { prefix: "/produtos", handler: routeProdutos },
  { prefix: "/fornecedores", handler: routeFornecedores },
  { prefix: "/contratos", handler: routeContratos },
  { prefix: "/lancamentos", handler: routeLancamentos },
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

        const subPath =
          url.pathname.slice(route.prefix.length) || "/";

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