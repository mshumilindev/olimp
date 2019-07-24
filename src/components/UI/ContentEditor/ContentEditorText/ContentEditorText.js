import React, { useContext } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/languages/ru.js';
import FroalaEditor from 'react-froala-wysiwyg';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function ContentEditorText({ block, setBlock }) {
    const { translate } = useContext(siteSettingsContext);
    const editorConfig = {
        placeholderText: translate('start_typing'),
        language: 'ru',
        toolbarButtons: ['undo', 'redo', '|', 'paragraphFormat', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'align']
    };

    return (
        <div className="contentEditor__block-text">
            <FroalaEditor config={editorConfig} model={block.value} onModelChange={handleChange} />
        </div>
    );

    function handleChange(value) {
        setBlock({
            ...block,
            value: value
        })
    }
}