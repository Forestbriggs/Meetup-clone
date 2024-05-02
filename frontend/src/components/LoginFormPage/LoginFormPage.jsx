import { useState } from "react";
import { login } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';

const LoginFormPage = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    if (sessionUser) return <Navigate to="/" replace={true} />;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(login(credential, password)).catch(
            async (res) => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username / Email
                <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
            </label>

            <label>
                Password
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <i
                    className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                    onClick={() => setShowPassword(!showPassword)}
                ></i>
            </label>
            {errors.credential && <p>{errors.credential}</p>}
            <button
                type="submit"
            >
                Log In
            </button>
        </form>
    )
}

export default LoginFormPage;