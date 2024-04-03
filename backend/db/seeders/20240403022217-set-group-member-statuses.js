'use strict';

const { Group, User, GroupMember } = require('../models');

const groupsAndMembers = [
    {
        name: 'Straw Hat Pirates',
        groupMembers: [
            {
                username: 'ThreeSwordsZoro',
                status: 'co-host'
            },
            {
                username: 'NavigatorNami',
                status: 'member'
            },
            {
                username: 'Sogeking',
                status: 'member'
            },
            {
                username: 'BlackLegSanji',
                status: 'co-host'
            },
            {
                username: 'DoctorChopper',
                status: 'member'
            },
            {
                username: 'ArchaeologistRobin',
                status: 'member'
            },
            {
                username: 'Franky',
                status: 'member'
            },
            {
                username: 'SoulKingBrook',
                status: 'member'
            },
            {
                username: 'FishmanJinbe',
                status: 'member'
            },
        ]
    },
    {
        name: 'Heart Pirates',
        groupMembers: [
            {
                username: 'Bepo',
                status: 'co-host'
            },
            {
                username: 'JeanBart',
                status: 'co-host'
            },
            {
                username: 'Penguin',
                status: 'member'
            },
            {
                username: 'Shachi',
                status: 'member'
            },
        ]
    },
    {
        name: 'Donquixote Pirates',
        groupMembers: [
            {
                username: 'Vergo',
                status: 'member'
            },
            {
                username: 'Trebol',
                status: 'co-host'
            }
        ]
    },
    {
        name: 'Marines',
        groupMembers: [
            {
                username: 'LightSpeedKizaru',
                status: 'co-host'
            },
            {
                username: 'IceColdAokiji',
                status: 'co-host'
            },
            {
                username: 'FistOfJusticeGarp',
                status: 'co-host'
            },
            {
                username: 'Smoker',
                status: 'member'
            },
        ]
    },
    {
        name: 'The Revolutionary Army',
        groupMembers: [
            {
                username: 'FlameFistSabo',
                status: 'co-host'
            },
            {
                username: 'Ivankov',
                status: 'member'
            }
        ]
    },
    {
        name: 'Straw Hat Grand Fleet',
        groupMembers: [
            {
                username: 'Bartolomeo',
                status: 'member'
            },
            {
                username: 'GloriousCavendish',
                status: 'member'
            }
        ]
    }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of groupsAndMembers) {
            const { name, groupMembers } = info;
            const group = await Group.findOne({ where: { name } });

            for (let memberInfo of groupMembers) {
                const { username, status } = memberInfo;
                const user = await User.findOne({ where: { username } });
                await GroupMember.update({ status }, {
                    where: {
                        groupId: group.id,
                        memberId: user.id
                    }
                });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of groupsAndMembers) {
            const { name, groupMembers } = info;
            const group = await Group.findOne({ where: { name } });

            for (let memberInfo of groupMembers) {
                const { username } = memberInfo;
                const user = await User.findOne({ where: { username } });
                await GroupMember.update({ status: 'pending' }, {
                    where: {
                        groupId: group.id,
                        memberId: user.id
                    }
                });
            }
        }
    }
};
