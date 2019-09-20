const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../users/users-model.js');
const secrets = require('../config/secret.js'); 

router.post('/register', (req, res) => {
    // get object from req.body
    let user = req.body;

    // make hash of user's password 
    const hash = bcrypt.hashSync(user.password, 10);

    // set user pasword to its hash 
    user.password = hash;

    db.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json({
                message: "Could not add user.",
                error: error 
            });
        });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            // create user token 
            const token = generateToken(user);

            // send back the user's token in an object 
            res.status(200).json({ token });
        } else {
            // incorrect password  
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    })
    .catch(error => {
        // no user with that name 
        res.status(500).json({
            message: 'An error has occured', 
            error: error
        });
    });
});

// create a token using the user's info 
function generateToken(user) {
    const payload = {
        username: user.username,
    };
    const options = {
        expiresIn: '1d',
    };
    // bring in the secret from the secrets file
    return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
