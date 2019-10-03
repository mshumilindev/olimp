import React, { useContext, useState } from 'react';
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";

function ArticleAnswer({block, setAnswer}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const correctAnswers = block.value.correctAnswers.split(', ');
    const newFields = [{
        id: block.id,
        options: [],
        variant: 'alt',
        name: translate('answers')
    }];
    const [ formFields, setFormFields ] = useState(JSON.stringify(null));

    if ( correctAnswers.length === 1 ) {
        block.value.answers.forEach((answer, index) => {
            newFields[0].type = 'radio';
            newFields[0].value = '';
            newFields[0].options.push({
                id: index,
                name: answer[lang] ? answer[lang] : answer['ua']
            });
        });
    }
    else {
        block.value.answers.forEach((answer, index) => {
            newFields[0].type = 'checkboxes';
            newFields[0].value = [];
            newFields[0].options.push({
                id: index,
                name: answer[lang] ? answer[lang] : answer['ua']
            });
        });
    }

    if ( !JSON.parse(formFields) ) {
        setFormFields(JSON.stringify(newFields));
    }

    return (
        <div className="article__answers">
            {
                JSON.parse(formFields) ?
                    <Form fields={JSON.parse(formFields)} setFieldValue={setFieldValue}/>
                    :
                    null
            }
            <div className="article__answers-confirm">
                <a href="/" className="btn btn_primary" disabled={!JSON.parse(formFields) || !JSON.parse(formFields)[0].value.toString()} onClick={e => confirmAnswer(e)}>{ translate('confirm') }</a>
            </div>
        </div>
    );

    function setFieldValue(fieldID, value) {
        const currentFields = JSON.parse(formFields);

        if ( correctAnswers.length === 1 ) {
            currentFields[0].value = value;
        }
        else {
            if ( currentFields[0].value.indexOf(value) !== -1 ) {
                currentFields[0].value.splice(currentFields[0].value.indexOf(value), 1);
            }
            else {
                currentFields[0].value.push(value);
            }
        }

        setFormFields(JSON.stringify(currentFields));
    }

    function confirmAnswer(e) {
        e.preventDefault();

        const fields = JSON.parse(formFields);
        let score = 0;

        if ( correctAnswers.length === 1 ) {
            const chosenValue = '' + (block.value.answers.indexOf(block.value.answers.find(item => item[lang] ? item[lang] === fields[0].value : item['ua'] === fields[0].value)) + 1);

            if ( correctAnswers.indexOf(chosenValue) !== -1 ) {
                score = block.value.score;
            }
        }
        else {
            const chosenValues = fields[0].value;

            if ( correctAnswers.sort().toString() === chosenValues.sort().toString() ) {
                score = block.value.score;
            }
        }

        if ( fields && fields[0].value.toString() ) {
            setAnswer(block.id, parseInt(score));
        }
    }
}

export default ArticleAnswer;