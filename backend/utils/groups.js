//* /backend/utils/groups.js
const { Group, User, GroupMember, GroupImage, Venue } = require('../db/models');
const { formatDate } = require('../utils/formatDate');

//* Route Functions ------------------------------------------------------------
const getAllGroups = async (req, res, next) => {
    let groups = await Group.findAll({
        include: [
            {
                model: GroupImage,
                where: {
                    preview: true
                },
                required: false
            }
        ]
    });

    await Promise.all(groups.map(async (group) => {
        group.dataValues.numMembers = await group.countUsers() + 1;
        group.dataValues.previewImage = group.dataValues.GroupImages[0]?.url || null;
        group.dataValues.createdAt = formatDate(group.dataValues.createdAt);
        group.dataValues.updatedAt = formatDate(group.dataValues.updatedAt);
        delete group.dataValues.GroupImages;

        return group;
    }));

    return res.json({ Groups: groups })
};

const getCurrentUserGroups = async (req, res, next) => {
    const id = req.user.id;

    const orgGroups = await Group.findAll({
        where: {
            organizerId: id
        },
        include: [
            {
                model: GroupImage,
                where: {
                    preview: true
                },
                required: false
            }
        ]
    });

    const joinedGroups = await Group.findAll({
        include: [
            {
                model: GroupMember,
                attributes: [],
                where: {
                    memberId: id
                }
            },
            {
                model: GroupImage,
                where: {
                    preview: true
                },
                required: false
            }
        ]
    })

    let groups = orgGroups.concat(joinedGroups);

    groups = await Promise.all(groups.map(async (group) => {
        group.dataValues.numMembers = await group.countUsers() + 1;
        group.dataValues.previewImage = group.dataValues.GroupImages[0]?.url || null;
        group.dataValues.createdAt = formatDate(group.dataValues.createdAt);
        group.dataValues.updatedAt = formatDate(group.dataValues.updatedAt);
        delete group.dataValues.GroupImages;

        return group
    }));

    return res.json({
        Groups: groups
    });
};

const getGroupById = async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            }
        ]
    });

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Couldn't find a Group with the specified id";
        err.status = 404;
        return next(err);
    }

    group.dataValues.numMembers = await group.countUsers() + 1;
    group.dataValues.createdAt = formatDate(group.dataValues.createdAt);
    group.dataValues.updatedAt = formatDate(group.dataValues.updatedAt);

    group.dataValues.Organizer = await User.unscoped().findByPk(group.dataValues.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    });

    return res.json(group)
};

const createGroup = async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const organizerId = req.user.id;

    const group = await Group.create({
        name,
        about,
        type,
        private,
        city,
        state,
        organizerId
    });

    group.dataValues.createdAt = formatDate(group.dataValues.createdAt);
    group.dataValues.updatedAt = formatDate(group.dataValues.updatedAt);

    return res.status(201).json(group);
};

const addGroupImage = async (req, res, next) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Couldn't find a Group with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== group.organizerId) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.errors = { message: 'Unauthorized' };
        err.status = 401;
        return next(err);
    }


    const { url, preview } = req.body;
    const image = await group.createGroupImage({ url, preview });

    return res.json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });
};

const editGroupById = async (req, res, next) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Couldn't find a Group with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== group.organizerId) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.errors = { message: 'Unauthorized' };
        err.status = 401;
        return next(err);
    }

    const { name, about, type, private, city, state } = req.body;
    await group.update({
        name,
        about,
        type,
        private,
        city,
        state
    });

    group.dataValues.createdAt = formatDate(group.dataValues.createdAt);
    group.dataValues.updatedAt = formatDate(group.dataValues.updatedAt);

    return res.json(group);
};

const deleteGroupById = async (req, res, next) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Couldn't find a Group with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== group.organizerId) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.errors = { message: 'Unauthorized' };
        err.status = 401;
        return next(err);
    }

    await group.destroy();

    return res.json({
        message: "Successfully deleted"
    });
};

const getAllVenuesByGroupId = async (req, res, next) => {
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

    if (req.user.id !== group.organizerId) {

        if (group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Unauthorized');
            err.title = 'Unauthorized';
            err.errors = { message: 'Unauthorized' };
            err.status = 401;
            return next(err);
        }
    }

    const venues = await group.getVenues({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })

    return res.json({ Venues: venues });
};

const createVenueByGroupId = async (req, res, next) => {
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

    if (req.user.id !== group.organizerId) {

        if (group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Unauthorized');
            err.title = 'Unauthorized';
            err.errors = { message: 'Unauthorized' };
            err.status = 401;
            return next(err);
        }
    }

    const { address, city, state, lat, lng } = req.body;
    const venue = await group.createVenue({
        address,
        city,
        state,
        lat,
        lng
    });


    return res.json({
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
    });
};

module.exports = {
    getAllGroups,
    getCurrentUserGroups,
    getGroupById,
    createGroup,
    addGroupImage,
    editGroupById,
    deleteGroupById,
    getAllVenuesByGroupId,
    createVenueByGroupId
}