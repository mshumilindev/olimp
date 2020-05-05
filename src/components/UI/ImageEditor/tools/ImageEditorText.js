import React from 'react';
import {useContext} from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function({text, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="imageEditor__text">
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon fas fa-th"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('position') }
                </div>
            </div>
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon fas fa-palette" style={text && text.color ? {color: text.color} : null}/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('color') }
                </div>
            </div>
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon fas fa-heading"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('heading') }
                </div>
            </div>
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon fas fa-font"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('text') }
                </div>
            </div>
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon fas fa-link"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('button') }
                </div>
            </div>
        </div>
    )
}