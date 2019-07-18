import React, { useContext, useEffect } from 'react';
import MainContainer from "../containers/configContainer";
import AdminContainer from '../containers/adminContainer';
import {Provider} from "react-redux";
import {mainStore} from "../redux/stores/mainStore";
import userContext from "../context/userContext";
import { withRouter } from 'react-router-dom';

function Page(props) {
    const { user } = useContext(userContext);
    const {location, children, history} = props;

    if ( !localStorage.getItem('user') ) {
        location.pathname = '/login';
    }
    else {
        if ( user.role === 'admin' && !location.pathname.includes('admin') ) {
            history.push('/admin');
        }
        else if ( user.role === 'student' && location.pathname.includes('admin') ) {
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
                    user.role === 'student' ?
                        <MainContainer location={location} children={children}/>
                        :
                        user.role === 'admin' ?
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