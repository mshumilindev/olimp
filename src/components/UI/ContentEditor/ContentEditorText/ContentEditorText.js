import React, { useContext, useState } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/languages/ru.js';
import { Editor } from '@tinymce/tinymce-react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';

export default function ContentEditorText({ block, setBlock, removeBlock }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    block.value = block.value || {
        ua: '',
        ru: '',
        en: ''
    };
    const editorConfig = {
        menubar: false,
        height: 200,
        language: 'uk',
        plugins: [
            'autoresize',
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect bold italic underline strikeThrough subscript superscript align'
    };

    return (
        <div className="contentEditor__block-text">
            <Editor
                initialValue={block.value[lang]}
                onEditorChange={handleChange}
                init={editorConfig}
                apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
            />
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
        const newValue = block.value;
        newValue[lang] = value;

        setBlock({
            ...block,
            value: newValue
        })
    }
}