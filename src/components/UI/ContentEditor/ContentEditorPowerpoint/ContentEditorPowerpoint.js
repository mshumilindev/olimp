import React, { useContext, useState, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';
import ContentEditorInstructions from "../ContentEditorActions/ContentEditorInstructions";
import * as instructionsJSON from './instructions/instructions';

const instructions = instructionsJSON.default;

export default function ContentEditorPowerpoint({ block, setBlock, removeBlock }) {
    const { translate } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    const [ size, setSize ] = useState({width: 0, height: 0});
    block.value = block.value || '';

    const videoContainerRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            const width = videoContainerRef.current.offsetWidth - parseInt(getComputedStyle(videoContainerRef.current).paddingLeft);

            setSize({
                width: width,
                height: width * 56.25 / 100 + 23
            });
        }, 0);
    }, []);

    return (
        <div className="contentEditor__block-powerpoint" ref={videoContainerRef}>
            <form className="form">
                <input type="text" className="form__field" value={block.value} onChange={e => handleChange(e.target.value)} placeholder={translate('enter_powerpoint_url')}/>
            </form>
            <br/>
            {
                block.value && size.width > 0 ?
                    <iframe
                        src={getPowerpointURL(block.value)}
                        style={{width: '100%', height: size.height}} frameBorder="0"
                        allowFullScreen={true}
                        mozAllowFullScreen={true}
                        webkitAllowFullscreen={true} />
                    :
                    <div className="contentEditor__block-placeholder">
                        { translate('powerpoint_will_be_here') }
                    </div>
            }
            <div className="contentEditor__block-actions">
                {/*<span className="contentEditor__block-actions-sort">*/}
                {/*    <i className="content_title-icon fa fa-sort"/>*/}
                {/*</span>*/}
                <ContentEditorInstructions instructions={instructions} heading={'how_to_add_powerpoint'} />
                <a href="/" onClick={e => onRemoveBlock(e)} className="contentEditor__block-actions-remove">
                    <i className="content_title-icon fa fa-trash-alt"/>
                </a>
            </div>
            {
                showRemoveBlock ?
                    <Confirm message={translate('sure_to_remove_block')} confirmAction={() => removeBlock(block)} cancelAction={() => setShowRemoveBlock(false)} />
                    :
                    null
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

    function onRemoveBlock(e) {
        e.preventDefault();

        setShowRemoveBlock(true);
    }

    function handleChange(value) {
        setBlock({
            ...block,
            value: value
        })
    }
}