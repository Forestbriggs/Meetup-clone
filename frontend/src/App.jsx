import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import { restoreUser } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ListPage from "./components/ListPage";
import GroupDetailsPage from "./components/GroupDetailsPage";
import EventDetailPage from "./components/EventDetailPage";
import CreateGroupForm from "./components/GroupForm";
import EditGroupForm from "./components/GroupForm/EditGroupForm";
import CreateEventForm from "./components/EventForm/CreateEventForm";
import ErrorPage from './components/ErrorPage';

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
                children: [
                    {
                        index: true,
                        element: <ListPage type="groups" />,
                    },
                    {
                        path: ':groupId',
                        children: [
                            {
                                index: true,
                                element: <GroupDetailsPage />,
                            },
                            {
                                path: 'edit',
                                element: <EditGroupForm />
                            },
                            {
                                path: 'events/new',
                                element: <CreateEventForm />
                            }
                        ]
                    },
                    {
                        path: 'new',
                        element: <CreateGroupForm />
                    }
                ]
            },
            {
                path: 'events',
                children: [
                    {
                        index: true,
                        element: <ListPage type="events" />
                    },
                    {
                        path: ':eventId',
                        element: <EventDetailPage />
                    }
                ]
            },
            {
                path: 'error-page',
                element: <ErrorPage />
            },
            {
                path: '*',
                element: <ErrorPage />
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router} />
}

export default App;
