import './DeleteGroupModal.css';

export default function DeleteGroupModal() {
    return (
        <div id="DeleteGroupModal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <button className='confirm'>Yes (Delete Group)</button>
            <button className='no'>No (Keep Group)</button>
        </div>
    )
}