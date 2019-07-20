import {
    FETCH_SUBJECTS_BEGIN,
    FETCH_SUBJECTS_SUCCESS,
    FETCH_COURSESLIST_BEGIN,
    FETCH_COURSESLIST_SUCCESS,
    FETCH_MODULES_BEGIN,
    FETCH_MODULES_SUCCESS,
    UPDATE_SUBJECT_BEGIN,
    UPDATE_SUBJECT_SUCCESS,
    DELETE_SUBJECT_BEGIN,
    DELETE_SUBJECT_SUCCESS
} from '../actions/coursesActions';

const initialState = {
    subjectsList: [],
    loading: false
};

export default function usersReducer(state = initialState, action) {
    // === Need to remove unnecessary cases if they are the same for all the reducers
    switch ( action.type ) {
        case FETCH_SUBJECTS_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_SUBJECTS_SUCCESS:
            return {
                ...state,
                loading: false,
                subjectsList: action.payload.subjectsList
            };

        case FETCH_COURSESLIST_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_COURSESLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                subjectsList: action.payload.subjectsList
            };

        case FETCH_MODULES_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_MODULES_SUCCESS:
            return {
                ...state,
                loading: false,
                subjectsList: action.payload.subjectsList
            };

        case UPDATE_SUBJECT_BEGIN:
            return {
                ...state,
                loading: true
            };

        case UPDATE_SUBJECT_SUCCESS:
            return {
                ...state,
                loading: false,
                subjectsList: action.payload.subjectsList
            };

        case DELETE_SUBJECT_BEGIN:
            return {
                ...state,
                loading: true
            };

        case DELETE_SUBJECT_SUCCESS:
            return {
                ...state,
                loading: false,
                subjectsList: action.payload.subjectsList
            };

        default:
            return state;
    }
}
