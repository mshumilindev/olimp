import { NOTIFICATIONS_BEGIN, NOTIFICATIONS_SUCCESS } from '../actions/notificationsActions';

const initialState = {
    notificationsList: null,
    loading: false
};

export default function configReducer(state = initialState, action) {
    switch ( action.type ) {
        case NOTIFICATIONS_BEGIN:
            return {
                ...state,
                loading: true
            };

        case NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                notificationsList: action.payload.notificationsList
            };

        default:
            return state;
    }
}
