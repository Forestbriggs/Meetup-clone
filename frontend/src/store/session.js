import { csrfFetch } from './csrf';

//* Constants to avoid typos in action type
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

//* Normal action creators
const setUser = (payload) => {
    return {
        type: SET_USER,
        payload
    }
}

const removeUser = () => {
    return {
        type: REMOVE_USER
    }
}

//*  Thunk action creators
export const login = (credential, password) => async dispatch => {
    const res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    });
    const data = await res.json();
    dispatch(setUser(data));
    return res;
}

//* Reducer
const sessionReducer = (state = { user: null }, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };

        case REMOVE_USER:
            return { ...state, user: null }

        default:
            return state
    }
}

export default sessionReducer;