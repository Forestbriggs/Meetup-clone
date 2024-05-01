const { Event, Group, Venue, EventImage, GroupMember,
    EventAttendee, Sequelize } = require('../db/models');

const { formatDate } = require('../utils/formatDate');
const Op = Sequelize.Op;

const getAllEvents = async (req, res, next) => {
    let { page, size, name, type, startDate } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (Number.isNaN(size)) size = 20;

    const queries = {}

    if (name) queries.name = {
        [Op.like]: `%${name}%`
    }

    if (type) queries.type = type;

    if (startDate) queries.startDate = {
        [Op.between]: [`${startDate} 00:00:00`, `${startDate} 23:59:59`]
    }

    const events = await Event.findAll({
        attributes: {
            exclude: ['price', 'capacity', 'description', 'createdAt', 'updatedAt']
        },
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state'],
                required: false
            },
            {
                model: EventImage,
                where: {
                    preview: true
                },
                required: false
            }
        ],
        limit: size,
        offset: size * (page - 1),
        where: {
            ...queries
        }
    });

    await Promise.all(events.map(async (event) => {
        event.dataValues.numAttending = await event.countEventAttendees({
            where: {
                status: 'attending'
            }
        }) + 1;
        event.dataValues.previewImage = event.dataValues.EventImages[0]?.url || null;
        event.dataValues.startDate = formatDate(event.dataValues.startDate);
        event.dataValues.endDate = formatDate(event.dataValues.endDate);
        delete event.dataValues.EventImages;

        return event;
    }))

    return res.json({
        Events: events,
        page,
        size
    });
};

const getAllEventsByGroupId = async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId)

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Couldn't find a Group with the specified id";
        err.status = 404;
        return next(err);
    }

    const events = await Event.findAll({
        where: {
            groupId
        },
        attributes: {
            exclude: ['price', 'capacity', 'description', 'createdAt', 'updatedAt']
        },
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state'],
                required: false
            },
            {
                model: EventImage,
                where: {
                    preview: true
                },
                required: false
            }
        ]
    });

    await Promise.all(events.map(async (event) => {
        event.dataValues.numAttending = await event.countEventAttendees({
            where: {
                status: 'attending'
            }
        }) + 1;
        event.dataValues.previewImage = event.dataValues.EventImages[0]?.url || null;
        event.dataValues.startDate = formatDate(event.dataValues.startDate);
        event.dataValues.endDate = formatDate(event.dataValues.endDate);
        delete event.dataValues.EventImages;

        return event;
    }))

    return res.json({ Events: events });
};

const getEventDetailsByEventId = async (req, res, next) => {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: Group,
                attributes: {
                    exclude: ['organizerId', 'type', 'about', 'createdAt', 'updatedAt']
                }
            },
            {
                model: Venue,
                attributes: {
                    exclude: ['groupId', 'createdAt', 'updatedAt']
                },
                required: false
            },
            {
                model: EventImage,
                attributes: {
                    exclude: ['eventId', 'createdAt', 'updatedAt']
                },
                required: false
            }
        ]
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.title = "Couldn't find an Event with the specified id";
        err.status = 404;
        return next(err);
    }

    event.dataValues.numAttending = await event.countEventAttendees({
        where: {
            status: 'attending'
        }
    }) + 1;
    event.dataValues.price = event.dataValues.price.toFixed(2);
    event.dataValues.startDate = formatDate(event.dataValues.startDate);
    event.dataValues.endDate = formatDate(event.dataValues.endDate);

    return res.json(event)
};

const createEventByGroupId = async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupMember,
                where: {
                    memberId: req.user.id
                },
                required: false
            }
        ]
    });

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Couldn't find a Group with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== group.organizerId) {

        if (group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Forbidden');
            err.title = 'Forbidden';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        }
    }

    const { venueId, name, type, capacity, price, description,
        startDate, endDate } = req.body;

    let venue;

    if (venueId) {
        venue = await Venue.findByPk(venueId);

        if (!venue) {
            const err = new Error("Venue couldn't be found");
            err.title = "Couldn't find a Venue with the specified id";
            err.status = 404;
            return next(err);
        }
    }

    const event = await group.createEvent({
        venueId: venue ? venue.id : null,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    event.dataValues.price = event.dataValues.price.toFixed(2);
    event.dataValues.startDate = formatDate(event.dataValues.startDate);
    event.dataValues.endDate = formatDate(event.dataValues.endDate);
    delete event.dataValues.createdAt;
    delete event.dataValues.updatedAt;

    return res.json(event);
};

const addImageToEventByEventId = async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: EventAttendee,
                where: {
                    userId: req.user.id
                },
                required: false
            },
            {
                model: Group,
                include: [
                    {
                        model: GroupMember,
                        where: {
                            memberId: req.user.id
                        },
                        required: false
                    }
                ]
            }
        ]
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.title = "Couldn't find an Event with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== event.dataValues.Group.dataValues.organizerId) {


        if (event.dataValues.Group.GroupMembers[0]?.dataValues.status !== 'co-host'
            && event.dataValues.EventAttendees[0]?.dataValues.status !== 'attending') {
            const err = new Error('Forbidden');
            err.title = 'Forbidden';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        }
    }

    const { url, preview } = req.body;
    const image = await event.createEventImage({
        url,
        preview
    });

    return res.json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });
};

const editEventById = async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: Group,
                include: [
                    {
                        model: GroupMember,
                        where: {
                            memberId: req.user.id
                        },
                        required: false
                    }
                ]
            }
        ]
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.title = "Couldn't find an Event with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== event.dataValues.Group.dataValues.organizerId) {


        if (event.dataValues.Group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Forbidden');
            err.title = 'Forbidden';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        }
    }

    const { venueId, name, type, capacity, price, description,
        startDate, endDate } = req.body;

    let venue;

    if (venueId) {
        venue = await Venue.findByPk(venueId);

        if (!venue) {
            const err = new Error("Venue couldn't be found");
            err.title = "Couldn't find a Venue with the specified id";
            err.status = 404;
            return next(err);
        }
    }

    await event.update({
        venueId: venue ? venue.id : null,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    event.dataValues.price = event.dataValues.price.toFixed(2);
    event.dataValues.startDate = formatDate(event.dataValues.startDate);
    event.dataValues.endDate = formatDate(event.dataValues.endDate);
    delete event.dataValues.createdAt;
    delete event.dataValues.updatedAt;
    delete event.dataValues.Group;

    return res.json(event);
};

const deleteEventById = async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: Group,
                include: [
                    {
                        model: GroupMember,
                        where: {
                            memberId: req.user.id
                        },
                        required: false
                    }
                ]
            }
        ]
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.title = "Couldn't find an Event with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== event.dataValues.Group.dataValues.organizerId) {

        if (event.dataValues.Group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Forbidden');
            err.title = 'Forbidden';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        }
    };

    await event.destroy();

    res.json({
        message: 'Successfully deleted'
    })
};

module.exports = {
    getAllEvents,
    getAllEventsByGroupId,
    getEventDetailsByEventId,
    createEventByGroupId,
    addImageToEventByEventId,
    editEventById,
    deleteEventById
};