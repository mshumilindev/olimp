import React, { useRef, useState, useContext } from 'react';
import './form.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';
import CustomSelect from '../UI/CustomSelect/CustomSelect';
import { Preloader } from '../UI/preloader';
import TextTooltip from '../UI/TextTooltip/TextTooltip';
import Tabs from '../UI/Tabs/Tabs';
import Resizer from 'react-image-file-resizer';
import UserPicker from "../UI/UserPicker/UserPicker";
import LibraryPicker from "../UI/LibraryPicker/LibraryPicker";

export default function Form({fields, heading, setFieldValue, formAction, formError, formReset, loading, formUpdated}) {
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
            case 'tabs':
                return (
                    <Tabs tabs={
                        field.tabs.map(tab => {
                            return {
                                heading: translate(tab.heading),
                                content: tab.content.map(item => _renderField(item))
                            }
                        })
                    }/>
                );

            case 'block':
                return (
                    <div className="form__block">
                        {
                            field.heading ?
                                <div className="form__block-heading">{ translate(field.heading) }</div>
                                :
                                null
                        }
                        {
                            field.btnRemove ?
                                <span className="form__block-btnRemove" onClick={field.btnRemove}>
                                    <i className="fa fa-trash-alt"/>
                                </span>
                                :
                                null
                        }
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
            case 'number':
            case 'url':
                return (
                    <div className="form__field-holder">
                        <input className={classNames('form__field', {required: field.required, hasErrors: (field.required && hasErrors && !field.value) || field.errorMessage, hasBtn: field.btn, isUpdated: field.updated, readonly: field.readonly})} onChange={(e) => handleFieldChange(field.id, e.target.value)} type={field.type} title={name} value={field.value} autoComplete="new-password" readOnly={field.readonly} />
                        {
                            field.icon ?
                                <i className={classNames('form__field-icon ' + field.icon, { isFilled: field.value })} />
                                :
                                field.placeholder ?
                                    <span className={classNames('form__field-placeholder', { isFilled: field.value })}>{ placeholder }</span>
                                    :
                                    null
                        }
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

            case 'userPicker':
                return (
                    <div className="form__field-holder">
                        <UserPicker type={field.id} noSearch selectedList={field.value ? [field.value] : []} addUsers={(type, list) => handleFieldChange(field.id, list[0])} placeholder={field.placeholder} />
                    </div>
                );

            case 'libraryPicker':
                return (
                    <div className="form__field-holder">
                        <LibraryPicker selectedList={field.value ? [field.value] : []} placeholder={field.placeholder} addBooks={(type, list) => handleFieldChange(field.id, list[0])} />
                    </div>
                );

            case 'textarea':
                return (
                    <div className="form__field-holder">
                        <textarea className={classNames('form__field form__textarea', {required: field.required, hasErrors: (field.required && hasErrors && !field.value) || field.errorMessage, hasBtn: field.btn, isUpdated: field.updated, readonly: field.readonly})} onChange={(e) => handleFieldChange(field.id, e.target.value)} title={name} autoComplete="new-password" readOnly={field.readonly} value={field.value}/>
                        {
                            field.icon ?
                                <i className={classNames('form__field-icon ' + field.icon, { isFilled: field.value })} />
                                :
                                field.placeholder ?
                                    <span className={classNames('form__field-placeholder', { isFilled: field.value })}>{ placeholder }</span>
                                    :
                                    null
                        }
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

            case 'itemList':
                return (
                    <div className="form__field-holder form__itemList-holder">
                        <input className={classNames('form__field', {required: field.required, hasErrors: (field.required && hasErrors && !field.value) || field.errorMessage, hasBtn: field.btn, isUpdated: field.updated})} onChange={(e) => itemListChange(field.id, e.target.value)} type="text" title={name} value={field.value.join(' ')} />
                        {
                            field.placeholder ?
                                <span className={classNames('form__field-placeholder', { isFilled: field.value.length })}>{ placeholder }</span>
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
                                    <input className={classNames('form__field readonly', {required: field.required, hasErrors: field.required && hasErrors && !field.value, hasBtn: field.btn, isUpdated: field.updated})} onChange={(e) => handleFieldChange(field.id, e.target.value)} type={field.type} title={name} value={translate(field.value)} autoComplete="new-password" readOnly />
                                    {
                                        field.placeholder ?
                                            <span className={classNames('form__field-placeholder', { isFilled: field.value })}>{ placeholder }</span>
                                            :
                                            null
                                    }
                                </div>
                                :
                                <div className={classNames('form__select-holder', {hasErrors: field.required && hasErrors && !field.value})}>
                                    <CustomSelect options={field.options} hasReset={field.hasReset} id={field.id} updated={field.updated} name={translate(field.name)} value={translate(field.value)} selectChanged={setFieldValue} placeholder={translate(field.placeholder)} required={field.required} hasErrors={field.hasErrors}/>
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
                let imageClasses = 'form__file-trigger';

                if ( field.shape ) {
                    imageClasses += (' ' + field.shape);
                }
                if ( field.backSize ) {
                    imageClasses += (' ' + field.backSize);
                }
                if ( field.ext ) {
                    imageClasses += (' ' + field.ext);
                }

                return (
                    <div className={classNames('form__file-holder', {isUpdated: field.updated})} style={{width: field.size, maxWidth: field.maxSize ? field.maxSize : '100%'}}>
                        <TextTooltip text={translate(field.label)} position="left">
                            <span className={imageClasses}>
                                <i className={field.icon ? field.icon + ' form__file-icon' : 'form__file-icon'} />
                                {
                                    field.value ?
                                        <span className="form__file-image" style={{backgroundImage: 'url(' + field.value + ')'}} />
                                        :
                                        null
                                }
                            </span>
                            <input type="file" ref={$file} className="form__file" accept="image/gif, image/jpeg, image/png" onChange={() => getImageValue(field.id, $file.current, field.saveSize, field.ext)} id={'file-' + field.id}/>
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

            case 'button':
                return (
                    <div className="form__btn-holder">
                        <span className="form__btn btn btn_primary" title={name} onClick={field.action}>
                            {
                                field.icon ?
                                    <i className={'content_title-icon ' + field.icon}/>
                                    :
                                    null
                            }
                            { name }
                        </span>
                    </div>
                );

            case 'submit':
                return (
                    <div className="form__btn-holder">
                        <button type="submit" className="form__btn btn btn_primary" title={name} disabled={typeof formUpdated !== 'undefined' ? !formUpdated : false}>{ name }</button>
                    </div>
                );

            case 'reset':
                return (
                    <div className="form__btn-holder">
                        <button type="reset" className="form__btn btn btn__error" title={name} onClick={formReset} disabled={typeof formUpdated !== 'undefined' ? !formUpdated : false}>{ name }</button>
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

    function getImageValue(fieldID, $input, fieldSize, fieldExt) {
        const file = $input.files[0];
        const maxWidthHeight = 1000;

        if ( file ) {
            if ( fieldSize ) {
                Resizer.imageFileResizer(
                    file,
                    fieldSize,
                    fieldSize,
                    fieldExt ? fieldExt : 'JPEG',
                    100,
                    0,
                    uri => {
                        handleFieldChange(fieldID, uri);
                    },
                    'base64'
                )
            }
            else {
                const maxSize = 1000;
                if ( file.size / 1024 > maxSize ) {
                    Resizer.imageFileResizer(
                        file,
                        maxWidthHeight,
                        maxWidthHeight,
                        fieldExt ? fieldExt : 'JPEG',
                        80,
                        0,
                        uri => {
                            handleFieldChange(fieldID, uri);
                        },
                        'base64'
                    )
                }
                else {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    return new Promise(() => {
                        reader.onload = () => {
                            handleFieldChange(fieldID, reader.result);
                        };
                    });
                }
            }
        }
    }

    function itemListChange(fieldID, value) {
        const newValue = [];
        let intValue = value;

        // === Checking for an empty tag
        intValue = intValue.split('').reverse().join('');
        if ( intValue.indexOf('#') === 0 ) {
            intValue = intValue.substr(2, intValue.length);
        }
        intValue = intValue.split('').reverse().join('');

        // === Modifying tags
        intValue = intValue.split('#').join('');


        intValue = intValue.split(' ');

        if ( Array.isArray(intValue) ) {
            intValue.forEach(item => {
                newValue.push('#' + item);
            });
        }
        else {
            newValue.push('#' + intValue);
        }

        handleFieldChange(fieldID, newValue);
    }
}