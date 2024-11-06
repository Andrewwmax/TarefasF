import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

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
