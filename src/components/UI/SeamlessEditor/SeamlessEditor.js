import React, {useContext, useEffect, useState} from 'react';
import './seamlessEditor.scss';
import Article from "../../Article/Article";
import siteSettingsContext from "../../../context/siteSettingsContext";
import SeamlessEditorEditor from "./SeamlessEditorEditor";
import { generate } from "generate-password";
import Preloader from "../preloader";

export default function SeamlessEditor({loading, title, type, content, updateContent, types}) {
    const { translate } = useContext(siteSettingsContext);
    const [ isEdited, setIsEdited ] = useState(false);

    useEffect(() => {
        if ( isEdited ) {
            document.querySelector('body').classList.add('overflow');
        }
        else {
            document.querySelector('body').classList.remove('overflow');
        }
    }, [isEdited]);

    return (
        <div className="seamlessEditor">
            {
                isEdited ?
                    <SeamlessEditorEditor
                        content={content}
                        title={title}
                        type={type}
                        addBlock={addBlock}
                        setBlock={setBlock}
                        removeBlock={removeBlock}
                        scrollToBlock={scrollToBlock}
                        moveBlock={moveBlock}
                        setIsEdited={setIsEdited}
                        types={types}
                    />
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
                <Article content={content} readonly />
                {
                    loading ?
                        <Preloader/>
                        :
                        null
                }
            </div>
        )
    }

    function _renderToolbar() {
        return (
            <div className="seamlessEditor__toolbar">
                <span className="seamlessEditor__toolbar-btn btn btn_primary round btn__xs" onClick={() => setIsEdited(!isEdited)}>
                    <i className="fa fa-pencil-alt" />
                </span>
                <span className="seamlessEditor__toolbar-btn btn btn__error round btn__xs" onClick={() => updateContent(type, [])}>
                    <i className="fas fa-eraser" />
                </span>
            </div>
        )
    }

    function setBlock(block) {
        let newContent = content;
        const index = newContent.indexOf(newContent.find(item => item.id === block.id));

        newContent[index] = block;

        newContent.forEach((item, itemIndex) => {
            item.order = itemIndex;
        });

        updateContent(type, newContent);
    }

    function addBlock(block, index) {
        let newContent = content;
        const id = generate({length: 20, numbers: true});

        newContent.splice(index, 0, {
            ...block,
            id: id
        });

        newContent.forEach((item, itemIndex) => {
            item.order = itemIndex;
        });

        updateContent(type, newContent);

        setTimeout(() => {
            scrollToBlock(id);
        }, 100);
    }

    function removeBlock(block) {
        let newContent = content;
        const index = newContent.indexOf(block);

        newContent.splice(index, 1);

        newContent.forEach((item, itemIndex) => {
            item.order = itemIndex;
        });

        updateContent(type, newContent);
    }

    function moveBlock(prevIndex, newIndex) {
        let newContent = content;

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
                item.order = itemIndex;
            });

            updateContent(type, newContent);
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