import React, { useContext, useState, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function SeamlessEditorGooglePowerpoint({ block, setBlock }) {
    const { translate } = useContext(siteSettingsContext);
    const [ size, setSize ] = useState({width: 0, height: 0});
    block.value = block.value || '';

    const powerpointContainerRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            const width = powerpointContainerRef.current.offsetWidth - parseInt(getComputedStyle(powerpointContainerRef.current).paddingLeft);

            setSize({
                width: width,
                height: width * 56.25 / 100 + 23
            });
        }, 0);
    }, []);

    return (
        <div className="seamlessEditor__editor-block-powerpoint" ref={powerpointContainerRef}>
            <form className="form">
                <div className="form__row">
                    <input type="text" className="form__field" value={block.value} onChange={e => handleChange(e.target.value)} placeholder={translate('enter_powerpoint_url')}/>
                </div>
            </form>
            <br/>
            {
                block.value && size.width > 0 ?
                    <div className="seamlessEditor__editor-block-powerpoint-holder">
                        <iframe
                            src={getPowerpointURL(block.value)}
                            style={{width: '100%', height: size.height}} frameBorder="0"
                            allowFullScreen={true}
                            mozAllowFullScreen={true}
                            webkitAllowFullscreen={true} />
                    </div>
                    :
                    <div className="seamlessEditor__editor-block-placeholder">
                        { translate('powerpoint_will_be_here') }
                    </div>
            }
        </div>
    );

    function getPowerpointURL(url) {
        let newURL = url;

        if ( newURL.length ) {
           newURL = newURL.replace('/pub?', '/embed?')
        }
        return newURL;
    }

    function handleChange(value) {
        setBlock({
            ...block,
            value: value
        })
    }
}