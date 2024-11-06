# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo de dependências e instale
COPY package.json package-lock.json ./
RUN npm install --force

# Copie o restante do código do projeto
COPY . .

# Build do Next.js
RUN npm run build --force

# Porta exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
