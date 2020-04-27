import React, { useEffect } from 'react';
import MainContainer from "../containers/configContainer";
import AdminContainer from '../containers/adminContainer';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import firebase from "../db/firestore";
import { checkIfLoggedin } from '../redux/actions/authActions';

const db = firebase.firestore();

function Page(props) {
    const {location, children, history, checkIfLoggedin, user} = props;

    let prevLocation = {};
    history.listen(location => {
        const pathChanged = prevLocation.pathname !== location.pathname;
        const hashChanged = prevLocation.hash !== location.hash;
        if ( (pathChanged || hashChanged) && !location.pathname.includes('/admin-courses') && !location.pathname.includes('/admin-info') ){
            window.scrollTo(0, 0);
        }
        prevLocation = location;
    });

    if ( localStorage.getItem('token') ) {
        if ( !user ) {
            checkIfLoggedin(localStorage.getItem('token'));
        }
    }
    else {
        if ( location.pathname !== '/landing' && location.pathname !== '/login' ) {
            history.push('/landing');
        }
    }

    useEffect(() => {
        if ( user ) {
            if ( !location.pathname.includes('chat') ) {
                if ( user.role === 'admin' && (!location.pathname.includes('admin') || location.pathname.includes('login') || location.pathname.includes('landing')) ) {
                    history.push('/admin');
                }
                else if ( user.role === 'teacher' && (!location.pathname.includes('admin') || location.pathname.includes('login') || location.pathname.includes('landing')) ) {
                    history.push('/admin');
                }
                else if ( user.role === 'student' && (location.pathname.includes('admin') || location.pathname.includes('login') || location.pathname.includes('landing')) ) {
                    history.push('/');
                }
                else if ( user.role === 'guest' && (!location.pathname.includes('guest') || location.pathname.includes('login') || location.pathname.includes('landing')) ) {
                    history.push('/guest');
                }
            }
        }
    }, [user]);

    return (
        user ?
            user.role === 'student' || user.role === 'guest' ?
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
            location.pathname.includes('landing') || location.pathname.includes('login') ?
                children
                :
                null
    )
}

const mapStateToProps = state => {
    return {
        user: state.authReducer.currentUser
    }
};

const mapDispatchToProps = dispatch => ({
    checkIfLoggedin: (token) => dispatch(checkIfLoggedin(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Page));
