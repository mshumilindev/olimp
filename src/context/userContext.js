import React from 'react';

const userContext = React.createContext({
    isLoggedIn: !!localStorage.getItem('user'),
    userName: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : null,
    userClass: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).class : null,
    userRole: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : null,
    userStatus: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).status : null,
});

export default userContext;