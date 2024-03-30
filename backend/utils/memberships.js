const { Group, GroupMember, User } = require('../db/models');

const getGroupMembersByGroupId = async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupMember,
                where: {
                    memberId: req.user.id
                },
                required: false
            }
        ]
    });


    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Couldn't find a Group with the specified id";
        err.status = 404;
        return next(err);
    }

    let members = await User.findAll({
        attributes: {
            exclude: ['username']
        },
        include: [
            {
                model: GroupMember,
                where: {
                    groupId: group.dataValues.id
                },
                attributes: ['status']
            }
        ]
    });

    await Promise.all(members.map(async (member) => {
        member.dataValues.Membership = member.dataValues.GroupMembers[0];
        delete member.dataValues.GroupMembers;
    }))

    if (req.user.id !== group.dataValues.organizerId) {


        if (group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            members = members.filter((member) => {
                return member.dataValues.Membership.status !== 'pending';
            })
        }
    }

    res.json({ Members: members })
};


module.exports = {
    getGroupMembersByGroupId
};