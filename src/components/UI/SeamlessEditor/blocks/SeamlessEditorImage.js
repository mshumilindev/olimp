import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Form from '../../../../components/Form/Form';
import Confirm from "../../Confirm/Confirm";
import classNames from 'classnames';

export default function SeamlessEditorImage({ block, setBlock, removeBlock }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    block.value = block.value || {};
    block.value.image = block.value.image || '';
    block.value.caption = block.value.caption || {
        ua: '',
        ru: '',
        en: ''
    };
    const formFields = [
        {
            type: 'image',
            id: block.id + '_image',
            value: block.value.image,
            size: '100%',
            icon: 'fa fa-image',
            customSize: true
        },
        {
            type: 'text',
            id: block.id + '_caption',
            value: block.value.caption[lang],
            placeholder: translate('caption')
        }
    ];

    return (
        <div className="seamlessEditor__editor-block-inner seamlessEditor__editor-block-media">
            <div className="seamlessEditor__editor-block-actions">
                <a href="/" onClick={e => onRemoveBlock(e)} className="seamlessEditor__editor-block-actions-remove">
                    <i className="content_title-icon fa fa-trash-alt"/>
                </a>
            </div>
            <div className="seamlessEditor__editor-block-content">
                <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
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

    function handleChange(id, value, size) {
        let newValue = {
            value: block.value
        };

        if ( id.includes('image') ) {
            newValue.value.image = value || block.value.image;
        }
        else {
            newValue.value.caption[lang] = value;
        }

        setBlock({
            ...block,
            ...newValue
        })
    }
}