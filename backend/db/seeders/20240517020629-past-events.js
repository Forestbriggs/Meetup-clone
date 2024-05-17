'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Event, Group, Venue } = require('../models');

const groupEvents = [
    {
        name: 'Straw Hat Pirates',
        address: 'Water 7 Island',
        event: {
            name: "Team Meeting",
            description: "Our first gathering as a team! We're gonna get together, eat lots of food, and brainstorm for the future!",
            type: "In person",
            capacity: 20,
            price: 0,
            startDate: new Date('January 15, 2025 10:00:00').toISOString(),
            endDate: new Date('January 15, 2025 12:00:00').toISOString()
        }
    },
    {
        name: 'Straw Hat Pirates',
        address: 'Water 7 Island',
        event: {
            name: "Swim Day",
            description: "The ocean is calling our name, lets go swim! (Devil fruit users allowed, just no swimming)",
            type: "In person",
            capacity: 20,
            price: 0,
            startDate: new Date('February 20, 2025 10:00:00').toISOString(),
            endDate: new Date('February 20, 2025 16:00:00').toISOString()
        }
    },
]

module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of groupEvents) {
            const { name, address, event } = info;
            const group = await Group.findOne({ where: { name } });
            let venue;
            if (address) {
                venue = await Venue.findOne({ where: { address, groupId: group.id } });
            }

            await group.createEvent({ venueId: venue ? venue.id : null, ...event },
                { validate: true });
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of groupEvents) {
            const { name, event } = info;
            const group = await Group.findOne({ where: { name } });

            const evnt = await Event.findOne({ where: { ...event, groupId: group.id } });
            await evnt.destroy();
        }
    }
};
