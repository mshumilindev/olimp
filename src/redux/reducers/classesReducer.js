import { CLASSES_BEGIN, CLASSES_SUCCESS, CLASS_BEGIN, CLASS_SUCCESS } from '../actions/classesActions';

const initialState = {
    classesList: null,
    loading: false
};

export default function handleStaticInfo(state = initialState, action) {
    switch ( action.type ) {
        case CLASSES_BEGIN:
            return {
                ...state,
                loading: true
            };

        case CLASSES_SUCCESS:
            return {
                ...state,
                loading: false,
                classesList: action.payload.classesList
            };

        case CLASS_BEGIN:
            return {
                ...state,
                loading: true
            };

        case CLASS_SUCCESS:
            return {
                ...state,
                loading: false,
                classData: action.payload.classData
            };

        default:
            return state;
    }
}
