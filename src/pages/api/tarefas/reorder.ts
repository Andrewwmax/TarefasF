import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../config/prisma";

/**
 * Manipula solicita es de API para reordenar as tarefas.
 *
 * - Para solicita es POST: Atualiza a ordem de apresenta o das tarefas com base nos dados
 *   recebidos no corpo da solicitação. Retorna um status 200 se a atualiza o for bem-sucedida
 *   ou um status 500 com uma mensagem de erro se ocorrer um erro.
 *
 * - Para outros em todos de solicitação: Retorna um status 405 indicando que o em todo não permitido.
 *
 * @param {NextApiRequest} req - O objeto de solicitação que contém o corpo da solicitação.
 * @param {NextApiResponse} res - O objeto de resposta usado para enviar a resposta HTTP.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const tarefasOrdenadas = req.body;
		console.log({ tarefasOrdenadas: tarefasOrdenadas });
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [ordem_apresentacao, action, data] = [
				tarefasOrdenadas.ordem_apresentacao,
				tarefasOrdenadas.action,
				tarefasOrdenadas.data,
			];

			if (action === "up") {
				// Caso a tarefa que seja reordenada para acima
				const taf = await prisma.tarefas.findUnique({
					where: { ordem_apresentacao: ordem_apresentacao },
				});
				if (taf) {
					await prisma.tarefas.update({
						where: { id: taf.id },
						data: { ordem_apresentacao: { set: -1 } },
					});
				}
				// console.log({ taf: taf });
				const tafe = await prisma.tarefas.findUnique({
					where: { ordem_apresentacao: ordem_apresentacao - 1 },
				});
				if (tafe) {
					await prisma.tarefas.update({
						where: { id: tafe.id },
						data: { ordem_apresentacao: { set: ordem_apresentacao } },
					});
				}

				const tafes = await prisma.tarefas.findUnique({
					where: { ordem_apresentacao: -1 },
				});
				if (tafes) {
					await prisma.tarefas.update({
						where: { id: tafes.id },
						data: { ordem_apresentacao: { set: ordem_apresentacao - 1 } },
					});
				}

				// Caso a tarefa que seja reordenada para abaixo
			} else {
				// Caso a tarefa que seja reordenada para acima
				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao },
					data: { ordem_apresentacao: { set: -1 } },
				});

				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao + 1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao } },
				});

				const tarefaAbaixoConsolidada = await prisma.tarefas.update({
					where: { ordem_apresentacao: -1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao + 1 } },
				});
				console.log(tarefaAbaixoConsolidada);
			}

			res.status(200).json({ message: "Ordem atualizada com sucesso" });
		} catch (error) {
			res.status(500).json({ error: "Erro ao atualizar a ordem das tarefas " + error });
		}
	} else {
		res.status(405).json({ error: "Método não permitido" });
	}
}
