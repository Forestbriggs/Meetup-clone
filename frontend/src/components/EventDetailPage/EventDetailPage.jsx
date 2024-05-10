import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { getEventDetailsById, selectEventById } from '../../store/events';
import { getGroupById, selectGroupById } from "../../store/groups";
import './EventDetails.css';
import { FaRegClock, FaMapPin } from "react-icons/fa6";
import { AiOutlineDollarCircle } from "react-icons/ai";

export default function EventDetailPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const event = useSelector(selectEventById(eventId));
    const group = useSelector(selectGroupById(event?.groupId));
    if (typeof group !== 'object' && typeof event === 'object') {
        dispatch(getGroupById(event?.groupId))
    }

    useEffect(() => {
        dispatch(getEventDetailsById(eventId)).then(() => {
            setIsLoaded(true);
        })

        return () => setIsLoaded(false);
    }, [dispatch, eventId])

    let eventPreviewImg;
    if (event?.EventImages) {
        event.EventImages.forEach((img) => {
            if (img.preview) {
                eventPreviewImg = img.url;
                return;
            }
        })
    }

    let groupPreviewImg;
    if (group?.GroupImages) {
        group.GroupImages.forEach((img) => {
            if (img.preview) {
                groupPreviewImg = img.url;
                return;
            }
        })
    }

    let splitStart;
    let startDate;
    let startTime;
    let splitEnd;
    let endDate;
    let endTime;

    if (typeof event === 'object') {
        splitStart = event?.startDate.split(' ');
        startDate = splitStart[0].slice(0, -1); //* Cut comma off end
        startTime = splitStart[1].slice(0, -3) + ' ' + splitStart[2];
        splitEnd = event?.endDate.split(' ');
        endDate = splitEnd[0].slice(0, -1);
        endTime = splitStart[1].slice(0, -3) + ' ' + splitEnd[2];
    }

    const handleBackClick = () => {
        navigate('..');
    }

    const handleGroupClick = () => {
        navigate(`/groups/${group.id}`);
    }

    const handleUpdate = () => {
        alert('Feature coming soon ...');
    }

    const handleDelete = () => {
        alert('Feature coming soon...');
    }

    return (
        <>
            {isLoaded && group && <>
                <div id="EventDetails">
                    <div id="event-header__container">
                        <div className="back-tracker"
                            onClick={handleBackClick}>
                            <span>{'< '}</span>
                            <a>Events</a>
                        </div>
                        <div className="event-header">
                            <h1>{event.name}</h1>
                            <p>Hosted by: {group?.Organizer.firstName} {group?.Organizer.lastName}</p>
                            <div id="event-header">
                                <img src={event.previewImage ? `${event.previewImage}` :
                                    eventPreviewImg ? `${eventPreviewImg}` :
                                        '/images/placeholder.jpeg'} alt="event-image" />
                                <div>
                                    <div
                                        className="mini-group-card"
                                        onClick={handleGroupClick}
                                    >
                                        <img src={group.previewImage ? `${group.previewImage}` :
                                            groupPreviewImg ? `${groupPreviewImg}` :
                                                '/images/placeholder.jpeg'} alt="" />
                                        <div>
                                            <h3>{group.name}</h3>
                                            <p>{group.private ? 'Private' : 'Public'}</p>
                                        </div>
                                    </div>
                                    <div id="event-info-card">
                                        <div>
                                            <FaRegClock />
                                            <div className="times">
                                                <p>Start {startDate} • {startTime}</p>
                                                <p>End {endDate} • {endTime}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <AiOutlineDollarCircle />
                                            <p>{event.price > 0 ? `$${event.price}` : 'FREE'}</p>
                                        </div>
                                        <div className={sessionUser && sessionUser.id === group?.Organizer.id ?
                                            'loc-manage__container' : ''}>
                                            <div className="location">
                                                <FaMapPin />
                                                <p>{event.type}</p>
                                            </div>
                                            {sessionUser && sessionUser.id === group.Organizer.id &&
                                                <div id="manage-event-buttons">
                                                    <button
                                                        onClick={handleUpdate}
                                                    >Update</button>
                                                    <button
                                                        onClick={handleDelete}
                                                    >Delete</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="event-details">
                                <h2>Details</h2>
                                <article>{event.description}</article>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
}