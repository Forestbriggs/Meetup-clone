'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Group.belongsToMany(models.User, {
                through: 'GroupMember',
                foreignKey: 'groupId',
                otherKey: 'memberId'
            });

            Group.belongsTo(models.User, {
                foreignKey: 'organizerId'
            });

            Group.hasMany(models.GroupImage, {
                foreignKey: 'groupId',
                onDelete: "CASCADE",
                hooks: true
            });

            Group.hasMany(models.GroupMember, {
                foreignKey: 'groupId',
                onDelete: "CASCADE",
                hooks: true
            });

            Group.hasMany(models.Venue, {
                foreignKey: 'groupId',
                onDelete: "CASCADE",
                hooks: true
            });

            Group.hasMany(models.Event, {
                foreignKey: 'groupId',
                onDelete: "CASCADE",
                hooks: true
            });
        }
    }
    Group.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [0, 60]
            }
        },
        about: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [50, 255]
            }
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Online', 'In person']]
            }
        },
        private: {
            type: DataTypes.BOOLEAN,
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
                len: [2, 2]
            }
        },
        organizerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Group',
    });
    return Group;
};