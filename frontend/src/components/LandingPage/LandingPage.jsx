import { useSelector } from 'react-redux';
import LandingPageCard from './LandingPageCard';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import './LandingPage.css';

export default function LandingPage() {
    const sessionUser = useSelector(state => state.session.user);
    let disabled = false;
    if (sessionUser === null) disabled = true
    return (
        <div id='LandingPage'>
            <div id="landing-page__top">
                <div>
                    <h1>Placerat in egestas — erat imperdiet sed euismod</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor orci eu lobortis elementum nibh tellus molestie.</p>
                </div>
                <img className='main-image' src="/images/placeholder.jpeg" alt="" />

            </div>
            <div id="landing-page__bottom">
                <h2>How Grand Line Gatherings works</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor orci eu lobortis elementum nibh tellus molestie.</p>
                <div className='cards__container'>
                    <LandingPageCard
                        title="See all groups"
                        text="Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        image="/images/placeholder.jpeg"
                        to='groups'
                    />
                    <LandingPageCard
                        title="Find an event"
                        text="Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        image="/images/placeholder.jpeg"
                        to='events'
                    />
                    <LandingPageCard
                        title="Start a new group"
                        text="Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        image="/images/placeholder.jpeg"
                        to="/groups/new"
                        disabled={disabled}
                    />
                </div>
                {!sessionUser && <OpenModalButton modalComponent={<SignupFormModal />} buttonText="Join Grand Line Gatherings" />}
            </div>
        </div>
    )
}