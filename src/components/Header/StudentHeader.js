import React, {useContext, useState, useEffect} from 'react';
import './studentHeader.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import LanguageSelect from '../language/languageSelect';
import Confirm from '../UI/Confirm/Confirm';
import {connect} from "react-redux";
import { fetchClasses } from "../../redux/actions/classesActions";
import { withRouter, Link } from 'react-router-dom';
import {Preloader} from "../UI/preloader";
import classNames from 'classnames';

function StudentHeader({logo, siteName, history}) {
    const { translate, lang } = useContext(SiteSettingsContext);
    const [ showConfirmLogout, setShowConfirmLogout ] = useState(false);
    const [ showMobileMenu, toggleMobileMenu ] = useState(false);
    let touchStart = null;

    useEffect(() => {
        document.addEventListener('click', e => onHideMenu(e));
        document.addEventListener('touchstart', e => onTouchStart(e));
        document.addEventListener('touchend', e => onTouchEnd(e));
    }, []);

    useEffect(() => {
        if ( showMobileMenu ) {
            handleToggleMenu();
            window.scrollTo({top: 0});
            document.removeEventListener('click', onHideMenu);
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchend', onTouchEnd);
        }
    }, [history.location.key]);

    return (
        <header className="studentHeader">
            <a href="/" className={classNames('studentHeader__burger laptop-hide', {active: showMobileMenu})} onClick={e => handleToggleMenu(e)}>
                <span/>
                <span/>
                <span/>
            </a>
            {
                logo ?
                    <h1 className="studentHeader__logo">
                        <Link to="/">
                            <img src={ logo.url } alt={ siteName[lang] ? siteName[lang] : siteName['ua'] } />
                        </Link>
                    </h1>
                    :
                    <Preloader size={40}/>
            }
            <div className="header__actions">
                <div className="header__actions-item header__language">
                    <LanguageSelect />
                </div>
                <div className="header__divider" />
                <div className="header__actions-item header__logout" onClick={() => setShowConfirmLogout(true)}>
                    <i className="header__icon fas fa-sign-out-alt" />
                    <span className="header__icon-descr">{ translate('logout') }</span>
                </div>
            </div>
            {
                showConfirmLogout ?
                    <Confirm message={translate('sure_to_logout')} confirmAction={onConfirmLogout} cancelAction={() => setShowConfirmLogout(false)}/>
                    :
                    null
            }
        </header>
    );

    function handleToggleMenu(e, direction) {
        if ( e ) {
            e.preventDefault();
        }

        if ( direction !== undefined ) {
            toggleMobileMenu(direction);

            if ( direction ) {
                document.querySelector('.page').classList.add('navVisible');
                document.querySelector('body').classList.add('overflow');
            }
            else {
                document.querySelector('.page').classList.remove('navVisible');
                document.querySelector('body').classList.remove('overflow');
            }
        }
        else {
            toggleMobileMenu(!showMobileMenu);
            if ( document.querySelector('.page') ) {
                document.querySelector('.page').classList.toggle('navVisible');
            }
            document.querySelector('body').classList.toggle('overflow');
        }
    }

    function onConfirmLogout() {
        localStorage.removeItem('user');
        window.location.replace('/landing');
    }

    function onHideMenu(e) {
        if ( !e.target.closest('.studentHeader__burger') && !e.target.closest('.studentNav') ) {
            toggleMobileMenu(false);
            if ( document.querySelector('.page') ) {
                document.querySelector('.page').classList.remove('navVisible');
            }
            document.querySelector('body').classList.remove('overflow');
        }
    }

    function onTouchStart(e) {
        touchStart = e.touches[0].clientX;
    }

    function onTouchEnd(e) {
        const touch = e.changedTouches[0].clientX;

        if ( touch - touchStart >= window.outerWidth / 4 ) {
            handleToggleMenu(null, true);
        }
        else if ( touchStart - touch >= window.outerWidth / 4 ) {
            handleToggleMenu(null, false);
        }

        touchStart = null;
    }
}
const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    logo: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.logo : null,
    siteName: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.siteName : null
});
const mapDispatchToProps = dispatch => ({
    fetchClasses: dispatch(fetchClasses())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StudentHeader));
