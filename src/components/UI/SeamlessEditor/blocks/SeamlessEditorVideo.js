import React, { useContext } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function SeamlessEditorVideo({ block, setBlock }) {
    const { translate } = useContext(siteSettingsContext);
    block.value = block.value || {
        caption: '',
        url: ''
    };

    return (
        <div className="seamlessEditor__editor-block-video">
            <form className="form">
                <div className="form__row">
                    <input type="text" className="form__field" value={block.value.caption} onChange={e => handleChange('caption', e.target.value)} placeholder={translate('enter_video_caption')}/>
                </div>
                <div className="form__row">
                    <input type="text" className="form__field" value={block.value.url} onChange={e => handleChange('url', e.target.value)} placeholder={translate('enter_video_url')}/>
                </div>
            </form>
            <br/>
            {
                block.value.url ?
                    <div className="contentEditor__block-video-holder">
                        <iframe src={getPlayLink(block.value.url)} allowFullScreen frameBorder/>
                    </div>
                    :
                    null
            }
        </div>
    );

    function getPlayLink(url) {
        return url.replace('https://drive.google.com/open?id=', 'https://drive.google.com/file/d/') + '/preview';
    }

    function handleChange(type, value) {
        const newValue = block.value;

        newValue[type] = value;

        setBlock({
            ...block,
            value: newValue
        })
    }
}