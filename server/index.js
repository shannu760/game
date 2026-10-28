import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { z } from 'zod';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

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
      try {
        db.prepare('INSERT OR IGNORE INTO rooms (id, game_type, status) VALUES (?, ?, ?)').run(roomId, 'quickdraw', 'waiting');
      } catch (err) {
        console.warn('DB error saving room:', err.message);
      }
    }

    if (room.players.length >= 8) {
      socket.emit('error', 'Room full');
      return;
    }

    const newPlayer = { id: socket.id, ...player };
    room.players.push(newPlayer);
    socket.join(roomId);

    try {
      db.prepare(`
        INSERT INTO profiles (id, display_name, avatar)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, avatar = excluded.avatar
      `).run(socket.id, player.username || 'Rival', player.avatar || 'av1');
    } catch (err) {
      console.warn('DB error saving profile:', err.message);
    }

    io.to(roomId).emit('room:state', room);
    console.log(`${player.username || 'Player'} joined ${roomId}`);
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

      try {
        const matchId = 'match_' + Date.now();
        const sorted = [...room.players].sort((a, b) => {
          const timeA = a.reactionTime < 0 ? 99999 : a.reactionTime;
          const timeB = b.reactionTime < 0 ? 99999 : b.reactionTime;
          return timeA - timeB;
        });
        const winner = sorted[0];

        db.prepare('INSERT INTO matches (id, room_id, winner_id, ended_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)')
          .run(matchId, roomId, winner?.id || null);

        const insertResult = db.prepare(`
          INSERT INTO match_results (match_id, profile_id, reaction_time, rank, xp_earned)
          VALUES (?, ?, ?, ?, ?)
        `);

        sorted.forEach((p, idx) => {
          const rank = idx + 1;
          const xp = rank === 1 ? 50 : rank === 2 ? 30 : 15;
          insertResult.run(matchId, p.id, p.reactionTime, rank, xp);
          db.prepare('UPDATE profiles SET xp = xp + ? WHERE id = ?').run(xp, p.id);
        });
      } catch (err) {
        console.warn('DB match recording error:', err.message);
      }
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

app.get('/', (req, res) => {
  res.send('NEXORA Server is up and running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/leaderboard', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.id, p.display_name AS username, p.avatar, p.xp, p.level,
             MIN(CASE WHEN r.reaction_time > 0 THEN r.reaction_time ELSE NULL END) AS best_reaction
      FROM profiles p
      LEFT JOIN match_results r ON p.id = r.profile_id
      GROUP BY p.id
      ORDER BY p.xp DESC, best_reaction ASC
      LIMIT 10
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`NEXORA Server running on port ${PORT}`);
});
