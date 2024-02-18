// pages/api/minus.js
import pool from '../../../db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 요청 헤더에서 JWT 토큰을 추출합니다.
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }
      const token = authHeader.split(' ')[1];
      
      // 토큰 검증 및 디코딩
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const pointsToDeduct = req.body.pointsToDeduct;

      // users 테이블에서 사용자의 현재 포인트를 조회합니다.
      const [rows] = await pool.query('SELECT point FROM users WHERE id = ?', [userId]);
      if (rows.length > 0) {
        const currentPoints = rows[0].point;

        // 계산된 새 포인트 값이 음수가 아닌지 확인합니다.
        if (currentPoints - pointsToDeduct >= 0) {
          // 새 포인트 값으로 users 테이블을 업데이트합니다.
          const [updateResult] = await pool.query('UPDATE users SET point = point - ? WHERE id = ?', [pointsToDeduct, userId]);

          // 토큰에서 포인트 정보를 업데이트합니다.
          const newPayload = {
            ...decoded,
            point: currentPoints - pointsToDeduct,
            exp: decoded.exp 
          };

          // 새로운 JWT를 생성합니다.
          const newToken = jwt.sign(
            newPayload, 
            process.env.JWT_SECRET,
           
          );
          
          // 성공적으로 포인트가 감소된 경우 응답을 보냅니다.
          res.status(200).json({ 
            message: 'Points updated successfully',
            newToken, 
            newPoint: currentPoints - pointsToDeduct
          });
        } else {
          // 포인트가 부족한 경우
          res.status(400).json({ message: 'Not enough points' });
        }
      } else {
        // 사용자 ID에 해당하는 레코드가 없는 경우
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Token decode/verify error', error);
      if (error instanceof jwt.JsonWebTokenError) {
        // JWT 관련 에러 처리
        res.status(401).json({ message: 'Invalid or expired token', error: error.message });
      } else {
        // 기타 에러 처리
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    }
  } else {
    // POST 요청이 아닌 경우
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
