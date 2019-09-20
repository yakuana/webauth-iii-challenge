const jwt = require('jsonwebtoken');

const secrets = require('../config/secret.js'); 

const verify = (req, res, next) => {

    // get the user's token 
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if (err) {
                // token expired or is invalid
                res.status(401).json({ message: 'You shall not pass!' });
            } else {
                // token is good 
                req.user = { username: decodedToken.username };
                next();
            }
        });
    } else {
        res.status(400).json({ message: 'no credentials provided' });
    }
};

module.exports = verify; 
