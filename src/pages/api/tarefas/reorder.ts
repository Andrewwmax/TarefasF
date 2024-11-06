import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../config/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const tarefasOrdenadas = req.body;
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [ordem_apresentacao, action, data] = [
				tarefasOrdenadas.ordem_apresentacao,
				tarefasOrdenadas.action,
				tarefasOrdenadas.data,
			];

			if (action === "up") {
				// Caso a tarefa que seja reordenada para acima
				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao },
					data: { ordem_apresentacao: { set: -1 } },
				});

				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao - 1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao } },
				});

				await prisma.tarefas.update({
					where: { ordem_apresentacao: -1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao - 1 } },
				});
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
