import React, {useContext} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function ImageEditorOverlay({overlay, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="imageEditor__overlay">
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon customIcon colorIcon" style={{backgroundColor: overlay}}/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('overlay') }
                </div>
            </div>
        </div>
    )
}