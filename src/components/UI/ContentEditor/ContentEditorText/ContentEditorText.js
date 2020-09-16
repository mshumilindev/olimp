import React, {useContext, useState, useEffect, useRef} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';

export default function ContentEditorText({ block, setBlock, removeBlock, noBtns, toolbar }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    const $wrapper = useRef(null);
    const editorToolbar = toolbar || ['fullscreen undo redo | formatselect | forecolor | fontselect | fontsizeselect | numlist bullist | align | bold italic underline strikeThrough subscript superscript | image'];

    const editorConfig = {
        menubar: false,
        language: 'uk',
        max_height: 550,
        plugins: [
            'autoresize fullscreen',
            'advlist lists image charmap anchor',
            'visualblocks',
            'paste'
        ],
        paste_word_valid_elements: "b,strong,i,em,h1,h2,u,p,ol,ul,li,a[href],span,color,font-size,font-color,font-family,mark,table,tr,td",
        paste_retain_style_properties: "all",
        fontsize_formats: "8 9 10 11 12 14 16 18 20 22 24 26 28 36 48 72",
        toolbar: editorToolbar,
        placeholder: translate('enter_text')
    };

    block.value = block.value || {
        ua: '',
        ru: '',
        en: ''
    };

    return (
        <div className="contentEditor__block-text" ref={$wrapper}>
            <Editor
                initialValue={block.value[lang] ? block.value[lang] : block.value['ua']}
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