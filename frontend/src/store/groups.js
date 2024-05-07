import { csrfFetch } from "./csrf";

//* Constants to avoid typos in action type
const SET_GROUPS = 'groups/setGroups';

//* Normal action creators
const setGroups = (payload) => {
    return {
        type: SET_GROUPS,
        payload
    }
}

//*  Thunk action creators
export const getAllGroups = () => async dispatch => {
    const res = await csrfFetch('/api/groups');

    const data = await res.json();
    console.log(data)
    dispatch(setGroups(data.Groups));
    return res;
}

//* Reducer
const initialState = {
    byId: {},
    allIds: []
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

        default:
            return state
    }
}

export default groupsReducer;