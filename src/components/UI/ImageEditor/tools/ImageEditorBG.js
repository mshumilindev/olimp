import React, {useContext} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function ImageEditorBG({bg, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="imageEditor__bg">
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon customIcon colorIcon" style={{backgroundColor: bg}}/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('background') }
                </div>
            </div>
        </div>
    )
}