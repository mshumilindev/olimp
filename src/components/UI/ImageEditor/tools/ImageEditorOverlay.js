import React, {useContext, useEffect, useRef, useState} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import {SwatchesPicker} from "react-color";
import classNames from "classnames";
import Range from "../../Range/Range";
import Form from "../../../Form/Form";

export default function ImageEditorOverlay({overlay, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showColorPicker, setShowColorPicker ] = useState(false);
    const $overlay = useRef(null);

    const modesFields = [
        {
            type: 'select',
            id: 'overlayMode',
            value: overlay.mode,
            options: [
                {
                    id: 'normal',
                    title: 'normal'
                },
                {
                    id: 'color',
                    title: 'color'
                },
                {
                    id: 'color-burn',
                    title: 'color-burn'
                },
                {
                    id: 'color-dodge',
                    title: 'color-dodge'
                },
                {
                    id: 'darken',
                    title: 'darken'
                },
                {
                    id: 'difference',
                    title: 'difference'
                },
                {
                    id: 'exclusion',
                    title: 'exclusion'
                },
                {
                    id: 'hard-light',
                    title: 'hard-light'
                },
                {
                    id: 'hue',
                    title: 'hue'
                },
                {
                    id: 'lighten',
                    title: 'lighten'
                },
                {
                    id: 'luminosity',
                    title: 'luminosity'
                },
                {
                    id: 'multiply',
                    title: 'multiply'
                },
                {
                    id: 'overlay',
                    title: 'overlay'
                },
                {
                    id: 'saturation',
                    title: 'saturation'
                },
                {
                    id: 'screen',
                    title: 'screen'
                },
                {
                    id: 'soft-light',
                    title: 'soft-light'
                }
            ]
        }
    ];

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
                        <div className="imageEditor__overlay-mode">
                            <div className="imageEditor__toolbar-heading">{ translate('blend_mode') }</div>
                            <Form fields={modesFields} setFieldValue={(fieldID, value) => setSettingsItem('overlay', {...overlay, mode: value})}/>
                        </div>
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