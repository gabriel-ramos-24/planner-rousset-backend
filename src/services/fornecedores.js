import * as database from '../db/dbfornecedores.js';

function validarFornecedor(fornecedorData) {

    // Verifica existência do objeto
    if (!fornecedorData) {
        return {
            erro: "Dados do fornecedor não enviados."
        };
    }

    // Sanitização e padronização
    const nome = fornecedorData.nome
        ?.trim()
        .toUpperCase();

    const email = fornecedorData.email
        ?.trim()
        .toLowerCase();

    const celular = fornecedorData.celular
        ?.replace(/\D/g, '');

    const cnpj = fornecedorData.cnpj
        ?.replace(/\D/g, '');

    // Campos obrigatórios
    if (!nome || !email || !celular || !cnpj) {
        return {
            erro: "Todos os campos são obrigatórios."
        };
    }

    // Nome
    if (nome.length < 3) {
        return {
            erro: "O nome deve possuir no mínimo 3 caracteres."
        };
    }

    if (nome.length > 100) {
        return {
            erro: "O nome deve possuir no máximo 100 caracteres."
        };
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return {
            erro: "Email inválido."
        };
    }

    if (email.length > 150) {
        return {
            erro: "O email deve possuir no máximo 150 caracteres."
        };
    }

    // Celular
    if (!/^\d{11}$/.test(celular)) {
        return {
            erro: "O celular deve conter exatamente 11 números."
        };
    }

    return {
        dados: {
            ...fornecedorData,
            nome,
            email,
            celular,
            cnpj
        }
    };
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

        console.error(
            'Log de erro dentro da pasta services método GET módulo FORNECEDORES:',
            error
        );

        return {
            body: {
                mensagem: "Erro ao inicializar conexão com banco de dados."
            },

            status: 500
        };
    }
}

export async function createFornecedor(env, fornecedorData) {
    try {

        const validacao = validarFornecedor(fornecedorData);

        if (validacao.erro) {
            return {
                body: {
                    mensagem: validacao.erro
                },

                status: 400
            };
        }

        fornecedorData = validacao.dados;

        const resultado = await database.criarFornecedor(
            env,
            fornecedorData
        );

        return {
            body: {
                mensagem: resultado.mensagem
            },

            status: resultado.status
        };

    } catch (error) {

        console.error(
            'Log de erro dentro da pasta services método POST módulo FORNECEDORES:',
            error
        );

        return {
            body: {
                mensagem: "Erro ao inicializar conexão com banco de dados."
            },

            status: 500
        };
    }
}

export async function updateFornecedor(env, fornecedorData) {
    try {

        // Valida id
        if (!fornecedorData.id) {
            return {
                body: {
                    mensagem: "Id do fornecedor não informado."
                },

                status: 400
            };
        }

        const validacao = validarFornecedor(fornecedorData);

        if (validacao.erro) {
            return {
                body: {
                    mensagem: validacao.erro
                },

                status: 400
            };
        }

        fornecedorData = validacao.dados;

        const resultado = await database.atualizarFornecedor(
            env,
            fornecedorData
        );

        return {
            body: {
                mensagem: resultado.mensagem
            },

            status: resultado.status
        };

    } catch (error) {

        console.error(
            'Log de erro dentro da pasta services método PUT módulo FORNECEDORES:',
            error
        );

        return {
            body: {
                mensagem: "Erro ao inicializar conexão com banco de dados."
            },

            status: 500
        };
    }
}

export async function deleteFornecedor(env, fornecedorId) {
    try {

        // Valida id
        if (!fornecedorId.id) {
            return {
                body: {
                    mensagem: "Sem id para excluir fornecedor."
                },

                status: 400
            };
        }

        const resultado = await database.deletarFornecedor(
            env,
            fornecedorId
        );

        return {
            body: {
                mensagem: resultado.mensagem
            },

            status: resultado.status
        };

    } catch (error) {

        console.error(
            'Log de erro dentro da pasta services método DELETE módulo FORNECEDORES:',
            error
        );

        return {
            body: {
                mensagem: "Erro ao inicializar conexão com banco de dados."
            },

            status: 500
        };
    }
}