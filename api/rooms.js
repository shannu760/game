// Simple in-memory/serverless room state for Vercel
const activeRooms = [
  { id: 'ARENA1', name: 'Alpha Arena', players: 3, maxPlayers: 8, game: 'Quickdraw' },
  { id: 'ARENA2', name: 'Neon Thunder', players: 2, maxPlayers: 8, game: 'Quickdraw' },
  { id: 'ARENA3', name: 'Cyber Reflex', players: 5, maxPlayers: 8, game: 'Quickdraw' },
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, maxPlayers } = req.body || {};
    const newRoom = {
      id: Math.random().toString(36).substring(2, 7).toUpperCase(),
      name: name || 'Custom Arena',
      players: 1,
      maxPlayers: maxPlayers || 8,
      game: 'Quickdraw',
      created_at: new Date().toISOString()
    };
    activeRooms.push(newRoom);
    return res.status(201).json({ success: true, room: newRoom });
  }

  res.status(200).json({ success: true, rooms: activeRooms });
}
