import React, { useContext } from 'react';
import MainContainer from "../containers/configContainer";
import AdminContainer from '../containers/adminContainer';
import {Provider} from "react-redux";
import {mainStore} from "../redux/stores/mainStore";
import userContext from "../context/userContext";
import { withRouter } from 'react-router-dom';

function Page({location, children, history}) {
    const { isLoggedIn, userRole } = useContext(userContext);

    if ( !isLoggedIn ) {
        location.pathname = '/login';
    }
    if ( userRole === 'admin' && !location.pathname.includes('admin') ) {
        history.push('/admin');
    }
    else if ( userRole === 'student' && location.pathname.includes('admin') ) {
        history.push('/');
    }

    return (
        <Provider store={mainStore}>
            {
                isLoggedIn ?
                    userRole === 'student' ?
                        <MainContainer location={location} children={children}/>
                        :
                        userRole === 'admin' ?
                            <AdminContainer location={location} children={children}/>
                            :
                            null
                    :
                    children
            }
        </Provider>
    )
}
export default withRouter(Page);