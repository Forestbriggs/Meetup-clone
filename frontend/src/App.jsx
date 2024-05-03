import { useDispatch } from "react-redux";
import LoginFormPage from "./components/LoginFormPage";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import { restoreUser } from "./store/session";
import SignupFormPage from "./components/SignupFormPage";

function Layout() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        dispatch(restoreUser()).then(() => {
            setIsLoaded(true);
        });
    }, [dispatch]);

    return (
        <>
            {isLoaded && <Outlet />}
        </>
    )
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <h1>Welcome!</h1>
            },
            {
                path: 'login',
                element: <LoginFormPage />
            },
            {
                path: 'signup',
                element: <SignupFormPage />
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router} />
}

export default App;
