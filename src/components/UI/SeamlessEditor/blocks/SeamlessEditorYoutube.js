import React, { useContext } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import ReactPlayer from 'react-player';

export default function SeamlessEditorYoutube({ block, setBlock }) {
    const { translate } = useContext(siteSettingsContext);
    block.value = block.value || '';

    return (
        <div className="seamlessEditor__editor-block-youtube">
            <form className="form">
                <div className="form__row">
                    <input type="text" className="form__field" value={block.value} onChange={e => handleChange(e.target.value)} placeholder={translate('enter_youtube_url')}/>
                </div>
            </form>
            <br/>
            {
                block.value ?
                    <div className="seamlessEditor__editor-block-youtube-holder">
                        <ReactPlayer url={block.value} width={'auto'} height={'auto'} />
                    </div>
                    :
                    null
            }
        </div>
    );

    function handleChange(value) {
        setBlock({
            ...block,
            value: value
        })
    }
}