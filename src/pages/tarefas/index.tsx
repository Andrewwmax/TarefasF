"use client";

import React from "react";
import { DateTime } from "luxon";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Backdrop from "@mui/material/Backdrop";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalEditarTarefa from "@/components/ModalEditar";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import CircularProgress from "@mui/material/CircularProgress";
import ModalAdicionarTarefa from "@/components/ModalAdicionar";

import styles from "./index.module.css";

import { Tarefa } from "@/interfaces/tarefa";

/**
 * A função `getTarefas` é responsável por buscar uma lista de tarefas de um endpoint remoto.
 *
 * Ela faz uma requisição HTTP para a URL "http://localhost:3000/api/list" e verifica se a resposta
 * foi bem-sucedida. Caso contrário, lança um erro com o status e a mensagem da resposta.
 * Após receber os dados, a função verifica se as tarefas retornadas são um array. Se não forem, lança um erro.
 * Para cada tarefa, converte o campo `data_limite` de string para um objeto `DateTime` usando a biblioteca Luxon.
 * A função retorna a lista de tarefas formatadas ou lança um erro caso algum problema ocorra durante o processo.
 *
 * @returns {Promise<Tarefa[]>} Uma promessa que resolve para um array de objetos Tarefa.
 * @throws {Error} Se a resposta da API não for bem-sucedida ou se os dados não forem válidos.
 */
export async function getTarefas() {
	const res = await fetch("http://localhost:3000/api/list");

	if (!res.ok) {
		throw new Error(`Erro ao carregar as tarefas: ${res.status} - ${res.statusText}`);
	}

	const tarefas = await res.json();

	if (!Array.isArray(tarefas)) {
		throw new Error("Erro ao carregar as tarefas: as tarefas não são um array");
	}

	tarefas.forEach((tarefa: Tarefa) => {
		tarefa.data_limite = DateTime.fromJSDate(new Date(tarefa.data_limite as unknown as string));
	});

	// console.log(tarefas);

	return tarefas;
}

/**
 * A função `postTarefa` é responsável por enviar uma requisição HTTP para o endpoint remoto
 * "/api/create" com o método POST e o corpo da requisição com as informações da tarefa a ser adicionada.
 *
 * A função espera como parâmetro um objeto que represente a tarefa a ser adicionada. Ela
 * serializa o objeto para JSON e envia como corpo da requisição. Após enviar a requisição,
 * a função verifica se a resposta foi bem-sucedida. Se sim, ela alerta que a tarefa foi adicionada com
 * sucesso. Caso contrário, ela alerta para o erro ocorrido. Se a resposta não for bem-sucedida,
 * a função também alerta para o erro ocorrido.
 *
 * @param {Tarefa} req Um objeto que represente a tarefa a ser adicionada.
 * @throws {Error} Se a resposta da API não for bem-sucedida ou se os dados não forem válidos.
 */
const postTarefa = async (req: Tarefa) => {
	try {
		const response = await fetch("/api/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...req }),
		});

		if (response.ok) {
			alert("Tarefa adicionada com sucesso!");
		} else {
			const errorData = await response.json();
			alert(errorData.error || "Erro ao adicionar tarefa");
		}
	} catch (error) {
		console.error("Erro ao adicionar tarefa:", error);
	}
};

/**
 * A função `editTarefa` é responsável por enviar uma requisição HTTP para o endpoint remoto
 * "/api/tarefas/{id}" com o método PUT e o corpo da requisição contendo as informações atualizadas
 * da tarefa. Ela espera como parâmetro um objeto que represente a tarefa a ser editada.
 *
 * A função serializa o objeto para JSON e envia como corpo da requisição. Após enviar a requisição,
 * a função verifica se a resposta foi bem-sucedida. Se sim, a tarefa foi atualizada com sucesso.
 * Caso contrário, ela tenta extrair a mensagem de erro da resposta e alerta o erro ocorrido.
 *
 * @param {Tarefa} req Um objeto que represente a tarefa a ser editada, incluindo o ID da tarefa.
 * @throws {Error} Se a resposta da API não for bem-sucedida ou se os dados não forem válidos.
 */
