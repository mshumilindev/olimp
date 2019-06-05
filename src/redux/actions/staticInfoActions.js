import firebase from "../../db/firestore";

const db = firebase.firestore();
const staticInfoCollection = db.collection('staticInfo');
const newStaticInfoList = [];

export const FETCH_STATIC_INFO_BEGIN = 'FETCH_STATIC_INFO_BEGIN';
export const FETCH_STATIC_INFO_SUCCESS = 'FETCH_STATIC_INFO_SUCCESS';

export function fetchStaticInfo() {
    if ( !newStaticInfoList.length ) {
        return dispatch => {
            dispatch(fetchStaticInfoBegin());
            return staticInfoCollection.get().then((data) => {
                data.docs.map(doc => newStaticInfoList.push(doc.data()));

                dispatch(fetchStaticInfoSuccess(newStaticInfoList));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchStaticInfoSuccess(newStaticInfoList))
        }
    }
}

export const fetchStaticInfoBegin =() => {
    return {
        type: FETCH_STATIC_INFO_BEGIN
    }
};
export const fetchStaticInfoSuccess = staticInfo => {
    return {
        type: FETCH_STATIC_INFO_SUCCESS,
        payload: { staticInfo }
    }
};
