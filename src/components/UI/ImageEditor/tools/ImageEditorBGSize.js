import React, {useContext} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import classNames from 'classnames';

export default function ImageEditorBGSize({size, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <>
            <div className={classNames('imageEditor__toolbar-btn', {active: size === 'cover'})} onClick={() => setSettingsItem('size', 'cover')}>
                <i className="imageEditor__toolbar-btn-icon customIcon coverIcon"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('cover') }
                </div>
            </div>
            <div className={classNames('imageEditor__toolbar-btn', {active: size === 'contain'})} onClick={() => setSettingsItem('size', 'contain')}>
                <i className="imageEditor__toolbar-btn-icon customIcon containIcon"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('contain') }
                </div>
            </div>
        </>
    )
}