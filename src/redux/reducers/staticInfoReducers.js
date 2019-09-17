import { STATIC_INFO_BEGIN, STATIC_INFO_SUCCESS, PAGE_BEGIN, PAGE_SUCCESS } from '../actions/staticInfoActions';

const initialState = {
    staticInfoList: [],
    loading: false
};

export default function handleStaticInfo(state = initialState, action) {
    switch ( action.type ) {
        case STATIC_INFO_BEGIN:
            return {
                ...state,
                loading: true
            };

        case STATIC_INFO_SUCCESS:
            return {
                ...state,
                loading: false,
                staticInfoList: action.payload.staticInfo
            };

        case PAGE_BEGIN:
            return {
                ...state,
                loading: true
            };

        case PAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                page: action.payload.page
            };

        default:
            return state;
    }
}
