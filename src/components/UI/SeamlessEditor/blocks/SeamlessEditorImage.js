import React, { useContext } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Form from '../../../../components/Form/Form';

export default function SeamlessEditorImage({ block, setBlock }) {
    const { translate, lang } = useContext(siteSettingsContext);
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
        <div className="seamlessEditor__editor-block-media">
            <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
        </div>
    );

    function handleChange(id, value) {
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