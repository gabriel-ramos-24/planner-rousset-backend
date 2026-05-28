import * as database from '../db/dbfornecedores.js';

function validarFornecedor(fornecedorData) {

    // Verifica existência do objeto
    if (!fornecedorData) {
        return "Dados do fornecedor não enviados.";
    }

    // Remove espaços extras
    const nome = fornecedorData.nome?.trim();
    const email = fornecedorData.email?.trim();
    const celular = fornecedorData.celular?.replace(/\D/g, '');
    const cnpj = fornecedorData.cnpj?.replace(/\D/g, '');

    // Campos obrigatórios
    if (!nome || !email || !celular || !cnpj) {
        return "Todos os campos são obrigatórios.";
    }

    // Nome
    if (nome.length < 3) {
        return "O nome deve possuir no mínimo 3 caracteres.";
    }

    if (nome.length > 100) {
        return "O nome deve possuir no máximo 100 caracteres.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Email inválido.";
    }

    if (email.length > 150) {
        return "O email deve possuir no máximo 150 caracteres.";
    }

    // Celular
    if (!/^\d{11}$/.test(celular)) {
        return "O celular deve conter exatamente 11 números.";
    }

    // CNPJ
    if (!/^\d{14}$/.test(cnpj)) {
        return "O CNPJ deve conter exatamente 14 números.";
    }

    return null;
}

export async function getTodosFornecedores(env) {
    try {

        const resultado = await database.buscarTodosFornecedores(env);
        return {
            body: resultado.status === 200
                ? {
                    dados: resultado.dados,
                    mensagem: resultado.mensagem
                }
                : {
                    mensagem: resultado.mensagem
                },

            status: resultado.status
        };

    } catch (error) {

        console.log('Log de erro dentro da pasta services método GET módulo FORNECEDORES: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function createFornecedor(env, fornecedorData) {
    try {

        const erro = validarFornecedor(fornecedorData);

        if (erro) {
            return {
                body: { mensagem: erro },
                status: 400
            };
        }

        const resultado = await database.criarFornecedor(env, fornecedorData);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.log('Log de erro dentro da pasta services método POST módulo FORNECEDORES: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function updateFornecedor(env, fornecedorData) {
    try {

        const erro = validarFornecedor(fornecedorData);

        if (erro) {
            return {
                body: { mensagem: erro },
                status: 400
            };
        }

        const resultado = await database.atualizarFornecedor(env, fornecedorData);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.log('Log de erro dentro da pasta services método PUT módulo FORNECEDORES: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}

export async function deleteFornecedor(env, fornecedorId) {
    try {

        // Id no corpo da requisição
        if (!fornecedorId.id) return { body: { mensagem: "Sem id para excluir fornecedor." }, status: 400 };

        const resultado = await database.deletarFornecedor(env, fornecedorId);
        return { body: { mensagem: resultado.mensagem }, status: resultado.status };

    } catch (error) {

        console.log('Log de erro dentro da pasta services método DELETE módulo FORNECEDORES: ', error);
        return { body: { mensagem: "Erro ao inicializar conexão com banco de dados." }, status: 500 };

    }
}