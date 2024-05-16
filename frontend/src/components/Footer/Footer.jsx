import './Footer.css';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
// import { FaUserCircle } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer>
            <div>
                <div><p>Forest Briggs</p></div>
                <div id='about-links'>
                    {/* <Link
                        to={'REPLACE WITH PORTFOLIO'}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <FaUserCircle className='fa-xl' />
                    </Link> */}
                    <Link
                        to={'https://github.com/Forestbriggs/Grand-line-gatherings'}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <FaGithub className='fa-xl' />
                    </Link>
                    <Link
                        to={'https://linkedin.com/in/forest-briggs'}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <FaLinkedin className='fa-xl' />
                    </Link>
                </div>
            </div>
        </footer >
    )
}