import { FETCH_USERS_BEGIN, FETCH_USERS_SUCCESS } from '../actions/usersActions';

const initialState = {
    usersList: [],
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

        default:
            return state;
    }
}
