import React, { useRef, useState, useContext } from 'react';
import './form.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';
import CustomSelect from '../UI/CustomSelect/CustomSelect';
import { Preloader } from '../UI/preloader';
import TextTooltip from '../UI/TextTooltip/TextTooltip';

export default function Form({fields, heading, setFieldValue, formAction, formError, formReset, loading}) {
    const $form = useRef(null);
    const [ hasErrors, setHasErrors ] = useState(false);
    const { translate } = useContext(SiteSettingsContext);

    return (
        <form className={classNames('form', {hasErrors: hasErrors || formError})} ref={$form} onSubmit={e => submitForm(e)}>
            {
                heading ?
                    <h2 className="form__heading">{ heading }</h2>
                    :
                    null
            }
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

            case 'cols':
                return (
                    field.children.map(childField => <div className="form__col" key={field.id + childField.id}>{ _renderField(childField) }</div>)
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
                        <input className={classNames('form__field', {required: field.required, hasErrors: (field.required && hasErrors && !field.value) || field.errorMessage, hasBtn: field.btn, isUpdated: field.updated})} onChange={(e) => handleFieldChange(field.id, e.target.value)} type={field.type} title={name} value={field.value} autoComplete="new-password" />
                        <span className={classNames('form__field-placeholder', { isFilled: field.value })}>{ placeholder }</span>
                        {
                            field.btn ?
                                <span className="form__field-btn" onClick={() => field.btn.action(field.id)} title={field.btn.title}>
                                    <i className={field.btn.icon} />
                                </span>
                                :
                                null
                        }
                        {
                            field.errorMessage ?
                                <div className="form__field-error">
                                    { field.errorMessage }
                                </div>
                                :
                                null
                        }
                    </div>
                );

            case 'select':
                return (
                    <div className="form__field-holder">
                        {
                            field.readonly ?
                                <div className="form__field-holder">
                                    <input className={classNames('form__field readonly', {required: field.required, hasErrors: field.required && hasErrors && !field.value, hasBtn: field.btn, isUpdated: field.updated})} onChange={(e) => handleFieldChange(field.id, e.target.value)} type={field.type} title={name} value={field.value} autoComplete="new-password" readOnly />
                                    <span className={classNames('form__field-placeholder', { isFilled: field.value })}>{ placeholder }</span>
                                </div>
                                :
                                <div className={classNames('form__select-holder', {hasErrors: field.required && hasErrors && !field.value})}>
                                    <CustomSelect options={field.options} hasReset={field.hasReset} id={field.id} updated={field.updated} name={translate(field.name)} value={translate(field.value)} selectChanged={setFieldValue} placeholder={translate(field.placeholder)}/>
                                </div>
                        }
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="form__field-holder">
                        {
                            field.readonly ?
                                <span className={classNames('form__checkbox', {checked: field.value === field.checked})}/>
                                :
                                <input className={classNames('form__field form__checkbox', {required: field.required, hasErrors: field.required && hasErrors && !field.value, hasBtn: field.btn, isUpdated: field.updated})} onChange={() => handleFieldChange(field.id, field.value === field.checked ? field.unchecked : field.checked)} type="checkbox" title={name} id={field.id} checked={field.value === field.checked} />
                        }
                        <label htmlFor={field.id} className={field.readonly ? 'isReadonly' : ''}>
                            <span className="check-text">{ translate(field.label) }:</span>
                            <span className="check"/>
                            <span className="check-descr">{ translate(field.value) }</span>
                        </label>
                    </div>
                );

            case 'radio':
                return (
                    <div className={classNames('form__field-holder form__radio-holder', { hasIcons: field.options[0].icon })}>
                        <div className="form__radio-heading">
                            { translate(field.name) }:
                        </div>
                        {
                            field.options.map(opt => {
                                return (
                                    <div className="form__radio-item" key={opt.name}>
                                        <input type="radio" className="form__radio" id={field.name + '-' + opt.name} name={field.name} checked={field.value === opt.name} onChange={() => handleFieldChange(field.id, opt.name)}/>
                                        {
                                            opt.icon ?
                                                <label htmlFor={field.name + '-' + opt.name}>
                                                    <TextTooltip text={translate(opt.name)}>
                                                        <i className={opt.icon} />
                                                    </TextTooltip>
                                                </label>
                                                :
                                                <label htmlFor={field.name + '-' + opt.name}>{ translate(opt.name) }</label>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                );

            case 'image':
                const $file = React.createRef(null);

                return (
                    <div className="form__file-holder" style={{width: field.size}}>
                        <TextTooltip text={translate(field.label)} position="left">
                            <span className={field.shape ? field.shape + ' form__file-trigger' : 'form__file-trigger'}>
                                <i className={field.icon ? field.icon + ' form__file-icon' : 'form__file-icon'} />
                                <span className="form__file-image" style={{backgroundImage: 'url(' + field.value + ')'}} />
                            </span>
                            <input type="file" ref={$file} className="form__file" accept="image/gif, image/jpeg, image/png" onChange={() => getImageValue(field.id, $file.current)} id={'file-' + field.id}/>
                        </TextTooltip>
                        {
                            field.remove && field.value ?
                                <span className="form__file-remove-holder">
                                    <TextTooltip text={translate('delete')} position="right">
                                        <span className="form__file-remove" onClick={() => handleFieldChange(field.id, '')}>
                                            <i className="fas fa-trash-alt" />
                                        </span>
                                    </TextTooltip>
                                </span>
                                :
                                null
                        }
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

    function handleFieldChange(fieldID, value, placeholder) {
        setFieldValue(fieldID, value, placeholder);
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

        if ( formAction ) {
            if ( !validateForm() ) {
                setHasErrors(true);
            }
            else {
                setHasErrors(false);
                formAction();
            }
        }
    }

    function validateForm() {
        const $requiredFields = $form.current.querySelectorAll('.required');

        return ![...$requiredFields].some(field => !field.value.trim() || field.classList.contains('hasErrors'));
    }

    function getImageValue(fieldID, $input) {
        const reader = new FileReader();
        const file = $input.files[0];

        reader.readAsDataURL(file);

        return new Promise(() => {
            reader.onload = () => {
                handleFieldChange(fieldID, reader.result);
            };
        });

    }
}