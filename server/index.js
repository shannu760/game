import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { z } from 'zod';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const RoomSchema = z.object({
  id: z.string(),
  players: z.array(z.object({
    id: z.string(),
    username: z.string(),
    avatar: z.string(),
    reactionTime: z.number().optional(),
  })),
  state: z.enum(['waiting', 'countdown', 'go', 'results']),
  startTime: z.number().optional(),
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('room:join', ({ roomId, player }) => {
    let room = rooms.get(roomId);
    if (!room) {
      room = { id: roomId, players: [], state: 'waiting', startTime: null };
      rooms.set(roomId, room);
    }

    if (room.players.length >= 8) {
      socket.emit('error', 'Room full');
      return;
    }

    const newPlayer = { id: socket.id, ...player };
    room.players.push(newPlayer);
    socket.join(roomId);

    io.to(roomId).emit('room:state', room);
    console.log(`${player.username} joined ${roomId}`);
  });

  socket.on('room:start', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || room.players.length < 2) return;

    room.state = 'countdown';
    io.to(roomId).emit('room:state', room);

    // Random delay between 2 and 5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    setTimeout(() => {
      room.state = 'go';
      room.startTime = Date.now();
      io.to(roomId).emit('room:state', room);
    }, delay);
  });

  socket.on('game:click', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (room.state === 'countdown') {
      player.reactionTime = -1; // False start
    } else if (room.state === 'go') {
      player.reactionTime = Date.now() - room.startTime;
    }

    io.to(roomId).emit('room:state', room);

    // End round if everyone clicked
    if (room.players.every(p => p.reactionTime !== undefined)) {
      room.state = 'results';
      io.to(roomId).emit('room:state', room);
    }
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.players.find(p => p.id === socket.id)) {
        room.players = room.players.filter(p => p.id !== socket.id);
        io.to(roomId).emit('room:state', room);
        if (room.players.length === 0) rooms.delete(roomId);
      }
    });
  });
});

const PORT = 3001;
app.get('/', (req, res) => {
  res.send('NEXORA Server is up and running');
});

httpServer.listen(PORT, () => {
  console.log(`NEXORA Server running on port ${PORT}`);
});
