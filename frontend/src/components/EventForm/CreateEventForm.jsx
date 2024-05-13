import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupById, selectGroupById } from "../../store/groups";
import EventForm from "./EventForm";
import './EventForm.css';

export default function CreateEventForm() {
    const { groupId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector(selectGroupById(groupId));
    let groupName = group?.name;

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState('');
    const [price, setPrice] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [venueId, setVenueId] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (typeof group !== 'object') {
            dispatch(getGroupById(groupId)).then(() => {
                setIsLoaded(true);
            })
        } else {
            setIsLoaded(true);
        }

        return () => setIsLoaded(false);
    }, [dispatch, groupId, group])

    const handleSubmit = (e) => {
        e.stopPropagation();
        alert('coming soon')
    }

    return (
        <>
            {isLoaded &&
                <div className="event-form-container">
                    <h1>Create an event for {groupName}</h1>
                    <form onSubmit={handleSubmit}>
                        <EventForm
                            name={name}
                            setName={setName}
                            type={type}
                            setType={setType}
                            isPrivate={isPrivate}
                            setIsPrivate={setIsPrivate}
                            price={price}
                            setPrice={setPrice}
                            capacity={capacity}
                            setCapacity={setCapacity}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            imageUrl={imageUrl}
                            setImageUrl={setImageUrl}
                            venueId={venueId}
                            setVenueId={setVenueId}
                            description={description}
                            setDescription={setDescription}
                            errors={errors}
                        />
                        <button className="group-button">Create event</button>
                    </form>
                </div>
            }
        </>
    )
}