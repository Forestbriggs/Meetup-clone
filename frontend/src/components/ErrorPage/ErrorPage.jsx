import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

export default function ErrorPage() {
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    }

    return (
        <div id="error-page">
            <h1>Oh no!</h1>
            <h1>What you searched for doesn&apos;t seem to exist!</h1>
            <button
                onClick={navigateHome}
            >
                Return Home
            </button>
        </div>
    )
}