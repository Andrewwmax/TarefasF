import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

export async function handler2(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const { nome, custo, data_limite, ordem_apresentacao } = req.body;
		const novaTarefa = await prisma.tarefas.create({
			data: {
				nome,
				custo,
				data_limite: new Date(data_limite),
				ordem_apresentacao,
			},
		});
		res.status(201).json(novaTarefa);
	} else {
		res.status(405).end();
	}
}

// pages/api/tarefas/add.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const { nome, custo, data_limite } = req.body;

		try {
			// Verifica se o nome já existe
			const tarefaExistente = await prisma.tarefas.findUnique({
				where: { nome },
			});

			if (tarefaExistente) {
				return res.status(400).json({ error: "Uma tarefa com este nome já existe" });
			}

			// Encontra a maior ordem_apresentacao e define a nova como última
			const ultimaTarefa = await prisma.tarefas.findFirst({
				orderBy: { ordem_apresentacao: "desc" },
			});
			const novaOrdem = ultimaTarefa ? ultimaTarefa.ordem_apresentacao + 1 : 1;

			const novaTarefa = await prisma.tarefas.create({
				data: {
					nome,
					custo: parseFloat(custo),
					data_limite: new Date(data_limite),
					ordem_apresentacao: novaOrdem,
				},
			});

			res.status(201).json(novaTarefa);
		} catch (error) {
			res.status(500).json({ error: "Erro ao criar a tarefa" + error });
		}
	} else {
		res.status(405).json({ error: "Método não permitido" });
	}
}
