import { FETCH_LIBRARY_BEGIN, FETCH_LIBRARY_SUCCESS } from '../actions/libraryActions';

const initialState = {
    usersList: [],
    loading: false
};

export default function usersReducer(state = initialState, action) {
    switch ( action.type ) {
        case FETCH_LIBRARY_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_LIBRARY_SUCCESS:
            return {
                ...state,
                loading: false,
                libraryList: action.payload.libraryList
            };

        default:
            return state;
    }
}
