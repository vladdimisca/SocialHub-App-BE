const jwt = require('jsonwebtoken');
const Config = require('../env/Config');

module.exports.generateToken = (key) => {
    const token = jwt.sign({ uuid: key }, Config.jwtSecretKey, { expiresIn: Config.jwtExpireTime });
    return token;
}

module.exports.verifyToken = (token) => {
    let uuid;

    jwt.verify(token, Config.jwtSecretKey, (err, decoded) => {
        if(err){
            throw err;
        }
        uuid =  decoded.uuid;
    });

    return uuid;
}