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
                    <SeamlessEditorEditor
                        content={currentContent}
                        title={title}
                        type={type}
                        addBlock={addBlock}
                        setBlock={setBlock}
                        removeBlock={removeBlock}
                        scrollToBlock={scrollToBlock}
                        moveBlock={moveBlock}
                    />
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

    function setBlock(block) {
        let newContent = currentContent;
        const index = newContent.indexOf(block);

        newContent[index] = block;

        newContent.forEach((item, itemIndex) => {
            item.index = itemIndex;
        });

        setCurrentContent(Object.assign([], newContent));
    }

    function addBlock(block, index) {
        let newContent = currentContent;
        const id = generate({length: 20, numbers: true});

        newContent.splice(index, 0, {
            ...block,
            id: id
        });

        newContent.forEach((item, itemIndex) => {
            item.index = itemIndex;
        });

        setCurrentContent(Object.assign([], newContent));

        setTimeout(() => {
            scrollToBlock(id);
        }, 100);
    }

    function removeBlock(block) {
        let newContent = currentContent;
        const index = newContent.indexOf(block);

        newContent.splice(index, 1);

        newContent.forEach((item, itemIndex) => {
            item.index = itemIndex;
        });

        setCurrentContent(Object.assign([], newContent));
    }

    function moveBlock(prevIndex, newIndex) {
        let newContent = Object.assign([], currentContent);

        const block = newContent[prevIndex];

        if ( newIndex !== prevIndex ) {
            if ( newIndex > prevIndex ) {
                newContent.splice(newIndex, 0, block);
                newContent.splice(prevIndex, 1);
            }
            else {
                newContent.splice(prevIndex, 1);
                newContent.splice(newIndex, 0, block);
            }

            newContent.forEach((item, itemIndex) => {
                item.index = itemIndex;
            });

            setCurrentContent(newContent);
        }
    }

    function scrollToBlock(blockID) {
        const block = document.querySelector('#block' + blockID);
        const scrollTop = block.offsetTop - 40;
        const container = document.querySelector('.seamlessEditor__editor-blocks-holder .scrollbar__content');

        container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }
}