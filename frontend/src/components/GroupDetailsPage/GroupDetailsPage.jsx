import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupById, getGroupEventsById, selectGroupById } from '../../store/groups';
import { useEffect, useState } from 'react';
import './GroupDetails.css';

export default function GroupDetailsPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)
    const group = useSelector(selectGroupById(groupId));

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

    useEffect(() => {
        dispatch(getGroupById(groupId)).then(() => {
            dispatch(getGroupEventsById(groupId));
        }).then(() => {
            setIsLoaded(true);
        })

        return () => setIsLoaded(false);
    }, [dispatch, groupId])

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
                            <img src='/images/placeholder.jpeg' alt="group-image" />
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
                        {upcomingEvents.length > 0 && <h1>Upcoming</h1>}
                        {pastEvents.length > 0 && <h1>Past Events</h1>}
                    </div>
                </div>
            </>}
        </>
    )
}