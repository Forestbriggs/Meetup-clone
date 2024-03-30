'use strict';

const { Event, User, EventAttendee } = require('../models');

const eventAttendees = [
    {
        name: 'Aqua Laguna Relief Effort',
        attendees: [
            {
                username: 'ThreeSwordsZoro'
            },
            {
                username: 'NavigatorNami'
            },
            {
                username: 'Sogeking'
            },
            {
                username: 'BlackLegSanji'
            },
            {
                username: 'DoctorChopper'
            },
            {
                username: 'ArchaeologistRobin'
            },
            {
                username: 'Franky'
            },
            {
                username: 'SoulKingBrook'
            }
        ]
    },
    {
        name: 'Sabaody Archipelago Human Auction Rescue',
        attendees: [
            {
                username: 'Bepo'
            },
            {
                username: 'JeanBart'
            },
            {
                username: 'Penguin'
            },
        ]
    },
    {
        name: 'Marineford War',
        attendees: [
            {
                username: 'LightSpeedKizaru'
            },
            {
                username: 'IceColdAokiji'
            },
            {
                username: 'FistOfJusticeGarp'
            }
        ]
    },
    {
        name: 'Potluck',
        attendees: [
            {
                username: 'BlackLegSanji'
            },
            {
                username: 'DoctorChopper'
            },
            {
                username: 'Franky'
            },
            {
                username: 'NavigatorNami'
            }
        ]
    },
    {
        name: 'Secret planning',
        attendees: [
            {
                username: 'FlameFistSabo'
            },
            {
                username: 'Ivankov'
            },
        ]
    }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of eventAttendees) {
            const { name, attendees } = info;
            const event = await Event.findOne({ where: { name } });

            for (let attendee of attendees) {
                const { username } = attendee;
                const user = await User.findOne({ where: { username } });
                await event.addUser([user]);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of eventAttendees) {
            const { name, attendees } = info;
            const event = await Event.findOne({ where: { name } });

            for (let attendee of attendees) {
                const { username } = attendee;
                const user = await User.findOne({ where: { username } });
                await event.removeUser([user]);
            }
        }
    }
};
