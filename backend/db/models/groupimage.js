'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GroupImage extends Model {

        static associate(models) {
            GroupImage.belongsTo(models.Group,
                {
                    foreignKey: "groupId"
                });
        }
    }
    GroupImage.init({
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        },
        preview: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'GroupImage'
    });
    return GroupImage;
};