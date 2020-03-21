import React, { useContext } from 'react';
import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';
import DocumentTitle from "react-document-title";
import SiteSettingsContext from "../../context/siteSettingsContext";

export default function Admin({children, location, params, isTeacher}) {
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
            url: '/admin-pages',
            icon: 'fa fa-copy',
            name: 'pages'
        },
        {
            id: 8,
            url: '/admin-library',
            icon: 'fa fa-bookmark',
            name: 'library'
        },
        {
            id: 9,
            url: '/admin-translations',
            icon: 'fa fa-language',
            name: 'translations'
        },
        {
            id: 10,
            url: '/admin-settings',
            icon: 'fa fa-cogs',
            name: 'settings'
        },
        {
            id: 11,
            url: '/admin-info',
            icon: 'fa fa-info',
            name: 'info'
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
            id: 4,
            url: '/admin-users',
            icon: 'fa fa-users',
            name: 'users'
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
            url: '/admin-library',
            icon: 'fa fa-bookmark',
            name: 'library'
        },
        {
            id: 11,
            url: '/admin-info',
            icon: 'fa fa-info',
            name: 'info'
        }
    ];

    const { siteName, translate } = useContext(SiteSettingsContext);
    let firstLevelPath = location.pathname;

    firstLevelPath = firstLevelPath.substr(1, firstLevelPath.length);
    if ( firstLevelPath.includes('/') ) {
        firstLevelPath = firstLevelPath.substr(0, firstLevelPath.indexOf('/'));
    }
    firstLevelPath = '/' + firstLevelPath;

    const currentPage = adminNav && adminNav.length ? adminNav.find(item => item.url === firstLevelPath) ? adminNav.find(item => item.url === firstLevelPath).name : 'admin' : '';

    const docTitle = siteName + ' | ' + (currentPage ? translate(currentPage) : 'Завантаження...');

    return (
        <DocumentTitle title={ docTitle }>
            <div className="admin">
                <div className="page">
                    <Header/>
                    <Nav type={'admin'} showLogo nav={isTeacher ? teacherNav : adminNav} prefix="main--"/>
                    { children }
                </div>
            </div>
        </DocumentTitle>
    )
}