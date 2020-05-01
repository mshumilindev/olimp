import React, { useContext } from 'react';
import Form from '../../../../Form/Form';
import siteSettingsContext from "../../../../../context/siteSettingsContext";

export default function SeamlessEditorQuestionItem({item, index, handleChange, removeAnswer}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const formFields = [
        {
            type: 'text',
            id: index,
            value: item[lang],
            placeholder: translate('answer')
        }
    ];

    return (
        <div className="seamlessEditor__editor-block-question-answer">
            <a href="/" className="seamlessEditor__editor-block-question-answer-remove" tabIndex="-1" onClick={e => removeAnswer(e, index)}>
                <i className="content_title-icon fa fa-minus-circle"/>
            </a>
            <div className="seamlessEditor__editor-block-question-answer-num">{ index + 1 })</div>
            <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
        </div>
    );
}