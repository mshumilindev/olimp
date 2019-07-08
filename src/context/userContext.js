import React from 'react';

const userContext = React.createContext({
    isLoggedIn: !!localStorage.getItem('user'),
    userName: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : null,
    userData: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).data : null,
    userRole: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : null
});

export default userContext;