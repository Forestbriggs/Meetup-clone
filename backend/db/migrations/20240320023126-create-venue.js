'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
};

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Venues', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false
            },
            state: {
                type: Sequelize.STRING(2),
                allowNull: false
            },
            lat: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            lng: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            groupId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        }, options);
    },
    async down(queryInterface, Sequelize) {
        options.tableName = 'Venues'
        await queryInterface.dropTable(options);
    }
};