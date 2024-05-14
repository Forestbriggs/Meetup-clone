import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteEvent } from '../../store/events';

export default function DeleteEventModal({ navigateOnDelete, eventId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(deleteEvent(eventId));
        closeModal();
        return navigateOnDelete();
    }

    return (
        <div id="DeleteGroupModal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this event?</p>
            <button
                className='confirm'
                onClick={handleDelete}
            >Yes (Delete Event)</button>
            <button
                className='no'
                onClick={closeModal}
            >No (Keep Event)</button>
        </div>
    )
}