import { useSelector } from 'react-redux';
import LandingPageCard from './LandingPageCard';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const sessionUser = useSelector(state => state.session.user);
    let disabled = false;
    if (sessionUser === null) disabled = true

    const navigate = useNavigate();
    const navigateHome = () => {
        return navigate('/')
    }

    return (
        <div id='LandingPage'>
            <div id="landing-page__top">
                <div>
                    <h1>The people platform — Where interests become friendships</h1>
                    <p>Embark on an adventure with fellow One Piece fans at Grand Line Gatherings, the ultimate community for meetups and events inspired by the legendary world of One Piece! Whether you&apos;re a seasoned pirate or just setting sail, our platform is designed to bring enthusiasts together to share their passion, forge new friendships, and create unforgettable memories!</p>
                </div>
                <img className='main-image' src="/images/GLG-banner.webp" alt="GLG-banner" />

            </div>
            <div id="landing-page__bottom">
                <h2>How Grand Line Gatherings works</h2>
                <p>Grand Line Gatherings connects One Piece fans by offering a platform to find and create themed events. Simply sign up to join the community, browse through various meetups, and RSVP to events that interest you. You can also organize your own gatherings, inviting others to share in your passion for the world of One Piece. Engage with fellow fans, participate in discussions, and build lasting friendships as you embark on exciting adventures together!</p>
                <div className='cards__container'>
                    <LandingPageCard
                        title="See all groups"
                        text="Navigate through our site to discover upcoming gatherings, connect with like-minded fans, and dive into discussions about your favorite arcs, characters, and theories."
                        image="/images/groups-images.jpg"
                        to='groups'
                    />
                    <LandingPageCard
                        title="Find an event"
                        text="Join us to find and organize events, from casual hangouts to epic conventions, all themed around the adventures of Luffy and the Straw Hat Pirates."
                        image="/images/events-image.avif"
                        to='events'
                    />
                    <LandingPageCard
                        title="Start a new group"
                        text="Set sail with us and start a crew that celebrates the spirit of adventure, camaraderie, and the boundless excitement of the Grand Line!"
                        image="/images/start-group.avif"
                        to="/groups/new"
                        disabled={disabled}
                    />
                </div>
                {!sessionUser && <OpenModalButton modalComponent={<SignupFormModal navigateOnSignup={navigateHome} />} buttonText="Join Grand Line Gatherings" />}
            </div>
        </div>
    )
}