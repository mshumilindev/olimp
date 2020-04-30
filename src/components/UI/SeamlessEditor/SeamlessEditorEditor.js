import React, {useContext, useState} from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import classNames from 'classnames';
import * as blocksJSON from './blocks';
import SeamlessEditorText from "./blocks/SeamlessEditorText";
import SeamlessEditorImage from "./blocks/SeamlessEditorImage";

const blocksData = blocksJSON.default;

export default function SeamlessEditorEditor({title, type, addBlock, setBlock, removeBlock, content}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showType, setShowType ] = useState(null);
    const [ dragBlock, setDragBlock ] = useState(null);
    const [ dragOverBlock, setDragOverBlock ] = useState(null);
    const [ dragOverBlockPosition, setDragOverBlockPosition ] = useState(null);
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
    const typeBlocks = {
        text: [
            {
                icon: 'fas fa-font',
                block: 'text'
            }
        ],
        media: [
            {
                icon: 'fas fa-image',
                block: 'image'
            },
            {
                icon: 'fas fa-headphones',
                block: 'audio'
            },
            {
                icon: 'fas fa-video',
                block: 'video'
            },
            {
                icon: 'fab fa-youtube',
                block: 'youtube'
            }
        ],
        document: [
            {
                icon: 'fas fa-file-word',
                block: 'word'
            },
            {
                icon: 'fas fa-file-powerpoint',
                block: 'powerpoint'
            }
        ],
        other: [
            {
                icon: 'fa fa-divide',
                block: 'divider'
            },
            {
                icon: 'fa fa-file',
                block: 'page'
            }
        ]
    };

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
                    showType ?
                        _renderTypeBlocks()
                        :
                        null
                }
            </>
        )
    }

    function _renderType(item) {
        return (
            <div className="seamlessEditor__editor-types-item" key={'type' + item.type}>
                <div className={classNames('seamlessEditor__editor-btn', {active: showType === item.type})} onClick={() => setShowType(showType === item.type ? null : item.type)}>
                    <i className={item.icon} />
                    { translate(item.type) }
                </div>
            </div>
        )
    }

    function _renderTypeBlocks() {
        return (
            <div className="seamlessEditor__editor-type">
                {
                    typeBlocks[showType].map(item => _renderTypeBlock(item))
                }
            </div>
        )
    }

    function _renderTypeBlock(item) {
        return (
            <div className="seamlessEditor__editor-type-item" key={'typeBlock' + item.block} draggable onDragStart={() => setDragBlock(item.block)} onDragEnd={handleDragEnd}>
                <div className="seamlessEditor__editor-btn" onClick={() => addBlock(getNewBlock(item.block), content.length)}>
                    <i className={item.icon} />
                    { translate(item.block) }
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
                            content.map((item, index) => _renderBlock(item, index))
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

    function _renderBlock(item, index) {
        return (
            <div className="seamlessEditor__editor-block-holder" onDragEnter={() => setDragOverBlock(item.id)} key={'block' + item.id}>
                {
                    dragBlock && index === 0 ?
                        _renderDropArea(item.id, 'before')
                        :
                        null
                }
                { getBlock(item) }
                {
                    dragBlock ?
                        _renderDropArea(item.id, 'after')
                        :
                        null
                }
            </div>
        )
    }

    function _renderDropArea(blockID, position) {
        return (
            <div className={classNames('seamlessEditor__editor-block dropArea', {isOver: dragOverBlock === blockID && dragOverBlockPosition === position})} onDragEnter={() => setDragOverBlockPosition(position)}>
                <div className="seamlessEditor__editor-block-inner">
                    { translate('drop_block_here') }
                </div>
            </div>
        )
    }

    function getBlock(block) {
        switch (block.type) {
            case 'text':
                return <SeamlessEditorText block={block} setBlock={setBlock} removeBlock={removeBlock}/>;

            case 'media':
            case 'image':
                return <SeamlessEditorImage block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
        }
    }

    function handleDragEnd() {
        if ( dragBlock && dragOverBlock && dragOverBlockPosition ) {
            const index = content.indexOf(content.find(item => item.id === dragOverBlock));
            let newPosition = null;

            if ( dragOverBlockPosition === 'before' ) {
                if ( index === 0 ) {
                    newPosition = 0;
                }
                else {
                    newPosition = index - 1;
                }
            }
            else {
                if ( index === content.length - 1 ) {
                    newPosition = content.length;
                }
                else {
                    newPosition = index + 1;
                }
            }

            addBlock(getNewBlock(dragBlock), newPosition);
        }
        setDragBlock(null);
        setDragOverBlock(null);
    }

    function getNewBlock(type) {
        return JSON.parse(JSON.stringify(blocksData[type]));
    }
}