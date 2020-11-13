const bcrypt = require('bcryptjs');

const hash = (plainPassword) => {
    const salt = bcrypt.genSaltSync(Number(process.env.TOTAL_SALT) || 9);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
}

const compare = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
    hash, 
    compare
}