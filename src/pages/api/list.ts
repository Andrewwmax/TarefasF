import { DateTime } from "luxon";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../config/prisma";

/**
 * Manipula solicita es de API para uma lista de tarefas.
 *
 * Retorna uma lista de tarefas ordenadas por ordem de apresentação.
 * A lista ordenada por ordem de apresenta o em ordena ascendente.
 *
 * @param {NextApiRequest} req - O objeto de solicita o que contém par metros de
 *   query e dados do corpo da solicitação.
 * @param {NextApiResponse} res - O objeto de resposta usado para enviar a
 *   resposta HTTP.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const tarefas = await prisma.tarefas.findMany({
		orderBy: { ordem_apresentacao: "asc" },
	});
	const formatarTarefas = tarefas.map((tarefa: any) => {
		return {
			id: tarefa.id,
			nome: tarefa.nome,
			custo: tarefa.custo,
			data_limite: DateTime.fromJSDate(tarefa.data_limite),
			ordem_apresentacao: tarefa.ordem_apresentacao,
		};
	});
	res.status(200).json(formatarTarefas);
}
