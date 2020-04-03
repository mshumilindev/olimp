import React, {useContext} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import './guest.scss';

export default function Guest() {
    const { translate } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);

    return (
        <div className="guestPage">
            <div className="guestPage__title">
                <span>{ translate('welcome') },&nbsp;</span>
                <span className="guestPage__name">{ user.name }!</span>
            </div>
            <div className="guestPage__content">
                { translate('guest_dashboard_message') }
            </div>
        </div>
    )
}