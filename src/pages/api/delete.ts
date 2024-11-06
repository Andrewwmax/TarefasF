import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

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
