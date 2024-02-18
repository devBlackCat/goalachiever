import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 요청 헤더에서 토큰 추출
      const token = req.headers.authorization?.split(' ')[1]; // Bearer 토큰 분리
      if (!token) return res.status(401).json({ message: 'Token is required' });

      // .env 또는 다른 설정 파일에서 비밀 키를 로드
      const SECRET_KEY = process.env.JWT_SECRET;



      // 토큰 검증
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token is invalid' });

        // 토큰이 유효한 경우, 성공 응답 전송
        res.status(200).json({ message: 'Token is valid', decoded });
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // POST 요청이 아닌 경우
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}