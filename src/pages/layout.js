import React, { useContext, useEffect } from 'react';
import DocumentTitle from "react-document-title";
import StudentHeader from "../components/Header/StudentHeader";
import StudentNav from "../components/Nav/StudentNav";
import Footer from '../components/Footer/Footer';
import SiteSettingsContext from "../context/siteSettingsContext";
import Preloader from "../components/UI/preloader";
import ChatWidget from "../components/ChatBox/ChatWidget";
import firebase from "../db/firestore";
import moment from "moment";
import { connect } from 'react-redux';
import {fetchTests} from "../redux/actions/testsActions";
import {fetchEventsParticipant} from "../redux/actions/eventsActions";
import {checkIfLoggedin} from "../redux/actions/authActions";

function Layout({user, children, location, fetchEventsParticipant, fetchTests, checkIfLoggedin}) {
    const { siteName, translate } = useContext(SiteSettingsContext);

    useEffect(() => {
        const db = firebase.firestore();
        const updatesCollection = db.collection('updates');
        const savedUpdates = localStorage.getItem('updates') ? JSON.parse(localStorage.getItem('updates')) : null;

        updatesCollection.get().then(snapshot => {
            const version = snapshot.docs.find(doc => doc.id === 'version');

            if (savedUpdates) {
                if ( version && version.exists && (!savedUpdates.version || version.data().date > savedUpdates.version) ) {
                    localStorage.setItem('updates', JSON.stringify({
                        ...savedUpdates,
                        version: version.data().date
                    }));
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } else {
                if (version.exists) {
                    localStorage.setItem('updates', JSON.stringify({
                        version: version.data().date
                    }));
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }
        });
    }, [location]);

    useEffect(() => {
        if ( !user ) {
            checkIfLoggedin(localStorage.getItem('token'));
        }
    }, [user, checkIfLoggedin]);

    useEffect(() => {
        if ( user ) {
            fetchEventsParticipant(user.id, moment(moment().format('MM DD YYYY')).unix());
            fetchTests(user.id);
        }
    }, [user, fetchEventsParticipant, fetchTests]);

    const studentNav = [
        {
            id: 0,
            url: '/',
            icon: 'fa fa-home',
            name: 'dashboard'
        },
        {
            id: 1,
            url: '/profile',
            icon: 'fa fa-user',
            name: 'profile'
        },
        {
            id: 2,
            url: '/schedule',
            icon: 'fa fa-calendar-alt',
            name: 'schedule'
        },
        {
            id: 3,
            url: '/journal',
            icon: 'fa fa-user-check',
            name: 'attendance'
        },
        {
            id: 4,
            url: '/courses',
            icon: 'fa fa-book',
            name: 'courses'
        },
        {
            id: 5,
            url: '/chats',
            icon: 'fas fa-video',
            name: 'videochats'
        },
        {
            id: 6,
            url: '/class',
            icon: 'fa fa-graduation-cap',
            name: 'class'
        },
        {
            id: 7,
            url: '/library',
            icon: 'fa fa-book-open',
            name: 'library'
        },
        {
            id: 8,
            url: '/contact',
            icon: 'fa fa-mobile-alt',
            name: 'contact'
        }
    ];

    const currentPage = studentNav && studentNav.length ? studentNav.find(item => item.url === location.pathname) && studentNav.find(item => item.url === location.pathname).name : '';

    const docTitle = siteName + ' | ' + (user.role === 'student' ? (currentPage ? translate(currentPage) : 'Завантаження...') : translate('guest'));

    if ( !user ) {
        return null;
    }

    return (
        <DocumentTitle title={ docTitle }>
            {
                translate('current_schedule') === 'current_schedule' ?
                    <Preloader color={'#7f00a3'}/>
                    :
                    <>
                        <div className={'page ' + user.role}>
                            <div className="page__inner">
                                <StudentHeader/>
                                {
                                    user.role === 'student' ?
                                        <StudentNav nav={studentNav} />
                                        :
                                        null
                                }
                                <div className="content mapContainer">
                                    <div className="content__inner">
                                        { children }
                                        <ChatWidget/>
                                    </div>
                                </div>
                                {
                                    user.role === 'student' ?
                                        window.outerWidth < 769 ?
                                            <Footer/>
                                            :
                                            null
                                        :
                                        null
                                }
                            </div>
                            {
                                user.role === 'student' ?
                                    window.outerWidth >= 769 ?
                                        <Footer/>
                                        :
                                        null
                                    :
                                    null
                            }
                        </div>
                    </>
            }
        </DocumentTitle>
    );
}

const mapStateToProps = state => {
    return {
        user: state.authReducer.currentUser
    }
};

const mapDispatchToProps = dispatch => ({
    fetchEventsParticipant: (userID, date) => dispatch(fetchEventsParticipant(userID, date)),
    fetchTests: (userID) => dispatch(fetchTests(userID)),
    checkIfLoggedin: (token) => dispatch(checkIfLoggedin(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);