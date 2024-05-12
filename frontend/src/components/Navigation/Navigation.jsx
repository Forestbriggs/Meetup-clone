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

    const navigateOnLogin = () => {
        navigate('/');
    }

    return (
        <ul
            className='nav-container'
        >
            <span onClick={handleNameClick}>Grand Line Gatherings</span>
            <nav className='NavBar'>
                {
                    //* Renders when not logged in
                }
                {!sessionUser && <>
                    <OpenModalButton
                        buttonText={"Log In"}
                        modalComponent={<LoginFormModal navigateOnLogin={navigateOnLogin} />}
                    />
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
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