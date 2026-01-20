import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET

export const generateToken = (payload) =>  {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);   
     } catch (error) {
        return null;
    }   
}