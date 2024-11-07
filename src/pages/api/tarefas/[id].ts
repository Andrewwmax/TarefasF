// pages/api/tarefas/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../config/prisma";

/**
 * Manipula as solicita es de API para uma tarefa espec fica identificada pelo seu ID.
 *
 * - Para solicita es DELETE: Apaga a tarefa com o ID especificado e reordena as
 *   tarefas restantes com base na ordem de apresenta o. Retorna um status 204 se a
 *   dele o for bem-sucedida, ou um status 500 com uma mensagem de erro se ocorrer
 *   um erro.
 *
 * - Para solicita es PUT: Atualiza uma tarefa existente com novos dados fornecidos
 *   no corpo da solicita o. Certifica-se de que o nome da tarefa seja nico (exceto
 *   para a tarefa atual). Retorna um status 200 com os dados da tarefa atualizados
 *   se a solicita o for bem-sucedida, ou um status 400 com uma mensagem de erro se
 *   uma tarefa com o mesmo nome já existir, ou um status 500 com uma mensagem de
 *   erro.
 *
 * - Para outros m todos de solicitação: Retorna um status 405 indicando que não é
 * 	 permitido.
 *
 * @param {NextApiRequest} req - O objeto de solicita o que contém par metros de
 *   query e dados do corpo da solicitação.
 * @param {NextApiResponse} res - O objeto de resposta usado para enviar a
 *   resposta HTTP.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (req.method === "DELETE") {
		try {
			const deletada = await prisma.tarefas.delete({
				where: { id: Number(id) },
			});
			// console.log(deletada);
			// Reordena as tarefas com base na ordem de apresentacao
			// const reordenado =
			await prisma.tarefas.updateMany({
				where: { ordem_apresentacao: { gt: Number(deletada.ordem_apresentacao) } },
				data: { ordem_apresentacao: { decrement: 1 } },
			});

			// Retorna se a exclusão for bem-sucedida
			res.status(204).end();
		} catch (error) {
			res.status(500).json({ error: "Erro ao excluir a tarefa" + error });
		}
	} else if (req.method === "PUT") {
		const { nome, custo, data_limite } = req.body;

		try {
			const tarefaExistente = await prisma.tarefas.findUnique({
				where: { nome },
			});

			if (tarefaExistente && tarefaExistente.id !== Number(id)) {
				return res.status(400).json({ error: "Uma tarefa com este nome já existe" });
			}

			const tarefaAtualizada = await prisma.tarefas.update({
				where: { id: Number(id) },
				data: {
					nome,
					custo: parseFloat(custo),
					data_limite: new Date(data_limite),
				},
			});

			res.status(200).json(tarefaAtualizada);
		} catch (error) {
			res.status(500).json({ error: "Erro ao atualizar a tarefa" + error });
		}
	} else {
		res.status(405).json({ error: "Método não permitido" });
	}
}
