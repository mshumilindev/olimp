import React from 'react';

const userContext = React.createContext({
    isLoggedIn: !!localStorage.getItem('user'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
});

export default userContext;