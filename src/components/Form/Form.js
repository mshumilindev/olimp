import React, { useRef, useState, useContext } from 'react';
import './form.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';

export default function Form({fields, heading, setFieldValue, formAction, formError}) {
    const $form = useRef(null);
    const [ hasErrors, setHasErrors ] = useState(false);
    const { translate } = useContext(SiteSettingsContext);

    return (
        <form className={classNames('form', {hasErrors: hasErrors || formError})} ref={$form} onSubmit={e => submitForm(e)}>
            <h2 className="form__heading">{ heading }</h2>
            {
                hasErrors ?
                    <div className="form__error">
                        { translate('fill_required') }
                    </div>
                    :
                    null
            }
            {
                formError ?
                    <div className="form__error">
                        { translate(formError) }
                    </div>
                    :
                    null
            }
            { fields.map(field => _renderField(field)) }
        </form>
    );

    function _renderField(field) {
        return (
            <div className="form__row" key={field.name}>
                { getFormFieldType(field) }
            </div>
        )
    }

    function getFormFieldType(field) {
        const name = translate(field.name);

        switch ( field.type ) {
            case 'text':
            case 'password':
            case 'email':
            case 'tel':
            case 'name':
            case 'search':
            case 'url':
                return <input className={classNames('form__field', {required: field.required, hasErrors: field.required && hasErrors && !field.value})} onChange={(e) => handleFieldChange(field.id, e.target.value)} type={field.type} placeholder={name} title={name} value={field.value} autoComplete="new-password" />;
            case 'submit':
                return (
                    <div className="form__btn-holder">
                        <button className="form__btn btn btn_primary" title={name}>{ name }</button>
                    </div>
                );
            default:
                throw new Error('Field type not found');
        }
    }

    function handleFieldChange(fieldID, value) {
        setFieldValue(fieldID, value);
        if ( hasErrors ) {
            if ( !validateForm() ) {
                setHasErrors(true);
            }
            else {
                setHasErrors(false);
            }
        }
    }

    function submitForm(e) {
        e.preventDefault();

        if ( !validateForm() ) {
            setHasErrors(true);
        }
        else {
            setHasErrors(false);
            formAction();
        }
    }

    function validateForm() {
        const $requiredFields = $form.current.querySelectorAll('.required');

        return ![...$requiredFields].some(field => !field.value.trim());
    }
}