import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

/**
 * @deprecated
 * Manipula as solicita es de API para editar uma tarefa.
 *
 * - Para solicita es PUT: Atualiza uma tarefa existente com novos dados fornecidos
 *   no corpo da solicita o. Retorna um status 200 com os dados da tarefa atualizados
 *   se a solicita o for bem-sucedida, ou um status 500 com uma mensagem de erro se
 *   ocorrer um erro.
 *
 * - Para outros m todos de solicita o: Retorna um status 405 indicando que o
 *   m todo n o   permitido.
 *
 * @param {NextApiRequest} req - O objeto de solicita o que cont m par metros de
 *   query e dados do corpo da solicita o.
 * @param {NextApiResponse} res - O objeto de resposta usado para enviar a
 *   resposta HTTP.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "PUT") {
		const { id, nome, custo, data_limite } = req.body;
		const tarefaAtualizada = await prisma.tarefas.update({
			where: { id },
			data: {
				nome,
				custo,
				data_limite: new Date(data_limite),
			},
		});
		res.status(200).json(tarefaAtualizada);
	} else {
		res.status(405).end();
	}
}
