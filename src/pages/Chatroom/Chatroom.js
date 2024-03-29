import React, { useEffect, useContext } from "react";
import Preloader from "../../components/UI/preloader";
import { fetchChat } from "../../redux/actions/eventsActions";
import { connect } from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import "../../assets/scss/base/chatroom.scss";
import { useParams } from "react-router-dom";

function Chatroom({ user, fetchChat, loading, chat, chatError }) {
  const params = useParams();
  const { translate } = useContext(siteSettingsContext);

  useEffect(() => {
    fetchChat(params.chatID, user.id, user.role, user.isManagement);
  }, []);

  return (
    <div className="chatroom">
      {_renderContainer(
        loading || (!chatError && !chat) ? (
          <Preloader />
        ) : chatError ? (
          <div className="chatroom__message-holder">
            <div className="chatroom__error">
              <span>
                <i className="fas fa-eye-slash" />
                {translate(chatError)}
              </span>
            </div>
          </div>
        ) : null,
      )}
    </div>
  );

  function _renderContainer(children) {
    if (user.role === "student") {
      return (
        <>
          <div className="content__title-holder">
            <h2 className="content__title">
              <i className="content_title-icon fa fa-video" />
              {translate("videochat")}
            </h2>
          </div>
          {children}
        </>
      );
    } else {
      if (user.role === "guest") {
        return (
          <section className="section">
            <div className="guestPage__title">
              <span>{translate("welcome")},&nbsp;</span>
              <span className="guestPage__name">{user.name}!</span>
            </div>
            {children}
          </section>
        );
      } else {
        return (
          <section className="section">
            <div className="section__title-holder">
              <h2 className="section__title">
                <i className="content_title-icon fa fa-video" />
                {translate("videochat")}
              </h2>
            </div>
            {children}
          </section>
        );
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.eventsReducer.loading,
    chat: state.eventsReducer.chat,
    events: state.eventsReducer.events,
    chatError: state.eventsReducer.chatError,
    user: state.authReducer.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchChat: (chatID, userID, userRole, userIsManagement) =>
      dispatch(fetchChat(chatID, userID, userRole, userIsManagement)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom);
