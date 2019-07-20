import React, {useContext} from 'react';
import './confirm.scss';
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function Confirm({message, confirmAction, cancelAction}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="confirm">
            <div className="confirm__overlay"/>
            <div className="confirm__box">
                <div className="confirm__heading">
                    { translate('confirm_action') }
                </div>
                <div className="confirm__text">
                    { message }
                </div>
                <div className="confirm__actions">
                    <span className="btn btn__error confirm__action btn__xs" onClick={cancelAction}>{ translate('cancel') }</span>
                    <span className="btn btn_primary confirm__action btn__xs" onClick={confirmAction}>{ translate('confirm') }</span>
                </div>
            </div>
        </div>
    )
}