import React, {useContext} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function ImageEditorBorder({border, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="imageEditor__toolbar-btn">
            <i className="imageEditor__toolbar-btn-icon customIcon borderIcon"/>
            <div className="imageEditor__toolbar-btn-label">
                { translate('border') }
            </div>
        </div>
    )
}