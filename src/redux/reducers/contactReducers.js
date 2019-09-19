import { CONTACT_BEGIN, CONTACT_SUCCESS } from '../actions/contactActions';

const initialState = {
    contactList: null,
    loading: false
};

export default function handleContact(state = initialState, action) {
    switch ( action.type ) {
        case CONTACT_BEGIN:
            return {
                ...state,
                loading: true
            };

        case CONTACT_SUCCESS:
            return {
                ...state,
                loading: false,
                contactList: action.payload.contactList
            };

        default:
            return state;
    }
}
