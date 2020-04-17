import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from '../../Confirm/Confirm';
import ContentEditorQuestionItem from './ContentEditorQuestionItem';
import Form from '../../../../components/Form/Form';

export default function ContentEditorQuestion({ block, setBlock, removeBlock }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);

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
        <div className="contentEditor__block-question">
            <div className="contentEditor__block-question-settings">
                <Form fields={QASettingsFields} setFieldValue={(fieldID, value) => handleQASettings(fieldID, value)}/>
            </div>
            {
                block.value.type ?
                    _renderAnswer()
                    :
                    <div className="contentEditor__block-question-message">
                        { translate('choose_type') }
                    </div>
            }
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

    function _renderAnswer() {
        if ( block.value.type === 'text' ) {
            return (
                <div className="contentEditor__block-question-message isProminent">
                    { translate('text_will_be_shown') }
                </div>
            )
        }
        if ( block.value.type === 'formula' ) {
            return (
                <div className="contentEditor__block-question-message isProminent">
                    { translate('formula_will_be_shown') }
                </div>
            )
        }
        if ( block.value.type === 'multiple_choice' ) {
            return (
                <>
                    <div className="contentEditor__block-question-answers">
                    {
                        block.value.answers.map((item, index) => <ContentEditorQuestionItem item={item} key={index} index={index} handleChange={handleAnswersChange} removeAnswer={onRemoveAnswer} />)
                    }
                    <div className="contentEditor__block-question-answer">
                        <a href="/" className="contentEditor__block-question-add" onClick={e => onAddAnswer(e)}>
                            <i className="content_title-icon fa fa-plus-circle"/>
                            { translate('add_answer') }
                        </a>
                    </div>
                    </div>
                    <div className="contentEditor__block-question-correctAnswers">
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

    function onRemoveBlock(e) {
        e.preventDefault();

        setShowRemoveBlock(true);
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