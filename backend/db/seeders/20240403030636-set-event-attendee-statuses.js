'use strict';

const { Event, User, EventAttendee } = require('../models');

const eventsAndAttendees = [
    {
        name: 'Aqua Laguna Relief Effort',
        eventAttendees: [
            {
                username: 'ThreeSwordsZoro',
                status: 'attending'
            },
            {
                username: 'NavigatorNami',
                status: 'attending'
            },
            {
                username: 'Sogeking',
                status: 'attending'
            },
            {
                username: 'BlackLegSanji',
                status: 'attending'
            },
            {
                username: 'DoctorChopper',
                status: 'waitlist'
            },
            {
                username: 'ArchaeologistRobin',
                status: 'attending'
            },
            {
                username: 'Franky',
                status: 'waitlist'
            },
            {
                username: 'SoulKingBrook',
                status: 'waitlist'
            }
        ]
    },
    {
        name: 'Sabaody Archipelago Human Auction Rescue',
        eventAttendees: [
            {
                username: 'Bepo',
                status: 'attending'
            },
            {
                username: 'JeanBart',
                status: 'attending'
            },
            {
                username: 'Penguin',
                status: 'attending'
            },
            {
                username: 'Shachi',
                status: 'waitlist'
            },
        ]
    },
    {
        name: 'Marineford War',
        eventAttendees: [
            {
                username: 'LightSpeedKizaru',
                status: 'attending'
            },
            {
                username: 'IceColdAokiji',
                status: 'attending'
            },
            {
                username: 'FistOfJusticeGarp',
                status: 'attending'
            },
            {
                username: 'Smoker',
                status: 'waitlist'
            },
        ]
    },
    {
        name: 'Secret planning',
        eventAttendees: [
            {
                username: 'FlameFistSabo',
                status: 'attending'
            },
            {
                username: 'Ivankov',
                status: 'attending'
            }
        ]
    },
    {
        name: 'Potluck',
        eventAttendees: [
            {
                username: 'BlackLegSanji',
                status: 'attending'
            },
            {
                username: 'DoctorChopper',
                status: 'attending'
            },
            {
                username: 'Franky',
                status: 'waitlist'
            },
            {
                username: 'NavigatorNami',
                status: 'attending'
            },
        ]
    }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of eventsAndAttendees) {
            const { name, eventAttendees } = info;
            const event = await Event.findOne({ where: { name } });

            for (let eventInfo of eventAttendees) {
                const { username, status } = eventInfo;
                const user = await User.findOne({ where: { username } });
                await EventAttendee.update({ status }, {
                    where: {
                        userId: user.id,
                        eventId: event.id
                    }
                });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of eventsAndAttendees) {
            const { name, eventAttendees } = info;
            const event = await Event.findOne({ where: { name } });

            for (let eventInfo of eventAttendees) {
                const { username } = eventInfo;
                const user = await User.findOne({ where: { username } });
                await EventAttendee.update({ status: 'pending' }, {
                    where: {
                        userId: user.id,
                        eventId: event.id
                    }
                });
            }
        }
    }
};
