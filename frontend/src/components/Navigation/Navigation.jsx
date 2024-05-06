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

    return (
        <ul className='nav-container'>
            <span onClick={handleNameClick}>Grand Line Gatherings</span>
            <nav className='NavBar'>
                <NavLink to="/">Home</NavLink>
                {
                    //* Renders when not logged in
                }
                {!sessionUser && <>
                    <OpenModalButton
                        buttonText={"Log In"}
                        modalComponent={<LoginFormModal />}
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
                    <ProfileButton user={sessionUser} />
                </>}
            </nav>
        </ul>
    )
}