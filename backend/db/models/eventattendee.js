'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EventAttendee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    EventAttendee.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending',
            validate: {
                isIn: [['attending', 'waitlist', 'pending']]
            }
        },
    }, {
        sequelize,
        modelName: 'EventAttendee',
    });
    return EventAttendee;
};