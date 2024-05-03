import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import { restoreUser } from "./store/session";
import Navigation from "./components/Navigation/Navigation";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";


function Layout() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(restoreUser()).then(() => {
            setIsLoaded(true);
        });
    }, [dispatch]);

    const content = <>
        <Navigation />
        <Outlet />
    </>

    return (
        <>
            {isLoaded && content}
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
