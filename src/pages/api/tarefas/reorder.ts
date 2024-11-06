import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../config/prisma";
// import { Tarefa } from "@/interfaces/tarefa";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// console.log(req.body);
	if (req.method === "POST") {
		const tarefasOrdenadas = req.body;
		// console.log({ reorder: tarefasOrdenadas });
		try {
			const [ordem_apresentacao, action, data] = [
				tarefasOrdenadas.ordem_apresentacao,
				tarefasOrdenadas.action,
				tarefasOrdenadas.data,
			];

			if (action === "up") {
				// Caso a tarefa que seja reordenada para acima
				/* const tarefaAcimaAtiva =  */
				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao },
					data: { ordem_apresentacao: { set: -1 } },
				});

				// console.log(tarefaAcimaAtiva);

				/* const tarefaAcimaResidual =  */
				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao - 1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao } },
				});
				// console.log(tarefaAcimaResidual);

				/* const tarefaAcimaConsolidada =  */
				await prisma.tarefas.update({
					where: { ordem_apresentacao: -1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao - 1 } },
				});

				// console.log(tarefaAcimaConsolidada);
			} else {
				// Caso a tarefa que seja reordenada para acima
				/* const tarefaAbaixoAtiva =  */
				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao },
					data: { ordem_apresentacao: { set: -1 } },
				});

				// console.log(tarefaAbaixoAtiva);

				/* const tarefaAbaixoResidual =  */
				await prisma.tarefas.update({
					where: { ordem_apresentacao: ordem_apresentacao + 1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao } },
				});
				// console.log(tarefaAbaixoResidual);

				const tarefaAbaixoConsolidada = await prisma.tarefas.update({
					where: { ordem_apresentacao: -1 },
					data: { ordem_apresentacao: { set: ordem_apresentacao + 1 } },
				});
				console.log(tarefaAbaixoConsolidada);
			}

			// const atualizarPromises = tarefasOrdenadas.map((tarefa: Tarefa) =>
			// 	prisma.tarefas.update({
			// 		where: { id: tarefa.id, ordem_apresentacao: tarefa.ordem_apresentacao },
			// 		data: { ordem_apresentacao: tarefa.ordem_apresentacao },
			// 	})
			// );

			// const consolidado = await Promise.all(atualizarPromises);

			res.status(200).json({ message: "Ordem atualizada com sucesso" });
		} catch (error) {
			res.status(500).json({ error: "Erro ao atualizar a ordem das tarefas " + error });
		}
	} else {
		res.status(405).json({ error: "Método não permitido" });
	}
}
