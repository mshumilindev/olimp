import React, { useContext, useState, useEffect } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import './contentEditor.scss';
import Preloader from "../preloader";
import generator from 'generate-password';
import Modal from '../Modal/Modal';

import ContentEditorText from './ContentEditorText/ContentEditorText';
import ContentEditorFormula from './ContentEditorFormula/ContentEditorFormula';
import ContentEditorMedia from './ContentEditorMedia/ContentEditorMedia';
import ContentEditorYoutube from './ContentEditorYoutube/ContentEditorYoutube';
import ContentEditorAudio from "./ContentEditorAudio/ContentEditorAudio";
import ContentEditorVideo from "./ContentEditorVideo/ContentEditorVideo";
import ContentEditorPowerpoint from "./ContentEditorPowerpoint/ContentEditorPowerpoint";
import ContentEditorWord from "./ContentEditorWord/ContentEditorWord";
import ContentEditorQuestion from './ContentEditorQuestion/ContentEditorQuestion';
import ContentEditorDivider from './ContentEditorDivider/ContentEditorDivider';
import ContentEditorPage from './ContentEditorPage/ContentEditorPage';

export default function ContentEditor({content, setUpdated, isUpdated, setLessonContent, loading, types, contentType}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showAddModal, setShowAddModal ] = useState(false);
    const [ initialContent, setInitialContent ] = useState(null);
    const defaultEditorActions = [
        {
            type: 'text',
            icon: 'fa fa-font',
            title: 'text',
        },
        {
            type: 'formula',
            icon: 'fa fa-square-root-alt',
            title: 'formula',
        },
        {
            type: 'media',
            icon: 'fa fa-images',
            title: 'media'
        },
        {
            type: 'youtube',
            icon: 'fab fa-youtube',
            title: 'youtube'
        },
        {
            type: 'audio',
            icon: 'fas fa-headphones',
            title: 'audio'
        },
        {
            type: 'video',
            icon: 'fas fa-video',
            title: 'video'
        },
        {
            type: 'word',
            icon: 'fas fa-file-word',
            title: 'word'
        },
        {
            type: 'powerpoint',
            icon: 'fas fa-file-powerpoint',
            title: 'powerpoint'
        },
        {
            type: 'answers',
            icon: 'fa fa-question',
            title: 'answers'
        },
        {
            type: 'divider',
            icon: 'fa fa-divide',
            title: 'divider'
        },
        {
            type: 'page',
            icon: 'fa fa-file',
            title: 'page'
        }
    ];
    const contentEditorActions = [];

    if ( types.length ) {
        types.forEach(defaultType => {
            if ( typeof defaultType === 'object' ) {
                contentEditorActions.push(defaultType.map(innerType => {
                    if ( defaultEditorActions.find(item => item.type === innerType) ) {
                        return defaultEditorActions.find(item => item.type === innerType);
                    }
                }));
            }
            else {
                if ( defaultEditorActions.find(item => item.type === defaultType) ) {
                    contentEditorActions.push(defaultEditorActions.find(item => item.type === defaultType));
                }
            }
        });
    }

    useEffect(() => {
        if ( !isUpdated ) {
            setInitialContent(JSON.parse(JSON.stringify(content)));
        }
    }, [isUpdated]);

    useEffect(() => {
        if ( content && initialContent ) {
            setUpdated(JSON.stringify(content) !== JSON.stringify(initialContent));
        }
    }, [content, initialContent]);

    return (
        <div className="contentEditor">
            {
                content.length ?
                    <div className="contentEditor__blocks">
                        {
                            content.map(block => {
                                switch (block.type) {
                                    case ('text') :
                                        return <ContentEditorText key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('formula') :
                                        return <ContentEditorFormula key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('media') :
                                        return <ContentEditorMedia key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('youtube') :
                                        return <ContentEditorYoutube key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('audio') :
                                        return <ContentEditorAudio key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('video') :
                                        return <ContentEditorVideo key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('word') :
                                        return <ContentEditorWord key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('powerpoint') :
                                        return <ContentEditorPowerpoint key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('answers') :
                                        return <ContentEditorQuestion key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('divider') :
                                        return <ContentEditorDivider key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('page') :
                                        return <ContentEditorPage key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    default:
                                        return null;
                                }
                            })
                        }
                        {
                            loading ?
                                <Preloader/>
                                :
                                null
                        }
                    </div>
                    :
                    _renderNoContent()
            }
            {
                _renderContentAdd()
            }
            {
                showAddModal ?
                    <Modal onHideModal={() => setShowAddModal(false)}>
                        <h2 className="contentEditor__actions-heading">{ translate('choose_block_type') }</h2>
                        <div className="contentEditor__actions">
                            {
                                contentEditorActions.length ?
                                    contentEditorActions.map((action, index) => _renderAction(action, index))
                                    :
                                    null
                            }
                        </div>
                    </Modal>
                    :
                    null
            }
        </div>
    );

    function _renderAction(action, index) {
        if ( Array.isArray(action) ) {
            return (
                <div className="contentEditor__actions-row" key={'' + index + action.type}>
                    {
                        action.map((innerAction, innerIndex) => _renderAction(innerAction, innerIndex))
                    }
                </div>
            );
        }
        else {
            return (
                <a href="/" className="contentEditor__actions-link" onClick={e => startAddContentBlock(e, action.type)} key={'' + index + action.type}>
                    <i className={action.icon} />
                    {
                        action.title ?
                            translate(action.title)
                            :
                            null
                    }
                </a>
            );
        }
    }

    function _renderNoContent() {
        return <div className="contentEditor__noContent">{ translate('start_adding_content') }</div>
    }

    function _renderContentAdd() {
        return (
            <div className="contentEditor__add-holder">
                <a href="/" className="contentEditor__add" onClick={e => {e.preventDefault(); setShowAddModal(true)}}>
                    <i className="fa fa-plus" />
                </a>
            </div>
        )
    }

    function startAddContentBlock(e, blockType) {
        e.preventDefault();

        const newContent = Object.assign([], content);

        newContent.push({
            type: blockType,
            id: generator.generate({
                length: 16,
                strict: true
            }),
            value: ''
        });

        setLessonContent(newContent);
        setShowAddModal(false);
    }

    function removeBlock(block) {
        const newContent = Object.assign([], content);
        const blockToRemove = newContent.find(item => item.id === block.id);

        newContent.splice(newContent.indexOf(blockToRemove), 1);
        setLessonContent(newContent);
    }

    function setBlock(block) {
        const newContent = Object.assign([], content);

        newContent.find(item => item.id === block.id).value = block.value;
        setLessonContent(newContent);
    }
}