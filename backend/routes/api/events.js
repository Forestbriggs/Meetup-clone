const express = require('express');

const { getAllEvents, getEventDetailsByEventId } = require('../../utils/events.js');
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//* Middleware -----------------------------------------------------------------



//* Routes ---------------------------------------------------------------------

router.get('/:eventId', getEventDetailsByEventId)

router.get('/', getAllEvents);


module.exports = router;