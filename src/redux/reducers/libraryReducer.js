import {
    FETCH_LIBRARY_BEGIN,
    FETCH_LIBRARY_SUCCESS,
    DELETE_DOC_BEGIN,
    UPLOAD_DOC_BEGIN,
    UPDATE_DOC_BEGIN,
    DOWNLOAD_DOC_BEGIN,
    DOWNLOAD_DOC_SUCCESS,
    FETCH_TEXTBOOK_BEGIN,
    FETCH_TEXTBOOK_SUCCESS,
    DISCARD_DOC_SUCCESS,
} from '../actions/libraryActions';

const initialState = {
    libraryList: null,
    textbook: null,
    loading: false,
    downloadedTextbook: null
};

export default function usersReducer(state = initialState, action) {
    switch ( action.type ) {
        case FETCH_LIBRARY_BEGIN:
            return Object.assign({}, {
                ...state,
                loading: true
            });

        case FETCH_LIBRARY_SUCCESS:
            return Object.assign({}, {
                ...state,
                loading: false,
                libraryList: action.payload.libraryList
            });

        case DELETE_DOC_BEGIN:
            return {
                ...state,
                loading: true
            };

        case UPLOAD_DOC_BEGIN:
            return {
                ...state,
                loading: true
            };

        case UPDATE_DOC_BEGIN:
            return {
                ...state,
                loading: true
            };

        case DOWNLOAD_DOC_BEGIN:
            return {
                ...state,
                loading: true
            };

        case DOWNLOAD_DOC_SUCCESS:
            return Object.assign({
                ...state,
                loading: false,
                downloadedTextbook: action.payload.downloadedTextbook
            });

        case FETCH_TEXTBOOK_BEGIN:
            return {
                ...state,
                loading: true
            };

        case FETCH_TEXTBOOK_SUCCESS:
            return {
                ...state,
                loading: false,
                textbook: action.payload.textbook
            };

        case DISCARD_DOC_SUCCESS:
            return Object.assign({}, {
                ...state,
                loading: false,
                downloadedTextbook: null
            });

        default:
            return state;
    }
}
