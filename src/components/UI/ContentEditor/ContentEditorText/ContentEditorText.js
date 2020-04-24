import React, {useContext, useState, useEffect, useRef} from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/languages/ru.js';
import { Editor } from '@tinymce/tinymce-react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';

export default function ContentEditorText({ block, setBlock, removeBlock, noBtns, toolbar }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    const [ showEditor, setShowEditor ] = useState(false);
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

    useEffect(() => {
        document.addEventListener('click', handleShowEditor);

        return () => {
            document.removeEventListener('click', handleShowEditor);
        }
    }, []);

    return (
        <div className="contentEditor__block-text" ref={$wrapper}>
            {
                showEditor ?
                    <Editor
                        initialValue={block.value[lang] ? block.value[lang] : block.value['ua']}
                        onEditorChange={handleChange}
                        init={editorConfig}
                        apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
                    />
                    :
                    <div className="contentEditor__block-text-holder">
                        <div dangerouslySetInnerHTML={{__html: block.value[lang] ? block.value[lang] : block.value['ua']}}/>
                        {
                            block.value[lang] || block.value['ua'] ?
                                null
                                :
                                <div className="contentEditor__block-text-placeholder">
                                    { translate('enter_text') }
                                </div>
                        }
                    </div>
            }
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

    function handleShowEditor(e) {
        if ( e.target === $wrapper.current || $wrapper.current.contains(e.target) ) {
            setShowEditor(true);
        }
        else {
            setShowEditor(false);
        }
    }

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