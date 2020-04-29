import React, {useContext} from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function SeamlessEditorEditor({title, type, content}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="seamlessEditor__editor">
            { _renderBlocks() }
            { _renderActions() }
            { _renderTitle() }
            { _renderTypes() }
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
            <div className="seamlessEditor__editor-types">
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="fas fa-font" />
                        { translate('text') }
                    </div>
                </div>
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="far fa-images" />
                        { translate('media') }
                    </div>
                </div>
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="fas fa-file" />
                        { translate('document') }
                    </div>
                </div>
                <div className="seamlessEditor__editor-types-item">
                    <div className="seamlessEditor__editor-btn">
                        <i className="fas fa-infinity" />
                        { translate('other') }
                    </div>
                </div>
            </div>
        )
    }

    function _renderTitle() {
        return (
            <div className="seamlessEditor__editor-title">
                <i className="content_title-icon fa fa-paragraph"/>
                { `${title} / ${translate(type)}` }
            </div>
        )
    }

    function _renderBlocks() {
        return (
            <div className="seamlessEditor__editor-blocks-holder">
                <div className="seamlessEditor__editor-blocks">
                    This is blocks
                </div>
            </div>
        )
    }
}