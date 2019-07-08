import React, { useContext, useEffect } from 'react';
import MainContainer from "../containers/configContainer";
import AdminContainer from '../containers/adminContainer';
import {Provider} from "react-redux";
import {mainStore} from "../redux/stores/mainStore";
import userContext from "../context/userContext";
import { withRouter } from 'react-router-dom';

function Page({location, children, history}) {
    const { userRole } = useContext(userContext);

    if ( !localStorage.getItem('user') ) {
        location.pathname = '/login';
    }
    else {
        if ( userRole === 'admin' && !location.pathname.includes('admin') ) {
            history.push('/admin');
        }
        else if ( userRole === 'student' && location.pathname.includes('admin') ) {
            history.push('/');
        }
    }

    useEffect(() => {
        const unlisten = history.listen(location => {
            if ( !localStorage.getItem('user') && !location.pathname.includes('/login') ) {
                history.push('/login');
            }
        });
        return () => {
            unlisten();
        }
    });

    return (
        <Provider store={mainStore}>
            {
                localStorage.getItem('user') ?
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