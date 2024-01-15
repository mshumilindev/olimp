import { TUser, TUserRole } from "@types";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Dispatch, Unsubscribe } from "redux";
import { db } from "../../db/firestore";

const usersCollection = collection(db, "users");

export const fetchUsers = (role: TUserRole) => {
  let unsubscribe: Unsubscribe | null = null;

  return (dispatch: Dispatch) => {
    dispatch(fetchUsersBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList: TUser[] = [];

      snapshot.docs.forEach((doc) => {
        const docData = doc.data();

        if ((role && doc.data().role === role) || !role) {
          Object.assign(docData, {
            id: doc.id,
          });

          usersList.push(docData as TUser);
        }
      });
      dispatch(fetchUsersSuccess(usersList));
    });
  };
}

export const fetchProfile = (profileLogin: string) => {
  const profileRef = query(
    collection(db, "users"),
    where("login", "==", profileLogin),
  );

  return (dispatch: Dispatch) => {
    dispatch(fetchProfileBegin());
    return getDocs(profileRef).then((snapshot) => {
      let profile = {};
      if (snapshot.docs[0]) {
        profile = {
          ...snapshot.docs[0].data(),
          id: snapshot.docs[0].id,
        };
      }

      dispatch(fetchProfileSuccess(profile as TUser));
    });
  };
}

export const updateUser = (id: string, updatedFields: TUser) => {
  const userDoc = doc(db, "users", id);

  return () => {
    return setDoc(
      userDoc,
      {
        ...updatedFields,
      },
      { merge: true },
    );
  };
}

export const deleteUser = (id: string) => {
  const userDoc = doc(db, "users", id);

  return () => {
    return deleteDoc(userDoc);
  };
}

export const fetchUsersBegin = () => {
  return {
    type: FETCH_USERS_BEGIN,
  };
};
export const fetchUsersSuccess = (usersList: TUser[]) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: { usersList },
  };
};

export const FETCH_PROFILE_BEGIN = "FETCH_PROFILE_BEGIN";
export const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";

export const fetchProfileBegin = () => {
  return {
    type: FETCH_PROFILE_BEGIN,
  };
};
export const fetchProfileSuccess = (profile: TUser) => {
  return {
    type: FETCH_PROFILE_SUCCESS,
    payload: { profile },
  };
};

export const UPDATE_USER_BEGIN = "UPDATE_USER_BEGIN";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";

export const updateUserBegin = () => {
  return {
    type: UPDATE_USER_BEGIN,
  };
};
export const updateUserSuccess = (usersList: TUser[]) => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: { usersList },
  };
};

export const DELETE_USER_BEGIN = "DELETE_USER_BEGIN";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";

export const deleteUserBegin = () => {
  return {
    type: DELETE_USER_BEGIN,
  };
};
export const deleteUserSuccess = (usersList: TUser[]) => {
  return {
    type: DELETE_USER_SUCCESS,
    payload: { usersList },
  };
};

export const FETCH_USERS_BEGIN = "FETCH_USERS_BEGIN";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
