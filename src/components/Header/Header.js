import React, {useContext, useState} from 'react';
import './header.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import LanguageSelect from '../language/languageSelect';
import Confirm from '../UI/Confirm/Confirm';

export default function Header() {
    const { translate } = useContext(SiteSettingsContext);
    const { user } = useContext(userContext);
    const [ showConfirmLogout, setShowConfirmLogout ] = useState(false);

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
                <div className="header__user-name">
                    { user.name }
                    <div className="header__user-role">
                        { translate(user.role) }
                    </div>
                </div>
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
