import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.tarefas.createMany({
		data: [
			{
				nome: "Planejamento do Projeto",
				custo: 500.0,
				data_limite: new Date("2024-12-01T10:00:00Z"),
				ordem_apresentacao: 1,
			},
			{
				nome: "Design da Interface",
				custo: 1200.0,
				data_limite: new Date("2024-12-10T15:00:00Z"),
				ordem_apresentacao: 2,
			},
			{
				nome: "Configuração de Banco de Dados",
				custo: 300.0,
				data_limite: new Date("2024-12-15T12:30:00Z"),
				ordem_apresentacao: 3,
			},
			{
				nome: "Implementação do Backend",
				custo: 2000.0,
				data_limite: new Date("2024-12-20T09:00:00Z"),
				ordem_apresentacao: 4,
			},
			{
				nome: "Desenvolvimento do Frontend",
				custo: 1500.0,
				data_limite: new Date("2025-01-05T11:00:00Z"),
				ordem_apresentacao: 5,
			},
			{
				nome: "Testes de Unidade",
				custo: 800.0,
				data_limite: new Date("2025-01-10T16:45:00Z"),
				ordem_apresentacao: 6,
			},
			{
				nome: "Integração de API",
				custo: 600.0,
				data_limite: new Date("2025-01-12T13:30:00Z"),
				ordem_apresentacao: 7,
			},
			{
				nome: "Testes de Integração",
				custo: 950.0,
				data_limite: new Date("2025-01-15T10:15:00Z"),
				ordem_apresentacao: 8,
			},
			{
				nome: "Configuração de Deploy",
				custo: 1100.0,
				data_limite: new Date("2025-01-18T14:20:00Z"),
				ordem_apresentacao: 9,
			},
			{
				nome: "Documentação do Projeto",
				custo: 400.0,
				data_limite: new Date("2025-01-20T17:00:00Z"),
				ordem_apresentacao: 10,
			},
		],
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
