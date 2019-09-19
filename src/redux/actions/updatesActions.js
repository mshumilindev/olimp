/* global onTranslationsUpdate */

import firebase from "../../db/firestore";
import React from "react";

const db = firebase.firestore();
const translationsRef = db.collection('updates').doc('translations');

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
