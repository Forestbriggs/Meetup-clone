//* /backend/utils/groups.js
const { Group, User, GroupMember, Image, sequelize } = require('../db/models');

const getAllGroups = async (req, res) => {
    let groups = await Group.findAll({
        include: [
            {
                model: Image,
                where: {
                    preview: true
                },
                required: false
            }
        ]
    });

    await Promise.all(groups.map(async (group) => {
        group.dataValues.numMembers = await group.countUsers() + 1;
        group.dataValues.previewImage = group.dataValues.Images[0]?.url || null;
        delete group.dataValues.Images;

        return group;
    }));

    res.json({ Groups: groups })
};

const getCurrentUserGroups = async (req, res) => {
    const id = req.user.id;

    const orgGroups = await Group.findAll({
        where: {
            organizerId: id
        }
    });

    //TODO get all groups joined by user

    res.json(orgGroups);
};

module.exports = {
    getAllGroups,
    getCurrentUserGroups
}