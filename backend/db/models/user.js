'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsToMany(models.Group, {
                through: 'GroupMember',
                foreignKey: 'memberId',
                otherKey: 'groupId'
            });

            User.hasMany(models.Group, {
                foreignKey: 'organizerId',
                onDelete: "CASCADE",
                hooks: true
            });

            User.belongsToMany(models.Event, {
                through: 'EventAttendee',
                foreignKey: 'userId',
                otherKey: 'eventId'
            })
        }
    }
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }

        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4, 30],
                isNotEmail(value) {
                    if (Validator.isEmail(value)) {
                        throw new Error('Username can not be an email.');
                    }
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 256],
                isEmail: true
            }
        },
        hashedPassword: {
            type: DataTypes.STRING.BINARY,
            allowNull: false,
            validate: {
                len: [60, 60]
            }
        },
    }, {
        sequelize,
        modelName: 'User',
        defaultScope: {
            attributes: {
                exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
            }
        }
    });
    return User;
};