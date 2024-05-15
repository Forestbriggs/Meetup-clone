import { useDispatch, useSelector } from "react-redux";
import { getAllEvents, selectOrderedEventsArray } from "../../store/events";
import { useEffect, useState } from "react";
import EventCard from "../GroupDetailsPage/EventCard";
import './EventListPage.css'

export default function EventListPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    const { upcoming, past } = useSelector(selectOrderedEventsArray);
    const events = upcoming.concat(past);
    useEffect(() => {
        dispatch(getAllEvents()).then(() => setIsLoaded(true));
    }, [dispatch])

    return (
        <>
            {isLoaded && <>
                <p>Events in Grand Line Gatherings</p>
                <div className="card-container">
                    {events.map((event) => {
                        return (
                            <EventCard
                                key={event.id}
                                event={event}
                            />
                        )
                    })}
                </div>
            </>}
        </>
    )
}