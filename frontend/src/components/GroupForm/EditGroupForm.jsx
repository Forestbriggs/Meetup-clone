import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editGroup, getGroupById, selectGroupById } from '../../store/groups';
import { useNavigate, useParams } from 'react-router-dom';
import GroupForm from "./GroupForm";
import './GroupForm.css';

export default function EditGroupForm() {
    const { groupId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector(selectGroupById(groupId));

    const city = group?.city;
    const state = group?.state;
    const [location, setLocation] = useState(`${city}, ${state}`);
    const [name, setName] = useState(group?.name);
    const [about, setAbout] = useState(group?.about);
    const [type, setType] = useState(group?.type);
    const [isPrivate, setIsPrivate] = useState(group?.private);
    // const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (typeof group !== 'object') {
            dispatch(getGroupById(groupId)).then((data) => {
                setLocation(`${data.city}, ${data.state}`);
                setName(data.name);
                setAbout(data.about);
                setType(data.type);
                setIsPrivate(data.private);
                setIsLoaded(true);
            })
        } else {
            setIsLoaded(true)
        }

        return () => setIsLoaded(false);
    }, [dispatch, groupId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = {};
        if (location.length === 0) newErrors.city = 'Location is required';
        if (name.length === 0) newErrors.name = 'Name is required';
        if (about.length < 30) newErrors.about = 'Description must be at least 30 characters long';
        if (type === 'null') newErrors.type = 'Group Type is required';
        if (isPrivate === 'null') newErrors.private = 'Visibility Type is required';
        // if (!imageUrl.endsWith('.png') &&
        //     !imageUrl.endsWith('.jpg') &&
        //     !imageUrl.endsWith('.jpeg')) {
        //     newErrors.image = 'Image URL must end in .png, .jpg, or .jpeg';
        // }

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

        return dispatch(editGroup(groupId, payload)).then((data) => {
            return navigate(`/groups/${data.id}`);
        }).catch(
            async (data) => {
                if (data?.errors) setErrors(data.errors);
            }
        )
    }

    return (
        <>
            {isLoaded &&
                <div className="form-container">
                    <h3>UPDATE YOUR GROUP&apos;S INFORMATION</h3>
                    <h2>We&apos;ll walk you through a few steps to build your local community</h2>
                    <div className="split" />
                    <form onSubmit={handleSubmit}>
                        <GroupForm
                            formType='edit'
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
                            errors={errors}
                        />
                        <button className='group-button'>Update group</button>
                    </form >
                </div >
            }
        </>
    )
}