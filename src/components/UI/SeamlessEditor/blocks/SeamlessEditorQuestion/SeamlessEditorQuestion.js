import React, { useContext } from 'react';
import siteSettingsContext from "../../../../../context/siteSettingsContext";
import SeamlessEditorQuestionItem from './SeamlessEditorQuestionItem';
import Form from '../../../../Form/Form';

export default function SeamlessEditorQuestion({ block, setBlock }) {
    const { translate, lang } = useContext(siteSettingsContext);

    block.value = block.value || {
        type: '',
        answers: [
            {
                ua: '',
                ru: '',
                en: ''
            }
        ],
        correctAnswers: ''
    };
    const QASettingsFields = [
        {
            type: 'select',
            id: 'type',
            value: block.value.type,
            placeholder: translate('choose_type'),
            options: [
                {
                    id: 'multiple_choice',
                    title: translate('multiple_choice')
                },
                {
                    id: 'text',
                    title: translate('text')
                },
                {
                    id: 'formula',
                    title: translate('formula')
                },
                {
                    id: 'image',
                    title: translate('image')
                }
            ]
        }
    ];
    const formFields = [
        {
            type: 'text',
            id: 'correctAnswers',
            value: block.value.correctAnswers,
            placeholder: translate('correct_answers')
        }
    ];

    return (
        <div className="seamlessEditor__editor-block-question">
            <div className="seamlessEditor__editor-block-question-settings">
                <Form fields={QASettingsFields} setFieldValue={(fieldID, value) => handleQASettings(fieldID, value)}/>
            </div>
            {
                block.value.type ?
                    _renderAnswer()
                    :
                    <>
                    <br/>
                        <div className="seamlessEditor__editor-block-placeholder">
                            { translate('choose_type') }
                        </div>
                    </>
            }
        </div>
    );

    function _renderAnswer() {
        if ( block.value.type === 'text' ) {
            return (
                <>
                    <br/>
                    <div className="seamlessEditor__editor-block-placeholder">
                        { translate('text_will_be_shown') }
                    </div>
                </>
            )
        }
        if ( block.value.type === 'formula' ) {
            return (
                <>
                    <br/>
                    <div className="seamlessEditor__editor-block-placeholder">
                        { translate('formula_will_be_shown') }
                    </div>
                </>
            )
        }
        if ( block.value.type === 'image' ) {
            return (
                <>
                    <br/>
                    <div className="seamlessEditor__editor-block-placeholder">
                        Учень зможе завантажити зображення
                    </div>
                </>
            )
        }
        if ( block.value.type === 'multiple_choice' ) {
            return (
                <>
                    <div className="seamlessEditor__editor-block-question-answers">
                    {
                        block.value.answers.map((item, index) => <SeamlessEditorQuestionItem item={item} key={index} index={index} handleChange={handleAnswersChange} removeAnswer={onRemoveAnswer} />)
                    }
                    <div className="seamlessEditor__editor-block-question-answer">
                        <a href="/" className="seamlessEditor__editor-block-question-add" onClick={e => onAddAnswer(e)}>
                            <i className="content_title-icon fa fa-plus-circle"/>
                            { translate('add_answer') }
                        </a>
                    </div>
                    </div>
                    <div className="seamlessEditor__editor-block-question-correctAnswers">
                        <Form fields={formFields} setFieldValue={(fieldID, value) => handleCorrectAnswers(fieldID, value)}/>
                    </div>
                </>
            )
        }
    }

    function handleQASettings(fieldID, value) {
        const newValue = block.value;

        newValue[fieldID] = value;

        setBlock({
            ...block,
            value: newValue
        });
    }

    function handleCorrectAnswers(id, value) {
        const newValue = block.value;

        newValue[id] = value;

        setBlock({
            ...block,
            value: newValue
        });
    }

    function handleAnswersChange(id, value) {
        const newValue = block.value;

        newValue.answers[id][lang] = value;

        setBlock({
            ...block,
            value: newValue
        });
    }

    function onAddAnswer(e) {
        e.preventDefault();

        const newValue = block.value;

        newValue.answers.push({
            ua: '',
            ru: '',
            en: ''
        });

        setBlock({
            ...block,
            value: newValue
        });
    }

    function onRemoveAnswer(e, index) {
        e.preventDefault();

        const newValue = block.value;

        newValue.answers.splice(index, 1);

        setBlock({
            ...block,
            value: newValue
        });
    }
}
