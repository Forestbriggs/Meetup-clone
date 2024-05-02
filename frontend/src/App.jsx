import { useDispatch } from "react-redux";
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import { restoreUser } from "./store/session";

function Layout() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

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
        ]
    }
])

function App() {
    return <RouterProvider router={router} />
}

export default App;
