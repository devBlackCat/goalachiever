// pages/api/point/check.js
import pool from '../../../db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '인증 토큰이 없습니다.' });
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const [rows] = await pool.query('SELECT point FROM users WHERE id = ?', [userId]);
      if (rows.length > 0) {
        const currentPoints = rows[0].point;
        res.status(200).json({ points: currentPoints });
      } else {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('포인트 조회 중 오류 발생:', error);
      res.status(500).json({ message: '서버 오류', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
