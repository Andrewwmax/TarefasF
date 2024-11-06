import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

/**
 * Manipula solicita es de API para excluir uma tarefa.
 *
 * - Para solicita es DELETE: Exclui a tarefa com o ID especificado no corpo da solicita o.
 *   Retorna um status 204 se a exclus o for bem-sucedida. Caso o m todo da solicita o n o
 *   seja DELETE, retorna um status 405 indicando que o m todo n o   permitido.
 *
 * @param {NextApiRequest} req - O objeto de solicita o que cont m o ID da tarefa no corpo.
 * @param {NextApiResponse} res - O objeto de resposta usado para enviar a resposta HTTP.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "DELETE") {
		const { id } = req.body;
		await prisma.tarefas.delete({
			where: { id },
		});
		res.status(204).end();
	} else {
		res.status(405).end();
	}
}
