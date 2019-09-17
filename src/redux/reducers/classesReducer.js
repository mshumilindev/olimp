import { CLASSES_BEGIN, CLASSES_SUCCESS } from '../actions/classesActions';

const initialState = {
    classesList: [],
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

        default:
            return state;
    }
}
