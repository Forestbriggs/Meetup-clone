import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

export default function Navigation() {
    const sessionUser = useSelector(state => state.session.user);
    const navigate = useNavigate();

    const handleClick = () => {
        return navigate('/signup')
    }

    const handleNameClick = () => {
        return navigate('/')
    }

    return (
        <ul className='nav-container'>
            <span onClick={handleNameClick}>Grand Line Gatherings</span>
            <nav className='NavBar'>
                <NavLink to="/">Home</NavLink>
                {
                    //* Renders when not logged in
                }
                {!sessionUser && <>
                    <NavLink to="login">Login</NavLink>
                    <button
                        className='signup-button'
                        onClick={handleClick}
                    >
                        Sign Up
                    </button>
                </>}

                {
                    //* Renders when logged in
                }
                {sessionUser && <>
                    <ProfileButton user={sessionUser} />
                </>}
            </nav>
        </ul>
    )
}