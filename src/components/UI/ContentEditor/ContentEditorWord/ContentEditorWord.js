import React, { useContext, useState, useEffect, useRef } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/languages/ru.js';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';
import ContentEditorInstructions from "../ContentEditorActions/ContentEditorInstructions";
import * as instructionsJSON from './instructions/instructions';

const instructions = instructionsJSON.default;

export default function ContentEditorWord({ block, setBlock, removeBlock }) {
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
        <div className="contentEditor__block-word" ref={videoContainerRef}>
            <form className="form">
                <input type="text" className="form__field" value={block.value} onChange={e => handleChange(e.target.value)} placeholder={translate('enter_word_url')}/>
            </form>
            <br/>
            {
                block.value && size.width > 0 ?
                    <div className="contentEditor__block-word-holder">
                        <iframe
                            src={getWordURL(block.value)}
                            style={{width: '100%', height: size.width * 141 / 100}} frameBorder="0"
                            allowFullScreen={true}
                            mozAllowFullScreen={true}
                            webkitAllowFullscreen={true} />
                    </div>
                    :
                    <div className="contentEditor__block-placeholder">
                        { translate('word_will_be_here') }
                    </div>
            }
            <div className="contentEditor__block-actions">
                {/*<span className="contentEditor__block-actions-sort">*/}
                {/*    <i className="content_title-icon fa fa-sort"/>*/}
                {/*</span>*/}
                <ContentEditorInstructions instructions={instructions} heading={'how_to_add_word'} />
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

    function getWordURL(url) {
        let newURL = url;

        if ( newURL.length ) {
            newURL = newURL += '?embedded=true&widget=false&headers=false&chrome=false';
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