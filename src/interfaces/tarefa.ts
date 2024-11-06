import { DateTime } from "luxon";

export interface Tarefa {
	id?: number;
	nome: string;
	custo: number;
	data_limite: DateTime;
	ordem_apresentacao: number;
}
