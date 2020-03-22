import React, { useContext, useState, useEffect, useRef } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/languages/ru.js';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';
import ReactPlayer from 'react-player';

export default function ContentEditorYoutube({ block, setBlock, removeBlock }) {
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
                height: width * 56.25 / 100
            });
        }, 0);
    }, []);

    return (
        <div className="contentEditor__block-youtube" ref={videoContainerRef}>
            <form className="form">
                <input type="text" className="form__field" value={block.value} onChange={e => handleChange(e.target.value)}/>
            </form>
            <br/>
            {
                block.value ?
                    <ReactPlayer url={block.value} width={size.width} height={size.height} />
                    :
                    null
            }
            <div className="contentEditor__block-actions">
                {/*<span className="contentEditor__block-actions-sort">*/}
                {/*    <i className="content_title-icon fa fa-sort"/>*/}
                {/*</span>*/}
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