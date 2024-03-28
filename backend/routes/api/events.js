const express = require('express');

const { getAllEvents } = require('../../utils/events.js');
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//* Middleware -----------------------------------------------------------------



//* Routes ---------------------------------------------------------------------

router.get('/', getAllEvents);


module.exports = router;