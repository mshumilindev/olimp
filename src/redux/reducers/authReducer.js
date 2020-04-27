import {
    LOGIN_USER_BEGIN,
    LOGIN_USER_ERROR,
    LOGIN_USER_SUCCESS,
    CHECK_IF_LOGGED_IN_BEGIN,
    CHECK_IF_LOGGED_IN_ERROR,
    CHECK_IF_LOGGED_IN_SUCCESS
} from '../actions/authActions';

const initialState = {
    loading: false,
    currentUser: null,
    error: null,
    isLoginError: null
};

export default function authReducer(state = initialState, action) {
    switch ( action.type ) {
        case LOGIN_USER_BEGIN:
            return {
                ...state,
                loading: true
            };

        case LOGIN_USER_ERROR:
            return Object.assign({}, {
                ...state,
                loading: false,
                error: action.payload.error
            });

        case LOGIN_USER_SUCCESS:
            return Object.assign({}, {
                ...state,
                error: null,
                loading: false,
                currentUser: action.payload.currentUser
            });

        case CHECK_IF_LOGGED_IN_BEGIN:
            return {
                ...state,
                loading: true
            };

        case CHECK_IF_LOGGED_IN_ERROR:
            return Object.assign({}, {
                ...state,
                loading: false,
                isLoginError: action.payload.error
            });

        case CHECK_IF_LOGGED_IN_SUCCESS:
            return Object.assign({}, {
                ...state,
                isLoginError: null,
                loading: false,
                currentUser: action.payload.currentUser
            });

        default:
            return state;
    }
}
