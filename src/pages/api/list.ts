import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const tarefas = await prisma.tarefas.findMany({
		orderBy: { ordem_apresentacao: "asc" },
	});

	// console.log(tarefas);

	res.status(200).json(tarefas);
}
