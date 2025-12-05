FROM node:18

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]