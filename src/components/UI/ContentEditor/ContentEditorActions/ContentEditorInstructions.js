import React, {useContext, useState} from 'react';
import Modal from "../../Modal/Modal";
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function ContentEditorInstructions({ instructions, heading }) {
    const { translate } = useContext(siteSettingsContext);
    const [ showInstructions, setShowInstructions ] = useState(false);

    return (
        <>
            <a href="/" onClick={onBlockInfo} className="contentEditor__block-actions-info">
                <i className="content_title-icon fas fa-question-circle"/>
            </a>
            {
                showInstructions ?
                    <Modal heading={translate(heading)} className="contentEditor__instructions-modal" onHideModal={e => setShowInstructions(false)}>
                        <div className="contentEditor__instructions">
                            {
                                instructions.map((item, index) => _renderInstructionItem(item, index))
                            }
                        </div>
                    </Modal>
                    :
                    null
            }
        </>
    );

    function onBlockInfo(e) {
        e.preventDefault();

        setShowInstructions(true);
    }

    function _renderInstructionItem(item, index) {
        switch (item.type) {
            case 'text':
                return <p dangerouslySetInnerHTML={{__html: item.value}} key={index}/>;

            case 'image':
                return <div className="contentEditor__instructions-image" key={index}><img src={item.value} /></div>;
        }
    }
}