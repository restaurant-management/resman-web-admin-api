import { Server } from 'http';
import Socket from 'socket.io';

export const createSocket = (app: Server) => {
    const io = Socket(app);

    io.on('connection', (socket) => {
        socket.emit('news', { hello: 'world' });
        socket.on('hello', (data) => {
            console.log(data);
        });
    });
};
