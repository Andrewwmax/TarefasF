-- CreateTable
CREATE TABLE "Tarefas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "custo" DECIMAL(65,30) NOT NULL,
    "data_limite" TIMESTAMP(3) NOT NULL,
    "ordem_apresentacao" INTEGER NOT NULL,

    CONSTRAINT "Tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tarefas_nome_key" ON "Tarefas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Tarefas_ordem_apresentacao_key" ON "Tarefas"("ordem_apresentacao");
