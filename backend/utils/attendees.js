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

module.exports = {
    getAttendeesByEventId
};