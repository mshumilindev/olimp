import React, {useContext, useEffect} from 'react';
import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';
import DocumentTitle from "react-document-title";
import SiteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import ChatWidget from "../../components/ChatBox/ChatWidget";
import '../../assets/scss/base/chatroom.scss';
import firebase from "../../db/firestore";
import classNames from 'classnames';

export default function Admin({children, location, params, isTeacher, fetchEvents}) {
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
        fetchEvents(user.id, user.role);
    }, []);

    const adminNav = [
        {
            id: 0,
            url: '/admin',
            icon: 'fa fa-home',
            name: 'dashboard'
        },
        {
            id: 2,
            url: '/admin-profile',
            icon: 'fa fa-user',
            name: 'profile'
        },
        // {
        //     id: 3,
        //     url: '/admin-messages',
        //     icon: 'fa fa-comments',
        //     name: 'messages'
        // },
        {
            id: 4,
            url: '/admin-users',
            icon: 'fa fa-users',
            name: 'users'
        },
        {
            id: 5,
            url: '/admin-chats',
            icon: 'fas fa-video',
            name: 'videochats'
        },
        {
            id: 6,
            url: '/admin-courses',
            icon: 'fa fa-book',
            name: 'courses'
        },
        {
            id: 7,
            url: '/admin-classes',
            icon: 'fa fa-graduation-cap',
            name: 'classes'
        },
        {
            id: 8,
            url: '/admin-attendance',
            icon: 'fa fa-user-check',
            name: 'attendance'
        },
        {
            id: 9,
            url: '/admin-pages',
            icon: 'fa fa-copy',
            name: 'pages'
        },
        {
            id: 10,
            url: '/admin-library',
            icon: 'fa fa-bookmark',
            name: 'library'
        },
        {
            id: 11,
            url: '/admin-translations',
            icon: 'fa fa-language',
            name: 'translations'
        },
        {
            id: 12,
            url: '/admin-settings',
            icon: 'fa fa-cogs',
            name: 'settings'
        },
        {
            id: 13,
            url: '/admin-info/videochats',
            icon: 'fa fa-info',
            name: 'info'
        },
        {
            id: 14,
            url: '/admin-updates',
            icon: 'fa fa-list-ol',
            name: 'updates'
        }
    ];

    const teacherNav = [
        {
            id: 0,
            url: '/admin',
            icon: 'fa fa-home',
            name: 'dashboard'
        },
        {
            id: 2,
            url: '/admin-profile',
            icon: 'fa fa-user',
            name: 'profile'
        },
        {
            id: 3,
            url: '/admin-users',
            icon: 'fa fa-users',
            name: 'users'
        },
        {
            id: 4,
            url: '/admin-chats',
            icon: 'fas fa-video',
            name: 'videochats'
        },
        {
            id: 5,
            url: '/admin-courses',
            icon: 'fa fa-book',
            name: 'courses'
        },
        {
            id: 6,
            url: '/admin-classes',
            icon: 'fa fa-graduation-cap',
            name: 'classes'
        },
        {
            id: 8,
            url: '/admin-attendance',
            icon: 'fa fa-user-check',
            name: 'attendance'
        },
        {
            id: 9,
            url: '/admin-library',
            icon: 'fa fa-bookmark',
            name: 'library'
        },
        {
            id: 11,
            url: '/admin-info/videochats',
            icon: 'fa fa-info',
            name: 'info'
        },
        {
            id: 12,
            url: '/admin-updates',
            icon: 'fa fa-list-ol',
            name: 'updates'
        }
    ];

    const { siteName, translate } = useContext(SiteSettingsContext);
    let firstLevelPath = location.pathname;

    firstLevelPath = firstLevelPath.substr(1, firstLevelPath.length);
    if ( firstLevelPath.includes('/') ) {
        firstLevelPath = firstLevelPath.substr(0, firstLevelPath.indexOf('/'));
    }
    firstLevelPath = (firstLevelPath === 'chat' ? '/admin-chats' : '/' + firstLevelPath);

    const currentPage = adminNav && adminNav.length ? adminNav.find(item => item.url === firstLevelPath) ? adminNav.find(item => item.url === firstLevelPath).name : 'admin' : '';

    const docTitle = siteName + ' | ' + (currentPage ? translate(currentPage) : 'Завантаження...');

    return (
        <DocumentTitle title={ docTitle }>
            <div className="admin">
                <div className={classNames('page page-' + currentPage)}>
                    <Header/>
                    <Nav type={'admin'} showLogo nav={isTeacher ? teacherNav : adminNav} prefix="main--"/>
                    { children }
                    <ChatWidget/>
                </div>
            </div>
        </DocumentTitle>
    )
}