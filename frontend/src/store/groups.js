import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

//* Constants to avoid typos in action type
const SET_GROUPS = 'groups/setGroups';
const SET_CURRENT_GROUP = 'groups/setCurrentGroup';

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

//* Selectors
const selectGroups = state => state.groups.byId
export const selectGroupsArray = createSelector(selectGroups, (groups) => {
    return (Object.values(groups));
})

export const selectCurrentGroup = state => state.groups.currentGroup;

//* Reducer
const initialState = {
    byId: {},
    allIds: [],
    currentGroup: null
}

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUPS: {
            // const newState = { byid: { ...byId }, allIds: [...allIds] }
            const byId = action.payload.reduce((acc, group) => {
                return { ...acc, [group.id]: group }
            }, {})
            const newState = { byId, allIds: [] };

            action.payload.forEach(group => {
                newState.allIds.push(group.id);
            });

            return newState;
        }

        case SET_CURRENT_GROUP:
            return {
                byId: { ...state.byId },
                allIds: [...state.allIds],
                currentGroup: action.payload
            }

        default:
            return state
    }
}

export default groupsReducer;