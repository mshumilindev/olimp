import React, {useContext, useState} from 'react';
import Article from "../../Article/Article";
import {Scrollbars} from "react-custom-scrollbars";
import siteSettingsContext from "../../../context/siteSettingsContext";
import classNames from "classnames";
import * as typeBlocksJSON from './typeBlocks';

const typeBlocks = typeBlocksJSON.default;

export default function SeamlessEditorPreview({content, scrollToBlock, moveBlock, removeBlock}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ dragBlock, setDragBlock ] = useState(null);
    const [ dragOverBlock, setDragOverBlock ] = useState(null);
    const [ dragOverBlockPosition, setDragOverBlockPosition ] = useState(null);
    const [ isToDelete, setIsToDelete ] = useState(false);

    return (
        <div className="seamlessEditor__preview-holder">
            <Scrollbars
                autoHeight
                hideTracksWhenNotNeeded
                autoHeightMax={'100%'}
                renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                renderView={props => <div {...props} className="seamlessEditor__preview"/>}
                renderTrackHorizontal={props => <div {...props} style={{display: 'none'}}/>}
                onDragEnter={() => setIsToDelete(false)}
            >
                <div className="seamlessEditor__preview-list">
                    {
                        content.map((item, index) => _renderPreviewBlock(item, index))
                    }
                </div>
            </Scrollbars>
            <div className={classNames('seamlessEditor__preview-delete', {isOver: isToDelete})} onDragEnter={() => setIsToDelete(true)}>
                <i className="fas fa-trash-alt" />
                { translate('delete') }
            </div>
        </div>
    );

    function _renderPreviewBlock(item, index) {
        return (
            <div className="seamlessEditor__preview-item-holder" onDragEnter={() => setDragOverBlock(item.id)} key={item.id}>
                {
                    dragBlock && index === 0 ?
                        _renderDropArea(item.id, 'before')
                        :
                        null
                }
                <div className="seamlessEditor__preview-item" onClick={() => scrollToBlock(item.id)} draggable onDragStart={() => setDragBlock(item.id)} onDragEnd={handleDragEnd}>
                    <div className="seamlessEditor__preview-item-inner">
                        {
                            !item.value || !hasValue(item) ?
                                <div className="seamlessEditor__preview-placeholder">
                                    <i className={getType(item.type).icon}/>
                                    { translate(getType(item.type).block) }
                                </div>
                                :
                                <Article content={[item]} isCanvas/>
                        }
                    </div>
                </div>
                {
                    dragBlock ?
                        _renderDropArea(item.id, 'after')
                        :
                        null
                }
            </div>
        );
    }

    function _renderDropArea(blockID, position) {
        return (
            <div className={classNames('seamlessEditor__preview-dropArea', {isOver: dragOverBlock === blockID && dragOverBlockPosition === position})} onDragLeave={() => setTimeout(() => { setDragOverBlockPosition(null)}, 0)} onDragEnter={() => setDragOverBlockPosition(position)}>
                { translate('drop_block_here') }
            </div>
        )
    }

    function handleDragEnd() {
        if ( isToDelete ) {
            removeBlock(content.find(item => item.id === dragBlock));
        }
        else {
            if ( dragBlock && dragOverBlock && dragOverBlockPosition ) {
                const prevIndex = content.indexOf(content.find(item => item.id === dragBlock));
                const newIndex = content.indexOf(content.find(item => item.id === dragOverBlock));
                let newPosition = null;

                if ( dragOverBlockPosition === 'before' ) {
                    newPosition = newIndex;
                }
                if ( dragOverBlockPosition === 'after' ) {
                    if ( newIndex === content.length - 1 ) {
                        newPosition = content.length;
                    }
                    else {
                        newPosition = newIndex + 1;
                    }
                }

                moveBlock(prevIndex, newPosition);
            }
        }

        setDragBlock(null);
        setDragOverBlock(null);
        setDragOverBlockPosition(null);
        setIsToDelete(false);
    }

    function getType(itemType) {
        let type = null;

        Object.keys(typeBlocks).forEach(key => {
            const parsedType = itemType === 'media' ? 'image' : itemType;

            if ( typeBlocks[key].find(item => item.block === parsedType) ) {
                type = typeBlocks[key].find(item => item.block === parsedType);
            }
        });

        return type;
    }

    function hasValue(item) {
        let hasValue = false;

        Object.keys(item.value).forEach(key => {
            if ( key !== 'caption' ) {
                if ( item.value[key] ) {
                    hasValue = true;
                }
            }
            else {
                Object.keys(item.value.caption).forEach(capKey => {
                    if ( item.value.caption[capKey] ) {
                        hasValue = true;
                    }
                });
            }
        });

        return hasValue;
    }
}