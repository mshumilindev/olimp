import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Form from '../../../../components/Form/Form';
import Confirm from "../../Confirm/Confirm";
import classNames from 'classnames';

export default function ContentEditorMedia({ block, setBlock, removeBlock }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    const [ showSettings, setShowSettings ] = useState(false);
    const [ mediaSize, setMediaSize ] = useState(block.value.size || '16x9');
    block.value = block.value || {};
    block.value.image = block.value.image || '';
    block.value.size = block.value.size || mediaSize;
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
            icon: 'fa fa-image'
        },
        {
            type: 'text',
            id: block.id + '_caption',
            value: block.value.caption[lang],
            placeholder: translate('caption')
        }
    ];

    return (
        <div className={'contentEditor__block-media size-' + mediaSize}>
            <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
            <div className="contentEditor__block-actions">
                {/*<span className="contentEditor__block-actions-sort">*/}
                {/*    <i className="content_title-icon fa fa-sort"/>*/}
                {/*</span>*/}
                <a href="/" onClick={e => onShowSettings(e)} className={classNames('contentEditor__block-actions-settings', {active: showSettings})}>
                    <i className="content_title-icon fa fa-cog"/>
                </a>
                <a href="/" onClick={e => onRemoveBlock(e)} className="contentEditor__block-actions-remove">
                    <i className="content_title-icon fa fa-trash-alt"/>
                </a>
            </div>
            {
                showSettings ?
                    <div className="contentEditor__block-settings-holder">
                        <div className="contentEditor__block-settings">
                            <h2 className="contentEditor__block-settings-title">{ translate('dimensions') }</h2>
                            <a href="/" className={classNames('contentEditor__block-settings-btn', {active: mediaSize === '16x9'})} onClick={(e) => onSetMediaSize(e, '16x9')}>16 x 9</a>
                            <a href="/" className={classNames('contentEditor__block-settings-btn', {active: mediaSize === '4x3'})} onClick={(e) => onSetMediaSize(e, '4x3')}>4 x 3</a>
                            <a href="/" className={classNames('contentEditor__block-settings-btn', {active: mediaSize === '1x1'})} onClick={(e) => onSetMediaSize(e, '1x1')}>1 x 1</a>
                        </div>
                    </div>
                    :
                    null
            }
            {
                showRemoveBlock ?
                    <Confirm message={translate('sure_to_remove_block')} confirmAction={() => removeBlock(block)} cancelAction={() => setShowRemoveBlock(false)} />
                    :
                    null
            }
        </div>
    );

    function onSetMediaSize(e, size) {
        e.preventDefault();

        setMediaSize(size);
        handleChange(block.id + '_image', null, size);
    }

    function onRemoveBlock(e) {
        e.preventDefault();

        setShowRemoveBlock(true);
    }

    function onShowSettings(e) {
        e.preventDefault();

        setShowSettings(!showSettings);
    }

    function handleChange(id, value, size) {
        let newValue = {
            value: block.value
        };

        if ( id.includes('image') ) {
            newValue.value.image = value || block.value.image;
            newValue.value.size = size || mediaSize;
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