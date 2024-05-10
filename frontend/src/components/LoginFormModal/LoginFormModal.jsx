import { useState } from "react";
import { login } from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { useNavigate } from "react-router-dom";

const LoginFormModal = () => {
    const dispatch = useDispatch();

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(login(credential, password))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data?.errors) setErrors(data.errors);
                }
            )
    }

    const handleDemoUserLogin = () => {
        setErrors({});
        return dispatch(login('Demo-lition', 'password'))
            .then(closeModal);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="login-error-container">
                {errors.credential && <p className="errors">{errors.credential}</p>}
            </div>
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
                <div className="password-container">
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
                </div>
            </label>
            <button
                type="submit"
                disabled={credential.length < 4 || password.length < 6}
            >
                Log In
            </button>

            <a
                id="demo-user-login"
                onClick={handleDemoUserLogin}
            >
                Log in as Demo User
            </a>
        </form>
    )
}

export default LoginFormModal;