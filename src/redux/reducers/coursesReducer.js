import {
    COURSES_BEGIN,
    COURSES_SUCCESS,
    LESSON_BEGIN,
    LESSON_SUCCESS,
    ALL_COURSES_BEGIN,
    ALL_COURSES_SUCCESS,
    MODULES_LESSONS_BEGIN,
    MODULES_LESSONS_SUCCESS,
    DISCARD_SUCCESS,
    LESSONS_BEGIN,
    LESSONS_SUCCESS
} from '../actions/coursesActions';

const initialState = {
    subjectsList: [],
    coursesList: null,
    modulesLessons: null,
    lesson: null,
    loading: false,
    lessonsList: null
};

export default function usersReducer(state = initialState, action) {
    switch ( action.type ) {
        case COURSES_BEGIN:
            return {
                ...state,
                loading: true
            };

        case COURSES_SUCCESS:
            return Object.assign({}, {
                ...state,
                loading: false,
                subjectsList: action.payload.subjectsList
            });

        case LESSONS_BEGIN:
            return Object.assign({}, {
                ...state,
                loading: true
            });

        case LESSONS_SUCCESS:
            return Object.assign({}, {
                ...state,
                loading: false,
                lessonsList: action.payload.lessonsList
            });

        case ALL_COURSES_BEGIN:
            return {
                ...state,
                loading: true
            };

        case ALL_COURSES_SUCCESS:
            return {
                ...state,
                loading: false,
                coursesList: action.payload.allCoursesList
            };

        case LESSON_BEGIN:
            return {
                ...state,
                loading: true
            };

        case LESSON_SUCCESS:
            return Object.assign({}, {
                ...state,
                loading: false,
                lesson: action.payload.lesson
            });

        case DISCARD_SUCCESS:
            return Object.assign({}, {
                ...state,
                lesson: null
            });

        case MODULES_LESSONS_BEGIN:
            return {
                ...state,
                loading: true
            };

        case MODULES_LESSONS_SUCCESS:
            return {
                ...state,
                loading: false,
                modulesLessons: action.payload.modulesLessons
            };

        default:
            return state;
    }
}
