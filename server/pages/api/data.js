// pages/api/data.js
import connection from '../../db';

export default async function handler(req, res) {
  try {
    const [rows, fields] = await connection.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error during database query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

