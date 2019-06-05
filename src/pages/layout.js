import React from 'react';
import DocumentTitle from "react-document-title";
import Header from "../components/header/header";
import Nav from "../components/nav/nav";
import SiteSettingsContext from "../context/siteSettingsContext";
import Loader from '../assets/img/loader.svg';

export default class Layout extends React.Component {
    render() {
        const { siteName, translate } = this.context;
        const nav = this.getSortedNav(this.props.nav);

        const currentPage = nav && nav.length ? nav.find(item => item.url === this.props.location.pathname).name : '';

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
                            <Nav nav={nav} prefix="main--" showLogo />
                            <div className="grid">
                                { this.props.children }
                            </div>
                        </div>
                }
            </DocumentTitle>
        )
    }

    getSortedNav(arr) {
        return arr.sort((a, b) => a.id - b.id);
    }
}
Layout.contextType = SiteSettingsContext;
