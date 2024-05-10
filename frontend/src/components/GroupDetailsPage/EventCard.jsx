import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
    const {
        id, groupId, venueId, name, type, startDate,
        endDate, numAttending, previewImage, Group, Venue, description } = event;

    const navigate = useNavigate();

    const split = startDate.split(' ')
    const date = split[0].slice(0, -1) //* Cut comma off end
    const time = split[1].slice(0, -3) + ' ' + split[2];

    const handleClick = () => {
        navigate(`/events/${id}`);
    }

    return (
        <div onClick={handleClick} className="event-card">
            <div className="event-card__upper">
                <img src={previewImage ? `${previewImage}` : `/images/placeholder.jpeg`} alt="event-image" />
                <div className="event-card__details">
                    <p>{date} <span>•</span> {time}</p>
                    <h3>{name}</h3>
                    <p>{type === 'Online' ? 'Online' : `${Venue.city}, ${Venue.state}`}</p>
                </div>
            </div>
            <div className="event-card__lower">
                <p>{description}</p>
            </div>
        </div>
    )
}