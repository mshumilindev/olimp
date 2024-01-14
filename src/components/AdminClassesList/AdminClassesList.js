import React, { useContext, useMemo } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import siteSettingsContext from "../../context/siteSettingsContext";
import withData from "../../utils/withData";
import Preloader from "../UI/preloader";
import "./adminClassesList.scss";
import AdminClassesListItem from "./AdminClassesListItem";

const AdminClassesList = ({
  list,
  loading,
  searchQuery,
  startCreateClass,
  totalItems,
  user,
}) => {
  const { translate } = useContext(siteSettingsContext);

  const myList = useMemo(() => {
    return list?.filter((item) => item.curator === user.id);
  }, [list]);

  const otherList = useMemo(() => {
    return list?.filter((item) => item.curator !== user.id);
  }, [list]);

  return (
    <div className="widget">
      {totalItems}
      {list && list.length ? (
        <div className="adminClasses__list grid">
          {!!myList?.length && (
            <>
              {!!otherList?.length && (
                <AdminClassesListTitleStyled>
                  Мої класи
                </AdminClassesListTitleStyled>
              )}
              {myList.map((item, index) => (
                <AdminClassesListItem item={item} key={item.id} index={index} />
              ))}
            </>
          )}
          {!!otherList?.length && (
            <>
              {!!myList?.length && (
                <AdminClassesListTitleStyled>
                  Інші класи
                </AdminClassesListTitleStyled>
              )}
              {otherList.map((item, index) => (
                <AdminClassesListItem item={item} key={item.id} index={index} />
              ))}
            </>
          )}
        </div>
      ) : !loading ? (
        searchQuery ? (
          <div className="nothingFound">{translate("nothing_found")}</div>
        ) : (
          <div className="nothingFound">
            <a
              href="/"
              className="btn btn_primary"
              onClick={(e) => startCreateClass(e)}
            >
              <i className="content_title-icon fa fa-plus" />
              {translate("create_class")}
            </a>
          </div>
        )
      ) : null}
      {loading ? <Preloader /> : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
  };
};

export default connect(mapStateToProps)(withData(AdminClassesList));

const AdminClassesListTitleStyled = styled.h3`
  font-family: "Roboto Condensed", Arial, sans-serif;
  font-weight: bold;
  padding: 20px 20px 0;
  width: 100%;
  text-transform: uppercase;

  &:first-child {
    padding-top: 0;
  }
`;
