import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

/**
 * Manipula solicita es de API para uma lista de tarefas.
 *
 * Retorna uma lista de tarefas ordenadas por ordem de apresenta o.
 * A lista  ordenada por ordem de apresenta o em ordena   ascendente.
 *
 * @param {NextApiRequest} req - O objeto de solicita o que cont m par metros de
 *   query e dados do corpo da solicita o.
 * @param {NextApiResponse} res - O objeto de resposta usado para enviar a
 *   resposta HTTP.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const tarefas = await prisma.tarefas.findMany({
		orderBy: { ordem_apresentacao: "asc" },
	});

	res.status(200).json(tarefas);
}
