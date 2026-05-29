import * as database from '../db/dbprodutos.js';

const UNIDADES_VALIDAS = [
    'KG',
    'L',
    'PCT',
    'FARDO',
    'DUZIA',
    'MOLHO'
];

function validarProduto(produtoData) {

    // Verifica existência do objeto
    if (!produtoData) {
        return {
            erro: "Dados do produto não enviados."
        };
    }

    // Sanitização e padronização
    const contratoId = produtoData.contratoId
        ?.toString()
        .replace(/\D/g, '');

    const nome = produtoData.nome
        ?.trim()
        .toUpperCase();

    const unidade = produtoData.unidade
        ?.trim()
        .toUpperCase();

    const quantidadeContrato = Number(
        produtoData.quantidadeContrato
            ?.toString()
            .replace(/\D/g, '')
    );

    const valorUnitario = Number(
        produtoData.valorUnitario
            ?.toString()
            .replace(/\./g, '')
            .replace(',', '.')
            .replace(/[^\d.-]/g, '')
    );

    // Campos obrigatórios
    if (
        !contratoId ||
        !nome ||
        !unidade ||
        !quantidadeContrato ||
        !valorUnitario
    ) {
        return {
            erro: "Todos os campos são obrigatórios."
        };
    }

    // Contrato
    if (!/^\d+$/.test(contratoId)) {
        return {
            erro: "Contrato inválido."
        };
    }

    // Nome
    if (nome.length < 2) {
        return {
            erro: "O nome do produto deve possuir no mínimo 2 caracteres."
        };
    }

    if (nome.length > 150) {
        return {
            erro: "O nome do produto deve possuir no máximo 150 caracteres."
        };
    }

    // Unidade
    if (!UNIDADES_VALIDAS.includes(unidade)) {
        return {
            erro: `Unidade inválida. Valores permitidos: ${UNIDADES_VALIDAS.join(', ')}.`
        };
    }

    // Quantidade
    if (isNaN(quantidadeContrato)) {
        return {
            erro: "Quantidade contratada inválida."
        };
    }

    if (quantidadeContrato <= 0) {
        return {
            erro: "A quantidade contratada deve ser maior que zero."
        };
    }

    // Valor unitário
    if (isNaN(valorUnitario)) {
        return {
            erro: "Valor unitário inválido."
        };
    }

    if (valorUnitario <= 0) {
        return {
            erro: "O valor unitário deve ser maior que zero."
        };
    }

    return {
        dados: {
            ...produtoData,

            contratoId: Number(contratoId),

            nome,

            unidade,

            quantidadeContrato,

            valorUnitario
        }
    };
}

export async function getTodosProdutos(env, orderBy) {
    try {

        const resultado = await database.buscarTodosProdutos(
            env,
            orderBy
        );

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
            'Log de erro dentro da pasta services método GET módulo PRODUTOS:',
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

export async function createProduto(env, produtoData) {
    try {

        const validacao = validarProduto(produtoData);

        if (validacao.erro) {
            return {
                body: {
                    mensagem: validacao.erro
                },

                status: 400
            };
        }

        produtoData = validacao.dados;

        // Verifica existência do contrato
        const contrato = await env.DB
            .prepare(`
                SELECT id
                FROM contratos
                WHERE id = ?
            `)
            .bind(produtoData.contratoId)
            .first();

        if (!contrato) {
            return {
                body: {
                    mensagem: "Contrato não encontrado."
                },

                status: 404
            };
        }

        const resultado = await database.criarProduto(
            env,
            produtoData
        );

        return {
            body: {
                mensagem: resultado.mensagem
            },

            status: resultado.status
        };

    } catch (error) {

        console.error(
            'Log de erro dentro da pasta services método POST módulo PRODUTOS:',
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

export async function updateProduto(env, produtoData) {
    try {

        // Valida id
        if (!produtoData.id) {
            return {
                body: {
                    mensagem: "Id do produto não informado."
                },

                status: 400
            };
        }

        const validacao = validarProduto(produtoData);

        if (validacao.erro) {
            return {
                body: {
                    mensagem: validacao.erro
                },

                status: 400
            };
        }

        produtoData = validacao.dados;

        // Verifica existência do contrato
        const contrato = await env.DB
            .prepare(`
                SELECT id
                FROM contratos
                WHERE id = ?
            `)
            .bind(produtoData.contratoId)
            .first();

        if (!contrato) {
            return {
                body: {
                    mensagem: "Contrato não encontrado."
                },

                status: 404
            };
        }

        const resultado = await database.atualizarProduto(
            env,
            produtoData
        );

        return {
            body: {
                mensagem: resultado.mensagem
            },

            status: resultado.status
        };

    } catch (error) {

        console.error(
            'Log de erro dentro da pasta services método PUT módulo PRODUTOS:',
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

export async function deleteProduto(env, produtoId) {
    try {

        // Valida id
        if (!produtoId.id) {
            return {
                body: {
                    mensagem: "Sem id para excluir produto."
                },

                status: 400
            };
        }

        const resultado = await database.deletarProduto(
            env,
            produtoId
        );

        return {
            body: {
                mensagem: resultado.mensagem
            },

            status: resultado.status
        };

    } catch (error) {

        console.error(
            'Log de erro dentro da pasta services método DELETE módulo PRODUTOS:',
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
