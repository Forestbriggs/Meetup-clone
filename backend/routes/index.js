// backend/routes/index.js
const express = require('express');
const router = express.Router();

const apiRouter = require('./api');

//* Static routes
//* Serve React build files in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    //* Serve the frontend's index.html file at the root route
    router.get('/', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
        );
    });

    //* Serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve('../frontend/dist')));

    //* Serve the frontend's index.html file at all other routes NOT starting with /API
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
        );
    });
}


// * Development route to add a XSRF-TOKEN cookie
if (process.env.NODE_ENV !== 'production') {
    router.get("/api/csrf/restore", (req, res) => {
        const csrfToken = req.csrfToken();
        res.cookie("XSRF-TOKEN", csrfToken);
        res.status(200).json({
            'XSRF-Token': csrfToken
        });
    });
}

router.use('/api', apiRouter);

module.exports = router;