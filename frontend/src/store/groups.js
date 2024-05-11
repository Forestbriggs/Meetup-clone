import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

//* Constants to avoid typos in action type
const SET_GROUPS = 'groups/setGroups';
const SET_CURRENT_GROUP = 'groups/setCurrentGroup';
const SET_GROUP_EVENTS = 'groups/setGroupEvents';
const SET_GROUP_IMAGE = 'groups/setGroupImage';

//* Normal action creators
const setGroups = (payload) => {
    return {
        type: SET_GROUPS,
        payload
    }
}

const setCurrentGroup = (payload) => {
    return {
        type: SET_CURRENT_GROUP,
        payload
    }
}

const setGroupEvents = (payload) => {
    return {
        type: SET_GROUP_EVENTS,
        payload
    }
}

const setGroupImage = (groupId, data) => {
    return {
        type: SET_GROUP_IMAGE,
        groupId,
        data
    }
}

//*  Thunk action creators
export const getAllGroups = () => async dispatch => {
    const res = await csrfFetch('/api/groups');

    const data = await res.json();
    dispatch(setGroups(data.Groups));
    return res;
}

export const getGroupById = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`);

    const data = await res.json();
    dispatch(setCurrentGroup(data));
    return res;
}

export const getGroupEventsById = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`);

    const data = await res.json();
    dispatch(setGroupEvents({ data, groupId }));
    return res;
}

export const createGroup = (payload) => async dispatch => {
    const res = await csrfFetch('/api/groups/', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    dispatch(setCurrentGroup(data));
    return data;
}

export const createGroupImage = (groupId, payload) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    dispatch(setGroupImage(groupId, data));
    return res;
}

//* Selectors
const selectGroups = state => state.groups.byId
export const selectGroupsArray = createSelector(selectGroups, (groups) => {
    return (Object.values(groups));
})

export const selectGroupById = (id) => state => state.groups.byId[id];

//* Reducer
const initialState = {
    byId: {},
    allIds: []
}

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUPS: {
            const newState = { byId: { ...state.byId }, allIds: [...state.allIds] };

            action.payload.forEach(group => {
                newState.byId[group.id] = { ...state.byId[group.id], ...group };
                if (!newState.allIds.includes(group.id)) {
                    newState.allIds.push(group.id);
                }
            });

            return newState;
        }

        case SET_CURRENT_GROUP: {
            const newState = {
                byId: { ...state.byId, [action.payload.id]: { ...state.byId[action.payload.id], ...action.payload } },
                allIds: [...state.allIds]
            }
            if (!state.allIds.includes(action.payload.id)) {
                newState.allIds.push(action.payload.id);
            }
            return newState;
        }

        case SET_GROUP_EVENTS: {
            const newState = {
                byId: {
                    ...state.byId,
                    [action.payload.groupId]: { ...state.byId[action.payload.groupId], ...action.payload.data }
                },
                allIds: [...state.allIds]
            }
            if (!state.allIds.includes(Number(action.payload.groupId))) {
                newState.allIds.push(action.payload.groupId);
            }

            return newState;
        }

        case SET_GROUP_IMAGE: {
            const newState = {
                byId: { ...state.byId },
                allIds: [...state.allIds]
            }
            console.log(action.groupId);
            console.log('new', newState)
            newState.byId[action.groupId] = newState.byId[action.groupId] ?
                { ...newState.byId[action.groupId] } : {};
            console.log('during', newState)
            newState.byId[action.groupId].GroupImages = [action.data]
            console.log('after', newState)
            return newState;
        }


        default:
            return state
    }
}

export default groupsReducer;