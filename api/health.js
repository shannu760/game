export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    message: 'NEXORA Backend API running on Vercel',
    timestamp: new Date().toISOString(),
    database: 'active'
  });
}
