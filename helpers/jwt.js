const jwt = require('jsonwebtoken');

const privateKey = process.env.JWT_SECRET_KEY;
const generateToken = (data) => {
    const token = jwt.sign(data, privateKey);
    return token;
}

const verifyToken = (token) => {
    return jwt.verify(token, privateKey);
}

module.exports = {
    generateToken, 
    verifyToken
}