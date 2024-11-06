// pages/api/tarefas/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../config/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (req.method === "DELETE") {
		try {
			const deletada = await prisma.tarefas.delete({
				where: { id: Number(id) },
			});

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
