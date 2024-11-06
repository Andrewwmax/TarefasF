import { PrismaClient } from "@prisma/client";

/* instanciação do PrismaClient, ORM para o manipular o banco de dados PostgreSQL */
const prisma = new PrismaClient();
export default prisma;
