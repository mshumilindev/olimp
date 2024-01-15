import { collection, getDocs } from 'firebase/firestore';
import { Dispatch } from 'redux';
import { db } from '../../db/firestore';

const newNav = localStorage.getItem('nav')
  ? JSON.parse(localStorage.getItem('nav') || '').data
  : [];

  export const fetchNav = () => {
  const navCollection = collection(db, 'nav');
  if (!newNav.length) {
    return (dispatch: Dispatch) => {
      dispatch(fetchNavBegin());
      return getDocs(navCollection).then((data) => {
        data.docs.map((doc) => newNav.push(doc.data()));
        localStorage.setItem('nav', JSON.stringify({ data: newNav }));

        dispatch(fetchNavSuccess(newNav));
      });
    };
  } else {
    return (dispatch: Dispatch) => {
      dispatch(fetchNavSuccess(newNav));
    };
  }
}

// === NAVIGATION ACTIONS
export const FETCH_NAV_BEGIN = 'FETCH_NAV_BEGIN';
export const FETCH_NAV_SUCCESS = 'FETCH_NAV_SUCCESS';

export const fetchNavBegin = () => {
  return {
    type: FETCH_NAV_BEGIN,
  };
};
export const fetchNavSuccess = (nav: any) => {
  return {
    type: FETCH_NAV_SUCCESS,
    payload: { nav },
  };
};
