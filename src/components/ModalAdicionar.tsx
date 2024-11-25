"use client";
import React from "react";
import { DateTime } from "luxon";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Tarefa } from "@/interfaces/tarefa";

/**
 * Modal para adicionar uma tarefa.
 *
 * O componente recebe como propriedades:
 * - `open`: um booleano que controla o estado de abertura do modal;
 * - `options`: um objeto com o t tulo do modal;
 * - `tarefa`: um objeto parcial com a tarefa a ser adicionada;
 * - `onClose`: uma fun o que fecha o modal;
 * - `handleTarefa`: uma fun o que recebe a tarefa adicionada e a salva.
 *
 * O componente retorna um JSX que representa o modal com os campos para adicionar a tarefa.
 */
const ModalAdicionarTarefa = ({
	open,
	options,
	tarefa,
	onClose,
	handleTarefa,
}: {
	open: boolean;
	options: { titulo: string };
	tarefa: Partial<Tarefa>;
	onClose: () => void;
	handleTarefa: (tarefa: Tarefa) => void;
}) => {
	const [nome, setNome] = React.useState<string>(null as unknown as string);
	const [custo, setCusto] = React.useState<number>(null as unknown as number);
	const [data_limite, setDataLimite] = React.useState<DateTime>(DateTime.now().plus({ days: 1 }));
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
	const handleCustoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const valor = Number(e.target.value.replace(",", "."));
		if (isNaN(valor)) {
			setCustoError("Por favor, insira um número válido.");
			// alert("Por favor, insira um número válido.");
			setCusto(null as unknown as number);
		} else if (valor <= 0) {
			setCustoError("O custo deve ser maior que zero.");
			// alert("O custo deve ser maior que zero.");
			setCusto(null as unknown as number);
		} else if (valor < LIMITE_MINIMO) {
			setCustoError(`O custo deve ser maior ou igual a ${LIMITE_MINIMO}.`);
			// alert("O custo deve ser menor que o limite minimo definido (0.001).");
			setCusto(null as unknown as number);
		} else if (valor > Number.MAX_SAFE_INTEGER) {
			setCustoError("O valor é muito grande.");
			// alert("O valor é muito grande.");
			setCusto(null as unknown as number);
		} else if (valor < Number.MIN_SAFE_INTEGER) {
			setCustoError("O valor é muito pequeno.");
			setCusto(null as unknown as number);
		} else {
			setCustoError(false);
			setCusto(valor);
		}
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
				<TextField id="idtarefa" label="id" variant="outlined" disabled value={tarefa.id} />
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
				<TextField
					id="idCusto"
					label="Custo"
					variant="outlined"
					type="number"
					defaultValue={""}
					required
					value={custo}
					error={custoError as boolean}
					helperText={custoError}
					onChange={handleCustoChange}
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
					onClick={() => {
						handleTarefa({
							id: tarefa.id,
							nome,
							custo,
							data_limite,
							ordem_apresentacao: tarefa.ordem_apresentacao!,
						});
						setNome(null as unknown as string);
						setCusto(null as unknown as number);
						setDataLimite(DateTime.now().plus({ days: 1 }));
					}}
					style={{ marginRight: "10px" }}
				>
					{options.titulo}
				</Button>
			</Box>
		</Modal>
	);
};

export default ModalAdicionarTarefa;
