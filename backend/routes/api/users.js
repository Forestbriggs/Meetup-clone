const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const router = express.Router();

//* Middleware -----------------------------------------------------------------
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Username is required')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more'),
    handleValidationErrors
];

//* Routes ---------------------------------------------------------------------
//* Sign Up
router.post('/', validateSignup, async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    const errors = {}
    const userEmailExists = await User.findOne({ where: { email } });
    const userUsernameExists = await User.findOne({ where: { username } });

    if (userEmailExists) {
        // const err = new Error("User already exists");
        // err.errors = { email: 'User with that email already exists' };
        // return next(err);
        const err = 'User with that email already exists';
        errors.email = err;
    }


    if (userUsernameExists) {
        // const err = new Error("User already exists");
        // err.errors = { username: 'User with that username already exists' };
        // return next(err);
        const err = 'User with that username already exists';
        errors.username = err;
    }

    if (Object.values(errors).length) {
        const err = new Error('User already exists');
        err.errors = errors;
        return next(err);
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword
    });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

module.exports = router;
