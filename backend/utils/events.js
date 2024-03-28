const { Event, Group, Venue } = require('../db/models');

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
            }
        ]
    });

    res.json(events);
};

module.exports = {
    getAllEvents,
};