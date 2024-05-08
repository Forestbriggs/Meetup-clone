import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import { restoreUser } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsListPage from "./components/GroupsListPage";
import GroupDetailsPage from "./components/GroupDetailsPage";

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
                element: <LandingPage />
            },
            {
                path: 'groups',
                element: <GroupsListPage />,
            },
            {
                path: 'groups/:groupId',
                element: <GroupDetailsPage />
            },
            {
                path: '*',
                element: <h1>Page Not Found</h1>
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router} />
}

export default App;
