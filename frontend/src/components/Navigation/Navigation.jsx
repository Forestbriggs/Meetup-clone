import { NavLink } from 'react-router-dom';
import './Navigation.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/session';
import ProfileButton from './ProfileButton';

export default function Navigation() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
    }

    return (
        <ul className='NavBar'>
            <NavLink to="/">Home</NavLink>
            {
                //* Renders when not logged in
            }
            {!sessionUser && <>
                <NavLink to="login">Login</NavLink>
                <NavLink to="signup">Sign Up</NavLink>
            </>}

            {
                //* Renders when logged in
            }
            {sessionUser && <>
                <ProfileButton user={sessionUser} />
                <button onClick={handleLogout}>Logout</button>
            </>}
        </ul>
    )
}