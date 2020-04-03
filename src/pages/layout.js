import React, { useContext, useEffect } from 'react';
import DocumentTitle from "react-document-title";
import StudentHeader from "../components/Header/StudentHeader";
import StudentNav from "../components/Nav/StudentNav";
import Footer from '../components/Footer/Footer';
import SiteSettingsContext from "../context/siteSettingsContext";
import userContext from "../context/userContext";
import {Preloader} from "../components/UI/preloader";
import ChatWidget from "../components/ChatBox/ChatWidget";
import firebase from "../db/firestore";

export default function Layout({children, location, events, fetchEvents, usersList}) {
    const { siteName, translate } = useContext(SiteSettingsContext);
    const { user } = useContext(userContext);

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
        fetchEvents(user.id);
    }, []);

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
            url: '/courses',
            icon: 'fa fa-book',
            name: 'courses'
        },
        {
            id: 4,
            url: '/chats',
            icon: 'fas fa-video',
            name: 'videochats'
        },
        {
            id: 5,
            url: '/class',
            icon: 'fa fa-graduation-cap',
            name: 'class'
        },
        {
            id: 6,
            url: '/contact',
            icon: 'fa fa-mobile-alt',
            name: 'contact'
        }
    ];

    const currentPage = studentNav && studentNav.length ? studentNav.find(item => item.url === location.pathname) && studentNav.find(item => item.url === location.pathname).name : '';

    const docTitle = siteName + ' | ' + (user.role === 'student' ? (currentPage ? translate(currentPage) : 'Завантаження...') : translate('guest'));

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