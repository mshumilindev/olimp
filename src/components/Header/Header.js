import React, {useContext} from 'react';
import './header.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import LanguageSelect from '../language/languageSelect';

export default function Header() {
    const { translate } = useContext(SiteSettingsContext);
    const { user } = useContext(userContext);

    return (
        <header className="header">
            <div className="header__user">
                <div className="header__user-avatar" style={{backgroundImage: 'url(' + user.avatar + ')'}}>
                    {
                        !user.avatar ?
                            <i className="header__user-avatar-icon fas fa-user"/>
                            :
                            null
                    }
                </div>
                { user.name }
                {
                    user.class ?
                        ', ' + user.class
                        :
                        null
                }
            </div>
            <div className="header__actions">
                <div className="header__actions-item header__language">
                    <LanguageSelect />
                </div>
                <div className="header__divider" />
                <div className="header__actions-item header__logout" onClick={logout}>
                    <i className="header__icon fas fa-sign-out-alt" />
                    <span className="header__icon-descr">{ translate('logout') }</span>
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
