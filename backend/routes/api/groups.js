//* /backend/routes/api/groups.js
const express = require('express');

const { getAllGroups, getCurrentUserGroups, getGroupById, createGroup,
    addGroupImage, editGroupById, deleteGroupById, getAllVenuesByGroupId,
    createVenueByGroupId } = require('../../utils/groups.js');
const { getAllEventsByGroupId } = require('../../utils/events.js');
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//* Middleware -----------------------------------------------------------------
const validateGroupBody = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'online' or 'In person'"),
    check('private')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 2 })
        .withMessage('State is required'),
    handleValidationErrors
];

const validateVenueBody = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    handleValidationErrors
];

//* Routes ---------------------------------------------------------------------

router.get('/current', requireAuth, getCurrentUserGroups);

router.get('/:groupId/events', getAllEventsByGroupId);

router.post('/:groupId/images', requireAuth, addGroupImage);

router.get('/:groupId/venues', requireAuth, getAllVenuesByGroupId);

router.post('/:groupId/venues', requireAuth, validateVenueBody, createVenueByGroupId)

router.put('/:groupId', requireAuth, validateGroupBody, editGroupById);

router.get('/:groupId', getGroupById);

router.delete('/:groupId', requireAuth, deleteGroupById);

router.post('/', requireAuth, validateGroupBody, createGroup);

router.get('/', getAllGroups);

module.exports = router;