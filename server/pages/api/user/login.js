// pages/api/user/login.js
import pool from '../../../db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id, password } = req.body;

      const query = `
        SELECT * FROM users WHERE id = ? AND password = ?;
      `;

      const [users] = await pool.query(query, [id, password]);

      if (users.length > 0) {
        const user = users[0];
        // JWT 시크릿과 옵션 설정. 환경변수로부터 JWT_SECRET을 로드하는 것이 안전합니다.
        const secretKey = process.env.JWT_SECRET;

        const token = jwt.sign({ id: user.id, point: user.point }, secretKey, { expiresIn: '2h' });

        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Login failed' });
      }
    } catch (error) {
      console.error('Error during user login', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
