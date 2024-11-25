"use client";
import React from "react";
import { DateTime } from "luxon";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { NumericFormat } from "react-number-format";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Tarefa } from "@/interfaces/tarefa";

/**
 * Modal para editar uma tarefa.
 *
 * O componente recebe como propriedades:
 * - `open`: um booleano que controla o estado de abertura do modal;
 * - `options`: um objeto com o t tulo do modal;
 * - `id`: o identificador da tarefa;
 * - `custo`: o custo da tarefa;
 * - `nome`: o nome da tarefa;
 * - `data_limite`: a data limite da tarefa;
 * - `ordem_apresentacao`: a ordem de apresenta o da tarefa;
 * - `setCusto`: uma fun o que atualiza o estado do custo;
 * - `setNome`: uma fun o que atualiza o estado do nome;
 * - `setDataLimite`: uma fun o que atualiza o estado da data limite;
 * - `onClose`: uma fun o que fecha o modal;
 * - `handleTarefa`: uma fun o que recebe a tarefa atualizada e a salva.
 *
 * O componente retorna um JSX que representa o modal com os campos para editar a tarefa.
 */
const ModalEditarTarefa = ({
	open,
	options,
	id,
	custo,
	nome,
	data_limite,
	ordem_apresentacao,
	setCusto,
	setNome,
	setDataLimite,
	onClose,
	handleTarefa,
}: {
	open: boolean;
	options: { titulo: string };
	id: number;
	custo: number;
	nome: string;
	data_limite: DateTime;
	ordem_apresentacao: number;
	setCusto: (custo: number) => void;
	setNome: (nome: string) => void;
	setDataLimite: (data_limite: DateTime) => void;
	onClose: () => void;
	handleTarefa: (tarefa: Tarefa) => void;
}) => {
	const [custoError, setCustoError] = React.useState<boolean | string>(false);
	const [nomeError, setNomeError] = React.useState<boolean | string>(false);
	const LIMITE_MINIMO = 0.001; // Ajuste para o limite desejado

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "2px solid #000",
		display: "flex",
		flexDirection: "column",
		alignItens: "center",
		boxShadow: 24,
		padding: 4,
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					{options.titulo} Tarefa
				</Typography>
				<br />
				<TextField id="idtarefa" label="id" variant="outlined" disabled value={id} />
				<br />
				<TextField
					id="idnome"
					label="Nome"
					variant="outlined"
					autoFocus
					required
					value={nome}
					error={nomeError as boolean}
					helperText={nomeError as string}
					onChange={(e) => {
						if (e.target.value.trim() === "") {
							setNomeError("O nome da tarefa não pode ser vazio");
						} else {
							setNomeError(false);
						}
						setNome(e.target.value);
					}}
				/>
				<br />
				<NumericFormat
					id="idCusto"
					label="Custo"
					variant="outlined"
					required
					helperText={custoError as string}
					value={custo}
					customInput={TextField}
					thousandSeparator
					onValueChange={(values) => {
						const inputValue = values.floatValue!;
						setCusto(values.floatValue!);
						if (isNaN(inputValue)) {
							setCustoError("Por favor, insira um número válido.");
							setCusto(null as unknown as number);
						} else if (inputValue <= 0) {
							setCustoError("O custo deve ser maior que zero.");
							setCusto(null as unknown as number);
						} else if (inputValue < LIMITE_MINIMO) {
							setCustoError(`O custo deve ser maior ou igual a ${LIMITE_MINIMO}.`);
							setCusto(null as unknown as number);
						} else if (inputValue >= Number.MAX_SAFE_INTEGER) {
							setCustoError("O valor é muito grande.");
							setCusto(null as unknown as number);
						} else {
							setCustoError(false);
							setCusto(inputValue);
						}
					}}
				/>
				<br />
				<LocalizationProvider dateAdapter={AdapterLuxon}>
					<DatePicker
						label="Data Limite"
						value={data_limite}
						minDate={DateTime.now()}
						format="yyyy/MM/dd"
						onChange={(newValue) => setDataLimite(newValue as DateTime)}
					/>
				</LocalizationProvider>
				<br />
				<Button
					fullWidth
					variant="outlined"
					onClick={() =>
						handleTarefa({
							id: id,
							nome,
							custo,
							data_limite,
							ordem_apresentacao: ordem_apresentacao,
						})
					}
					style={{ marginRight: "10px" }}
				>
					{options.titulo}
				</Button>
			</Box>
		</Modal>
	);
};

export default ModalEditarTarefa;
