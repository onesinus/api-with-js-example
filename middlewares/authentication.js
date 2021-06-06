const { verifyToken } = require("../helpers/jwt");
const authentication = (req, res, next) => {
    const token = req.get("token");
    if (token && verifyToken(token)) {
        next();
    }else {
    	res.status(401).json({ err_msg: 'You are forbidden to access' });
    }
}

module.exports = authentication;