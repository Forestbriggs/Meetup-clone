const { Group, User, GroupMember, GroupImage, EventImage, Event } = require('../db/models');

const deleteGroupImageByImageId = async (req, res, next) => {
    const { imageId } = req.params;

    const image = await GroupImage.findByPk(imageId);

    if (!image) {
        const err = new Error("Group Image couldn't be found");
        err.title = "Couldn't find a Group Image with the specified id";
        err.status = 404;
        return next(err);
    }

    const group = await Group.findByPk(image.groupId, {
        include: {
            model: GroupMember,
            where: {
                memberId: req.user.id
            },
            required: false
        }
    })

    if (req.user.id !== group.dataValues.organizerId) {

        if (group.dataValues.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Forbidden');
            err.title = 'Forbidden';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        }
    }

    await image.destroy();

    return res.json({
        message: "Successfully deleted"
    })
};

const deleteEventImageByImageId = async (req, res, next) => {
    const { imageId } = req.params;

    const image = await EventImage.findByPk(imageId);

    if (!image) {
        const err = new Error("Event Image couldn't be found");
        err.title = "Couldn't find a Event Image with the specified id";
        err.status = 404;
        return next(err);
    }

    const event = await Event.findByPk(image.eventId, {
        include: [
            {
                model: Group,
                attributes: ['organizerId'],
                include: {
                    model: GroupMember,
                    where: {
                        memberId: req.user.id
                    },
                    required: false
                }
            }
        ]
    })

    if (req.user.id !== event.dataValues.Group.dataValues.organizerId) {

        if (event.dataValues.Group.dataValues.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Forbidden');
            err.title = 'Forbidden';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        }
    }

    await image.destroy();

    return res.json({
        message: "Successfully deleted"
    })
};

module.exports = {
    deleteGroupImageByImageId,
    deleteEventImageByImageId
}