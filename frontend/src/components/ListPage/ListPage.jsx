import { NavLink } from 'react-router-dom';
import GroupsListPage from "../GroupsListPage";
import './ListPage.css';

export default function ListPage({ type }) {
    window.scrollTo({ top: 0 })

    return (
        <div id="ListPage">
            <div id="search-header">
                <NavLink
                    className={type === 'events' ? 'active' : ''}
                    to="/events"
                >Events</NavLink>
                <NavLink
                    className={type === 'groups' ? 'active' : ''}
                    to="/groups"
                >Groups</NavLink>
            </div>
            {type === 'groups' ? <GroupsListPage /> : <h1>events</h1>}
        </div >
    )
}