import { collection, query, getDocs, where, onSnapshot, doc, updateDoc } from "firebase/firestore"; 
import { generate } from "generate-password";
import { db } from "../../db/firestore";

export function loginUser(login, password, remember = false) {
  const userFoundRef = query(collection(db, "users"), where("login", "==", login));
  const token = generate({
    length: 500,
    numbers: true,
    symbols: true,
  });

  return (dispatch) => {
    dispatch(loginUserBegin());
    return getDocs(userFoundRef).then((snapshot) => {
      if (!snapshot.docs.length) {
        return dispatch(loginUserError("userNotFound"));
      } else {
        const foundUser = snapshot.docs[0].data();

        if (foundUser.password !== password) {
          return dispatch(loginUserError("wrongPassword"));
        } else {
          if (foundUser.status !== "active") {
            return dispatch(loginUserError("inactiveUser"));
          } else {
            const userRef = doc(db, 'users', snapshot.docs[0].id);

            if (remember) {
              const savedUsers = localStorage.getItem('savedUsers')
                ? JSON.parse(localStorage.getItem('savedUsers'))
                : [];

              if (!savedUsers?.find((user) => user.login === foundUser.login)) {
                savedUsers.push(foundUser);
              }

              localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
            }

            updateDoc(userRef, {
                token: token,
              })
              .then(() => {
                localStorage.setItem("token", token);
                return dispatch(
                  loginUserSuccess({
                    ...foundUser,
                    id: snapshot.docs[0].id,
                  }),
                );
              });
          }
        }
      }
    });
  };
}

export function checkIfLoggedin(token) {
  const userFoundRef = query(collection(db, "users"), where("token", "==", token));
  let unsubscribe = null;

  return (dispatch) => {
    dispatch(checkIfLoggedinBegin());

    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = onSnapshot(userFoundRef, (snapshot) => {
      if (!snapshot.docs.length) {
        localStorage.removeItem("token");
        window.location.replace("/landing");
      } else {
        if (snapshot.docs[0].data().status === "suspended") {
          localStorage.removeItem("token");
          window.location.replace("/landing");
        } else {
          dispatch(
            checkIfLoggedinSuccess({
              ...snapshot.docs[0].data(),
              id: snapshot.docs[0].id,
            }),
          );
        }
      }
    });
  };
}

export function logoutUser(userID) {
  const userRef = doc(db, 'users', userID);

  return (dispatch) => {
    dispatch(checkIfLoggedinBegin());

    localStorage.removeItem("token");

    updateDoc(userRef, {
      token: null,
    });

    window.location.replace("/landing");
  };
}

export const LOGIN_USER_BEGIN = "LOGIN_USER_BEGIN";
export const LOGIN_USER_ERROR = "LOGIN_USER_ERROR";
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const CHECK_IF_LOGGED_IN_BEGIN = "CHECK_IF_LOGGED_IN_BEGIN";
export const CHECK_IF_LOGGED_IN_ERROR = "CHECK_IF_LOGGED_IN_ERROR";
export const CHECK_IF_LOGGED_IN_SUCCESS = "CHECK_IF_LOGGED_IN_SUCCESS";

export const loginUserBegin = () => {
  return {
    type: LOGIN_USER_BEGIN,
  };
};
export const loginUserError = (error) => {
  return {
    type: LOGIN_USER_ERROR,
    payload: { error },
  };
};
export const loginUserSuccess = (currentUser) => {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: { currentUser },
  };
};

export const checkIfLoggedinBegin = () => {
  return {
    type: CHECK_IF_LOGGED_IN_BEGIN,
  };
};
export const checkIfLoggedinError = (error) => {
  return {
    type: CHECK_IF_LOGGED_IN_ERROR,
    payload: { error },
  };
};
export const checkIfLoggedinSuccess = (currentUser) => {
  return {
    type: CHECK_IF_LOGGED_IN_SUCCESS,
    payload: { currentUser },
  };
};
