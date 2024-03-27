'use strict';
const { Event, Group, Venue } = require('../models');

const groupEvents = [
    {
        name: 'Straw Hat Pirates',
        address: 'Water 7 Island',
        event: {
            name: "Aqua Laguna Relief Effort",
            description: "Assisting the citizens of Water 7 in evacuating and protecting the city from the impending Aqua Laguna tidal wave.",
            type: "In person",
            capacity: 1000,
            price: 0,
            startDate: new Date('March 30, 2024 10:00:00').toString(),
            endDate: new Date('March 31, 2024 14:00:00').toString()
        }
    }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of groupEvents) {
            const { name, address, event } = info;
            const group = await Group.findOne({ where: { name } });
            let venue;
            if (address) {
                venue = await Venue.findOne({ where: { address } });
            }

            await group.createEvent({ venueId: venue ? venue.id : null, ...event },
                { validate: true });
        }
    },

    async down(queryInterface, Sequelize) {
        Event.destroy({ where: { name: 'testing' } })
    }
};
