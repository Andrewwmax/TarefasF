import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

/**
 * Cria uma nova tarefa.
 *
 * Espera um objeto com os campos `nome`, `custo` e `data_limite` no corpo da requisi o.
 * Verifica se o nome j  existe e, se n o, a cria com a ordem de apresenta o maior + 1.
 * Retorna a tarefa criada com status 201 ou um erro com status 400 ou 500.
 *
 * @param {NextApiRequest} req - O objeto de solicita o.
 * @param {NextApiResponse} res - O objeto de resposta.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const { nome, custo, data_limite } = req.body;

		try {
			// Verifica se o nome já existe
			const tarefaExistente = await prisma.tarefas.findUnique({
				where: { nome },
			});

			if (tarefaExistente) {
				return res.status(400).json({ error: "Uma tarefa com este nome já existe" });
			}

			// Encontra a maior ordem_apresentacao e define a nova como última
			const ultimaTarefa = await prisma.tarefas.findFirst({
				orderBy: { ordem_apresentacao: "desc" },
			});
			const novaOrdem = ultimaTarefa ? ultimaTarefa.ordem_apresentacao + 1 : 1;

			const novaTarefa = await prisma.tarefas.create({
				data: {
					nome,
					custo: parseFloat(custo),
					data_limite: new Date(data_limite),
					ordem_apresentacao: novaOrdem,
				},
			});

			res.status(201).json(novaTarefa);
		} catch (error) {
			res.status(500).json({ error: "Erro ao criar a tarefa " + error });
		}
	} else {
		res.status(405).json({ error: "Método não permitido" });
	}
}
