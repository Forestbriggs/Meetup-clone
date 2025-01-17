import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
    const {
        id, name, type, startDate, previewImage, Group, Venue, description } = event;

    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState(previewImage ? `${previewImage}` : `/images/background.webp`)

    const split = startDate.split(' ')
    const date = split[0].slice(0, -1) //* Cut comma off end
    const time = split[1].slice(0, -3) + ' ' + split[2];

    const handleClick = () => {
        navigate(`/events/${id}`);
    }

    return (
        <div onClick={handleClick} className="event-card">
            <div className="event-card__upper">
                <img
                    src={imgSrc}
                    alt="event-image"
                    onError={() => setImgSrc('/images/background.webp')}
                />
                <div className="event-card__details">
                    <p>{date} <span>•</span> {time}</p>
                    <h3>{name}</h3>
                    <p>{type === 'Online' ? 'Online' :
                        Venue !== null ? `${Venue?.city}, ${Venue.state}` :
                            `${Group?.city}, ${Group?.state}`} </p>
                </div>
            </div>
            <div className="event-card__lower">
                <p>{description}</p>
            </div>
        </div>
    )
}