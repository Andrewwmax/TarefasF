"use client";

import React from "react";
import { DateTime } from "luxon";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ModalAdicionarTarefa from "@/components/ModalAdicionar";

// import router from "next/router";

import styles from "./index.module.css";

import { Tarefa } from "@/interfaces/tarefa";
import ModalEditarTarefa from "@/components/ModalEditar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export async function getTarefas() {
	const res = await fetch("http://localhost:3000/api/list");

	if (!res.ok) {
		throw new Error(`Erro ao carregar as tarefas: ${res.status} - ${res.statusText}`);
	}

	const tarefas = await res.json();

	if (!Array.isArray(tarefas)) {
		throw new Error("Erro ao carregar as tarefas: as tarefas não são um array");
	}

	console.log(tarefas);

	tarefas.forEach((tarefa: Tarefa) => {
		tarefa.data_limite = DateTime.fromJSDate(new Date(tarefa.data_limite as unknown as string));
	});

	console.log(tarefas);

	return tarefas;
}

const postTarefa = async (req: Tarefa /* , e: React.FormEvent */) => {
	/* e.preventDefault(); */

	try {
		const response = await fetch("/api/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...req }),
		});

		if (response.ok) {
			// router.push("/");
			alert("Tarefa adicionada com sucesso!");
		} else {
			const errorData = await response.json();
			alert(errorData.error || "Erro ao adicionar tarefa");
		}
	} catch (error) {
		console.error("Erro ao adicionar tarefa:", error);
	}
};

