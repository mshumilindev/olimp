import React, { useContext } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Form from '../../../../components/Form/Form';

export default function ContentEditorGridItem({index, item}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const formFields = [
        {
            type: 'image',
            id: index + '_image',
            value: item.image,
            size: '100%',
            icon: 'fa fa-image'
        },
        {
            type: 'text',
            id: index + '_text',
            value: item.text[lang],
            placeholder: translate('start_typing')
        }
    ];

    return (
        <div className={'contentEditor__block-grid-item'}>
            <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
        </div>
    );

    function handleChange() {
        console.log('true');
    }
}