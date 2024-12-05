import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/userRoute.js';
import listRouter from './routes/listRoute.js';
import productRouter from './routes/productRoute.js';
import userList from './routes/userHasListRoute.js';
import listRequest from './routes/listRequestRoute.js';
import sequelize from './dbConfig.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(express.json());

app.use('/', userRouter);
app.use('/', listRouter);
app.use('/', productRouter);
app.use('/', userList);
app.use('/', listRequest);

io.on('connection', (socket) => {
  console.log('Um usuário se conectou via Socket.IO');

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

export { io };

try {
  await sequelize.authenticate();
  console.log('Conexão estabelecida com sucesso.');
} catch (error) {
  console.error('Não foi possível conectar ao banco de dados:', error);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));
