import React, {useContext, useState} from 'react';
import './chalkBoard.scss';
import {Preloader} from "../../UI/preloader";
import TextTooltip from "../../UI/TextTooltip/TextTooltip";
import siteSettingsContext from "../../../context/siteSettingsContext";
import ChalkBoardGraph from "./ChalkBoardGraph";
import { sendChalkBoard, toggleChalkBoard } from "../../../redux/actions/eventsActions";
import { connect } from 'react-redux';

function ChalkBoard({isOrganizer, chat, sendChalkBoard, toggleChalkBoard}) {
    const { translate } = useContext(siteSettingsContext);
    const [ board, saveBoard ] = useState(chat.chalkBoard);

    return (
        <div className="chalkBoard">
            {
                isOrganizer ?
                    <Preloader/>
                    :
                    <Preloader color={'#7f00a3'} />
            }
            <ChalkBoardGraph saveBoard={(value) => saveBoard(value)} chat={chat}/>
            <div className="chalkBoard__notVisible">
                <i className="fas fa-eye-slash" />
            </div>
            {
                isOrganizer ?
                    _renderChalkBoardActions()
                    :
                    null
            }
        </div>
    );

    function _renderChalkBoardActions() {
        return (
            <div className="chalkBoard__actions">
                <div className="chalkBoard__actionsItem">
                    <TextTooltip position="top" text={translate('send')} children={
                        <span className="btn btn_primary round" onClick={shareBoard}>
                            <i className="fas fa-share"/>
                        </span>
                    }/>
                </div>
                <div className="chalkBoard__actionsItem">
                    <TextTooltip position="top" text={translate('erase')} children={
                        <span className="btn btn__error round" onClick={eraseBoard}>
                            <i className="fas fa-eraser"/>
                        </span>
                    }/>
                </div>
                <div className="chalkBoard__actionsItem">
                    <TextTooltip position="top" text={translate('close_chalkboard')} children={
                        <span className="btn btn_primary round" onClick={() => toggleChalkBoard(chat.id, false)}>
                            <i className="fas fa-times"/>
                        </span>
                    }/>
                </div>
            </div>
        )
    }

    function eraseBoard() {
        sendChalkBoard(chat.id, null);
    }

    function shareBoard() {
        sendChalkBoard(chat.id, board);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendChalkBoard: (chatID, value) => dispatch(sendChalkBoard(chatID, value)),
        toggleChalkBoard: (chatID, value) => dispatch(toggleChalkBoard(chatID, value))
    }
};

export default connect(null, mapDispatchToProps)(ChalkBoard);
