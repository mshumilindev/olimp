import React, { useRef, useState, useContext } from 'react';
import './form.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';
import CustomSelect from '../UI/CustomSelect/CustomSelect';
import { Preloader } from '../UI/preloader';

export default function Form({fields, heading, setFieldValue, formAction, formError, formReset, loading}) {
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
            {
                fields && fields.length ?
                    fields.map(field => _renderField(field))
                    :
                    null
            }
            {
                loading ?
                    <div className="form__loading">
                        <Preloader/>
                    </div>
                    :
                    null
            }
        </form>
    );

    function _renderField(field) {
        return (
            <div className="form__row" key={field.id}>
                { getFormFieldType(field) }
            </div>
        )
    }

    function getFormFieldType(field) {
        const name = translate(field.name);
        const placeholder = field.placeholder ? translate(field.placeholder) : name;

        switch ( field.type ) {
            case 'block':
                return (
                    <div className="form__block">
                        { field.children.map(childField => _renderField(childField)) }
                    </div>
                );

            case 'actions':
                return (
                    <div className="form__actions">
                        { field.children.map(childField => _renderField(childField)) }
                    </div>
                );

            case 'text':
            case 'password':
            case 'email':
            case 'tel':
            case 'name':
            case 'search':
            case 'url':
                return (
                    <div className="form__field-holder">
                        <input className={classNames('form__field', {required: field.required, hasErrors: field.required && hasErrors && !field.value, hasBtn: field.btn, isUpdated: field.updated})} onChange={(e) => handleFieldChange(field.id, e.target.value)} type={field.type} title={name} value={field.value} autoComplete="new-password" />
                        <span className={classNames('form__field-placeholder', { isFilled: field.value })}>{ placeholder }</span>
                        {
                            field.btn ?
                                <span className="form__field-btn" onClick={() => field.btn.action(field.id)} title={field.btn.title}>
                                    <i className={field.btn.icon} />
                                </span>
                                :
                                null
                        }
                    </div>
                );

            case 'select':
                return (
                    <div className="form__field-holder">
                        <div className={classNames('form__select-holder', {hasErrors: field.required && hasErrors && !field.value})}>
                            <CustomSelect options={field.options} id={field.id} updated={field.updated} name={translate(field.name)} value={translate(field.value)} selectChanged={setFieldValue} placeholder={translate(field.placeholder)}/>
                        </div>
                    </div>
                );

            case 'submit':
                return (
                    <div className="form__btn-holder">
                        <button type="submit" className="form__btn btn btn_primary" title={name}>{ name }</button>
                    </div>
                );

            case 'reset':
                return (
                    <div className="form__btn-holder">
                        <button type="reset" className="form__btn btn btn__error" title={name} onClick={formReset}>{ name }</button>
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