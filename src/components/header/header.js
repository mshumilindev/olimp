import React from 'react';
import './header.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import LanguageSelect from '../language/languageSelect';

export default class Header extends React.Component {
    render() {
        const { translate } = this.context;

        return (
            <header className="header">
                <div className="header_user">
                    John Doe, 8B
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
                    <div className="header_actions-item header_logout">
                        <i className="header_icon fas fa-sign-out-alt" />
                        <span className="header_icon-descr">{ translate('logout') }</span>
                    </div>
                </div>
            </header>
        )
    }
}
Header.contextType = SiteSettingsContext;