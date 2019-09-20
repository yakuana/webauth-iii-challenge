const router = require('express').Router();

const db = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
    db.find()
        .then(users => {
            res.json({ users, loggedInUser: req.user.username });
        })
        .catch(error => res.send(error));
});

module.exports = router;
