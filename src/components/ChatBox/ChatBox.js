import React, { memo } from "react";
import classNames from "classnames";
import { FullScreen } from "react-full-screen";

import dialing from "../../sounds/dialing.mp3";

import ChatInfo from "./ChatInfo";
import ChalkBoard from "../UI/ChalkBoard/ChalkBoard";
import ChatContainer from "./ChatContainer";
import ChatLesson from "./ChatLesson";
import ChatStartedActions from "./ChatStartedActions";
import ChatUnconditional from "./ChatUnconditional";

const ChatBox = (props) => {
  const {
    isChatPage,
    isOrganizer,
    isParticipant,
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
    currentChat,
    currentChatOrganizer,
    apiRef,
    setApiRef,
    raiseHand,
    setRaiseHand,
  } = props;

  return (
    <div
      className={classNames("chatroom__box", {
        fixed: !isChatPage,
        isOrganizer: isOrganizer,
        isHidden: isHidden,
        noOpacity: chat.chalkBoardOpen,
      })}
      style={chat.chalkBoardOpen ? { zIndex: 100 } : null}
    >
      <FullScreen
        enabled={isFullScreen}
        onChange={(isFull) => setIsFullScreen(isFull)}
      >
        <div
          className={classNames("chatroom__chatHolder", {
            isFullscreen: isFullScreen,
          })}
        >
          <ChatInfo chat={chat} />
          {chat.chalkBoardOpen ? (
            <ChalkBoard currentChatOrganizer={isOrganizer} chat={chat} />
          ) : null}
          {user.role !== "student" && user.role !== "guest" ? (
            <ChatUnconditional
              chat={chat}
              currentChatOrganizer={isOrganizer}
              usersPresent={usersPresent}
              usersList={usersList}
            />
          ) : null}
          {chat.lessonOpen && chatLesson && chatLesson.content.length ? (
            <ChatLesson
              isOrganizer={currentChatOrganizer}
              handleBlockClick={handleBlockClick}
              chatLesson={chatLesson}
              chat={chat}
            />
          ) : null}
          <ChatContainer
            chat={chat}
            usersList={usersList}
            setIsFullScreen={setIsFullScreen}
            setIsHidden={setIsHidden}
            muteChat={muteChat}
            shareScreen={shareScreen}
            setShareScreen={setShareScreen}
            isStopping={isStopping}
            setUsersLength={setUsersLength}
            onDisplayNameChange={onDisplayNameChange}
            noVideo={!isOrganizer && !isParticipant && canViewByRole}
            setApiRef={setApiRef}
          />
          <ChatStartedActions
            isOrganizer={isOrganizer}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            muteChat={muteChat}
            setMuteChat={setMuteChat}
            user={user}
            chat={chat}
            shareScreen={shareScreen}
            handleShareScreen={handleShareScreen}
            handleOpenLesson={handleOpenLesson}
            handleChalkBoard={handleChalkBoard}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
            isChatPage={isChatPage}
            isHidden={isHidden}
            setIsHidden={setIsHidden}
            stopChat={stopChat}
            currentChatOrganizer={isOrganizer}
            raiseHand={raiseHand}
            setRaiseHand={setRaiseHand}
            apiRef={apiRef}
          />
        </div>
      </FullScreen>
      {usersLength < 2 && isOrganizer ? (
        <audio autoPlay={true} loop={true}>
          <source src={dialing} />
        </audio>
      ) : null}
    </div>
  );
};

export default memo(ChatBox);
