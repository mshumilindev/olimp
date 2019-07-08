import React, { useContext } from 'react';
import DocumentTitle from "react-document-title";
import Header from "../components/Header/Header";
import Nav from "../components/Nav/Nav";
import SiteSettingsContext from "../context/siteSettingsContext";
import Loader from '../assets/img/loader.svg';

export default function Layout({children, nav, location}) {
    const { siteName, translate } = useContext(SiteSettingsContext);
    const sortedNav = getSortedNav(nav);

    const currentPage = sortedNav && sortedNav.length ? sortedNav.find(item => item.url === location.pathname).name : '';

    const docTitle = siteName + ' | ' + (currentPage ? translate(currentPage) : 'Завантаження...');

    return (
        <DocumentTitle title={ docTitle }>
            {
                translate('current_schedule') === 'current_schedule' ?
                    <div className="loader">
                        <img src={Loader} alt="Loading..."/>
                    </div>
                    :
                    <div className="page">
                        <Header/>
                        <Nav nav={sortedNav} prefix="main--" showLogo />
                        <div className="grid">
                            { children }
                        </div>
                    </div>
            }
        </DocumentTitle>
    );

    function getSortedNav(arr) {
        return arr.sort((a, b) => a.id - b.id);
    }
}
