import React, {useContext, useState} from 'react';
import './seamlessEditor.scss';
import Article from "../../Article/Article";
import TextTooltip from "../TextTooltip/TextTooltip";
import siteSettingsContext from "../../../context/siteSettingsContext";
import SeamlessEditorEditor from "./SeamlessEditorEditor";

export default function SeamlessEditor({title, type, content}) {
    const { translate } = useContext(siteSettingsContext);
    const [ isEdited, setIsEdited ] = useState(true);

    return (
        <div className="seamlessEditor">
            {
                isEdited ?
                    <SeamlessEditorEditor content={content} title={title} type={type} />
                    :
                    !content.length ?
                        _renderNoContent()
                        :
                        _renderContent()
            }
        </div>
    );

    function _renderNoContent() {
        return (
            <div className="seamlessEditor__noContent">
                <span className="seamlessEditor__noContent-btn btn btn_primary" onClick={() => setIsEdited(!isEdited)}>
                    <i className="content_title-icon fa fa-plus"/>
                    { translate('start_adding_content') }
                </span>
            </div>
        )
    }

    function _renderContent() {
        return (
            <div className="seamlessEditor__content">
                {
                    _renderToolbar()
                }
                <Article content={content} />
            </div>
        )
    }

    function _renderToolbar() {
        return (
            <div className="seamlessEditor__toolbar">
                <TextTooltip position="top" text={translate('edit')} children={
                    <span className="seamlessEditor__toolbar-btn btn btn_primary round btn__xs" onClick={() => setIsEdited(!isEdited)}>
                    <i className="fa fa-pencil-alt" />
                </span>
                }/>
                <TextTooltip position="top" text={translate('clear')} children={
                    <span className="seamlessEditor__toolbar-btn btn btn__error round btn__xs">
                        <i className="fas fa-eraser" />
                    </span>
                }/>
            </div>
        )
    }
}