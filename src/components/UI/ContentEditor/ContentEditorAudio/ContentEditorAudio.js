import React, { useContext, useState } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/languages/ru.js';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';
import Modal from "../../Modal/Modal";
import * as instructionsJSON from './instructions/instructions';

const instructions = instructionsJSON.default;

export default function ContentEditorAudio({ block, setBlock, removeBlock }) {
    const { translate } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    const [ showInstructions, setShowInstructions ] = useState(false);
    block.value = block.value || {
        caption: '',
        url: ''
    };

    return (
        <div className="contentEditor__block-audio">
            <form className="form">
                <div className="form__row">
                    <input type="text" className="form__field" value={block.value.caption} onChange={e => handleChange('caption', e.target.value)} placeholder={translate('enter_audio_caption')}/>
                </div>
                <div className="form__row">
                    <input type="text" className="form__field" value={block.value.url} onChange={e => handleChange('url', e.target.value)} placeholder={translate('enter_audio_url')}/>
                </div>
            </form>
            <br/>
            {
                block.value.url ?
                    <audio controls>
                        <source src={getPlayLink(block.value.url)}/>
                    </audio>
                    :
                    null
            }
            <div className="contentEditor__block-actions">
                {/*<span className="contentEditor__block-actions-sort">*/}
                {/*    <i className="content_title-icon fa fa-sort"/>*/}
                {/*</span>*/}
                <a href="/" onClick={onBlockInfo} className="contentEditor__block-actions-info">
                    <i className="content_title-icon fas fa-question-circle"/>
                </a>
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
            {
                showInstructions ?
                    <Modal heading={translate('how_to_add_audio')} className="contentEditor__instructions-modal" onHideModal={e => setShowInstructions(false)}>
                        <div className="contentEditor__instructions">
                            {
                                instructions.map(item => _renderInstructionItem(item))
                            }
                        </div>
                    </Modal>
                    :
                    null
            }
        </div>
    );

    function _renderInstructionItem(item) {
        switch (item.type) {
            case 'text':
                return <p dangerouslySetInnerHTML={{__html: item.value}}/>;

            case 'image':
                return <div className="contentEditor__instructions-image"><img src={item.value} /></div>;
        }
    }

    function getPlayLink(url) {
        let newURL = url;

        if ( newURL.indexOf('https://drive.google.com/file/d/') !== -1 ) {
            newURL = newURL.replace('https://drive.google.com/file/d/', '');
        }
        if ( newURL.indexOf('/view?usp=sharing') !== -1 ) {
            newURL = newURL.replace('/view?usp=sharing', '');
        }

        if ( newURL.length ) {
            newURL = 'https://docs.google.com/uc?export=download&id=' + newURL;
        }

        return newURL;
    }

    function onBlockInfo(e) {
        e.preventDefault();

        setShowInstructions(true);
    }

    function onRemoveBlock(e) {
        e.preventDefault();

        setShowRemoveBlock(true);
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