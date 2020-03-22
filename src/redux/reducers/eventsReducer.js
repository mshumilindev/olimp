import {
    FETCH_EVENTS_BEGIN,
    FETCH_EVENTS_SUCCESS
} from '../actions/eventsActions';

const initialState = {
    events: [],
    loading: false
};

export default function usersReducer(state = initialState, action) {
    switch ( action.type ) {
        case FETCH_EVENTS_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                events: action.payload.events
            };

        default:
            return state;
    }
}
