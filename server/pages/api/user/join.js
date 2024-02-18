// pages/api/user/join.js
import pool from '../../../db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id, password, age, gender, email } = req.body;

      const query = `
        INSERT INTO users (id, password, age, gender, email, point)
        VALUES (?, ?, ?, ?, ?, 0);
      `;

      await pool.query(query, [id, password, age, gender, email]);

      // 성공 메시지만 전송
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error during user registration', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
