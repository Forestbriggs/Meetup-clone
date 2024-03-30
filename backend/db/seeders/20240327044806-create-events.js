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
            startDate: new Date('March 15, 2025 10:00:00').toISOString(),
            endDate: new Date('March 16, 2025 14:00:00').toISOString()
        }
    },
    {
        name: 'Heart Pirates',
        address: 'Sabaody Archipelago',
        event: {
            name: "Sabaody Archipelago Human Auction Rescue",
            description: "Rescuing enslaved humans from the underground human auction at Sabaody Archipelago.",
            type: "In person",
            capacity: 50,
            price: 0,
            startDate: new Date('February 2, 2025 18:00:00').toISOString(),
            endDate: new Date('February 3, 2025 10:00:00').toISOString()
        }
    },
    {
        name: 'Marines',
        address: 'Marineford',
        event: {
            name: "Marineford War",
            description: "Engagement in the Battle of Marineford against the Whitebeard Pirates and their allies, aiming to execute Portgas D. Ace and suppress the pirate forces.",
            type: "In person",
            capacity: "1000",
            price: 0,
            startDate: new Date('March 1, 2025 12:00:00').toISOString(),
            endDate: new Date('March 3, 2025 16:00:00').toISOString()
        }
    },
    {
        name: 'Straw Hat Pirates',
        address: 'Water 7 Island',
        event: {
            name: 'Potluck',
            description: "We're toast after the Aqua Laguna Relief Effort! I'm sure you are too. Join us for a feast down here in Water 7 to celebrate!",
            type: 'In person',
            capacity: 25,
            price: 15,
            startDate: new Date('March 17, 2025 08:00:00').toISOString(),
            endDate: new Date('March 17, 2025 12:00:00').toISOString()
        }
    },
    {
        name: 'The Revolutionary Army',
        event: {
            name: 'Secret planning',
            description: 'If you know you know',
            type: 'Online',
            capacity: 10,
            price: 0,
            startDate: new Date('April 29, 2025 18:00:00').toISOString(),
            endDate: new Date('April 29, 2025 20:00:00').toISOString()
        }
    },
]

/** @type {import('sequelize-cli').Migration} */
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
            const { name, address, event } = info;
            const group = await Group.findOne({ where: { name } });

            const evnt = await Event.findOne({ where: { ...event, groupId: group.id } });
            await evnt.destroy();
        }
    }
};
