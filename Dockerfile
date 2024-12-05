FROM node:22-bullseye

WORKDIR /usr/app

# Copiar apenas os arquivos de dependências primeiro
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Adicionar o script wait-for-it.sh
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/app/wait-for-it.sh

# Dar permissão de execução ao script
RUN chmod +x /usr/app/wait-for-it.sh

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]