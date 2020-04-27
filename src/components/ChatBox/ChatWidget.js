import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {fetchChat, setChatStart, setStopChat, discardChat, setOnACall, toggleChalkBoard, toggleLesson} from "../../redux/actions/eventsActions";
import {Link, withRouter} from 'react-router-dom';
import Fullscreen from 'react-full-screen';
import siteSettingsContext from "../../context/siteSettingsContext";
import ChatContainer from "./ChatContainer";
import ringing from "../../sounds/ringing.mp3";
import dialing from "../../sounds/dialing.mp3";
import './quickCall.scss';
import classNames from 'classnames';
import TextTooltip from "../UI/TextTooltip/TextTooltip";
import ChalkBoard from "../UI/ChalkBoard/ChalkBoard";
import ChatInfo from "./ChatInfo";
import moment from "moment";
import 'moment/locale/uk';
import 'moment/locale/ru';
import 'moment/locale/en-gb';
import {Scrollbars} from "react-custom-scrollbars";
import firebase from "firebase";
import Article from "../Article/Article";

const db = firebase.firestore();

let mediaRecorder = null;
let chunks = [];

function ChatWidget({user, location, history, events, usersList, fetchChat, chat, setChatStart, setStopChat, discardChat, onACall, setOnACall, toggleChalkBoard, toggleLesson}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ isFullScreen, setIsFullScreen ] = useState(false);
    const [ isHidden, setIsHidden ] = useState(false);
    const [ isChatPage, setIsChatPage ] = useState(false);
    const [ caller, setCaller ] = useState(null);
    const [ muteChat, setMuteChat ] = useState(false);
    const [ shareScreen, setShareScreen ] = useState(false);
    const [ isStopping, setIsStopping ] = useState(false);
    const [ usersLength, setUsersLength ] = useState(1);
    const [ usersPresent, setUsersPresent ] = useState([]);
    const [ chatLesson, setChatLesson ] = useState(null);
    const [ isRecording, setIsRecording ] = useState(false);
    const [ chatVideo, setChatVideo ] = useState(null);

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
        if ( chatVideo ) {
            const link = document.createElement('a');

            link.id = 'recordLink';
            link.href = chatVideo;
            link.download = chat.name;

            document.querySelector('body').appendChild(link);
            document.getElementById('recordLink').click();
            document.getElementById('recordLink').remove();
            setChatVideo(null);
        }
    }, [chatVideo]);

    useEffect(() => {
        if ( lang === 'ua' ) {
            moment.locale('uk');
        }
        if ( lang === 'ru' ) {
            moment.locale('ru');
        }
        if ( lang === 'en' ) {
            moment.locale('en-gb');
        }
    }, [lang]);

    useEffect(() => {
        if ( user.role === 'guest' ) {
            if ( onACall ) {
                history.push('/chat/' + chat.id);
            }
            else {
                history.push('/guest');
            }
        }
    }, [onACall]);

    useEffect(() => {
        setIsChatPage(!!getChatID());
    }, [location]);

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

    useEffect(() => {
        if ( isFullScreen || isChatPage ) {
            setIsHidden(false);
        }
    }, [isFullScreen, isChatPage]);

    useEffect(() => {
        if ( chat && chat.organizer === user.id ) {
            setOnACall(true);
        }
        if ( onACall && (!chat || (chat && !chat.started)) ) {
            setOnACall(false);
        }
    }, [chat, location]);

    useEffect(() => {
        if ( events ) {
            if ( getChatID() ) {
                fetchChat(getChatID(), user.id);
            }
            if ( checkForActiveChat() ) {
                fetchChat(checkForActiveChat(), user.id);
            }
            if ( !checkForActiveChat() && !getChatID() ) {
                discardChat();
            }
        }
    }, [events, location]);

    useEffect(() => {
        if ( chat && chat.started && usersList ) {
            setCaller(usersList.find(item => item.id === chat.organizer));
        }
    }, [chat, usersList]);

    return (
        chat ?
            chat.started ?
                onACall && !isStopping ?
                    _renderChatBox()
                    :
                    _renderCallBox()
                :
                _renderStoppedChatActions()
            :
            null
    );

    function _renderChatBox() {
        return (
            <div className={classNames('chatroom__box', {fixed: !isChatPage, isOrganizer: isOrganizer(), isHidden: isHidden, noOpacity: chat.chalkBoardOpen })} style={chat.chalkBoardOpen ? {zIndex: 100} : null}>
                <Fullscreen enabled={isFullScreen} onChange={isFull => setIsFullScreen(isFull)}>
                    <div className={classNames('chatroom__chatHolder', { isFullscreen: isFullScreen })}>
                        <ChatInfo chat={chat} />
                        {
                            chat.chalkBoardOpen ?
                                <ChalkBoard isOrganizer={isOrganizer()} chat={chat}/>
                                :
                                null
                        }
                        {
                            user.role !== 'student' && user.role !== 'guest' ?
                                _renderUnconditionally()
                                :
                                null
                        }
                        {
                            chat.lessonOpen && chatLesson && chatLesson.content.length ?
                                _renderLesson()
                                :
                                null
                        }
                        <ChatContainer chat={chat} usersList={usersList} setIsFullScreen={setIsFullScreen} setIsHidden={setIsHidden} muteChat={muteChat} shareScreen={shareScreen} setShareScreen={setShareScreen} isStopping={isStopping} setUsersLength={setUsersLength} onDisplayNameChange={onDisplayNameChange} />
                        { _renderStartedChatActions() }
                    </div>
                </Fullscreen>
                {
                    usersLength < 2 && isOrganizer() ?
                        <audio autoPlay={true} loop={true}>
                            <source src={dialing}/>
                        </audio>
                        :
                        null
                }
            </div>
        );
    }

    function _renderCallBox() {
        return (
            <div className="quickCall">
                <div className="quickCall__overlay"/>
                <div className="quickCall__info">
                    {
                        caller ?
                            <span className="quickCall__name">{ caller.name } { translate('is_calling') }</span>
                            :
                            null
                    }
                    <span className="btn btn__success round ringing" onClick={() => setOnACall(true)}>
                        <div className="btn__before"/>
                        <i className="fas fa-phone"/>
                    </span>
                </div>
                <audio autoPlay={true} loop={true}>
                    <source src={ringing}/>
                </audio>
            </div>
        );
    }

    function _renderStartedChatActions() {
        return (
            <div className="chatroom__btnsHolder">
                {
                    isOrganizer() ?
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
                                        { _renderInteractions() }
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
                                            onClick={handleShareScreen}
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
                        null
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
                    isOrganizer() ?
                        <span className="btn btn__error round" onClick={stopChat}><i className="fas fa-phone-slash" /></span>
                        :
                        null
                }
            </div>
        );
    }

    function _renderInteractions() {
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

    function _renderStoppedChatActions() {
        if ( isChatPage ) {
            if ( user.id === chat.organizer ) {
                return (
                    <>
                        <div className="chatroom__message-holder" style={chat.chalkBoardOpen ? {zIndex: 100} : null}>
                            <ChatInfo isStatic={true} chat={chat} />
                            <div className="chatroom__info">
                                { _renderUnconditionally() }
                                <span>
                                <i className="fas fa-eye-slash"/>
                                    { translate('you_can_start_chat') }
                            </span>
                            </div>
                        </div>
                        <div className="chatroom__btnsHolder">
                            <TextTooltip position="top" text={translate('prepare_chalkboard')} children={
                                <span
                                    className={classNames('btn round', {
                                        btn_primary: !chat.chalkBoardOpen,
                                        'btn__success btn__working': chat.chalkBoardOpen
                                    })}
                                    onClick={handleChalkBoard}
                                >
                                <i className="fas fa-pencil-alt"/>
                            </span>
                            }/>
                            <span className="btn btn__success round" onClick={startChat}><i className="fas fa-phone" /></span>
                        </div>
                    </>
                )
            }
            else {
                return (
                    <div className="chatroom__message-holder">
                        <ChatInfo isStatic={true} chat={chat} />
                        <div className="chatroom__info">
                            {
                                chat.datetime - moment().unix() > 3600 ?
                                    <span>
                                    <i className="far fa-clock"/>
                                    <span>
                                        { translate('videochat_will_start_at') }
                                        { moment(chat.datetime * 1000).format(' HH:mm, DD MMMM YYYY') }
                                    </span>
                                </span>
                                    :
                                    <span>
                                    <i className="fas fa-eye-slash"/>
                                        { translate('chat_will_start_soon') }
                                </span>
                            }
                        </div>
                    </div>
                );
            }
        }
        return null;
    }

    function _renderUnconditionally() {
        return (
            <div className="chatroom__users">
                <Scrollbars
                    autoHeight
                    hideTracksWhenNotNeeded
                    autoHeightMax={'100%'}
                    renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                    renderView={props => <div {...props} className="scrollbar__content"/>}
                >
                    { _renderUser(chat.organizer, true) }
                    { participantsToArray().filter(userItem => usersPresent.find(usersPresentItem => getUser(userItem) && usersPresentItem.name === getUser(userItem).name)).map(userItem => _renderUser(userItem)) }
                    <hr/>
                    { participantsToArray().filter(userItem => !usersPresent.find(usersPresentItem => getUser(userItem) && usersPresentItem.name === getUser(userItem).name)).map(userItem => _renderUser(userItem)) }
                </Scrollbars>
                {
                    chat.chalkBoardOpen ?
                        <ChalkBoard isOrganizer={isOrganizer()} chat={chat}/>
                        :
                        null
                }
            </div>
        );
    }

    function _renderUser(currentUser, isOrganizer) {
        const gottenUser = getUser(currentUser);

        if ( !gottenUser ) {
            return null;
        }

        return (
            <div className={classNames('chatroom__user', {isOrganizer: isOrganizer, isPresent: usersPresent.find(usersPresentItem => usersPresentItem.name === gottenUser.name)})} key={currentUser} data-user-id={usersPresent.find(userPresentItem => userPresentItem.name === gottenUser.name)  ? usersPresent.find(userPresentItem => userPresentItem.name === gottenUser.name).id : currentUser}>
                <div className="chatroom__user-avatar-holder">
                    <i className="chatroom__user-avatar-placeholder fa fa-user"/>
                    <div className="chatroom__user-avatar" style={{backgroundImage: 'url(' + gottenUser.avatar + ')'}}/>
                </div>
                <div className="chatroom__user-name">{ gottenUser.name } </div>
            </div>
        )
    }

    function _renderLesson() {
        return (
            <div className="chatroom__lesson">
                <div className="chatroom__lesson-inner">
                    {
                        isOrganizer() ?
                            <div className="chatroom__lesson-blocks">
                                <Scrollbars
                                    autoHeight
                                    hideTracksWhenNotNeeded
                                    autoHeightMax={'100%'}
                                    renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                                    renderView={props => <div {...props} className="scrollbar__content"/>}
                                >
                                    <Article content={chatLesson.content} onBlockClick={handleBlockClick}/>
                                </Scrollbars>
                            </div>
                            :
                            null
                    }
                    <div className="chatroom__lesson-content">
                        <Scrollbars
                            autoHeight
                            hideTracksWhenNotNeeded
                            autoHeightMax={'100%'}
                            renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                            renderView={props => <div {...props} className="scrollbar__content"/>}
                        >
                            <Article content={[chatLesson.content[chat.lessonOpen - 1]]} onBlockClick={handleBlockClick}/>
                        </Scrollbars>
                    </div>
                </div>
            </div>
        )
    }

    function handleBlockClick(index) {
        toggleLesson(chat.id, index + 1);
    }

    function participantsToArray() {
        if ( typeof chat.participants === 'object' ) {
            return chat.participants;
        }
        return [chat.participants];
    }

    function getUser(userToGet) {
        return usersList.find(userItem => userItem.id === userToGet);
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

    function getChatID() {
        if ( location.pathname.includes('/chat/') ) {
            return location.pathname.replace('/chat/', '');
        }
        return null;
    }

    function isOrganizer() {
        return chat.organizer === user.id;
    }

    function checkForActiveChat() {
        let chatID = null;

        if ( events.all && events.all.find(eventItem => eventItem.started) ) {
            chatID = events.all.find(eventItem => eventItem.started).id;
        }
        if ( events.organizer && events.organizer.find(eventItem => eventItem.started) ) {
            chatID = events.organizer.find(eventItem => eventItem.started).id;
        }
        if ( events.participant && events.participant.find(eventItem => eventItem.started) ) {
            chatID = events.participant.find(eventItem => eventItem.started).id;
        }
        return chatID;
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
        fetchChat: (chatID, userID) => dispatch(fetchChat(chatID, userID)),
        setChatStart: (chatID, setStarted) => dispatch(setChatStart(chatID, setStarted)),
        setStopChat: (chatID) => dispatch(setStopChat(chatID)),
        discardChat: () => dispatch(discardChat()),
        setOnACall: (value) => dispatch(setOnACall(value)),
        toggleChalkBoard: (chatID, value) => dispatch(toggleChalkBoard(chatID, value)),
        toggleLesson: (chatID, value) => dispatch(toggleLesson(chatID, value))
    }
};

export default compose(connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatWidget)));