const { Event, Group, Venue, EventImage } = require('../db/models');

const getAllEvents = async (req, res, next) => {
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
        ]
    });

    await Promise.all(events.map(async (event) => {
        event.dataValues.numAttending = await event.countUsers() + 1;
        event.dataValues.previewImage = event.dataValues.EventImages[0]?.url || null;
        delete event.dataValues.EventImages;

        return event;
    }))

    res.json({ Events: events });
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
        event.dataValues.numAttending = await event.countUsers() + 1;
        event.dataValues.previewImage = event.dataValues.EventImages[0]?.url || null;
        delete event.dataValues.EventImages;

        return event;
    }))

    res.json({ Events: events });
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

    event.dataValues.numAttending = await event.countUsers() + 1;

    return res.json(event)
};

module.exports = {
    getAllEvents,
    getAllEventsByGroupId,
    getEventDetailsByEventId
};