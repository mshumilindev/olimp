import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {fetchChat, setChatStart, setStopChat, discardChat, setOnACall, toggleChalkBoard} from "../../redux/actions/eventsActions";
import {Link, withRouter} from 'react-router-dom';
import userContext from '../../context/userContext';
import Fullscreen from 'react-full-screen';
import siteSettingsContext from "../../context/siteSettingsContext";
import ChatContainer from "./ChatContainer";
import ringing from "../../sounds/ringing.mp3";
import './quickCall.scss';
import classNames from 'classnames';
import TextTooltip from "../UI/TextTooltip/TextTooltip";
import ChalkBoard from "../UI/ChalkBoard/ChalkBoard";
import ChatInfo from "./ChatInfo";

function ChatWidget({location, history, events, usersList, fetchChat, chat, setChatStart, setStopChat, discardChat, onACall, setOnACall, toggleChalkBoard}) {
    const { user } = useContext(userContext);
    const { translate } = useContext(siteSettingsContext);
    const [ isFullScreen, setIsFullScreen ] = useState(false);
    const [ isHidden, setIsHidden ] = useState(false);
    const [ isChatPage, setIsChatPage ] = useState(false);
    const [ caller, setCaller ] = useState(null);
    const [ muteChat, setMuteChat ] = useState(false);
    const [ shareScreen, setShareScreen ] = useState(false);
    const [ isStopping, setIsStopping ] = useState(false);

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
        if ( events.length ) {
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
            <div className={classNames('chatroom__box', {fixed: !isChatPage, isOrganizer: chat.organizer === user.id, isHidden: isHidden, noOpacity: chat.chalkBoardOpen })}>
                <Fullscreen enabled={isFullScreen} onChange={isFull => setIsFullScreen(isFull)}>
                    <div className={classNames('chatroom__chatHolder', { isFullscreen: isFullScreen })}>
                        <ChatInfo chat={chat} />
                        {
                            chat.chalkBoardOpen ?
                                <ChalkBoard isOrganizer={isOrganizer} chat={chat}/>
                                :
                                null
                        }
                        <ChatContainer chat={chat} usersList={usersList} setIsFullScreen={setIsFullScreen} setIsHidden={setIsHidden} muteChat={muteChat} shareScreen={shareScreen} setShareScreen={setShareScreen} isStopping={isStopping} />
                        { _renderStartedChatActions() }
                    </div>
                </Fullscreen>
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
                <span className={classNames('btn btn_primary round', { btn__pale: muteChat })} onClick={() => setMuteChat(!muteChat)}>
                    {
                        muteChat ?
                            <i className="fas fa-microphone-slash"/>
                            :
                            <i className="fas fa-microphone"/>
                    }
                </span>
                {
                    user.id === chat.organizer ?
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
                    user.id === chat.organizer ?
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
                    user.id === chat.organizer ?
                        <span className="btn btn__error round" onClick={stopChat}><i className="fas fa-phone-slash" /></span>
                        :
                        null
                }
            </div>
        );
    }

    function _renderStoppedChatActions() {
        if ( user.id === chat.organizer ) {
            return (
                <>
                    <div className="chatroom__message-holder">
                        <ChatInfo isStatic={true} chat={chat} />
                        <div className="chatroom__info">
                            <span>
                                <i className="fas fa-eye-slash"/>
                                { translate('you_can_start_chat') }
                            </span>
                        </div>
                    </div>
                    <div className="chatroom__btnsHolder">
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
                        <span>
                            <i className="fas fa-eye-slash"/>
                            { translate('chat_will_start_soon') }
                        </span>
                    </div>
                </div>
            );
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
        return events.find(eventItem => eventItem.organizer === user.id)
    }

    function checkForActiveChat() {
        return (
            events.find(eventItem => eventItem.started && (eventItem.organizer === user.id || eventItem.participants.indexOf(user.id) !== -1)) ?
                events.find(eventItem => eventItem.started && (eventItem.organizer === user.id || eventItem.participants.indexOf(user.id) !== -1)).id
                :
                null
        );
    }
}

const mapStateToProps = state => {
    return {
        events: state.eventsReducer.events,
        usersList: state.usersReducer.usersList,
        chat: state.eventsReducer.chat,
        onACall: state.eventsReducer.onACall
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChat: (chatID, userID) => dispatch(fetchChat(chatID, userID)),
        setChatStart: (chatID, setStarted) => dispatch(setChatStart(chatID, setStarted)),
        setStopChat: (chatID) => dispatch(setStopChat(chatID)),
        discardChat: () => dispatch(discardChat()),
        setOnACall: (value) => dispatch(setOnACall(value)),
        toggleChalkBoard: (chatID, value) => dispatch(toggleChalkBoard(chatID, value))
    }
};

export default compose(connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatWidget)));