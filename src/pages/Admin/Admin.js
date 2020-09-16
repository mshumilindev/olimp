import React, {useContext, useEffect, useMemo} from 'react';
import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';
import DocumentTitle from "react-document-title";
import SiteSettingsContext from "../../context/siteSettingsContext";
import ChatWidget from "../../components/ChatBox/ChatWidget";
import '../../assets/scss/base/chatroom.scss';
import firebase from "../../db/firestore";
import classNames from 'classnames';
import { connect } from 'react-redux';

function Admin({user, children, location, isTeacher, fetchEvents, fetchEventsOrganizer, fetchEventsParticipant}) {
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
        if ( user.role === 'admin' ) {
            fetchEvents();
        }
        else {
            fetchEventsOrganizer(user.id);
            fetchEventsParticipant(user.id);
        }
    }, [fetchEvents, fetchEventsOrganizer, fetchEventsParticipant, user]);

    const adminNav = useMemo(() => {
        return [
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
            }
        ];
    }, []);

    const teacherNav = useMemo(() => {
        return [
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
                id: 7,
                url: '/admin-attendance',
                icon: 'fa fa-user-check',
                name: 'attendance'
            },
            {
                id: 8,
                url: '/admin-tests',
                icon: 'fas fa-clipboard-check',
                name: 'testing'
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
            }
        ];
    }, []);

    const { siteName, translate } = useContext(SiteSettingsContext);

    const firstLevelPath = useMemo(() => {
        let path = location.pathname;
        path = path.substr(1, path.length);

        if ( path.includes('/') ) {
            path = path.substr(0, path.indexOf('/'));
        }
        path = (path === 'chat' ? '/admin-chats' : '/' + path);

        return path;
    }, [location]);

    const currentPage = useMemo(() => {
        if ( adminNav && adminNav.length ) {
            if ( adminNav.find(item => item.url === firstLevelPath) ) {
                return adminNav.find(item => item.url === firstLevelPath).name;
            }
            else {
                return 'admin';
            }
        }
        return '';
    }, [adminNav, firstLevelPath]);

    const docTitle = useMemo(() => {
        return siteName + ' | ' + (currentPage ? translate(currentPage) : 'Завантаження...');
    }, [siteName, currentPage, translate]);

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

const mapStateToProps = state => {
    return {
        user: state.authReducer.currentUser
    }
};

export default connect(mapStateToProps)(Admin);