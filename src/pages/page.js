import React, { useContext, useEffect, useState } from 'react';
import MainContainer from "../containers/configContainer";
import AdminContainer from '../containers/adminContainer';
import {Provider} from "react-redux";
import {mainStore} from "../redux/stores/mainStore";
import userContext from "../context/userContext";
import { withRouter } from 'react-router-dom';
import firebase from "../db/firestore";

const db = firebase.firestore();

function Page(props) {
    const { user } = useContext(userContext);
    const {location, children, history} = props;

    let prevLocation = {};
    history.listen(location => {
        const pathChanged = prevLocation.pathname !== location.pathname;
        const hashChanged = prevLocation.hash !== location.hash;
        if ( (pathChanged || hashChanged) && !location.pathname.includes('/admin-courses') ){
            window.scrollTo(0, 0);
        }
        prevLocation = location;
    });

    if ( !localStorage.getItem('user') ) {
        location.pathname = '/login';
    }
    else {
        if ( !location.pathname.includes('chat') ) {
            if ( user.role === 'admin' && !location.pathname.includes('admin') ) {
                history.push('/admin');
            }
            else if ( user.role === 'teacher' && !location.pathname.includes('admin') ) {
                history.push('/admin');
            }
            else if ( user.role === 'student' && location.pathname.includes('admin') ) {
                history.push('/');
            }
        }

        const profileRef = db.collection('users').where('login', '==', user.login);
        let profileCheckI = 0;
        checkProfileStatus();

        function checkProfileStatus() {
            profileCheckI ++;
            profileRef.get().then(snapshot => {
                if ( !snapshot.docs.length && profileCheckI < 10 ) {
                    setTimeout(() => {
                        checkProfileStatus();
                    }, 1000);
                }
                else {
                    if ( snapshot.docs[0] && snapshot.docs[0].data().status === 'suspended' ) {
                        localStorage.removeItem('user');
                        history.push('/suspended');
                    }
                }
            });
        }
    }

    useEffect(() => {
        const unlisten = history.listen(location => {
            if ( !localStorage.getItem('user') && !location.pathname.includes('/login') ) {
                history.push('/login');
            }
            else {
                const profileRef = db.collection('users').where('login', '==', user.login);

                profileRef.get().then(snapshot => {
                    if ( !snapshot.docs.length || snapshot.docs[0].data().status === 'suspended' ) {
                        localStorage.removeItem('user');
                        history.push('/suspended');
                    }
                });
            }
        });
        return () => {
            unlisten();
        }
    }, [history.location.key]);

    return (
        <Provider store={mainStore}>
            {
                localStorage.getItem('user') ?
                    user.role === 'student' ?
                        <MainContainer location={location} children={children}/>
                        :
                        user.role === 'admin' ?
                            <AdminContainer location={location} children={children}/>
                            :
                            user.role === 'teacher' ?
                                <AdminContainer location={location} children={children} isTeacher/>
                                :
                                null
                    :
                    children
            }
        </Provider>
    )
}
export default withRouter(Page);