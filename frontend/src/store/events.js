import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

//* Constants to avoid typos in action type
const SET_EVENTS = 'events/setEvents';
const SET_EVENT_DETAILS = 'events/setEventDetails';

//* Normal action creators
const setEvents = (payload) => {
    return {
        type: SET_EVENTS,
        payload
    }
}

const setEventDetails = (payload) => {
    return {
        type: SET_EVENT_DETAILS,
        payload
    }
}

//*  Thunk action creators
export const getAllEvents = () => async dispatch => {
    const res = await csrfFetch('/api/events');

    const data = await res.json();
    dispatch(setEvents(data));
    return res;
}

export const getEventDetailsById = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}`);

    const data = await res.json();
    dispatch(setEventDetails(data));
    return res;
}

// export const createEvent = () => async dispatch => {

// }

//* Selectors
const selectEvents = state => state.events.byId
export const selectEventsArray = createSelector(selectEvents, (events) => {
    return Object.values(events);
})

export const selectOrderedEventsArray = createSelector(selectEvents, (events) => {
    const upcoming = [];
    const past = [];

    const now = new Date();
    Object.values(events).forEach((event) => {
        const startDate = new Date(event.startDate);
        if (startDate >= now) {
            upcoming.push(event);
        } else {
            past.push(event);
        }
    });
    upcoming.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    });
    past.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    });

    return { upcoming, past };
})

export const selectEventById = id => state => state.events.byId[id];

//* Reducer
const initialState = {
    byId: {},
    allIds: []
}

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EVENTS: {
            const newState = { byId: { ...state.byId }, allIds: [...state.allIds] }
            console.log(newState)

            action.payload.Events.forEach(event => {
                newState.byId[event.id] = { ...newState.byId[event.id], ...event };
                if (!newState.allIds.includes(event.id)) {
                    newState.allIds.push(event.id);
                }
            });

            return newState;
        }

        case SET_EVENT_DETAILS: {
            const newState = { byId: { ...state.byId }, allIds: [...state.allIds] }

            if (!newState.allIds.includes(action.payload.id)) {
                newState.allIds.push(action.payload.id);
            }
            newState.byId[action.payload.id] = { ...state.byId[action.payload.id], ...action.payload };
            return newState;
        }

        default:
            return state;
    }
}

export default eventsReducer;