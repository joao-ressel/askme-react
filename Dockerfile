# Etapa 1: Construir a aplicação
FROM node:23-slim

# Passo 2: Definir o diretório de trabalho dentro do container
WORKDIR /app

# Passo 3: Copiar os arquivos de dependências para o container
COPY package*.json ./

# Passo 4: Instalar as dependências
RUN npm install --legacy-peer-deps

# Passo 5: Copiar o restante dos arquivos do projeto para o container
COPY . .

# Passo 6: Compilar o projeto (para produção, se necessário)
RUN npm run build

# Passo 7: Expôr a porta que o Vite usa por padrão
EXPOSE 5173

# Passo 8: Definir o comando para rodar o aplicativo em desenvolvimento
CMD ["npm", "run", "dev"]
