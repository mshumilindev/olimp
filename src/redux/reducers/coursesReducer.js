import {
    COURSES_BEGIN,
    COURSES_SUCCESS
} from '../actions/coursesActions';

const initialState = {
    subjectsList: [],
    loading: false
};

export default function usersReducer(state = initialState, action) {
    switch ( action.type ) {
        case COURSES_BEGIN:
            return {
                ...state,
                loading: true
            };

        case COURSES_SUCCESS:
            return {
                ...state,
                loading: false,
                subjectsList: action.payload.subjectsList
            };

        default:
            return state;
    }
}
