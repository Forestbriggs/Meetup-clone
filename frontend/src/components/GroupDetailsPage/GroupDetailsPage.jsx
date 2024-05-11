import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupById, getGroupEventsById, selectGroupById } from '../../store/groups';
import { useEffect, useState } from 'react';
import './GroupDetails.css';
import EventCard from './EventCard';

export default function GroupDetailsPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)
    const group = useSelector(selectGroupById(groupId));


    //* sort events by date - split by upcoming and past
    const upcomingEvents = [];
    const pastEvents = [];
    if (group?.Events) {
        const now = new Date();
        group.Events.forEach((event) => {
            const eventStart = new Date(event.startDate);
            if (eventStart >= now) {
                upcomingEvents.push(event);
            } else {
                pastEvents.push(event);
            }
        })
    }

    upcomingEvents.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    })

    pastEvents.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    })

    //* check for previewImage
    let previewImg;
    if (group?.GroupImages) {
        group.GroupImages.forEach((img) => {
            if (img.preview) {
                previewImg = img.url;
                return;
            }
        })
    }

    //* Load group and group events
    useEffect(() => {
        dispatch(getGroupById(groupId)).then(() => {
            dispatch(getGroupEventsById(groupId));
        }).then(() => {
            setIsLoaded(true);
        })

        return () => setIsLoaded(false);
    }, [dispatch, groupId])


    //* Click events
    const handleBackClick = () => {
        navigate('..');
    }

    const handleJoinClick = () => {
        alert('Feature Coming Soon...')
    }

    const handleCreateEventClick = () => {
        alert('Feature coming soon')
    }

    const handleUpdate = () => {
        alert('Feature coming soon')
    }

    const handleDelete = () => {
        alert('Feature coming soon')
    }

    return (
        <>
            {isLoaded && <>
                <div id='GroupDetails'>
                    <div id='group-header__container'>
                        <div className="back-tracker" onClick={handleBackClick}><span>{'< '}</span><a>Groups</a></div>
                        <div className="group-header">
                            <img src={group.previewImage ? `${group.previewImage}` : previewImg ? `${previewImg}` : '/images/placeholder.jpeg'} alt="group-image" />
                            <div>
                                <div>
                                    <h1>{group.name}</h1>
                                    <p>{group.city}, {group.state}</p>
                                    <div>
                                        <p>{group.numMembers} members</p>
                                        •
                                        <p>{group.private ? 'Private' : 'Public'} group</p>
                                    </div>
                                    <p>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</p>
                                </div>
                                {sessionUser && sessionUser.id !== group.Organizer.id && <button onClick={handleJoinClick}>Join this group</button>}
                                {sessionUser && sessionUser.id === group.Organizer.id && <div className='manage-group-button__container'>
                                    <button
                                        onClick={handleCreateEventClick}
                                    >Create Event</button>
                                    <button
                                        onClick={handleUpdate}
                                    >Update</button>
                                    <button
                                        onClick={handleDelete}
                                    >Delete</button>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className='split'></div>
                    <div className='group-bottom__container'>
                        <div className='group-bottom__header'>
                            <h2>Organizer</h2>
                            <p>{group.Organizer.firstName} {group.Organizer.lastName}</p>
                        </div>
                        <div className='group-bottom__about'>
                            <h2>What we&apos;re about</h2>
                            <article>{group.about}</article>
                        </div>
                        {upcomingEvents.length > 0 && <div id='upcoming-events'>
                            <h2>Upcoming Events ({upcomingEvents.length})</h2>
                            <div className='event-card__container'>
                                {upcomingEvents.map((event) => {
                                    return <EventCard key={event.id} event={event} />
                                })}
                            </div>
                        </div>}
                        {pastEvents.length > 0 && <div id='past-events'>
                            <h2>Past Events ({pastEvents.length})</h2>
                            <div className="event-card__container">
                                {pastEvents.map((event) => {
                                    return <EventCard key={event.id} event={event} />
                                })}
                            </div>
                        </div>}
                        {upcomingEvents.length === 0 && pastEvents.length === 0 &&
                            <h2>No Upcoming Events</h2>
                        }
                    </div>
                </div>
            </>}
        </>
    )
}