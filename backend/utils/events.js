const { Event, Group, Venue, EventImage } = require('../db/models');

// TODO add numAttending and previewImage
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

module.exports = {
    getAllEvents,
};