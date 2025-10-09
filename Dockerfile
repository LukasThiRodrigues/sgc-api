FROM node:22-alpine

WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

RUN npm install -g ts-node

# Copia TODO o código fonte
COPY . .

# COMPILA o TypeScript para JavaScript
RUN npm run build

EXPOSE 3000

# Agora executa o código compilado
CMD ["node", "dist/main.js"]