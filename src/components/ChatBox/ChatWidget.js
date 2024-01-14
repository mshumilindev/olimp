import React, { useEffect, useContext, useState, useMemo, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {withRouter} from 'react-router-dom';
import {fetchChat, setChatStart, setStopChat, discardChat, setOnACall, toggleChalkBoard, toggleLesson} from "../../redux/actions/eventsActions";
import siteSettingsContext from "../../context/siteSettingsContext";
import './quickCall.scss';
import firebase from "firebase";
import ChatBox from "./ChatBox";
import ChatCallBox from "./ChatCallBox";
import ChatStoppedActions from "./ChatStoppedActions";
import { useChatWidget } from './hooks/useChatWidget';
import { getChatID } from './utils/getChatID';

const db = firebase.firestore();

let mediaRecorder = null;
let chunks = [];

function ChatWidget(props) {
  const {chat: anyChat, user, location, history, events, usersList, fetchChat, setChatStart, setStopChat, discardChat, onACall, setOnACall, toggleChalkBoard, toggleLesson} = props;
  const {
    isOrganizer,
    isParticipant,
    canViewByRole,
    muteChat,
    setMuteChat,
    isFullScreen,
    setIsFullScreen,
    isHidden,
    setIsHidden,
    isChatPage,
    caller,
    shareScreen,
    setShareScreen,
    isStopping,
    setIsStopping,
    usersLength,
    setUsersLength,
    usersPresent,
    setUsersPresent,
    chatLesson,
    setChatLesson,
    isRecording,
    setIsRecording,
    setChatVideo,
    hasToParticipate,
    currentChatOrganizer,
    chat,
    setApiRef,
    apiRef,
    raiseHand,
    setRaiseHand
  } = useChatWidget(props);

    useEffect(() => {
        navigator.getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia);

        if ( isRecording ) {
            navigator.getUserMedia({audio: true, video: true}, stream => {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.start();
            });
        }
        else {
            if ( mediaRecorder ) {
                mediaRecorder.stop();
            }
        }
        if ( mediaRecorder ) {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { 'type' : 'video/avi;codecs=opus' });
                const url = URL.createObjectURL(blob);

                setChatVideo(url);
            };

            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            }
        }
    }, [isRecording]);

    useEffect(() => {
        if ( chat ) {
            if ( chat.started ) {
                setIsStopping(false);
            }
            else {
                setIsStopping(true);
                if ( mediaRecorder ) {
                    setIsRecording(false);
                }
            }
            if ( chat.lessonOpen && chat.lesson.subjectID && chat.lesson.courseID && (!chatLesson || chatLesson.id !== chat.lesson.lessonID) ) {
                const lessonRef = db.collection('courses').doc(chat.lesson.subjectID).collection('coursesList').doc(chat.lesson.courseID).collection('modules').doc(chat.lesson.moduleID).collection('lessons').doc(chat.lesson.lessonID);
                const lessonContentRef = db.collection('courses').doc(chat.lesson.subjectID).collection('coursesList').doc(chat.lesson.courseID).collection('modules').doc(chat.lesson.moduleID).collection('lessons').doc(chat.lesson.lessonID).collection('content');
                let newLesson = null;

                lessonRef.get().then(doc => {
                    newLesson = {
                        ...doc.data(),
                        id: doc.id,
                        content: []
                    };
                    lessonContentRef.get().then(snapshot => {
                        if ( snapshot.docs.length ) {
                            newLesson.content = snapshot.docs.map(doc => {
                                return {
                                    ...doc.data(),
                                    id: doc.id
                                }
                            });
                            setChatLesson(newLesson);
                        }
                        else {
                            setChatLesson(newLesson);
                        }
                    });
                });
            }
        }
    }, [chat]);

    const chatBoxProps = {
      isChatPage,
      isOrganizer,
      isHidden,
      setIsHidden,
      chat,
      isFullScreen,
      setIsFullScreen,
      user,
      chatLesson,
      usersList,
      muteChat,
      setMuteChat,
      shareScreen,
      setShareScreen,
      isStopping,
      usersLength,
      setUsersLength,
      onDisplayNameChange,
      canViewByRole,
      handleBlockClick,
      isRecording,
      setIsRecording,
      handleShareScreen,
      handleOpenLesson,
      handleChalkBoard,
      usersPresent,
      stopChat,
      isParticipant,
      currentChatOrganizer,
      setApiRef,
      apiRef,
      raiseHand,
      setRaiseHand
    }

    const callBoxProps = {
      isOrganizer,
      events,
      chat,
      caller,
      setOnACall,
    }

    if ( !chat ) {
      return null;
    }

    if ( chat?.started ) {
      if ( onACall && !isStopping ) {
        return <ChatBox {...chatBoxProps} />;
      }
      if ( hasToParticipate ) {
        return <ChatCallBox {...callBoxProps} />;
      }
    }

    return (
      <ChatStoppedActions
        isChatPage={isChatPage}
        chat={chat}
        usersPresent={usersPresent}
        usersList={usersList}
        handleChalkBoard={handleChalkBoard}
        startChat={startChat}
        hasToParticipate={hasToParticipate}
        currentChatOrganizer={currentChatOrganizer}
      />
    );

    function handleBlockClick(index) {
        toggleLesson(chat.id, index + 1);
    }

    function onDisplayNameChange(id, displayName) {
        const newUsersPresent = usersPresent;

        if ( displayName ) {
            newUsersPresent.push({
                id: id,
                name: displayName
            });

            setUsersPresent(Object.assign([], newUsersPresent));
        }
        else {
            if ( newUsersPresent.find(newUserItem => newUserItem.id === id) ) {
                setUsersPresent(Object.assign([], newUsersPresent.filter(newUserItem => newUserItem.id !== id).length ? newUsersPresent.filter(newUserItem => newUserItem.id !== id) : []));
            }
        }
    }

    function handleShareScreen() {
        if ( !chat.chalkBoardOpen ) {
            setShareScreen(!shareScreen);
        }
    }

    function handleChalkBoard() {
        if ( !shareScreen ) {
            toggleChalkBoard(chat.id, !chat.chalkBoardOpen);
        }
    }

    function startChat() {
        setIsStopping(false);
        setOnACall(true);
        setChatStart(chat.id, true);
    }

    function stopChat() {
        setIsStopping(true);
        setStopChat(chat.id);
        setUsersPresent([]);
        setMuteChat(false);
        setIsFullScreen(false);
    }

    function handleOpenLesson() {
        toggleLesson(chat.id, chat.lessonOpen ? null : 1);
    }
}

const mapStateToProps = state => {
    return {
        events: state.eventsReducer.events,
        usersList: state.usersReducer.usersList,
        chat: state.eventsReducer.chat,
        onACall: state.eventsReducer.onACall,
        user: state.authReducer.currentUser
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChat: (chatID, userID, userRole, userIsManagement) => dispatch(fetchChat(chatID, userID, userRole, userIsManagement)),
        setChatStart: (chatID, setStarted) => dispatch(setChatStart(chatID, setStarted)),
        setStopChat: (chatID) => dispatch(setStopChat(chatID)),
        discardChat: () => dispatch(discardChat()),
        setOnACall: (value) => dispatch(setOnACall(value)),
        toggleChalkBoard: (chatID, value) => dispatch(toggleChalkBoard(chatID, value)),
        toggleLesson: (chatID, value) => dispatch(toggleLesson(chatID, value))
    }
};

export default compose(connect(mapStateToProps, mapDispatchToProps)(withRouter(memo(ChatWidget))));
