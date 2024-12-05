Projeto HENKAN - Lista compartilhada.

Para a construção do HENKAN foi utilizado Javascript com Node.JS para construção da API, MYSQL como SBGD e Kotlin para a construção do aplicativo para O.S Android. 
A API em Javascript e o banco de dados são gerenciados por meio de Docker Compose. Então para iniciar a aplicação localmente é somente fazer git pull desse repositório e com o Docker instalado em sua máquina, digitar "docker compose up --build", o servidor API rodará na pota 3000 de sua máquina e o servidor do MYSQL na porta 3307.

Bibliotecas utilizadas na API e suas versões:
"@sequelize/mysql": "^7.0.0-alpha.43",
"axios": "^1.7.7",
"express": "^4.21.1",
"mysql2": "^3.11.4",
"sequelize": "^6.37.5"

Versão do Mysql: 8.0.32