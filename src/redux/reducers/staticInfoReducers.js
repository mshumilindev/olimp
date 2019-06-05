import { FETCH_STATIC_INFO_BEGIN, FETCH_STATIC_INFO_SUCCESS } from '../actions/staticInfoActions';

const initialState = {
    staticInfoList: [],
    loading: false
};

export default function handleStaticInfo(state = initialState, action) {
    switch ( action.type ) {
        case FETCH_STATIC_INFO_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_STATIC_INFO_SUCCESS:
            return {
                ...state,
                loading: false,
                staticInfoList: action.payload.staticInfo
            };

        default:
            return state;
    }
}
