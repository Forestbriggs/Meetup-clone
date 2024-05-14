import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupById, selectGroupById } from "../../store/groups";
import EventForm from "./EventForm";
import './EventForm.css';
import { createEvent, createEventImage } from "../../store/events";

export default function CreateEventForm() {
    const { groupId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector(selectGroupById(groupId));
    let groupName = group?.name;

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    // const [isPrivate, setIsPrivate] = useState('');
    const [price, setPrice] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    // const [venueId, setVenueId] = useState('');
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
        e.preventDefault();
        setErrors({});
        const newErrors = {};
        if (name.length === 0) newErrors.name = 'Name is required';
        if (type === '') newErrors.type = 'Event Type is required';
        if (price.length === 0) newErrors.price = 'Price is required';
        if (capacity.length === 0) newErrors.capacity = 'Capacity is required';
        if (startDate.length === 0) newErrors.startDate = 'Event start is required';
        if (endDate.length === 0) newErrors.endDate = 'Event end is required';
        if (!imageUrl.endsWith('.png') &&
            !imageUrl.endsWith('.jpg') &&
            !imageUrl.endsWith('.jpeg')) {
            newErrors.image = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (description.length < 30) {
            newErrors.description =
                'Description must be at least 30 characters long'
        }

        if (Object.values(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            name,
            type,
            capacity: Number(capacity),
            price: Number(price),
            description,
            startDate,
            endDate
        }

        return dispatch(createEvent(groupId, payload)).then(async (data) => {
            dispatch(createEventImage(data.id, { url: imageUrl, preview: true }));
            navigate(`/events/${data.id}`);
        }).catch(
            async (res) => {
                console.log(res);
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        )
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
                            // isPrivate={isPrivate}
                            // setIsPrivate={setIsPrivate}
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
                            // venueId={venueId}
                            // setVenueId={setVenueId}
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