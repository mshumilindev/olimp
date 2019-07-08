import React, {useContext} from 'react';
import './header.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import LanguageSelect from '../language/languageSelect';

export default function Header() {
    const { translate, lang } = useContext(SiteSettingsContext);
    const { userName, userData } = useContext(userContext);

    return (
        <header className="header">
            <div className="header_user">
                { userName[lang] }
                {
                    userData && userData.class ?
                        ', ' + userData.class[lang]
                        :
                        null
                }
            </div>
            <div className="header_actions">
                <div className="header_actions-item header_language">
                    <LanguageSelect />
                </div>
                <div className="header_actions-item header_notifications">
                    <i className="header_icon fa fa-bell" />
                    <span className="header_icon-descr">{ translate('notifications') }</span>
                </div>
                <div className="header_divider" />
                <div className="header_actions-item header_logout" onClick={logout}>
                    <i className="header_icon fas fa-sign-out-alt" />
                    <span className="header_icon-descr">{ translate('logout') }</span>
                </div>
            </div>
        </header>
    );

    function logout() {
        // === Confirmation prompt needs to be made into styled component
        if ( window.confirm(translate('sure_to_logout')) ) {
            localStorage.removeItem('user');
            window.location.replace('/');
        }
    }
}
