'use strict';

const { Group, User } = require('../models');
const bcrypt = require('bcryptjs');

const crewsAndMembers = [
    {
        name: 'Straw Hat Pirates',
        crewMembers: [
            {
                firstName: 'Roronoa',
                lastName: 'Zoro',
                username: 'ThreeSwordsZoro',
                email: 'zoro@strawhats.com',
                hashedPassword: bcrypt.hashSync('Str0ng3stSw0rdsman!!')
            },
            {
                firstName: 'Nami',
                lastName: 'Orange',
                username: 'NavigatorNami',
                email: 'nami@strawhats.com',
                hashedPassword: bcrypt.hashSync('W3atherMaster!')
            },
            {
                firstName: 'Usopp',
                lastName: 'Yasopp',
                username: 'Sogeking',
                email: 'usopp@strawhats.com',
                hashedPassword: bcrypt.hashSync('Br@veWarr!orUsopp')
            },
            {
                firstName: 'Vinsmoke',
                lastName: 'Sanji',
                username: 'BlackLegSanji',
                email: 'sanji@strawhats.com',
                hashedPassword: bcrypt.hashSync('AllBlu3Dream!ng')
            },
            {
                firstName: 'TonyTony',
                lastName: 'Chopper',
                username: 'DoctorChopper',
                email: 'chopper@strawhats.com',
                hashedPassword: bcrypt.hashSync('Re1nd33r')
            },
            {
                firstName: 'Nico',
                lastName: 'Robin',
                username: 'ArchaeologistRobin',
                email: 'robin@strawhats.com',
                hashedPassword: bcrypt.hashSync('0haraScho!ar')
            },
            {
                firstName: 'Cutty',
                lastName: 'Flam',
                username: 'Franky',
                email: 'franky@strawhats.com',
                hashedPassword: bcrypt.hashSync('SuperC0la!01')
            },
            {
                firstName: 'Brook',
                lastName: 'Yohoho',
                username: 'SoulKingBrook',
                email: 'brook@strawhats.com',
                hashedPassword: bcrypt.hashSync('Y0h0ho!!!')
            },
            {
                firstName: 'Jinbe',
                lastName: 'Tiger',
                username: 'FishmanJinbe',
                email: 'jinbe@strawhats.com',
                hashedPassword: bcrypt.hashSync('SeaW@rr!or')
            },
        ]
    },
    {
        name: 'Heart Pirates',
        crewMembers: [
            {
                firstName: 'Bepo',
                lastName: 'Bepo',
                username: 'Bepo',
                email: 'bepo@hearts.com',
                hashedPassword: bcrypt.hashSync('B3arHug@dventure')
            },
            {
                firstName: 'Jean',
                lastName: 'Bart',
                username: 'JeanBart',
                email: 'jean@hearts.com',
                hashedPassword: bcrypt.hashSync('L0yaltyBound!')
            },
            {
                firstName: 'Penguin',
                lastName: 'Penguin',
                username: 'Penguin',
                email: 'penguin@hearts.com',
                hashedPassword: bcrypt.hashSync('!ceb3rgHideout')
            },
            {
                firstName: 'Shachi',
                lastName: 'Shachi',
                username: 'Shachi',
                email: 'shachi@hearts.com',
                hashedPassword: bcrypt.hashSync('J0llyRogerCr3w!@')
            },
        ]
    },
    {
        name: 'Donquixote Pirates',
        crewMembers: [
            {
                firstName: 'Vergo',
                lastName: 'Vergo',
                username: 'Vergo',
                email: 'vergo@donquixote.com',
                hashedPassword: bcrypt.hashSync('L0yalty&Str3ngth')
            },
            {
                firstName: 'Trebol',
                lastName: 'Trebol',
                username: 'Trebol',
                email: 'trebol@donquixote.com',
                hashedPassword: bcrypt.hashSync('Mucu$M@5ter')
            }
        ]
    },
    {
        name: 'Marines',
        crewMembers: [
            {
                firstName: 'Borsalino',
                lastName: 'Kizaru',
                username: 'LightSpeedKizaru',
                email: 'kizaru@marines.com',
                hashedPassword: bcrypt.hashSync('L@ziness1sKey!')
            },
            {
                firstName: 'Kuzan',
                lastName: 'Aokiji',
                username: 'IceColdAokiji',
                email: 'aokiji@marines.com',
                hashedPassword: bcrypt.hashSync('Ch1llOut!!')
            },
            {
                firstName: 'Garp',
                lastName: 'Garp',
                username: 'FistOfJusticeGarp',
                email: 'garp@marines.com',
                hashedPassword: bcrypt.hashSync('Gr@andpa123')
            },
            {
                firstName: 'Smoker',
                lastName: 'Smoker',
                username: 'Smoker',
                email: 'smoker@marines.com',
                hashedPassword: bcrypt.hashSync('Just!ceSmokescr33n')
            },
        ]
    },
    {
        name: 'The Revolutionary Army',
        crewMembers: [
            {
                firstName: 'Sabo',
                lastName: 'Sabo',
                username: 'FlameFistSabo',
                email: 'sabo@revolutionists.com',
                hashedPassword: bcrypt.hashSync('R!p@ce:(')
            },
            {
                firstName: 'Ivankov',
                lastName: 'Ivankov',
                username: 'Ivankov',
                email: 'ivankov@revolutionists.com',
                hashedPassword: bcrypt.hashSync('R3volutionQueen!')
            },
        ]
    },
    {
        name: 'Straw Hat Grand Fleet',
        crewMembers: [
            {
                firstName: 'Bartolomeo',
                lastName: 'Bartolomeo',
                username: 'Bartolomeo',
                email: 'bartolomeo@bartoclub.com',
                hashedPassword: bcrypt.hashSync('Str@wHatFanboy123')
            },
            {
                firstName: 'Cavendish',
                lastName: 'Cavendish',
                username: 'GloriousCavendish',
                email: 'cavendish@beautiful.com',
                hashedPassword: bcrypt.hashSync('Wh!t3Horse')
            }
        ]
    }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        for (let info of crewsAndMembers) {
            const { name, crewMembers } = info;
            const group = await Group.findOne({ where: { name } })

            for (let crewInfo of crewMembers) {
                await group.createUser({ ...crewInfo }, { validate: true });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        for (let info of crewsAndMembers) {
            const { name, crewMembers } = info;
            const group = await Group.findOne({ where: { name } })

            for (let crewInfo of crewMembers) {
                const { username } = crewInfo
                const member = await User.findOne({ where: { username } });
                await group.removeUser([member]);
                await member.destroy();
            }
        }
    }
};
