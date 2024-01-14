import React, { useContext } from "react";
import moment from "moment";
import { orderBy } from "natural-orderby";
import classNames from "classnames";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";

import "../../pages/AdminChats/adminChats.scss";
import Preloader from "../UI/preloader";
import ChatListItem from "../ChatList/ChatListItem";
import siteSettingsContext from "../../context/siteSettingsContext";

function StudentChatsList({ events, loading, usersList, showTodayOnly }) {
  const { translate } = useContext(siteSettingsContext);

  return (
    <>
      {showTodayOnly ? (
        <div className="block__heading">
          <i className="content_title-icon fas fa-video" />
          {translate("chats_today")}
        </div>
      ) : null}
      {loading || !events.participant ? (
        <Preloader />
      ) : joinByDate(events.participant).length ? (
        <>
          {joinByDate(events.participant).map((block) =>
            _renderBlockByDate(block),
          )}
          {showTodayOnly && (
            <BtnHolderStyled>
              <Link to={"/chats"} className="btn btn_primary">
                Усі відеочати
              </Link>
            </BtnHolderStyled>
          )}
        </>
      ) : (
        <div className="nothingFound">{translate("no_videochats_yet")}</div>
      )}
    </>
  );

  function joinByDate(eventsArr) {
    const newEventsArr = [];

    eventsArr.forEach((event) => {
      const formattedDate = moment(event.datetime * 1000).format(
        "DD MMMM YYYY",
      );

      if (!newEventsArr.find((item) => item.formattedDate === formattedDate)) {
        newEventsArr.push({
          formattedDate: formattedDate,
          date: event.datetime,
          children: [],
        });
      }
      newEventsArr
        .find((item) => item.formattedDate === formattedDate)
        .children.push(event);
    });

    return orderBy(
      newEventsArr
        .filter((block) =>
          showTodayOnly
            ? block.formattedDate === moment().format("DD MMMM YYYY")
            : true,
        )
        .filter(
          (block) => block.date > moment(moment().format("MM DD YYYY")).unix(),
        ),
      (v) => -v.date,
    );
  }

  function _renderBlockByDate(block) {
    return (
      <div
        className={classNames("adminChats__eventsBlock", {
          isToday: block.formattedDate === moment().format("DD MMMM YYYY"),
        })}
        key={block.date}
      >
        {!showTodayOnly ? (
          <div className="adminChats__eventsBlock-date">
            {block.formattedDate}
          </div>
        ) : null}
        {orderBy(block.children, (v) => v.datetime).map((event) => (
          <ChatListItem
            key={event.id}
            event={event}
            usersList={usersList}
            noActions
            isStudent
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.eventsReducer.loading,
    events: state.eventsReducer.events,
    usersList: state.usersReducer.usersList,
  };
};

export default connect(mapStateToProps, null)(StudentChatsList);

const BtnHolderStyled = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
`;
