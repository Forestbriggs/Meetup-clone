'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group, GroupImage } = require('../models');

const groupImages = [
    {
        name: 'Straw Hat Pirates',
        images: [
            {
                url: 'https://beebom.com/wp-content/uploads/2023/01/straw-hats.jpg',
                preview: true
            }
        ]
    }
]

module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of groupImages) {
            const { name, images } = info;
            const group = await Group.findOne({ where: { name } });

            for (let image of images) {
                await group.createGroupImage({ ...image }, { validate: true });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of groupImages) {
            const { name, images } = info;
            const group = await Group.findOne({ where: { name } });

            for (let image of images) {
                const img = await GroupImage.findOne({ where: { ...image }, groupId: group.id });
                await img.destroy();
            }
        }
    }
};
