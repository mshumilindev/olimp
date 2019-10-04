import React, { useContext } from 'react';
import DocumentTitle from "react-document-title";
import StudentHeader from "../components/Header/StudentHeader";
import StudentNav from "../components/Nav/StudentNav";
import Footer from '../components/Footer/Footer';
import SiteSettingsContext from "../context/siteSettingsContext";
import userContext from "../context/userContext";
import {Preloader} from "../components/UI/preloader";

export default function Layout({children, location}) {
    const { siteName, translate } = useContext(SiteSettingsContext);
    const { user } = useContext(userContext);
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
            url: '/class',
            icon: 'fa fa-graduation-cap',
            name: 'class'
        },
        {
            id: 5,
            url: '/contact',
            icon: 'fa fa-mobile-alt',
            name: 'contact'
        }
    ];

    const currentPage = studentNav && studentNav.length ? studentNav.find(item => item.url === location.pathname) && studentNav.find(item => item.url === location.pathname).name : '';

    const docTitle = siteName + ' | ' + (currentPage ? translate(currentPage) : 'Завантаження...');

    return (
        <DocumentTitle title={ docTitle }>
            {
                translate('current_schedule') === 'current_schedule' ?
                    <Preloader color={'#7f00a3'}/>
                    :
                    <>
                        <div className={'page ' + user.role}>
                            <StudentHeader/>
                            <div className="page__inner">
                                <StudentNav nav={studentNav} />
                                <div className="content mapContainer">
                                    <div className="content__inner">
                                        { children }
                                    </div>
                                </div>
                                {
                                    window.outerWidth < 769 ?
                                        <Footer/>
                                        :
                                        null
                                }
                            </div>
                            {
                                window.outerWidth >= 769 ?
                                    <Footer/>
                                    :
                                    null
                            }
                        </div>
                    </>
            }
        </DocumentTitle>
    );
}
