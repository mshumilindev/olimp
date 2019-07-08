import React, { useContext } from 'react';
import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';
import DocumentTitle from "react-document-title";
import SiteSettingsContext from "../../context/siteSettingsContext";

export default function Admin({children, location}) {
    const adminNav = [
        {
            id: 0,
            url: '/admin',
            icon: 'fa fa-home',
            name: 'admin'
        },
        {
            id: 1,
            url: '/admin-users',
            icon: 'fa fa-users',
            name: 'users'
        },
        {
            id: 2,
            url: '/admin-courses',
            icon: 'fa fa-graduation-cap',
            name: 'courses'
        },
        {
            id: 3,
            url: '/admin-translations',
            icon: 'fa fa-language',
            name: 'translations'
        },
        {
            id: 4,
            url: '/admin-settings',
            icon: 'fa fa-cogs',
            name: 'settings'
        }
    ];

    const { siteName, translate } = useContext(SiteSettingsContext);

    const currentPage = adminNav && adminNav.length ? adminNav.find(item => item.url === location.pathname) ? adminNav.find(item => item.url === location.pathname).name : 'admin' : '';

    const docTitle = siteName + ' | ' + (currentPage ? translate(currentPage) : 'Завантаження...');

    return (
        <DocumentTitle title={ docTitle }>
            <div className="admin">
                <div className="page">
                    <Header/>
                    <Nav type={'admin'} showLogo nav={adminNav} prefix="main--"/>
                    { children }
                </div>
            </div>
        </DocumentTitle>
    )
}