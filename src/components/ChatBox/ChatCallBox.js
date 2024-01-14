import React, { useContext, memo } from "react";

import ringing from "../../sounds/ringing.mp3";
import quickCallBg from "../../assets/img/quickCallBg.png";
import siteSettingsContext from "../../context/siteSettingsContext";

const ChatCallBox = ({ isOrganizer, events, chat, caller, setOnACall }) => {
  if (
    isOrganizer ||
    events.participant?.find((eventItem) => eventItem.started)?.id !== chat?.id
  ) {
    return null;
  }

  return (
    <div className="quickCall">
      <div
        className="quickCall__info"
        style={{ backgroundImage: `url(${quickCallBg})` }}
      >
        {caller ? (
          <>
            <span className="quickCall__title">{chat.name}</span>
            {caller.avatar ? (
              <span
                className="quickCall__avatar"
                style={{ backgroundImage: `url(${caller.avatar})` }}
              />
            ) : null}
            <span className="quickCall__name">{caller.name}</span>
          </>
        ) : null}
        <span
          className="btn btn__success round ringing"
          onClick={() => setOnACall(true)}
        >
          <div className="btn__before" />
          <i className="fas fa-phone" />
        </span>
      </div>
      <audio autoPlay={true} loop={true}>
        <source src={ringing} />
      </audio>
    </div>
  );
};

export default memo(ChatCallBox);
