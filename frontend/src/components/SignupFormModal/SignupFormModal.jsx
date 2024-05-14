import { useState } from 'react';
import { useDispatch } from 'react-redux';
import './SignupFormPage.css';
import { signup } from '../../store/session';
import { useModal } from '../../context/Modal';

export default function SignupFormModal({ navigateOnSignup }) {
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

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
        }))
            .then(() => {
                closeModal();
                return navigateOnSignup();
            })
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data?.errors) setErrors(data.errors);
                });
    }

    return (
        <form className='login-signup-form' onSubmit={handleSubmit}>
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
                disabled={
                    username.length < 4 ||
                    password.length < 6 ||
                    firstName.length < 1 ||
                    lastName.length < 1 ||
                    email.length < 1 ||
                    password !== confirmPassword
                }
            >
                Sign Up
            </button>
        </form>
    )
}