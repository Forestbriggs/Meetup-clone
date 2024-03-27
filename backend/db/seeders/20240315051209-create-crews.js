'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User, Group } = require('../models');

const pirateCrews = [
    {
        username: "PirateKing",
        groups: [
            {
                name: "Straw Hat Pirates",
                about: "We sail the Grand Line, chasing dreams, fighting foes, and making memories that'll last a lifetime. From epic battles against tyrants to hilarious mishaps on the high seas, there's never a dull moment with the Straw Hat Pirates.",
                type: "In person",
                private: true,
                city: "Water 7",
                state: "GL"
            },
            {
                name: "Straw Hat Grand Fleet",
                about: "There's nothing we can't do! We've got each other's backs, and together, we're gonna take on anyone who tries to mess with us. So get ready, world – the Straw Hat Grand Fleet is here to shake things up and have one heck of an adventure!",
                type: "Online",
                private: false,
                city: "Water 7",
                state: "GL"
            }
        ]
    },
    {
        username: "SurgeonOfHearts",
        groups: [
            {
                name: "Heart Pirates",
                about: "We're the Heart Pirates, a family forged in the fires of the Grand Line. Through perilous seas and daunting battles, our bond remains unbreakable. With each beat, we stand united, facing challenges together. Join us for heart-pounding adventures!",
                type: "In person",
                private: true,
                city: "Sabaody Archipelago",
                state: "NB"
            }
        ]
    },
    {
        username: "PuppetMaster",
        groups: [
            {
                name: "Donquixote Pirates",
                about: "We are the Donquixote Pirates, a formidable force to be reckoned with on the high seas. Whether we're pursuing our ambitions or engaging in battle, you can bet that the Donquixote Pirates will always emerge victorious.",
                type: "Online",
                private: true,
                city: "Dressrosa",
                state: "NW"
            }
        ]
    },
    {
        username: "FleetAdmiral101",
        groups: [
            {
                name: "Marines",
                about: "Every marine, from the lowliest recruit to the highest-ranking officer, plays a vital role in our mission. Together, we are an indomitable force, united by our unwavering commitment to duty and honor.",
                type: "In person",
                private: false,
                city: "Marineford",
                state: "GL"
            }
        ]
    },
    {
        username: "FreedomFighterDragon",
        groups: [
            {
                name: "The Revolutionary Army",
                about: "We are the Revolutionary Army, a force dedicated to challenging the oppressive regimes that plague our world and fighting for the freedom and equality of all people. Join us in our quest to usher in a new era of peace and prosperity for all!",
                type: "Online",
                private: false,
                city: "Unnamed Island",
                state: "GL"
            }
        ]
    }
]

module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of pirateCrews) {
            const { username, groups } = info;
            const user = await User.findOne({ where: { username } });

            for (let groupInfo of groups) {
                await Group.create({ ...groupInfo, organizerId: user.id }, { validate: true });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of pirateCrews) {
            const { username, groups } = info;
            const user = await User.findOne({ where: { username } });

            for (let groupInfo of groups) {
                await Group.destroy({
                    where: {
                        ...groupInfo,
                        organizerId: user.id
                    }
                });
            }
        }
    }
};
