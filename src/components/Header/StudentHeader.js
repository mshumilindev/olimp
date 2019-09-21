import React, {useContext, useState} from 'react';
import './studentHeader.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import LanguageSelect from '../language/languageSelect';
import Confirm from '../UI/Confirm/Confirm';
import {connect} from "react-redux";
import { fetchClasses } from "../../redux/actions/classesActions";
import { Link } from 'react-router-dom';
import {Preloader} from "../UI/preloader";

function StudentHeader({logo, siteName}) {
    const { translate, lang } = useContext(SiteSettingsContext);
    const [ showConfirmLogout, setShowConfirmLogout ] = useState(false);

    return (
        <header className="studentHeader">
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

    function onConfirmLogout() {
        localStorage.removeItem('user');
        window.location.replace('/');
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentHeader);
