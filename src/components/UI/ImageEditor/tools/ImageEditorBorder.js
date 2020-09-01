import React, {useContext, useEffect, useRef, useState} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Range from "../../Range/Range";
import {SwatchesPicker} from "react-color";
import classNames from "classnames";

export default function ImageEditorBorder({border, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showDrop, setShowDrop ] = useState(false);
    const $border = useRef(null);

    useEffect(() => {
        document.addEventListener('click', closeDrop);

        return () => {
            document.removeEventListener('click', closeDrop);
        }
    }, []);

    return (
        <div className="imageEditor__border" ref={$border}>
            <div className={classNames('imageEditor__toolbar-btn', {open: showDrop})} onClick={() => setShowDrop(!showDrop)}>
                <i className="imageEditor__toolbar-btn-icon customIcon borderIcon" style={{
                    border: '2px ' + border.style + ' ' + border.color,
                    boxShadow: border.color === '#fff' || border.color === '#ffffff' ? 'inset 0 0 5px 0 rgba(0,0,0,.15), 0 0 5px 0 rgba(0,0,0,.25)' : 'none'
                }}/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('border') }
                </div>
            </div>
            {
                showDrop ?
                    <div className="imageEditor__border-drop">
                        <div className="imageEditor__border-col">
                            <div className="imageEditor__border-style">
                                <div className="imageEditor__toolbar-heading">{ translate('style') }</div>
                                <div className={classNames('imageEditor__toolbar-btn', {active: border.style === 'solid'})} onClick={() => setSettingsItem('border', {...border, style: 'solid'})}>
                                    <i className="imageEditor__toolbar-btn-icon customIcon borderStyle solid"/>
                                    <div className="imageEditor__toolbar-btn-label">
                                        { translate('solid') }
                                    </div>
                                </div>
                                <div className={classNames('imageEditor__toolbar-btn', {active: border.style === 'dashed'})} onClick={() => setSettingsItem('border', {...border, style: 'dashed'})}>
                                    <i className="imageEditor__toolbar-btn-icon customIcon borderStyle dashed"/>
                                    <div className="imageEditor__toolbar-btn-label">
                                        { translate('dashed') }
                                    </div>
                                </div>
                                <div className={classNames('imageEditor__toolbar-btn', {active: border.style === 'dotted'})} onClick={() => setSettingsItem('border', {...border, style: 'dotted'})}>
                                    <i className="imageEditor__toolbar-btn-icon customIcon borderStyle dotted"/>
                                    <div className="imageEditor__toolbar-btn-label">
                                        { translate('dotted') }
                                    </div>
                                </div>
                            </div>
                            <div className="imageEditor__border-width">
                                <div className="imageEditor__toolbar-heading">{ translate('width') }</div>
                                <Range
                                    step={10}
                                    min={0}
                                    max={100}
                                    activeValue={border.width}
                                    type={'border'}
                                    setRange={(type, value) => setSettingsItem(type, {...border, width: value})}
                                    units={'px'}
                                />
                            </div>
                        </div>
                        <div className="imageEditor__border-col">
                            <div className="imageEditor__border-color">
                                <div className="imageEditor__toolbar-heading">{ translate('color') }</div>
                                <SwatchesPicker
                                    color={border.color}
                                    onChange={value => setSettingsItem('border', {...border, color: value.hex})}
                                    height="100%"
                                    width={400}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    );

    function closeDrop(e) {
        if ( e.target !== $border.current && !$border.current.contains(e.target) ) {
            setShowDrop(false);
        }
    }
}