const editTarefa = async (req: Tarefa) => {
	const id = req.id;
	try {
		const response = await fetch(`/api/tarefas/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...req }),
		});

		if (response.ok) {
			alert("Tarefa atualizada com sucesso!");
		} else {
			const errorData = await response.json();
			alert(errorData.error || "Erro ao atualizar tarefa");
		}
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
	}
};

/**
 * A função `deleteTarefa` exclui uma tarefa do banco de dados.
 *
 * Ela espera como parâmetro um objeto que represente a tarefa a ser excluída, incluindo o ID da tarefa.
 * Antes de enviar a requisição, a função pergunta ao usuário se ele tem certeza que deseja excluir a tarefa.
 * Caso o usuário confirme, a função envia uma requisição HTTP para o endpoint remoto
 * "/api/tarefas/{id}" com o método DELETE. Após enviar a requisição, a função verifica se a resposta foi bem-sucedida.
 * Se sim, a tarefa foi excluída com sucesso. Caso contrário, a função alerta o erro ocorrido.
 *
 * @param {Tarefa} req Um objeto que represente a tarefa a ser excluída, incluindo o ID da tarefa.
 * @returns {boolean} true se a tarefa foi excluída com sucesso, false caso contrário.
 * @throws {Error} Se a resposta da API não for bem-sucedida ou se os dados não forem válidos.
 */
const deleteTarefa = async (req: Tarefa) => {
	const confirmed = window.confirm("Tem certeza que deseja excluir esta tarefa?");
	if (!confirmed) return;

	try {
		const response = await fetch(`/api/tarefas/${req.id}`, {
			method: "DELETE",
		});
		console.log(response);
		if (response.status >= 200 && response.status <= 300) {
			return true;
		} else {
			alert("Erro ao excluir a tarefa");
		}
	} catch (error) {
		console.error("Erro ao excluir a tarefa:", error);
		alert("Erro ao excluir a tarefa");
	}
};

/**
 * A função `reordernarTarefas` envia uma requisição para reordenar as tarefas no banco de dados.
 *
 * Ela aceita uma lista de tarefas ordenadas (orderedTasks), um número de ordem de apresentação
 * (ordem_apresentacao), e uma string de ação (action) indicando se a tarefa deve ser movida "up" ou "down".
 * A função mapeia as tarefas para incluir suas IDs e novas ordens de apresentação, e envia
 * essas informações em um corpo JSON para o endpoint "/api/tarefas/reorder" com método POST.
 * Após enviar a requisição, a função faz log da resposta.
 *
 * @param {Tarefa[]} orderedTasks Uma lista de objetos Tarefa ordenados.
 * @param {number} ordem_apresentacao O número da ordem de apresentação da tarefa a ser movida.
 * @param {string} action A ação a ser realizada, "up" para mover para cima ou "down" para mover para baixo.
 */
const reordernarTarefas = async (orderedTasks: Tarefa[], ordem_apresentacao: number, action: string) => {
	const data = orderedTasks.map((tarefa: Tarefa, index: number) => ({
		...tarefa,
		id: tarefa.id,
		ordem_apresentacao: index + 1,
	}));

	// console.log(data);
	/* const response =  */
	await fetch("/api/tarefas/reorder", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ordem_apresentacao: ordem_apresentacao, action: action, data: data }),
	});
};

export default function Home() {
	/* Estados do componente:
	 * openAdicionarModal: booleano que controla o estado de abertura do modal de adicionar tarefa
	 * openEditarModal: booleano que controla o estado de abertura do modal de editar tarefa
	 * openProgress: booleano que controla o estado de abertura do circulo de progresso
	 * tarefas: lista de tarefas
	 * id: identificador da tarefa
	 * nome: nome da tarefa
	 * custo: custo da tarefa
	 * data_limite: data limite da tarefa
	 */
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

	/**
	 * A função `handleCloseProgress` fecha o circulo de progresso.
	 *
	 * Ela é usada para fechar o circulo de progresso quando as tarefas forem carregadas com sucesso.
	 * A função simplemente seta o estado `openProgress` para false.
	 * @returns {void} Nada é retornado.
	 */
	const handleCloseProgress = () => {
		setOpenProgress(false);
	};

	/**
	 * A função `handlePostTarefa` é responsável por adicionar uma nova tarefa.
	 *
	 * Esta função utiliza a função `postTarefa` para enviar uma requisição HTTP
	 * com as informações da nova tarefa para um endpoint remoto. Assim que a requisição
	 * é concluída com sucesso, ela atualiza o estado local com a lista mais recente de tarefas
	 * através da função `getTarefas` e fecha o modal de adição de tarefas.
	 *
	 * @param {Tarefa} req - Um objeto que representa a tarefa a ser adicionada.
	 * @returns {void} Nada é retornado.
	 */
	const handlePostTarefa = async (req: Tarefa) => {
		await postTarefa(req);
		setTarefas(await getTarefas());
		handleCloseAdicionarModal();
	};
	/**
	 * A função `handleClickEditTarefa` é responsável por editar uma tarefa existente.
	 *
	 * Esta função utiliza a função `editTarefa` para enviar uma requisição HTTP
	 * com as informações atualizadas da tarefa para um endpoint remoto. Assim que a requisição
	 * é concluída com sucesso, ela atualiza o estado local com a lista mais recente de tarefas
	 * através da função `getTarefas` e fecha o modal de edição de tarefas.
	 *
	 * @param {Tarefa} req - Um objeto que representa a tarefa a ser editada.
	 * @returns {void} Nada é retornado.
	 */
	const handleClickEditTarefa = async (req: Tarefa) => {
		await editTarefa(req);
		setTarefas(await getTarefas());
		handleCloseEditarModal();
	};

	/**
	 * A função `handleClickDeleteTarefa` exclui uma tarefa existente.
	 *
	 * Esta função utiliza a função `deleteTarefa` para enviar uma requisição HTTP
	 * para excluir uma tarefa no endpoint remoto. Assim que a requisição
	 * é concluída com sucesso, ela atualiza o estado local com a lista mais recente de tarefas
	 * através da função `getTarefas` e fecha o modal de edição de tarefas.
	 *
	 * @param {Tarefa} req - Um objeto que representa a tarefa a ser excluída.
	 * @returns {void} Nada é retornado.
	 */
	const handleClickDeleteTarefa = async (req: Tarefa) => {
		const deleted = await deleteTarefa(req);
		if (!deleted) return;
		setTarefas(await getTarefas());
		handleCloseEditarModal();
	};

	/**
	 * A função `handleMoveUp` move uma tarefa para cima na lista de tarefas.
	 *
	 * Ela procura a tarefa com o ID passado como parâmetro na lista de tarefas e, se a tarefa estiver na segunda
	 * posição ou acima, ela move a tarefa para cima na lista. Ela reordena as tarefas na lista de tarefas e envia
	 * uma requisição HTTP para o endpoint "/api/tarefas/reorder" com o método POST para atualizar a ordem de
	 * apresentação das tarefas no banco de dados. Após enviar a requisição, a função atualiza o estado local
	 * com a lista mais recente de tarefas.
	 *
	 * @param {number} id - O ID da tarefa a ser movida para cima.
	 * @returns {void} Nada é retornado.
	 */
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

	/**
	 * A função `handleMoveDown` move uma tarefa para baixo na lista de tarefas.
	 *
	 * Ela procura a tarefa com o ID passado como parâmetro na lista de tarefas e, se a tarefa estiver na penúltima
	 * posição ou acima, ela move a tarefa para baixo na lista. Ela reordena as tarefas na lista de tarefas e envia
	 * uma requisição HTTP para o endpoint "/api/tarefas/reorder" com o método POST para atualizar a ordem de
	 * apresentação das tarefas no banco de dados. Após enviar a requisição, a função atualiza o estado local
	 * com a lista mais recente de tarefas.
	 *
	 * @param {number} id - O ID da tarefa a ser movida para baixo.
	 * @returns {void} Nada é retornado.
	 */
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

	/**
	 * A função `getMaxId` retorna o maior ID dentre as tarefas informadas acrescido de 1.
	 *
	 * Se a lista de tarefas estiver vazia, a função retorna 1.
	 *
	 * @param {Tarefa[]} tarefas - A lista de tarefas.
	 * @returns {number} O maior ID dentre as tarefas informadas acrescido de 1.
	 */
	const getMaxId = (tarefas: Tarefa[]) => {
		return tarefas.length > 0 ? Math.max(...tarefas.map((tarefa) => tarefa.id || 0)) + 1 : 1;
	};

	/**
	 * A função `getMaxOrdem` retorna o maior valor de ordem de apresentação dentre as tarefas informadas
	 * acrescido de 1.
	 *
	 * Se a lista de tarefas estiver vazia, a função retorna 1.
	 *
	 * @param {Tarefa[]} tarefas - A lista de tarefas.
	 * @returns {number} O maior valor de ordem de apresentação dentre as tarefas informadas acrescido de 1.
	 */
	const getMaxOrdem = (tarefas: Tarefa[]) => {
		return tarefas.length > 0 ? Math.max(...tarefas.map((tarefa) => tarefa.ordem_apresentacao || 0)) + 1 : 1;
	};

	/**
	 * 1. para buscar a lista de tarefas assim que o componente é montado;
	 */
	React.useEffect(() => {
		getTarefas().then((tarefas) => {
			setTarefas(tarefas);
			setId(getMaxId(tarefas));
			setOrdemApresentacao(getMaxOrdem(tarefas));
			setOpenProgress(false);
		});
	}, []);

	/*
	 * 2. para atualizar o estado local com a tarefa selecionada quando o modal de edição é aberto.
	 */
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
			{/* Circulo de progresso, para não exibir a lista em carregamento */}
			{openProgress && (
				<div>
					<Backdrop
						sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
						open={openProgress}
						onClick={handleCloseProgress}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</div>
			)}
			{/* componente principal, para mostrar a lista de tarefas */}
			{!openProgress && (
				<>
					{/* Titulo */}
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
							{/* Cabeçalho da lista */}
							<Typography variant="h5">Id</Typography>
							<Typography variant="h5">Nome</Typography>
							<Typography variant="h5">Custo</Typography>
							<Typography variant="h5">Data Limite</Typography>
							<Typography variant="h5">Ações</Typography>
						</div>
						{tarefas.map((tarefa: Tarefa) => (
							/* Lista de tarefas, retirada de um array e construida de forma dinâmica em itens separados */
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
								{/* Acoes da tarefa, editação e exclusão, ordenação */}
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
					{/* Modal para adicionar e editar tarefas,
					 * separados para melhor legibilidade do código,
					 * mas com o mesmo comportamento, é possivel
					 * incorpora-los em um único componente reutilizavel. */}
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
