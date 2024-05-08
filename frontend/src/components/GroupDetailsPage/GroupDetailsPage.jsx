import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupById, selectGroupById } from '../../store/groups';
import { useEffect, useState } from 'react';
import './GroupDetails.css';

export default function GroupDetailsPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)
    const group = useSelector(selectGroupById(groupId));

    useEffect(() => {
        dispatch(getGroupById(groupId)).then(() => {
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
                                {sessionUser && <button onClick={handleJoinClick}>Join this group</button>}
                            </div>
                        </div>
                    </div>
                    <div className='split'></div>
                </div>
            </>}
        </>
    )
}