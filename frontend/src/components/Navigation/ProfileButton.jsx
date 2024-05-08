import { FaUserCircle } from "react-icons/fa";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../store/session";
import { useEffect, useRef, useState } from "react";

export default function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); //* Keep click from bubbling up to document and triggering close menu
        setShowMenu(!showMenu);
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        navigate('/');
    }

    const ulClassName = "profile-dropdown " + (showMenu ? "" : "hidden")

    return (
        <>
            <button
                className="profile-button"
                onClick={toggleMenu}>
                <FaUserCircle />
                {showMenu ? <RxCaretUp /> : <RxCaretDown />}
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li className="logout-link" onClick={handleLogout}>Log Out</li >
            </ul >
        </>
    )
}