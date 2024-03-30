const { Venue, Group, GroupMember } = require('../db/models');

//* Route Functions ------------------------------------------------------------
const editVenueById = async (req, res, next) => {
    const { venueId } = req.params;
    const venue = await Venue.findByPk(venueId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: Group,
                include: [
                    {
                        model: GroupMember,
                        where: {
                            memberId: req.user.id
                        },
                        required: false
                    }
                ]
            }
        ]
    });

    if (!venue) {
        const err = new Error("Venue couldn't be found");
        err.title = "Couldn't find a Venue with the specified id";
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== venue.Group.dataValues.organizerId) {

        if (venue.Group.GroupMembers[0]?.dataValues.status !== 'co-host') {
            const err = new Error('Forbidden');
            err.title = 'Forbidden';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        }
    }

    const { address, city, state, lat, lng } = req.body;
    await venue.update({
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
    editVenueById,
}