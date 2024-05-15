import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, createGroupImage } from '../../store/groups';
import { useNavigate } from 'react-router-dom';
import GroupForm from "./GroupForm";
import './GroupForm.css';

export default function CreateGroupForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('null');
    const [isPrivate, setIsPrivate] = useState('null');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        if (sessionUser === null) {
            navigate('/')
        }
    }, [navigate, sessionUser])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = {};
        if (location.length === 0) newErrors.city = 'Location is required';
        if (name.length === 0) newErrors.name = 'Name is required';
        if (about.length < 50) newErrors.about = 'Description must be at least 50 characters long';
        if (about.length > 255) newErrors.about - 'Description must be less than 255 characters';
        if (type === 'null') newErrors.type = 'Group Type is required';
        if (isPrivate === 'null') newErrors.private = 'Visibility Type is required';
        if (!imageUrl.endsWith('.png') &&
            !imageUrl.endsWith('.jpg') &&
            !imageUrl.endsWith('.jpeg')) {
            newErrors.image = 'Image URL must end in .png, .jpg, or .jpeg';
        }

        if (Object.values(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        const splitLocation = location.split(', ');
        const city = splitLocation[0];
        const state = splitLocation[1];
        const payload = {
            name,
            about,
            type,
            private: isPrivate === 'true' ? true : false,
            city,
            state
        }

        return dispatch(createGroup(payload)).then(async (data) => {
            dispatch(createGroupImage(data.id, { url: imageUrl, preview: true }))
            navigate(`/groups/${data.id}`)
        }).catch(
            async (res) => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        )
    }

    return (
        <div className="form-container">
            <h3>BECOME AN ORGANIZER</h3>
            <h2>We&apos;ll walk you through a few steps to build your local community</h2>
            <div className="split" />
            <form onSubmit={handleSubmit}>
                <GroupForm
                    formType='create'
                    location={location}
                    setLocation={setLocation}
                    name={name}
                    setName={setName}
                    about={about}
                    setAbout={setAbout}
                    type={type}
                    setType={setType}
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    errors={errors}
                />
                <button className='group-button'>Create group</button>
            </form >
        </div >
    )
}