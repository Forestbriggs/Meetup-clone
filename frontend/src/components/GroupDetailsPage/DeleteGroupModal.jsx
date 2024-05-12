import { useDispatch } from 'react-redux';
import './DeleteGroupModal.css';
import { useModal } from '../../context/Modal';
import { deleteGroup } from '../../store/groups';
import { useParams } from 'react-router-dom';

export default function DeleteGroupModal({ navigateOnDelete, groupId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(deleteGroup(groupId));
        closeModal();
        return navigateOnDelete()
    }

    return (
        <div id="DeleteGroupModal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <button
                className='confirm'
                onClick={handleDelete}
            >Yes (Delete Group)</button>
            <button
                className='no'
                onClick={closeModal}
            >No (Keep Group)</button>
        </div>
    )
}