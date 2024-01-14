import React, { useContext, memo, useCallback } from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import siteSettingsContext from "../../context/siteSettingsContext";

import TextTooltip from "../UI/TextTooltip/TextTooltip";

import ChatInteractions from './ChatInteractions';

const ChatStartedActions = (props) => {
  const { translate } = useContext(siteSettingsContext);
  const {
    currentChatOrganizer,
    isRecording,
    setIsRecording,
    muteChat,
    setMuteChat,
    user,
    chat,
    shareScreen,
    handleShareScreen,
    handleOpenLesson,
    handleChalkBoard,
    isFullScreen,
    setIsFullScreen,
    isChatPage,
    isHidden,
    setIsHidden,
    stopChat,
    raiseHand,
    setRaiseHand,
    apiRef
  } = props;

  const handleRaiseHand = useCallback(() => {
    setRaiseHand(!raiseHand)
    apiRef.executeCommand('toggleRaiseHand')
  }, [apiRef, setRaiseHand, raiseHand]);

  const onShareScreen = useCallback(() => {
    handleShareScreen();
    apiRef.executeCommand('toggleVideo');
    apiRef.executeCommand('toggleShareScreen');
  }, [apiRef, handleShareScreen]);

  return (
    <div className="chatroom__btnsHolder">
        {
            currentChatOrganizer ?
                <TextTooltip position="top" text={!isRecording ? translate('record') : translate('stop_recording')} children={
                    <span
                        className={classNames('btn round', {
                            btn_primary: !isRecording,
                            'btn__error btn__working btn__spinning': isRecording
                        })}
                        onClick={() => setIsRecording(!isRecording)}>
                        <i className="fas fa-compact-disc"/>
                    </span>
                }/>
                :
                null
        }
        <TextTooltip position="top" text={!muteChat ? translate('mute_microphone') : translate('unmute_microphone')} children={
            <span className={classNames('btn btn_primary round', {btn__pale: muteChat})}
                  onClick={() => setMuteChat(!muteChat)}>
                {
                    muteChat ?
                        <i className="fas fa-microphone-slash"/>
                        :
                        <i className="fas fa-microphone"/>
                }
            </span>
        }/>
        {
            user.id === chat.organizer ?
                <>
                    {
                        !shareScreen && !chat.chalkBoardOpen && !chat.lessonOpen ?
                            <div className="chatroom__interactions-holder">
                                <span
                                    className={classNames('btn round', {
                                        btn_primary: !shareScreen,
                                        'btn__success btn__working': shareScreen
                                    })}
                                    disabled={chat.chalkBoardOpen}
                                >
                                    <i className="fas fa-ellipsis-h"/>
                                </span>
                                <ChatInteractions
                                  handleShareScreen={onShareScreen}
                                  shareScreen={shareScreen}
                                  chat={chat}
                                  handleOpenLesson={handleOpenLesson}
                                  handleChalkBoard={handleChalkBoard}
                                />
                            </div>
                            :
                            null
                    }
                    {
                        shareScreen ?
                            <TextTooltip position="top" text={translate('share_screen')} children={
                                <span
                                    className={classNames('btn round', {
                                        btn_primary: !shareScreen,
                                        'btn__success btn__working': shareScreen
                                    })}
                                    onClick={onShareScreen}
                                    disabled={chat.chalkBoardOpen}
                                >
                                    <i className="fas fa-desktop"/>
                                </span>
                            }/>
                            :
                            null
                    }
                    {
                        chat.lessonOpen && chat.lesson && chat.lesson.subjectID ?
                            <TextTooltip position="top" text={chat.lessonOpen ? translate('close_lesson') : translate('open_lesson')} children={
                                <span
                                    className={classNames('btn round', {
                                        btn_primary: !chat.lessonOpen,
                                        'btn__success btn__working': chat.lessonOpen
                                    })}
                                    onClick={handleOpenLesson}
                                    disabled={chat.chalkBoardOpen}
                                >
                                    <i className="fas fa-paragraph"/>
                                </span>
                            }/>
                            :
                            null
                    }
                    {
                        chat.chalkBoardOpen ?
                            <TextTooltip position="top" text={translate('virtual_chalkboard')} children={
                                <span
                                    className={classNames('btn round', {
                                        btn_primary: !chat.chalkBoardOpen,
                                        'btn__success btn__working': chat.chalkBoardOpen
                                    })}
                                    disabled={shareScreen}
                                    onClick={handleChalkBoard}
                                >
                                    <i className="fas fa-pencil-alt"/>
                                </span>
                            }/>
                            :
                            null
                    }
                </>
                :
                <TextTooltip position="top" text={raiseHand ? 'Опустити руку' : 'Підняти руку'} children={
                    <span className={classNames('btn btn_primary round', {btn__success: raiseHand})}
                          onClick={handleRaiseHand}>
                        <i className="fas fa-hand-paper"/>
                    </span>
                }/>
        }
        {
            !isFullScreen && !isChatPage ?
                <TextTooltip position="top" text={translate('change_size')} children={
                    <span className="btn btn_primary round" onClick={() => setIsHidden(!isHidden)}>
                    {
                        isHidden ?
                            <i className="fas fa-chevron-up" />
                            :
                            <i className="fas fa-chevron-down" />
                    }
                </span>
                } />
                :
                null
        }
        <TextTooltip position="top" text={translate('fullscreen')} children={
            <span className="btn btn_primary round" onClick={() => setIsFullScreen(!isFullScreen)}><i
                className="fas fa-compress"/></span>
        } />
        {
            !isChatPage && !isFullScreen ?
                <TextTooltip position="top" text={translate('to_chat')} children={
                    <Link to={'/chat/' + chat.id} className="btn btn_primary round">
                        <i className="fa fa-link"/>
                    </Link>
                }/>
                :
                null
        }
        {
            currentChatOrganizer ?
                <span className="btn btn__error round" onClick={stopChat}><i className="fas fa-phone-slash" /></span>
                :
                null
        }
    </div>
  )
}

export default memo(ChatStartedActions);
