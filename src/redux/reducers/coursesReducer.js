import {
    COURSES_BEGIN,
    COURSES_SUCCESS,
    LESSON_BEGIN,
    LESSON_SUCCESS
} from '../actions/coursesActions';

const initialState = {
    subjectsList: [],
    lesson: null,
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

        case LESSON_BEGIN:
            return {
                ...state,
                loading: true
            };

        case LESSON_SUCCESS:
            return {
                ...state,
                loading: false,
                lesson: action.payload.lesson
            };

        default:
            return state;
    }
}
