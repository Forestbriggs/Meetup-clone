import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

//* Constants to avoid typos in action type
const SET_EVENTS = 'events/setEvents';
const SET_EVENT_DETAILS = 'events/setEventDetails';
const SET_EVENT_IMAGE = 'events/setEventImage';
const REMOVE_EVENT = 'events/removeEvent';

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

const setEventImage = (eventId, payload) => {
    return {
        type: SET_EVENT_IMAGE,
        payload,
        eventId
    }
}

const removeEvent = (eventId) => {
    return {
        type: REMOVE_EVENT,
        eventId
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

export const createEvent = (groupId, payload) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    const data = await res.json();
    dispatch(setEventDetails(data));
    return data;
}

export const createEventImage = (eventId, payload) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    const data = await res.json();
    dispatch(setEventImage(eventId, data))
    return data;
}

export const deleteEvent = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(removeEvent(eventId));
    }
    return res;
}

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

        case SET_EVENT_IMAGE: {
            const newState = {
                byId: { ...state.byId },
                allIds: [...state.allIds]
            }
            newState.byId[action.eventId] = newState.byId[action.eventId] ?
                { ...newState.byId[action.eventId] } : {};
            newState.byId[action.eventId].GroupImages = [action.payload]
            return newState;
        }

        case REMOVE_EVENT: {
            const newState = {
                byId: { ...state.byId },
                allIds: [...state.allIds]
            }
            delete newState.byId[action.eventId];
            const index = newState.allIds.indexOf(action.eventId);
            newState.allIds.splice(index, 1);
            return newState;
        }

        default:
            return state;
    }
}

export default eventsReducer;