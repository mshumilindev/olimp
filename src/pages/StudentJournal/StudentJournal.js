import React, { useContext } from "react";
import { connect } from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import Notifications from "../../components/Notifications/Notifications";
import Preloader from "../../components/UI/preloader";
import Journal from "../../components/Journal/Journal";

const StudentJournal = ({ user, loading }) => {
  const { translate } = useContext(siteSettingsContext);

  return (
    <>
      <div className="content__title-holder">
        <h2 className="content__title">
          <i className="content_title-icon fa fa-user-check" />
          {translate("attendance")}
        </h2>
      </div>
      <Notifications />
      {user && !loading ? (
        <Journal attendance={user.attendance} user={user} />
      ) : (
        <Preloader />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  loading: state.authReducer.loading,
  user: state.authReducer.currentUser,
});

export default connect(mapStateToProps)(StudentJournal);
