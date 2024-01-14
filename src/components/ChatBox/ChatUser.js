import React, { memo } from "react";
import classNames from "classnames";

const ChatUser = ({ currentUser, isOrganizer, usersPresent, getUser }) => {
  const gottenUser = getUser(currentUser);

  if (!gottenUser) {
    return null;
  }

  return (
    <div
      className={classNames("chatroom__user", {
        isOrganizer: isOrganizer,
        isPresent: usersPresent.find(
          (usersPresentItem) => usersPresentItem.name === gottenUser.name,
        ),
      })}
      key={currentUser}
      data-user-id={
        usersPresent.find(
          (userPresentItem) => userPresentItem.name === gottenUser.name,
        )
          ? usersPresent.find(
              (userPresentItem) => userPresentItem.name === gottenUser.name,
            ).id
          : currentUser
      }
    >
      <div className="chatroom__user-avatar-holder">
        <i className="chatroom__user-avatar-placeholder fa fa-user" />
        <div
          className="chatroom__user-avatar"
          style={{ backgroundImage: "url(" + gottenUser.avatar + ")" }}
        />
      </div>
      <div className="chatroom__user-name">{gottenUser.name} </div>
    </div>
  );
};

export default memo(ChatUser);
