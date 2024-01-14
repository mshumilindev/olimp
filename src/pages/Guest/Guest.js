import React, { useContext } from "react";
import siteSettingsContext from "../../context/siteSettingsContext";
import "./guest.scss";
import { connect } from "react-redux";

function Guest({ user }) {
  const { translate } = useContext(siteSettingsContext);

  return (
    <div className="guestPage">
      <div className="guestPage__title">
        <span>{translate("welcome")},&nbsp;</span>
        <span className="guestPage__name">{user.name}!</span>
      </div>
      <div className="guestPage__content">
        {translate("guest_dashboard_message")}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
  };
};

export default connect(mapStateToProps)(Guest);
