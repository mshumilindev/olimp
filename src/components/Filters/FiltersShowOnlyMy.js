import React, { useContext } from "react";
import Form from "../Form/Form";
import SiteSettingsContext from "../../context/siteSettingsContext";
import { connect } from "react-redux";

function FiltersShowOnlyMy({ user, showOnlyMyChecked, filterChanged }) {
  const { translate } = useContext(SiteSettingsContext);

  const showOnlyMyFields = [
    {
      type: "checkbox",
      label: translate("show_only_my"),
      checked: showOnlyMyChecked,
      value: true,
      id: "showOnlyMy",
    },
  ];

  return user.role !== "admin" ? (
    <Form fields={showOnlyMyFields} setFieldValue={filterChanged} />
  ) : null;
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
  };
};

export default connect(mapStateToProps)(FiltersShowOnlyMy);
