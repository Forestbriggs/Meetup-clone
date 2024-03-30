const { Event, EventAttendee, User, GroupMember, Group } = require('../db/models');

const getAttendeesByEventId = async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.title = "Couldn't find an Event with the specified id";
        err.status = 404;
        return next(err);
    }

    const group = await Group.findByPk(event.dataValues.groupId, {
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

    let attendees = await User.findAll({
        attributes: {
            exclude: ['username']
        },
        include: [
            {
                model: EventAttendee,
                where: {
                    eventId: event.dataValues.id
                },
                attributes: ['status']
            }
        ]
    });

    await Promise.all(attendees.map(async (member) => {
        member.dataValues.Attendance = member.dataValues.EventAttendees[0];
        delete member.dataValues.EventAttendees;
    }));

    if (req.user.id !== group.dataValues.organizerId) {


        if (group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            attendees = attendees.filter((member) => {
                return member.dataValues.Attendance.status !== 'pending';
            })
        }
    }

    return res.json({ Attendees: attendees });
};

const requestEventAttendanceByEventId = async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.title = "Couldn't find an Event with the specified id";
        err.status = 404;
        return next(err);
    }

    const group = await Group.findByPk(event.dataValues.groupId, {
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

    if (!group.dataValues.GroupMembers[0]) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.errors = { message: 'Unauthorized' };
        err.status = 403;
        return next(err);
    }

    const userIsAttending = await EventAttendee.findOne({
        where: {
            eventId,
            userId: req.user.id
        }
    });

    if (userIsAttending) {
        if (userIsAttending.dataValues.status === 'pending') {
            const err = new Error("Attendance has already been requested");
            err.title = "Member already has a status of 'pending'"
            err.status = 400;
            return next(err);
        } else {
            const err = new Error("User is already an attendee of the event");
            err.title = "Member is already attending event"
            err.status = 400;
            return next(err);
        }
    }

    const user = await User.findByPk(req.user.id);

    const newAttendee = await event.createEventAttendee({
        userId: user.id
    });

    delete newAttendee.dataValues.createdAt;
    delete newAttendee.dataValues.updatedAt;
    delete newAttendee.dataValues.eventId;

    res.json(newAttendee)
};

const changeAttendanceStatusByEventId = async (req, res, next) => {
    const { eventId } = req.params;
    const { userId, status } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.title = "Couldn't find an Event with the specified id";
        err.status = 404;
        return next(err);
    }

    const userExists = await User.findByPk(userId);

    if (!userExists) {
        const err = new Error("User couldn't be found");
        err.title = "Couldn't find a User with the specified id";
        err.status = 404;
        return next(err);
    }

    const userIsPending = await EventAttendee.findOne({
        attributes: ['id', 'userId', 'eventId', 'status'],
        where: {
            userId,
            eventId
        }
    });

    if (!userIsPending) {
        const err = new Error("Attendance between the user and the event does not exist");
        err.title = "Attendance does not exist";
        err.status = 404;
        return next(err);
    }

    const group = await Group.findByPk(event.dataValues.groupId, {
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

    if (req.user.id !== group.dataValues.organizerId) {
        if (group.dataValues.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Unauthorized');
            err.title = 'Unauthorized';
            err.errors = { message: 'Unauthorized' };
            err.status = 403;
            return next(err);
        }
    }

    await userIsPending.update({
        status
    });

    delete userIsPending.dataValues.updatedAt;

    return res.json(userIsPending)
};

module.exports = {
    getAttendeesByEventId,
    requestEventAttendanceByEventId,
    changeAttendanceStatusByEventId
};