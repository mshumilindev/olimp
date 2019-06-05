import { FETCH_CONTACT_BEGIN, FETCH_CONTACT_SUCCESS } from '../actions/contactActions';

const initialState = {
    contactList: [],
    loading: false
};

export default function handleContact(state = initialState, action) {
    switch ( action.type ) {
        case FETCH_CONTACT_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_CONTACT_SUCCESS:
            return {
                ...state,
                loading: false,
                contactList: action.payload.contactList
            };

        default:
            return state;
    }
}
