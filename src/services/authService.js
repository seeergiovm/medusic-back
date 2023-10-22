import jwt from 'jsonwebtoken';

const secretKey = 'd33d39177bb7e0d63657463798d4e7eb3e11b1e20656a646cfb110e1d453e466';

export function generateToken(idUsuario) {
  const token = jwt.sign({ idUsuario }, secretKey, { expiresIn: '5h' });
  return token;
}

export default generateToken;