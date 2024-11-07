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
	const [nome, setNome] = React.useState<string>("");
	const [custo, setCusto] = React.useState<number>(0);
	const [data_limite, setDataLimite] = React.useState<DateTime>(DateTime.now().plus({ days: 1 }));

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
				<TextField id="idtarefa" label="id" variant="outlined" disabled value={tarefa.id} />
				<br />
				<TextField
					id="idnome"
					label="Nome"
					variant="outlined"
					required
					value={nome}
					onChange={(e) => setNome(e.target.value)}
				/>
				<br />
				<TextField
					id="idCusto"
					label="Custo"
					variant="outlined"
					type="number"
					required
					value={custo}
					onChange={(e) => setCusto(Number(e.target.value))}
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
						setNome("");
						setCusto(0);
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
