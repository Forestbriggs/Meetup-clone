import { NavLink, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

export default function Navigation() {
    const sessionUser = useSelector(state => state.session.user);

    const navigate = useNavigate();

    const handleNameClick = () => {
        return navigate('/')
    }

    const navigateHome = () => {
        navigate('/');
    }

    return (
        <ul
            className='nav-container'
        >
            <div className='logo-container' onClick={handleNameClick}>
                <img src="/favicon-32x32.png" alt="GLG-Logo" />
                <span>Grand Line Gatherings</span>
            </div>
            <nav className='NavBar'>
                {
                    //* Renders when not logged in
                }
                {!sessionUser && <>
                    <OpenModalButton
                        buttonText={"Log In"}
                        modalComponent={<LoginFormModal navigateOnLogin={navigateHome} />}
                    />
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal navigateOnSignup={navigateHome} />}
                    />
                </>}

                {
                    //* Renders when logged in
                }
                {sessionUser && <>
                    <NavLink to="/groups/new">Start a new group</NavLink>
                    <ProfileButton user={sessionUser} />
                </>}
            </nav>
        </ul>
    )
}