import React, {useContext, useEffect, useRef, useState} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import {SwatchesPicker} from "react-color";
import classNames from "classnames";
import Range from "../../Range/Range";

export default function ImageEditorOverlay({overlay, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showColorPicker, setShowColorPicker ] = useState(false);
    const $overlay = useRef(null);

    useEffect(() => {
        document.addEventListener('click', closeBG);

        return () => {
            document.removeEventListener('click', closeBG);
        }
    }, []);

    return (
        <div className="imageEditor__overlay" ref={$overlay}>
            <div className={classNames('imageEditor__toolbar-btn', {open: showColorPicker})} onClick={() => setShowColorPicker(!showColorPicker)}>
                <i className="imageEditor__toolbar-btn-icon fas fa-palette" style={{
                    color: overlay.color,
                    textShadow: overlay.color === '#fff' || overlay.color === '#ffffff' ? '0 0 5px rgba(0,0,0,.25)' : 'none'
                }}/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('overlay') }
                </div>
            </div>
            {
                showColorPicker ?
                    <div className="imageEditor__overlay-drop">
                        <div className="imageEditor__overlay-opacity">
                            <div className="imageEditor__toolbar-heading">{ translate('opacity') }</div>
                            <Range
                                step={10}
                                min={0}
                                max={100}
                                activeValue={overlay.opacity}
                                type={'overlay'}
                                setRange={(type, value) => setSettingsItem(type, {...overlay, opacity: value})}
                            />
                        </div>
                        <div className="imageEditor__overlay-color">
                            <div className="imageEditor__toolbar-heading">{ translate('color') }</div>
                            <SwatchesPicker
                                color={overlay.color}
                                onChange={value => setSettingsItem('overlay', {...overlay, color: value.hex})}
                                height="100%"
                                width={400}
                            />
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    );

    function closeBG(e) {
        if ( e.target !== $overlay.current && !$overlay.current.contains(e.target) ) {
            setShowColorPicker(false);
        }
    }
}