import React, {useContext, useEffect, useRef, useState} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import { SwatchesPicker } from 'react-color';
import classNames from 'classnames';

export default function ImageEditorBG({bg, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showColorPicker, setShowColorPicker ] = useState(false);
    const $bg = useRef(null);

    useEffect(() => {
        document.addEventListener('click', closeBG);

        return () => {
            document.removeEventListener('click', closeBG);
        }
    }, []);

    return (
        <div className="imageEditor__bg" ref={$bg}>
            <div className={classNames('imageEditor__toolbar-btn', {open: showColorPicker})} onClick={() => setShowColorPicker(!showColorPicker)}>
                <i className="imageEditor__toolbar-btn-icon fas fa-palette" style={{
                    color: bg,
                    textShadow: bg === '#fff' || bg === '#ffffff' ? '0 0 5px rgba(0,0,0,.25)' : 'none'
                }}/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('background') }
                </div>
            </div>
            {
                showColorPicker ?
                    <div className="imageEditor__bg-drop">
                        <div className="imageEditor__toolbar-heading">{ translate('color') }</div>
                        <SwatchesPicker
                            color={bg}
                            onChange={value => setSettingsItem('bg', value.hex)}
                            height="100%"
                            width={400}
                        />
                    </div>
                    :
                    null
            }
        </div>
    );

    function closeBG(e) {
        if ( e.target !== $bg.current && !$bg.current.contains(e.target) ) {
            setShowColorPicker(false);
        }
    }
}