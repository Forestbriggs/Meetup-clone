'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group, Venue } = require('../models');

const groupVenues = [
    {
        name: 'Straw Hat Pirates',
        venues: [
            {
                address: "Water 7 Island",
                city: "Water 7",
                state: "GL",
                lat: 38.4357,
                lng: -107.3438
            },
        ]
    },
    {
        name: 'Heart Pirates',
        venues: [
            {
                address: "Sabaody Archipelago",
                city: "Sabaody Archipelago",
                state: "NB",
                lat: 10.0294,
                lng: -61.6537
            },
        ]
    },
    {
        name: 'Marines',
        venues: [
            {
                address: "Marineford",
                city: "Marineford",
                state: "GL",
                lat: 38.2655,
                lng: -77.4621
            },
        ]
    }
]

module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of groupVenues) {
            const { name, venues } = info;
            const group = await Group.findOne({ where: { name } });

            for (let venue of venues) {
                await Venue.create({ ...venue, groupId: group.id }, { validate: true });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of groupVenues) {
            const { name, venues } = info;
            const group = await Group.findOne({ where: { name } });

            for (let venue of venues) {
                await Venue.destroy({ where: { ...venue, groupId: group.id } });
            }
        }
    }
};