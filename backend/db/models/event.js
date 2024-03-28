'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Event.belongsTo(models.Group, {
                foreignKey: 'groupId'
            });

            Event.belongsTo(models.Venue, {
                foreignKey: 'venueId'
            });

            Event.hasMany(models.EventImage, {
                foreignKey: 'eventId',
                onDelete: 'CASCADE',
                hooks: true
            });
        }
    }
    Event.init({
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        venueId: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5, 100]
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Online', 'In person']]
            }
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfter: new Date().toString()
            }
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfterStartDate(endDate) {
                    if (this.startDate > endDate) {
                        throw new Error('End date must be after start date.')
                    }
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Event',
    });
    return Event;
};