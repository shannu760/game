export default function handler(req, res) {
  const topPlayers = [
    { rank: 1, username: 'FlashGod', xp: 12500, best: '142ms', avatar: 'av5' },
    { rank: 2, username: 'ZenReflex', xp: 11200, best: '158ms', avatar: 'av2' },
    { rank: 3, username: 'CyberSlayer', xp: 9800, best: '170ms', avatar: 'av1' },
    { rank: 4, username: 'Neo', xp: 8400, best: '188ms', avatar: 'av3' },
    { rank: 5, username: 'Void', xp: 7200, best: '195ms', avatar: 'av4' },
    { rank: 6, username: 'ShadowStrike', xp: 6800, best: '205ms', avatar: 'av6' },
  ];

  res.status(200).json({
    success: true,
    data: topPlayers
  });
}
