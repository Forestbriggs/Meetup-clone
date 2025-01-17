'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Venue extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Venue.belongsTo(models.Group, {
                foreignKey: 'groupId'
            });

            Venue.hasMany(models.Event, {
                foreignKey: 'venueId',
                onDelete: "CASCADE",
                hooks: true
            });
        }
    }
    Venue.init({
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2]
            }
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: -90,
                max: 90
            }
        },
        lng: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: -180,
                max: 180
            }
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Venue',
    });
    return Venue;
};