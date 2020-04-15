import React, {useContext, useState} from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/languages/ru.js';
import { Editor } from '@tinymce/tinymce-react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';

export default function ContentEditorFormula({ block, setBlock, removeBlock, noBtns }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    const editorToolbar = ['tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry'];

    const editorConfig = {
        menubar: false,
        language: 'uk',
        max_height: 550,
        external_plugins: {
            'tiny_mce_wiris' : 'https://cdn.jsdelivr.net/npm/@wiris/mathtype-tinymce4@7.17.0/plugin.min.js'
        },
        plugins: [
            'autoresize'
        ],
        toolbar: editorToolbar,
    };

    block.value = block.value || {
        ua: '',
        ru: '',
        en: ''
    };

    return (
        <div className="contentEditor__block-text">
            <Editor
                initialValue={block.value[lang]}
                onEditorChange={handleChange}
                init={editorConfig}
                apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
            />
            {
                !noBtns ?
                    <>
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
                    </>
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