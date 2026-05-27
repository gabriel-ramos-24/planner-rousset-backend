import routeContas from './routes/contas.js';
//import routeRelatorios from './routes/relatorios.js';
//import routeProdutos from './routes/produtos.js';
//import routeFornecedores from './routes/fornecedores.js';

const routes = [
  { prefix: "/contas", handler: routeContas },
 // { prefix: "/relatorios", handler: routeRelatorios },
 // { prefix: "/produtos", handler: routeProdutos },
 // { prefix: "/fornecedores", handler: routeFornecedores },
];


export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    for (const route of routes) {
      if (url.pathname === route.prefix || url.pathname.startsWith(route.prefix + "/")) {
        const subPath = url.pathname.slice(route.prefix.length) || "/";
        return route.handler(request, env, subPath);
      }
    }
    
    return Response.json({ mensagem: "Rota inexistente" }, { status: 404 });

  }
};
