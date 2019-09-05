import React, { useContext, useState, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import './contentEditor.scss';
import {Preloader} from "../preloader";
import generator from 'generate-password';
import Modal from '../Modal/Modal';

const ContentEditorText = React.lazy(() => import('./ContentEditorText/ContentEditorText'));
const ContentEditorMedia = React.lazy(() => import('./ContentEditorMedia/ContentEditorMedia'));
const ContentEditorQuestion = React.lazy(() => import('./ContentEditorQuestion/ContentEditorQuestion'));
const ContentEditorDivider = React.lazy(() => import('./ContentEditorDivider/ContentEditorDivider'));
// const ContentEditorTable = React.lazy(() => import('./ContentEditorTable/ContentEditorTable'));
// const ContentEditorGrid = React.lazy(() => import('./ContentEditorGrid/ContentEditorGrid'));

// === Need to move this to a separate file from all the files it's used in
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export default function ContentEditor({content, setUpdated, setLessonContent, loading, types}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showAddModal, setShowAddModal ] = useState(false);
    const [ currentContent, setCurrentContent ] = useState(JSON.stringify(content));
    const prevContent = usePrevious(currentContent);
    const defaultEditorActions = [
        {
            type: 'text',
            icon: 'fa fa-font',
            title: 'text',
        },
        {
            type: 'media',
            icon: 'fa fa-images',
            title: 'media'
        },
        // {
        //     type: 'table',
        //     icon: 'fa fa-table'
        // },
        // {
        //     type: 'grid',
        //     icon: 'fa fa-stream'
        // }
        {
            type: 'answers',
            icon: 'fa fa-question',
            title: 'answers'
        },
        {
            type: 'divider',
            icon: 'fa fa-divide',
            title: 'divider'
        }
    ];
    const contentEditorActions = [];

    if ( types.length ) {
        types.forEach(defaultType => {
            if ( defaultEditorActions.find(item => item.type === defaultType) ) {
                contentEditorActions.push(defaultEditorActions.find(item => item.type === defaultType));
            }
        });
    }

    useEffect(() => {
        if ( prevContent && prevContent !== currentContent ) {
            setUpdated();
        }
    });

    return (
        <div className="contentEditor">
            {
                JSON.parse(currentContent).length ?
                    <div className="contentEditor__blocks">
                        {
                            JSON.parse(currentContent).map(block => {
                                switch (block.type) {
                                    case ('text') :
                                        return <ContentEditorText key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('media') :
                                        return <ContentEditorMedia key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    // case ('table') :
                                    //     return <ContentEditorTable key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    // case ('grid') :
                                    //     return <ContentEditorGrid key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('answers') :
                                        return <ContentEditorQuestion key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('divider') :
                                        return <ContentEditorDivider key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
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
                                    contentEditorActions.map(action => {
                                        return (
                                            <a href="/" className="contentEditor__actions-link" onClick={e => startAddContentBlock(e, action.type)} key={action.type}>
                                                <i className={action.icon} />
                                                {
                                                    action.title ?
                                                        translate(action.title)
                                                        :
                                                        null
                                                }
                                            </a>
                                        );
                                    })
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

        const newContent = JSON.parse(currentContent);

        newContent.push({
            type: blockType,
            id: generator.generate({
                length: 16,
                strict: true
            }),
            value: ''
        });

        setShowAddModal(false);
        setCurrentContent(JSON.stringify(newContent));
    }

    function removeBlock(block) {
        const newCurrentContent = JSON.parse(currentContent);
        const blockToRemove = newCurrentContent.find(item => item.id === block.id);

        newCurrentContent.splice(newCurrentContent.indexOf(blockToRemove), 1);
        setCurrentContent(JSON.stringify(newCurrentContent));
        setLessonContent(newCurrentContent);
    }

    function setBlock(block) {
        const newCurrentContent = JSON.parse(currentContent);

        newCurrentContent.find(item => item.id === block.id).value = block.value;
        setCurrentContent(JSON.stringify(newCurrentContent));
        setLessonContent(newCurrentContent);
    }
}