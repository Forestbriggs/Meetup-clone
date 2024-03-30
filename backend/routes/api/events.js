const express = require('express');

const { getAllEvents, getEventDetailsByEventId,
    addImageToEventByEventId, editEventById, deleteEventById } = require('../../utils/events.js');
const { getAttendeesByEventId } = require('../../utils/attendees.js');
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//* Middleware -----------------------------------------------------------------

const validateEventBody = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In person'])
        .withMessage('Type must be Online or In person'),
    check('capacity')
        .exists({ checkFalsy: true })
        .isInt(true)
        .withMessage('Capacity must be an integer'),
    check('price')
        .exists()
        .isFloat(true)
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('startDate')
        .exists({ checkFalsy: true })
        .isAfter()
        .withMessage('Start date must be in the future'),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom((endDate, { req }) => {
            if (endDate < req.body.startDate) {
                return false;
            }
            return true;
        })
        .withMessage('End date is less than start date'),
    handleValidationErrors
]

//* Routes ---------------------------------------------------------------------

router.get('/:eventId/attendees', getAttendeesByEventId);

router.post('/:eventId/images', requireAuth, addImageToEventByEventId);

router.get('/:eventId', getEventDetailsByEventId)

router.put('/:eventId', requireAuth, validateEventBody, editEventById);

router.delete('/:eventId', requireAuth, deleteEventById);

router.get('/', getAllEvents);


module.exports = router;