import React, { useContext } from 'react';
import './nav.scss';
import { Link } from 'react-router-dom';
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';
import {fetchSiteSettings} from "../../redux/actions/siteSettingsActions";
import {connect} from "react-redux";
import withFilters from "../../utils/withFilters";
import {Preloader} from "../UI/preloader";

function Nav({nav, prefix, showLogo, hideItems, logo}) {
    const { siteName, translate } = useContext(SiteSettingsContext);

    return (
        <nav className={prefix + 'nav'}>
            <ul className={prefix + 'nav_list'}>
                {
                    showLogo ?
                        <li className={prefix + 'nav_logo-item'}>
                            {
                                logo ?
                                    <img src={ logo.url } alt={ siteName } className={prefix + 'nav_logo'} />
                                    :
                                    <Preloader size={52}/>
                            }
                        </li>
                        :
                        null
                }
                { nav.map(item => _renderItem(item)) }
            </ul>
        </nav>
    );

    function _renderItem(item) {
        const pathName = window.location.pathname;

        if ( !hideItems || !hideItems.some(hiddenItem => item.name === hiddenItem) ) {
            return (
                <li key={item.id} className={prefix + 'nav_item'}>
                    <Link to={ item.url } className={classNames(prefix + 'nav_link type-' + item.name, {active: pathName.includes(item.url) && (pathName.substr(item.url.length, pathName.length).split('')[0] === '/' || pathName.substr(item.url.length, pathName.length).split('')[0] === undefined)})}>
                        <i className={prefix + 'nav_icon ' + item.icon} />
                        <span className={prefix + 'nav_text'}>{ translate(item.name) }</span>
                    </Link>
                </li>
            )
        }
        return false;
    }
}
const mapStateToProps = state => ({
    logo: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.logo : null
});
const mapDispatchToProps = dispatch => ({
    fetchSiteSettings: dispatch(fetchSiteSettings())
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(Nav, true));