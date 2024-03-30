'use strict';

const { Event, EventImage } = require('../models');

const eventImages = [
    {
        name: 'Aqua Laguna Relief Effort',
        images: [
            {
                url: 'https://qph.cf2.quoracdn.net/main-qimg-99626072ac6863db8e86da0ab7830070-pjlq',
                preview: true
            },
            {
                url: 'https://static.wikia.nocookie.net/onepiece/images/5/53/Aqua_Laguna_Infobox.png/revision/latest/scale-to-width-down/1200?cb=20220522163609',
                preview: false
            }
        ]
    },
    {
        name: 'Secret planning',
        images: [
            {
                url: 'https://www.cbc.ca/kids/images/4wayssecretmessages_header1140.jpg',
                preview: true
            }
        ]
    },
    {
        name: 'Marineford War',
        images: [
            {
                url: 'https://beebom.com/wp-content/uploads/2023/02/featured-8.jpg?w=750&quality=75',
                preview: true
            },
            {
                url: 'https://static.wikia.nocookie.net/onepiece/images/d/da/Hot_Wind_Marines_Infobox.png/revision/latest?cb=20130827010530',
                preview: false
            }
        ]
    },
    {
        name: 'Potluck',
        images: [
            {
                url: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/03/Featured-Image-Straw-Hat-Picnic-Cropped.jpg',
                preview: true
            },
            {
                url: 'https://sportshub.cbsistatic.com/i/2023/07/11/a03d86ed-9277-4716-828e-6014c60ecef9/one-piece-alcohol.jpg?width=1200',
                preview: false
            }
        ]
    },
    {
        name: 'Sabaody Archipelago Human Auction Rescue',
        images: [
            {
                url: 'https://static.wikia.nocookie.net/onepiece/images/c/c2/Human_Auctioning_House_Infobox.png/revision/latest?cb=20150623202205',
                preview: true
            },
            {
                url: 'https://64.media.tumblr.com/d01d490309f3302670ec755210727646/tumblr_inline_o01b48Jlxa1s2yta0_640.jpg',
                preview: false
            }
        ]
    }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of eventImages) {
            const { name, images } = info;

            const event = await Event.findOne({ where: { name } });

            for (let image of images) {
                await event.createEventImage({ ...image }, { validate: true });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of eventImages) {
            const { name, images } = info;

            const event = await Event.findOne({ where: { name } });

            for (let image of images) {
                const img = await EventImage.findOne({ where: { ...image, eventId: event.id } });
                await img.destroy();
            }
        }
    }
};
