import React, {useContext, useState} from 'react';
import './seamlessEditor.scss';
import Article from "../../Article/Article";
import TextTooltip from "../TextTooltip/TextTooltip";
import siteSettingsContext from "../../../context/siteSettingsContext";
import SeamlessEditorEditor from "./SeamlessEditorEditor";
import { generate } from "generate-password";
import {orderBy} from "natural-orderby";

export default function SeamlessEditor({title, type, content}) {
    const { translate } = useContext(siteSettingsContext);
    const [ isEdited, setIsEdited ] = useState(true);
    const [ currentContent, setCurrentContent ] = useState(Object.assign([], orderBy(content, v => v.order)));

    return (
        <div className="seamlessEditor">
            {
                isEdited ?
                    <SeamlessEditorEditor content={currentContent} title={title} type={type} addBlock={addBlock} />
                    :
                    !currentContent.length ?
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
                <Article content={currentContent} />
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

    function addBlock(block, index) {
        const newContent = [
            ...currentContent.slice(0, index),
            block,
            ...currentContent.slice(index)
        ];

        setCurrentContent(newContent.map((item, index) => {
            return {
                ...item,
                index: index,
                id: generate({length: 20, numbers: true})
            }
        }));
    }
}