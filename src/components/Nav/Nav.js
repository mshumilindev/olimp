import React, { useContext, useState, useEffect } from 'react';
import './nav.scss';
import { Link } from 'react-router-dom';
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';
import {connect} from "react-redux";
import withFilters from "../../utils/withFilters";
import Preloader from "../UI/preloader";
import favicon from '../../assets/img/favicon.png';

function Nav({user, nav, prefix, showLogo, hideItems, logo}) {
    const { siteName, translate } = useContext(SiteSettingsContext);
    const [ isNavCollapsed, setIsNavCollapsed ] = useState(localStorage.getItem('isNavCollapsed'));

    useEffect(() => {
        if ( isNavCollapsed ) {
          document.querySelector('body').classList.add('isNavCollapsed');
        }
        else {
          document.querySelector('body').classList.remove('isNavCollapsed');
        }
    }, [isNavCollapsed]);

    return (
        <nav className={prefix + 'nav'}>
            <ul className={prefix + 'nav_list'}>
                {
                    showLogo ?
                        <li className={prefix + 'nav_logo-item'}>
                            {
                                logo ?
                                    isNavCollapsed ?
                                      <img src={ favicon } alt={ siteName } className={prefix + 'nav_logo'} />
                                      :
                                      <img src={ logo.url } alt={ siteName } className={prefix + 'nav_logo'} />
                                    :
                                    <Preloader size={52}/>
                            }
                        </li>
                        :
                        null
                }
                { nav.map(item => _renderItem(item)) }
                {
                  user.role === 'admin' || user.role === 'teacher' ?
                      <li className={prefix + 'nav__collapse'}>
                          <span className={prefix + 'nav__collapse-inner'} onClick={collapseNav}>
                              {
                                  isNavCollapsed ?
                                      <i className={prefix + 'nav_icon fa fa-chevron-right'} />
                                      :
                                      <>
                                          <i className={prefix + 'nav_icon fa fa-chevron-left'} />
                                          <span className={prefix + 'nav_text'}>{ translate('collapse') }</span>
                                      </>
                              }
                          </span>
                      </li>
                      :
                      null
                }
            </ul>
        </nav>
    );

    function _renderItem(item) {
        const pathName = window.location.pathname;

        if ( !hideItems || !hideItems.some(hiddenItem => item.name === hiddenItem) ) {
            return (
                <li key={item.id} className={prefix + 'nav_item'}>
                    <Link to={ item.url } className={classNames(prefix + 'nav_link type-' + item.name, {active: pathName.includes(item.url) && (pathName.substr(item.url.length, pathName.length).split('')[0] === '/' || pathName.substr(item.url.length, pathName.length).split('')[0] === undefined)})}>
                        {
                            isNavCollapsed ?
                                <i className={prefix + 'nav_icon ' + item.icon} />
                                :
                                <>
                                    <i className={prefix + 'nav_icon ' + item.icon} />
                                    <span className={prefix + 'nav_text'}>{ translate(item.name) }</span>
                                </>
                        }
                    </Link>
                </li>
            )
        }
        return false;
    }

    function collapseNav() {
      localStorage.setItem('isNavCollapsed', !isNavCollapsed);
      setIsNavCollapsed(!isNavCollapsed);
    }
}
const mapStateToProps = state => ({
    logo: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.logo : null,
    user: state.authReducer.currentUser
});
export default connect(mapStateToProps)(withFilters(Nav, true));
