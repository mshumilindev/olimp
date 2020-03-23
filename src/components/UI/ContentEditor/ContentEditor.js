import React, { useContext, useState, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import './contentEditor.scss';
import {Preloader} from "../preloader";
import generator from 'generate-password';
import Modal from '../Modal/Modal';

import ContentEditorText from './ContentEditorText/ContentEditorText';
import ContentEditorMedia from './ContentEditorMedia/ContentEditorMedia';
import ContentEditorYoutube from './ContentEditorYoutube/ContentEditorYoutube';
import ContentEditorAudio from "./ContentEditorAudio/ContentEditorAudio";
import ContentEditorQuestion from './ContentEditorQuestion/ContentEditorQuestion';
import ContentEditorDivider from './ContentEditorDivider/ContentEditorDivider';
import ContentEditorPage from './ContentEditorPage/ContentEditorPage';
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

export default function ContentEditor({content, setUpdated, setLessonContent, loading, types, contentType}) {
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
                contentType === 'questions' && JSON.parse(currentContent).length ?
                    <div className="contentEditor__heading">{ translate('max_score') }: { content.maxScore ? content.maxScore : 0 }</div>
                    :
                    null
            }
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
                                    case ('youtube') :
                                        return <ContentEditorYoutube key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    case ('audio') :
                                        return <ContentEditorAudio key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    // case ('table') :
                                    //     return <ContentEditorTable key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
                                    // case ('grid') :
                                    //     return <ContentEditorGrid key={block.id} block={block} setBlock={setBlock} removeBlock={removeBlock}/>;
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
        setLessonContent(calcMaxScore(newCurrentContent));
    }

    function setBlock(block) {
        const newCurrentContent = JSON.parse(currentContent);

        newCurrentContent.find(item => item.id === block.id).value = block.value;
        setCurrentContent(JSON.stringify(newCurrentContent));
        setLessonContent(calcMaxScore(newCurrentContent));
    }

    function calcMaxScore(newCurrentContent) {
        if ( contentType !== 'questions' ) {
            return newCurrentContent;
        }
        let maxScore = 0;

        newCurrentContent.forEach(item => {
            if ( item.type === 'answers' ) {
                maxScore += parseInt(item.value.score);
            }
        });
        newCurrentContent.maxScore = maxScore;
        return newCurrentContent;
    }
}