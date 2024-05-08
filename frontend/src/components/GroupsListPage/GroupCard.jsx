import { useNavigate } from "react-router-dom"

export default function GroupCard({ group }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`${group.id}`)
    }
    return (
        <div className="card" onClick={handleClick}>
            {group.previewImage &&
                <img
                    src={group.previewImage ? `url(${group.previewImage})` : '/images/placeholder.jpeg'}
                    height='100px'
                    width='180px'
                    alt="group-image" />
            }
            <div className="card-content">
                <h2>{group.name}</h2>
                <p>{group.city}, {group.state}</p>
                <p>{group.about}</p>
                <div>
                    <p>{group.numMembers} members</p>
                    <span>•</span>
                    <p>{group.private ? 'Private' : 'Public'}</p>
                </div>
            </div>
        </div>
    )
}