/* global onTranslationsUpdate */

import firebase from "../../db/firestore";

const db = firebase.firestore();
const translationsRef = db.collection('updates').doc('translations');
const siteSettingsRef = db.collection('updates').doc('siteSettings');
const versionRef = db.collection('updates').doc('version');

export function setUpdates(type) {
    const date = new Date();
    return dispatch => {
        dispatch(updatesBegin());

        if ( type === 'translations' ) {
            return translationsRef.set({
                date: date.getTime()
            }).then(() => {
                window.dispatchEvent(onTranslationsUpdate);
                dispatch(updatesSuccess());
            });
        }
        if ( type === 'siteSettings' ) {
            return siteSettingsRef.set({
                date: date.getTime()
            }).then(() => {
                dispatch(updatesSuccess());
            });
        }
        if ( type === 'version' ) {
            return versionRef.set({
                date: date.getTime()
            }).then(() => {
                dispatch(updatesSuccess());
            });
        }
    }
}

export const UPDATES_BEGIN = 'UPDATES_BEGIN';
export const UPDATES_SUCCESS = 'UPDATES_SUCCESS';

export const updatesBegin = () => {
    return {
        type: UPDATES_BEGIN
    }
};
export const updatesSuccess = () => {
    return {
        type: UPDATES_SUCCESS
    }
};
