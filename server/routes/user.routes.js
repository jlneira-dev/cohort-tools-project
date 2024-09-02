const router = require('express').Router();

const User = require('../models/User.model');

router.get("/users/:userId", (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
        .then((user) => res.json(user))
        .catch(error => next(error));
});

module.exports = router;