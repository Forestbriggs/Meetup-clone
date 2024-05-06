// * Required packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

// * Check if environment is production
const { environment } = require('./config');
const isProduction = environment === 'production';

// * Import routes
const routes = require('./routes');

// * Initialize express app
const app = express();

// * Initialize middlewares ----------------------------------------------------

// * Logs info about requests and responses 
app.use(morgan('dev'));

// * Parse cookies and JSON requests
app.use(cookieParser());
app.use(express.json());

// * Security middleware
if (!isProduction) {
    // * Only enable cors in development
    app.use(cors());
}

// * Sets variety of headers to better secure app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// * Sets _csrf token and creates req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "lax",
            httpOnly: true
        }
    })
);

// * Connect all the routes ----------------------------------------------------

app.use(routes);

// * Error handling ------------------------------------------------------------

// * Catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// * Process sequelize errors
app.use((err, _req, _res, next) => {
    //* check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        };
        err.title = 'Validation error';
        err.errors = errors;
    };
    next(err);
});

// * Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    const errRes = {
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors
    };
    if (!isProduction) {
        errRes.stack = err.stack
    }
    res.json(errRes);
});

module.exports = app;