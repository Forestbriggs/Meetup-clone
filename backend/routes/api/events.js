const express = require('express');

const { getAllEvents, getEventDetailsByEventId,
    addImageToEventByEventId, editEventById,
    deleteEventById } = require('../../utils/events.js');

const { getAttendeesByEventId, requestEventAttendanceByEventId,
    changeAttendanceStatusByEventId,
    deleteAttendanceByUserId } = require('../../utils/attendees.js');

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
        .isFloat({ min: 0 })
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
];

const validateAttendanceBody = [
    check('status')
        .exists({ checkFalsy: true })
        .not()
        .isIn(['pending'])
        .withMessage('Cannot change an attendance status to pending'),
    handleValidationErrors
];

const validateQueries = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Size must be between 1 and 20'),
    check('name')
        .optional()
        .isString()
        .not()
        .isNumeric()
        .withMessage('Name must be a string'),
    check('type')
        .optional()
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid datetime'),
    handleValidationErrors
];

//* Routes ---------------------------------------------------------------------

router.delete('/:eventId/attendance/:userId', requireAuth,
    deleteAttendanceByUserId);

router.get('/:eventId/attendees', getAttendeesByEventId);

router.post('/:eventId/attendance', requireAuth,
    requestEventAttendanceByEventId);

router.put('/:eventId/attendance', requireAuth, validateAttendanceBody,
    changeAttendanceStatusByEventId);

router.post('/:eventId/images', requireAuth, addImageToEventByEventId);

router.get('/:eventId', getEventDetailsByEventId)

router.put('/:eventId', requireAuth, validateEventBody, editEventById);

router.delete('/:eventId', requireAuth, deleteEventById);

router.get('/', validateQueries, getAllEvents);


module.exports = router;