const editTarefa = async (req: Tarefa /* , e: React.FormEvent */) => {
	const id = req.id;
	try {
		const response = await fetch(`/api/tarefas/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...req }),
		});

		if (response.ok) {
			// router.push("/");
			alert("Tarefa atualizada com sucesso!");
		} else {
			const errorData = await response.json();
			alert(errorData.error || "Erro ao atualizar tarefa");
		}
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
	}
};

const deleteTarefa = async (req: Tarefa) => {
	const confirmed = window.confirm("Tem certeza que deseja excluir esta tarefa?");
	if (!confirmed) return;

	try {
		const response = await fetch(`/api/tarefas/${req.id}`, {
			method: "DELETE",
		});

		if (response.ok) {
			return true;
			// setTarefas(tarefas.filter((tarefa) => tarefa.id !== req.id));
		} else {
			alert("Erro ao excluir a tarefa");
		}
	} catch (error) {
		console.error("Erro ao excluir a tarefa:", error);
		alert("Erro ao excluir a tarefa");
	}
};

const reordernarTarefas = async (orderedTasks: Tarefa[], ordem_apresentacao: number, action: string) => {
	const data = orderedTasks.map((tarefa: Tarefa, index: number) => ({
		...tarefa,
		id: tarefa.id,
		ordem_apresentacao: index + 1,
	}));

	const response = await fetch("/api/tarefas/reorder", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ordem_apresentacao: ordem_apresentacao, action: action, data: data }),
	});
	console.log(response);
};

export default function Home() {
	const [openAdicionarModal, setOpenAdicionarModal] = React.useState(false);
	const [openEditarModal, setOpenEditarModal] = React.useState(false);
	const [openProgress, setOpenProgress] = React.useState(true);
	const [tarefas, setTarefas] = React.useState<Tarefa[]>([]);

	const [id, setId] = React.useState<number>(0);
	const [nome, setNome] = React.useState<string>("");
	const [custo, setCusto] = React.useState<number>(0);
	const [data_limite, setDataLimite] = React.useState<DateTime>(DateTime.now().plus({ days: 1 }));
	const [ordem_apresentacao, setOrdemApresentacao] = React.useState<number>(0);

	const handleOpenAdicionarModal = () => setOpenAdicionarModal(true);
	const handleCloseAdicionarModal = () => setOpenAdicionarModal(false);
	const handleOpenEditarModal = () => setOpenEditarModal(true);
	const handleCloseEditarModal = () => setOpenEditarModal(false);

	const handleCloseProgress = () => {
		setOpenProgress(false);
	};

	const handlePostTarefa = async (req: Tarefa) => {
		await postTarefa(req);
		setTarefas(await getTarefas());
		handleCloseAdicionarModal();
	};

	const handleClickEditTarefa = async (req: Tarefa) => {
		await editTarefa(req);
		setTarefas(await getTarefas());
		handleCloseEditarModal();
	};

	const handleClickDeleteTarefa = async (req: Tarefa) => {
		const deleted = await deleteTarefa(req);
		if (!deleted) return;
		setTarefas(await getTarefas());
		handleCloseEditarModal();
	};

	const handleMoveUp = async (id: number) => {
		const index = tarefas.findIndex((t) => t.id === id);
		if (index > 0) {
			const reorderedTasks = [...tarefas];
			[reorderedTasks[index - 1], reorderedTasks[index]] = [reorderedTasks[index], reorderedTasks[index - 1]];
			[reorderedTasks[index - 1].ordem_apresentacao, reorderedTasks[index].ordem_apresentacao] = [
				reorderedTasks[index].ordem_apresentacao,
				reorderedTasks[index - 1].ordem_apresentacao,
			];

			await reordernarTarefas(reorderedTasks, reorderedTasks[index].ordem_apresentacao, "up");
			setTarefas(reorderedTasks);
		}
	};

	const handleMoveDown = async (id: number) => {
		const index = tarefas.findIndex((t) => t.id === id);
		if (index < tarefas.length - 1) {
			const reorderedTasks = [...tarefas];
			[reorderedTasks[index + 1], reorderedTasks[index]] = [reorderedTasks[index], reorderedTasks[index + 1]];
			[reorderedTasks[index + 1].ordem_apresentacao, reorderedTasks[index].ordem_apresentacao] = [
				reorderedTasks[index].ordem_apresentacao,
				reorderedTasks[index + 1].ordem_apresentacao,
			];
			await reordernarTarefas(reorderedTasks, reorderedTasks[index].ordem_apresentacao, "down");
			setTarefas(reorderedTasks);
		}
	};

	// const updateOrder = async (orderedTasks: Tarefa[]) => {
	// 	await fetch("/api/tarefas/reorder", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify(
	// 			orderedTasks.map((tarefa: Tarefa, index: number) => ({ id: tarefa.id, ordem_apresentacao: index + 1 }))
	// 		),
	// 	});
	// };

	const getMaxId = (tarefas: Tarefa[]) => {
		return tarefas.length > 0 ? Math.max(...tarefas.map((tarefa) => tarefa.id || 0)) + 1 : 1;
	};

	const getMaxOrdem = (tarefas: Tarefa[]) => {
		return tarefas.length > 0 ? Math.max(...tarefas.map((tarefa) => tarefa.ordem_apresentacao || 0)) + 1 : 1;
	};

	/*
	 * Carregamento inicial dos dados já no banco
	 */
	React.useEffect(() => {
		getTarefas().then((tarefas) => {
			setTarefas(tarefas);
			setId(getMaxId(tarefas));
			setOrdemApresentacao(getMaxOrdem(tarefas));
			setOpenProgress(false);
		});
	}, []);

	React.useEffect(() => {
		if (openEditarModal) {
			const tarefa = tarefas.find((tarefa) => tarefa.id === id);
			if (tarefa) {
				setNome(tarefa.nome);
				setCusto(tarefa.custo);
				setDataLimite(tarefa.data_limite);
				setOrdemApresentacao(tarefa.ordem_apresentacao);
			}
		}
	}, [id, openEditarModal, tarefas]);

	return (
		<div className={styles.page}>
			{openProgress && (
				<div>
					{/* <Button onClick={handleOpenProgress}>Show backdrop</Button> */}
					<Backdrop
						sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
						open={openProgress}
						onClick={handleCloseProgress}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</div>
			)}
			{!openProgress && (
				<>
					<div className={styles.title}>Lista de Tarefas</div>
					<div className={styles.tarefas}>
						<div
							className={styles.tarefa}
							style={{
								padding: "10px",
								marginBottom: "10px",
								border: "2px solid #ddd",
								boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
								backgroundColor: "#eee",
							}}
						>
							<Typography variant="h5">Id</Typography>
							<Typography variant="h5">Nome</Typography>
							<Typography variant="h5">Custo</Typography>
							<Typography variant="h5">Data Limite</Typography>
							<Typography variant="h5">Ações</Typography>
							<Typography variant="h5">Ordem</Typography>
						</div>
						{tarefas.map((tarefa: Tarefa) => (
							<div
								className={styles.tarefa}
								key={tarefa.id}
								style={{
									padding: "4px",
									marginBottom: "4px",
									backgroundColor: tarefa.custo >= 1000 ? "#ffa50075" : "#FFFFFF99",
									border: "1px solid #ddd",
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
								}}
							>
								<Typography variant="h6">{tarefa.id}</Typography>
								<Typography variant="h6">{tarefa.nome}</Typography>
								<Typography variant="body1">R$ {tarefa.custo}</Typography>
								<Typography variant="body1">
									{tarefa.data_limite.setLocale("br").toFormat("DDDD")}
								</Typography>
								<Stack direction="row" spacing={0}>
									<IconButton
										aria-label="edit"
										size="medium"
										color="warning"
										onClick={() => {
											setId(tarefa.id!);
											setNome(tarefa.nome);
											setCusto(tarefa.custo);
											setDataLimite(tarefa.data_limite);
											// setOrdemApresentacao(tarefa.ordem_apresentacao);
											handleOpenEditarModal();
										}}
									>
										<EditIcon fontSize="inherit" />
									</IconButton>
									<IconButton
										aria-label="delete"
										size="medium"
										color="error"
										onClick={() => handleClickDeleteTarefa(tarefa)}
									>
										<DeleteIcon fontSize="inherit" />
									</IconButton>
									<IconButton
										aria-label="edit"
										size="medium"
										color="success"
										onClick={() => handleMoveUp(tarefa.id!)}
									>
										<ArrowUpward fontSize="inherit" />
									</IconButton>
									<IconButton
										aria-label="delete"
										size="medium"
										color="secondary"
										onClick={() => handleMoveDown(tarefa.id!)}
									>
										<ArrowDownward fontSize="inherit" />
									</IconButton>
								</Stack>
								<Typography variant="h6">{tarefa.ordem_apresentacao}</Typography>
							</div>
						))}
					</div>
					<div>
						<Button
							variant="outlined"
							onClick={() => {
								setId(getMaxId(tarefas));
								setNome("");
								setCusto(0);
								setDataLimite(DateTime.now().plus({ days: 1 }));
								handleOpenAdicionarModal();
							}}
						>
							Adicionar
						</Button>
					</div>

					<ModalAdicionarTarefa
						open={openAdicionarModal}
						options={{ titulo: "Adicionar" }}
						tarefa={{
							id: id,
							ordem_apresentacao: ordem_apresentacao,
						}}
						onClose={handleCloseAdicionarModal}
						handleTarefa={handlePostTarefa}
					/>
					<ModalEditarTarefa
						open={openEditarModal}
						options={{ titulo: "Editar" }}
						id={id}
						nome={nome}
						custo={custo}
						data_limite={data_limite}
						ordem_apresentacao={ordem_apresentacao}
						setCusto={setCusto}
						setNome={setNome}
						setDataLimite={setDataLimite}
						onClose={handleCloseEditarModal}
						handleTarefa={handleClickEditTarefa}
					/>
				</>
			)}
		</div>
	);
}
