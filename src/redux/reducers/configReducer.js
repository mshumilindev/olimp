import { FETCH_NAV_BEGIN, FETCH_NAV_SUCCESS } from '../actions/configActions';

const initialState = {
    nav: [],
    loading: false
};

export default function configReducer(state = initialState, action) {
    switch ( action.type ) {
        case FETCH_NAV_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_NAV_SUCCESS:
            return {
                ...state,
                loading: false,
                nav: action.payload.nav
            };

        default:
            return state;
    }
}
