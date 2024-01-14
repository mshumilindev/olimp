import React, { useContext, memo } from 'react';
import classNames from 'classnames';

import siteSettingsContext from "../../context/siteSettingsContext";

const ChatInteractions = ({handleShareScreen, shareScreen, chat, handleOpenLesson, handleChalkBoard}) => {
  const { translate } = useContext(siteSettingsContext);

  return (
    <div className="chatroom__interactions">
        <div className="chatroom__interactions-item" onClick={handleShareScreen}>
            <span
                className={classNames('btn round', {
                    btn_primary: !shareScreen,
                    'btn__success btn__working': shareScreen
                })}
                disabled={chat.chalkBoardOpen}
            >
                <i className="fas fa-desktop"/>
            </span>
            { translate('share_screen') }
        </div>
        {
            chat.lesson && chat.lesson && chat.lesson.subjectID ?
                <div className="chatroom__interactions-item" onClick={handleOpenLesson}>
                    <span
                        className={classNames('btn round', {
                            btn_primary: !chat.lessonOpen,
                            'btn__success btn__working': chat.lessonOpen
                        })}
                        disabled={chat.chalkBoardOpen}
                    >
                        <i className="fas fa-paragraph"/>
                    </span>
                    {
                        chat.lessonOpen ?
                            translate('close_lesson')
                            :
                            translate('open_lesson')
                    }
                </div>
                :
                null
        }
        <div className="chatroom__interactions-item" onClick={handleChalkBoard}>
            <span
                className={classNames('btn round', {
                    btn_primary: !chat.chalkBoardOpen,
                    'btn__success btn__working': chat.chalkBoardOpen
                })}
                disabled={shareScreen}
            >
                <i className="fas fa-pencil-alt"/>
            </span>
            { translate('virtual_chalkboard') }
        </div>
    </div>
  )
}

export default memo(ChatInteractions);
