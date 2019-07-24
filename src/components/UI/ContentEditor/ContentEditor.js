import React, { useContext, useState, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import './contentEditor.scss';
import {Preloader} from "../preloader";

const Modal = React.lazy(() => import('../Modal/Modal'));
const ContentEditorText = React.lazy(() => import('./ContentEditorText/ContentEditorText'));

// === Need to move this to a separate file from all the files it's used in
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export default function ContentEditor({content, setUpdated, setLessonContent, loading}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showAddModal, setShowAddModal ] = useState(false);
    const [ currentContent, setCurrentContent ] = useState(JSON.stringify(content));
    const prevContent = usePrevious(currentContent);
    const contentEditorActions = [
        {
            type: 'text',
            icon: 'fa fa-font'
        },
        {
            type: 'media',
            icon: 'fa fa-images'
        },
        {
            type: 'table',
            icon: 'fa fa-table'
        },
        {
            type: 'grid',
            icon: 'fa fa-stream'
        },
        {
            type: 'masonry',
            icon: 'fa fa-th'
        }
    ];

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
                                return (
                                    block.type === 'text' ?
                                        <ContentEditorText key={block.id} block={block} setBlock={setBlock}/>
                                        :
                                        null
                                )
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
                                contentEditorActions.map(action => {
                                    return (
                                        <a href="/" className="contentEditor__actions-link" onClick={e => startAddContentBlock(e, action.type)} key={action.type}>
                                            <i className={action.icon} />
                                            { translate(action.type) }
                                        </a>
                                    );
                                })
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
            id: newContent.length,
            value: ''
        });

        setShowAddModal(false);
        setCurrentContent(JSON.stringify(newContent));
    }

    function setBlock(block) {
        const newCurrentContent = JSON.parse(currentContent);

        newCurrentContent.find(item => item.id === block.id).value = block.value;
        setCurrentContent(JSON.stringify(newCurrentContent));
        setLessonContent(newCurrentContent);
    }
}