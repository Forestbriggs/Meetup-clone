'use strict';
const { Event } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        Event.bulkCreate([
            {
                groupId: 1,
                name: 'testing',
                description: 'd;slakfj;lasdkjfl;ak',
                type: 'Online',
                capacity: 5,
                price: 20,
                startDate: new Date('March 27, 2024 10:30:00').toString(),
                endDate: new Date('March 27, 2024 11:00:00').toString()
            }
        ], { validate: true })
    },

    async down(queryInterface, Sequelize) {
        Event.destroy({ where: { name: 'testing' } })
    }
};
