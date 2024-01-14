import { useState, useMemo, useEffect } from 'react';

import { getChatID } from '../utils/getChatID';

export const useChatWidget = ({user, location, history, events, usersList, fetchChat, chat, setChatStart, setStopChat, discardChat, onACall, setOnACall, toggleChalkBoard, toggleLesson}) => {
  const [ muteChat, setMuteChat ] = useState(true);
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ isHidden, setIsHidden ] = useState(false);
  const [ isChatPage, setIsChatPage ] = useState(false);
  const [ caller, setCaller ] = useState(null);
  const [ shareScreen, setShareScreen ] = useState(false);
  const [ isStopping, setIsStopping ] = useState(false);
  const [ usersLength, setUsersLength ] = useState(1);
  const [ usersPresent, setUsersPresent ] = useState([]);
  const [ chatLesson, setChatLesson ] = useState(null);
  const [ isRecording, setIsRecording ] = useState(false);
  const [ chatVideo, setChatVideo ] = useState(null);
  const [ raiseHand, setRaiseHand ] = useState(false);
  const [apiRef, setApiRef] = useState(null);

  const currentChatPage = useMemo(() => {
    if ( location.pathname.startsWith('/chat/') ) {
      return location.pathname.replace('/chat/', '');
    }
    return null;
  }, [location]);

  const currentChat = useMemo(() => {
    return events?.all?.find((event) => event.id === currentChatPage);
  }, [events, currentChatPage]);

  const isOrganizer = useMemo(() => {
    return chat?.organizer === user?.id;
  }, [chat, user]);

  const isParticipant = useMemo(() => {
    return events?.participant?.find(eventItem => eventItem.started)?.id === chat?.id;
  }, [events, chat]);

  const currentChatOrganizer = useMemo(() => {
    return currentChat?.organizer === user?.id;
  }, [user, currentChat]);

  const currentChatParticipant = useMemo(() => {
    return !!events?.participant?.find(eventItem => eventItem.started)?.id && currentChatPage && events?.participant?.find(eventItem => eventItem.started)?.id === currentChatPage;
  }, [events, currentChatPage]);

  useEffect(() => {
    if ( apiRef ) {
      apiRef.isAudioMuted().then(data => {
        if ( muteChat !== data ) {
          apiRef.executeCommand('toggleAudio')
        }
      });
    }
  }, [muteChat, apiRef]);

  const hasToParticipate = useMemo(() => {
    return isOrganizer || isParticipant
  }, [isOrganizer, isParticipant]);

  const canViewByRole = useMemo(() => {
    return user.isManagement && user.isManagement !== 'teacher'
  }, [user]);

  const hasActiveChat = useMemo(() => {
    return events?.organizer?.find(eventItem => eventItem.started)?.id || events?.participant?.find(eventItem => eventItem.started)?.id || null;
  }, [events])

  useEffect(() => {
    if ( !currentChatOrganizer && !currentChatParticipant && canViewByRole ) {
      if ( !onACall && chat?.id === currentChatPage && chat?.started && chat?.id === currentChatPage ) {
        setOnACall(true);
        return
      }
      if ( onACall && chat?.id !== currentChatPage && !hasToParticipate ) {
        setOnACall(false);
        return
      }
    }
  }, [onACall, currentChatOrganizer, currentChatParticipant, canViewByRole, setOnACall, chat, currentChatPage, hasToParticipate]);

  useEffect(() => {
    if ( chatVideo ) {
      const link = document.createElement('a');

      link.id = 'recordLink';
      link.href = chatVideo;
      link.download = chat?.name;

      document.querySelector('body').appendChild(link);
      document.getElementById('recordLink').click();
      document.getElementById('recordLink').remove();
      setChatVideo(null);
    }
  }, [chatVideo, chat]);

  useEffect(() => {
    if ( user?.role === 'guest' ) {
      if ( onACall ) {
        history.push('/chat/' + chat?.id);
      }
      else {
        history.push('/guest');
      }
    }
  }, [onACall, chat, user, history]);

  useEffect(() => {
    setIsChatPage(!!getChatID(location));
  }, [location]);

  useEffect(() => {
    if ( isFullScreen || isChatPage ) {
      setIsHidden(false);
    }
  }, [isFullScreen, isChatPage]);

  useEffect(() => {
    if ( chat?.organizer === user?.id ) {
      setOnACall(true);
    }
    if ( onACall && !chat?.started ) {
      setOnACall(false);
    }
  }, [chat, user, setOnACall]);

  useEffect(() => {
    if ( events ) {
      if ( getChatID(location) ) {
        fetchChat(getChatID(location), user.id, user.role, user.isManagement);
      }
      if ( hasActiveChat ) {
        fetchChat(hasActiveChat, user.id, user.role, user.isManagement);
      }
      if ( !hasActiveChat && !getChatID(location) ) {
        discardChat();
      }
    }
  }, [events, location, hasActiveChat, user, discardChat, fetchChat]);

  useEffect(() => {
    if ( chat?.started && usersList ) {
      setCaller(usersList.find(item => item.id === chat.organizer));
    }
  }, [chat, usersList]);

  return {
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
    setIsChatPage,
    caller,
    setCaller,
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
    chatVideo,
    setChatVideo,
    hasToParticipate,
    currentChatOrganizer,
    chat: currentChat || chat,
    apiRef,
    setApiRef,
    raiseHand,
    setRaiseHand
  }
}
