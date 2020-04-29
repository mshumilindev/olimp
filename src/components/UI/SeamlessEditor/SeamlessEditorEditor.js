import React, {useContext, useState} from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import classNames from 'classnames';

export default function SeamlessEditorEditor({title, type, content}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showType, setShowType ] = useState(null);
    const types = [
        {
            icon: 'fas fa-font',
            type: 'text',
        },
        {
            icon: 'fas fa-images',
            type: 'media',
        },
        {
            icon: 'fas fa-file',
            type: 'document',
        },
        {
            icon: 'fas fa-infinity',
            type: 'other',
        }
    ];

    return (
        <div className="seamlessEditor__editor">
            <div className="seamlessEditor__editor-header">
                { _renderTitle() }
                { _renderActions() }
            </div>
            <div className="seamlessEditor__editor-body">
                { _renderTypes() }
                { _renderBlocks() }
            </div>
        </div>
    );

    function _renderActions() {
        return (
            <div className="seamlessEditor__editor-actions">
                <div className="seamlessEditor__editor-actions-item">
                    <div className="seamlessEditor__editor-btn btn-success">
                        <i className="fas fa-save" />
                        { translate('save') }
                    </div>
                </div>
                <div className="seamlessEditor__editor-actions-item">
                    <div className="seamlessEditor__editor-btn btn-error">
                        <i className="fas fa-times" />
                        { translate('cancel') }
                    </div>
                </div>
            </div>
        )
    }

    function _renderTypes() {
        return (
            <>
                <div className="seamlessEditor__editor-types">
                    { types.map(item => _renderType(item)) }
                </div>
                {
                    showType === 'text' ?
                        _renderTypeText()
                        :
                        null
                }
                {
                    showType === 'media' ?
                        _renderTypeMedia()
                        :
                        null
                }
                {
                    showType === 'document' ?
                        _renderTypeDocument()
                        :
                        null
                }
                {
                    showType === 'other' ?
                        _renderTypeOther()
                        :
                        null
                }
            </>
        )
    }

    function _renderType(item) {
        return (
            <div className="seamlessEditor__editor-types-item">
                <div className={classNames('seamlessEditor__editor-btn', {active: showType === item.type})} onClick={() => setShowType(showType === item.type ? null : item.type)}>
                    <i className={item.icon} />
                    { translate(item.type) }
                </div>
            </div>
        )
    }

    function _renderTypeText() {
        return (
            <div className="seamlessEditor__editor-type">
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="fas fa-font" />
                        { translate('text') }
                    </div>
                </div>
            </div>
        )
    }

    function _renderTypeMedia() {
        return (
            <div className="seamlessEditor__editor-type">
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="fas fa-font" />
                        { translate('text') }
                    </div>
                </div>
            </div>
        )
    }

    function _renderTypeDocument() {
        return (
            <div className="seamlessEditor__editor-type">
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="fas fa-font" />
                        { translate('text') }
                    </div>
                </div>
            </div>
        )
    }

    function _renderTypeOther() {
        return (
            <div className="seamlessEditor__editor-type">
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="fas fa-font" />
                        { translate('text') }
                    </div>
                </div>
            </div>
        )
    }

    function _renderTitle() {
        return (
            <div className="seamlessEditor__editor-title">
                <i className="content_title-icon fa fa-paragraph"/>
                <div className="seamlessEditor__editor-title-inner">
                    { title }
                    <span>{ translate(type) }</span>
                </div>
            </div>
        )
    }

    function _renderBlocks() {
        return (
            <div className="seamlessEditor__editor-blocks-holder">
                <div className="seamlessEditor__editor-blocks">
                    {
                        !content.length ?
                            _renderNewBlock()
                            :
                            content.map(item => _renderBlock(item))
                    }
                </div>
            </div>
        )
    }

    function _renderNewBlock() {
        return (
            <div className="seamlessEditor__editor-block isNew">
                <div className="seamlessEditor__editor-block-inner">
                    { translate('seamlessEditor_drag_block_here') }
                </div>
            </div>
        )
    }

    function _renderBlock() {
        return (
            <div className="seamlessEditor__editor-block">
                <div className="seamlessEditor__editor-block-inner">
                    This is old block
                </div>
            </div>
        )
    }
}