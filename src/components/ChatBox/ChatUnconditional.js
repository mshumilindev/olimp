import React, { useMemo, useCallback, memo } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import ChalkBoard from "../UI/ChalkBoard/ChalkBoard";
import ChatUser from "./ChatUser";

const ChatUnconditional = ({
  chat,
  currentChatOrganizer,
  usersPresent,
  usersList,
}) => {
  const participantsArr = useMemo(() => {
    if (typeof chat.participants === "object") {
      return chat.participants;
    }
    return [chat.participants];
  }, [chat]);

  const getUser = useCallback(
    (userToGet) => {
      return usersList.find((userItem) => userItem.id === userToGet);
    },
    [usersList],
  );

  return (
    <div className="chatroom__users">
      {/*<Scrollbars
  autoHeight
  hideTracksWhenNotNeeded
  autoHeightMax={'100%'}
  renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
  renderView={props => <div {...props} className="scrollbar__content"/>}
  >
  <ChatUser
  currentUser={chat.organizer}
  isOrganizer
  usersPresent={usersPresent}
  getUser={getUser}
  />
  { participantsArr.filter(userItem => usersPresent.find(usersPresentItem => getUser(userItem) && usersPresentItem.name === getUser(userItem).name)).map(userItem => <ChatUser key={userItem} currentUser={userItem} usersPresent={usersPresent} getUser={getUser} />) }
  <hr/>
  { participantsArr.filter(userItem => !usersPresent.find(usersPresentItem => getUser(userItem) && usersPresentItem.name === getUser(userItem).name)).map(userItem => <ChatUser key={userItem} currentUser={userItem} usersPresent={usersPresent} getUser={getUser} />) }
  </Scrollbars>
  */}
      {chat.chalkBoardOpen ? (
        <ChalkBoard currentChatOrganizer={currentChatOrganizer} chat={chat} />
      ) : null}
    </div>
  );
};

export default memo(ChatUnconditional);
