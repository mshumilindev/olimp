import React, {useContext} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function ImageEditorTransform({transform, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="imageEditor__transform">
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon fas fa-draw-polygon"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('transform') }
                </div>
            </div>
        </div>
    )
}