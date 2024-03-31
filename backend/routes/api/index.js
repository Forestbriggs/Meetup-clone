//* backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser, requireAuth } = require('../../utils/auth.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const { deleteGroupImageByImageId, deleteEventImageByImageId } = require('../../utils/images.js');

//* Middleware -----------------------------------------------------------------
//* Connect restoreUser middleware to the API router
//* If current user is valid, set req.user to the user in the db
//* If current user session is not valid, set req.user to null
router.use(restoreUser);

//* Routes ---------------------------------------------------------------------

router.use('/session', sessionRouter); //* Login/logout

router.use('/users', usersRouter); //* Signup/user routes

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

router.delete('/group-images/:imageId', requireAuth, deleteGroupImageByImageId);

router.delete('/event-images/:imageId', requireAuth, deleteEventImageByImageId);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;