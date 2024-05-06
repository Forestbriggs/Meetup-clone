import { useModal } from "../../context/Modal";

export default function OpenModalButton({
    modalComponent,
    buttonText,
    onButtonClick,
    onModalClose
}) {
    const { setModalContent, setOnModalClose } = useModal();

    let className = "";
    if (buttonText === 'Sign Up') className = 'signup-button';
    if (buttonText === 'Log In') className = 'login-button'

    const handleClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent)
        if (typeof onButtonClick === 'function') onButtonClick();
    }

    return (
        <button
            className={className}
            onClick={handleClick}
        >
            {buttonText}
        </button>
    )
}