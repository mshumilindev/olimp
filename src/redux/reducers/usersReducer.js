import {
    FETCH_USERS_BEGIN,
    FETCH_USERS_SUCCESS,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    DELETE_USER_BEGIN,
    DELETE_USER_SUCCESS,
    FETCH_PROFILE_BEGIN,
    FETCH_PROFILE_SUCCESS
} from '../actions/usersActions';

const initialState = {
    usersList: [],
    profile: null,
    loading: false
};

export default function usersReducer(state = initialState, action) {
    switch ( action.type ) {
        case FETCH_USERS_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                usersList: action.payload.usersList
            };

        case UPDATE_USER_BEGIN:
            return {
                ...state,
                loading: true
            };

        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false
            };

        case DELETE_USER_BEGIN:
            return {
                ...state,
                loading: true
            };

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false
            };

        case FETCH_PROFILE_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                profile: action.payload.profile
            };

        default:
            return state;
    }
}
