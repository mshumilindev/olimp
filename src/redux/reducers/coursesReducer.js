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
    LESSONS_SUCCESS,
    COURSES_LIST_BEGIN,
    COURSES_LIST_SUCCESS,
    MODULES_BEGIN,
    MODULES_SUCCESS
} from '../actions/coursesActions';

const initialState = {
    subjectsList: [],
    coursesList: null,
    modulesLessons: null,
    lesson: null,
    loading: false,
    subjectCoursesList: null,
    subjectCoursesListLoading: false,
    lessonsList: null,
    modulesList: null
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
                loading: true,
                lessonsList: null
            });

        case LESSONS_SUCCESS:
            return Object.assign({}, {
                ...state,
                loading: false,
                lessonsList: action.payload.lessonsList
            });

        case ALL_COURSES_BEGIN:
            return Object.assign({}, {
                ...state,
                loading: true
            });

        case ALL_COURSES_SUCCESS:
            return Object.assign({}, {
                ...state,
                loading: false,
                coursesList: action.payload.allCoursesList
            });

        case LESSON_BEGIN:
            return Object.assign({}, {
                ...state,
                loading: true
            });

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
            return Object.assign({}, {
                ...state,
                loading: true
            });

        case MODULES_LESSONS_SUCCESS:
            return Object.assign({},{
                ...state,
                loading: false,
                modulesLessons: action.payload.modulesLessons
            });

        case COURSES_LIST_BEGIN:
            return Object.assign({},{
                ...state,
                loading: true,
                subjectCoursesListLoading: true
            });

        case COURSES_LIST_SUCCESS:
            return Object.assign({},{
                ...state,
                loading: false,
                subjectCoursesList: action.payload.subjectCoursesList,
                subjectCoursesListLoading: false
            });

        case MODULES_BEGIN:
            return Object.assign({},{
                ...state,
                loading: true,
                modulesList: null
            });

        case MODULES_SUCCESS:
            return Object.assign({},{
                ...state,
                loading: false,
                modulesList: action.payload.modulesList
            });

        default:
            return state;
    }
}
