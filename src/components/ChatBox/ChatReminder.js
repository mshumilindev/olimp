import React, { memo, useMemo, useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import moment from "moment";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { useGlobalNotificationContext } from "../UI/GlobalNotifications/context";

const ChatReminder = ({ events, location }) => {
  const [todayChats, setTodayChats] = useState(null);
  const [timeToChat, setTimeToChat] = useState(null);
  const [closedReminder, setClosedReminder] = useState(null);
  const { addNotification, removeNotification } =
    useGlobalNotificationContext();

  const chatsArr = useMemo(() => {
    return [
      ...(events?.organizer || []),
      ...(events?.participant || []),
    ].filter((item, i, self) => i === self.findIndex((t) => t.id === item.id));
  }, [events]);

  const handleSetTodayChats = useCallback((arr) => {
    const todayStart = moment().startOf("day").unix();
    const todayEnd = moment().endOf("day").unix();

    setTodayChats(
      arr.filter(
        (item) => item.datetime >= todayStart && item.datetime <= todayEnd,
      ),
    );
  }, []);

  const handleSetTimeToChat = useCallback(
    (arr) => {
      const timeNow = moment().unix();
      const closestChat = arr?.find((item) => timeNow < item.datetime);

      if (!closestChat?.datetime) {
        if (timeToChat !== null) {
          setTimeToChat(null);
        }
        return;
      }

      if (closestChat.id !== closedReminder) {
        if (closedReminder !== null) {
          setClosedReminder(null);
        }
      }

      const countdown = Math.ceil((closestChat.datetime - timeNow) / 60);

      if (
        timeToChat?.chatID !== closestChat.id ||
        timeToChat?.countdown !== countdown
      ) {
        setTimeToChat({
          chatID: closestChat.id,
          chatName: closestChat.name,
          countdown: countdown,
        });
      }
    },
    [closedReminder, timeToChat],
  );

  const handleCloseReminder = useCallback(() => {
    setClosedReminder(timeToChat?.chatID);
  }, [timeToChat]);

  useEffect(() => {
    handleSetTodayChats(chatsArr);

    const interval = setInterval(
      () => {
        handleSetTodayChats(chatsArr);
      },
      1000 * 60 * 60,
    );

    return () => clearInterval(interval);
  }, [chatsArr, handleSetTodayChats]);

  useEffect(() => {
    handleSetTimeToChat(todayChats);

    const interval = setInterval(() => {
      handleSetTimeToChat(todayChats);
    }, 1000 * 10);

    return () => clearInterval(interval);
  }, [todayChats, handleSetTimeToChat]);

  const getMinutesText = (time) => {
    const timeStr = `${time}`;

    if ((timeStr.endsWith("1") && time > 20) || time === 1) {
      return "хвилину";
    }

    if (
      (time < 10 || time > 20) &&
      (timeStr.endsWith("2") || timeStr.endsWith("3") || timeStr.endsWith("4"))
    ) {
      return "хвилини";
    }

    return "хвилин";
  };

  const showReminder = useMemo(() => {
    return !!timeToChat && !closedReminder && timeToChat.countdown <= 15;
  }, [timeToChat, closedReminder]);

  useEffect(() => {
    if (showReminder) {
      addNotification([
        {
          id: "chatNotification",
          text: (
            <>
              Відеочат{" "}
              <LinkStyled to={`/chat/${timeToChat?.chatID}`}>
                {timeToChat?.chatName}
              </LinkStyled>{" "}
              розпочнеться за {timeToChat?.countdown}{" "}
              {getMinutesText(timeToChat?.countdown)}
            </>
          ),
          icon: "fas fa-video",
          onClose: handleCloseReminder,
        },
      ]);
    } else {
      removeNotification("chatNotification");
    }
  }, [showReminder]);

  return null;
};

const mapStateToProps = (state) => {
  return {
    events: state.eventsReducer.events,
    usersList: state.usersReducer.usersList,
    chat: state.eventsReducer.chat,
    onACall: state.eventsReducer.onACall,
    user: state.authReducer.currentUser,
  };
};

export default compose(connect(mapStateToProps, null)(memo(ChatReminder)));

const LinkStyled = styled(Link)`
  color: #fff;
  text-decoration: underline;
`;
