import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SignupFormPage.css';
import { signup } from '../../store/session';
import { Navigate } from 'react-router-dom';

export default function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    if (sessionUser) return <Navigate to="/" replace={true} />

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = {};

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords must match'
            setErrors(newErrors);
            return;
        }

        return dispatch(signup({
            firstName,
            lastName,
            username,
            email,
            password
        })).catch(
            async (res) => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <label>
                First Name
                <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                />
                <div className='signup-error-holder'>
                    {errors.firstName && <p className='signup-errors'>{errors.firstName}</p>}
                </div>
            </label>
            <label>
                Last Name
                <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                />
                <div className='signup-error-holder'>
                    {errors.lastName && <p className='signup-errors'>{errors.lastName}</p>}
                </div>
            </label>
            <label>
                Email
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <div className='signup-error-holder'>
                    {errors.email && <p className='signup-errors'>{errors.email}</p>}
                </div>
            </label>
            <label>
                Username
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <div className='signup-error-holder'>
                    {errors.username && <p className='signup-errors'>{errors.username}</p>}
                </div>
            </label>
            <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <div className='signup-error-holder'>
                    {errors.password && <p className='signup-errors'>{errors.password}</p>}
                </div>
            </label>
            <label>
                Confirm Password
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
                <div className='signup-error-holder'>
                    {errors.confirmPassword && <p className='signup-errors'>{errors.confirmPassword}</p>}
                </div>
            </label>
            <button
                type='submit'
                disabled={username.length < 4 ||
                    password.length < 6}
            >
                Sign Up
            </button>
        </form>
    )
}