/** @format */

const users = {};

export default function userHandlers(io, socket) {
  // извлекаем id команты и имя пользователя из объекта socket
  const { userName, roomId } = socket;

  // инициализируем хранилище пользователей
  if (!users[roomId]) {
    users[roomId] = [];
  }

  // утилита для обновления списка пользователей
  const updateUserList = () => {
    // сообщение получают только пользователи, находящиеся в команте
    io.to(roomId).emit('user_list:update', users[roomId]);
  };

  // обрабатываем подключение нового пользователя
  socket.on('user:add', async (user) => {
    // сообщаем другим пользовтелям об этом
    socket.to(roomId).emit('log', `User ${userName} connected`);
    // Id сокета пользователя
    user.socketId = socket.id;
    // проверяем есть ли в хранилище пользователей, пользователь с таким же ID
    const isExisting = users[roomId].some((usr) => usr.userId === user.userId);
    // записываем пользователя в хранилище
    if (!isExisting) {
      users[roomId].push(user);
    }

    updateUserList();
  });

  // обрабатываем отключение пользователя
  socket.on('disconnect', () => {
    if (!users[roomId]) return;

    socket.emit('log', `User ${userName} disconnected`);

    users[roomId] = users[roomId].filter((u) => u.socketId !== socket.id);

    updateUserList();
  });
}
