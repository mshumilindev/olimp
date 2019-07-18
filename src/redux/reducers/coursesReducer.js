import { FETCH_SUBJECTS_BEGIN, FETCH_SUBJECTS_SUCCESS, FETCH_COURSESLIST_BEGIN, FETCH_COURSESLIST_SUCCESS, FETCH_MODULES_BEGIN, FETCH_MODULES_SUCCESS } from '../actions/coursesActions';

const initialState = {
    subjectsList: [],
    loading: false
};

export default function usersReducer(state = initialState, action) {
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

        default:
            return state;
    }
}
