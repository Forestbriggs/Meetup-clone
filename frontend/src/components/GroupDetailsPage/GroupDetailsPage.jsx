import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getGroupById, selectCurrentGroup } from '../../store/groups';
import { useEffect, useState } from 'react';

export default function GroupDetailsPage() {
    const { groupId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const group = useSelector(selectCurrentGroup);

    useEffect(() => {
        dispatch(getGroupById(groupId)).then(() => {
            setIsLoaded(true);
        })
    }, [dispatch, groupId])

    return (
        <>
            {isLoaded && <h1>{group.name}</h1>}
        </>
    )
}