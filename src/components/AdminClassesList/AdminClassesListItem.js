import React, { useContext, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import siteSettingsContext from "../../context/siteSettingsContext";
import { removeClass } from "../../redux/actions/classesActions";
import classBg from "./img/classBg.png";
import TextTooltip from "../UI/TextTooltip/TextTooltip";

import Confirm from "../../components/UI/Confirm/Confirm";

function AdminClassesListItem({ item, index, removeClass, usersList, user }) {
  const { translate, lang } = useContext(siteSettingsContext);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const curator = useMemo(() => {
    return usersList?.find((user) => user.id === item.curator);
  }, []);

  const classTitleStr = useMemo(() => {
    return item.title[lang] || item.title["ua"];
  }, [item]);

  const classInfo = useMemo(() => {
    return item.info[lang] || item.info["ua"] || translate("no_description");
  }, [item]);

  const classTitle = useMemo(() => {
    let arr = classTitleStr.split(" ");
    const hasNumber = /\d/;
    const hasQuote = /["]/;

    // Checking if the first word contains number and moving it to second position
    if (
      hasNumber.test(arr[0]) &&
      arr.length > 2 &&
      arr.some((item) => hasQuote.test(item))
    ) {
      arr.splice(1, 0, arr.splice(0, 1)[0]);
    }

    // Joining every item after the second to avoid empty items
    if (arr.length > 2) {
      arr = [
        arr[0],
        arr[1],
        arr
          .splice(2, arr.length - 1)
          .join(" ")
          .trim(),
      ];
    }

    // Joining every item after the first if number is still first
    if (hasNumber.test(arr[0]) && arr.length > 1) {
      arr = [
        arr[0],
        arr
          .splice(1, arr.length - 1)
          .join(" ")
          .trim(),
      ];
    }

    // Joining all items in case there are no numbers
    if (
      !hasNumber.test(arr[0]) &&
      !hasNumber.test(arr[1]) &&
      !hasQuote.test(arr)
    ) {
      arr = [arr.join(" ")];
    }

    // Removing white space before quotes
    arr = arr.map((item) => {
      if (item.indexOf(' "')) {
        return item.replace(' "', '"');
      }
      return item;
    });

    // Adding necessary empty items
    if (arr.length === 2) {
      if (hasNumber.test(arr[0])) {
        arr.unshift("");
      } else if (hasNumber.test(arr[1])) {
        arr.push("");
      } else {
        arr.splice(1, 0, "");
      }
    } else if (arr.length === 1) {
      arr.unshift("");
      arr.unshift("");
    }

    return arr;
  }, [classTitleStr]);

  const handleRemoveClass = useCallback((e) => {
    e.preventDefault();

    setShowConfirmRemove(true);
  }, []);

  const onConfirmRemove = useCallback(() => {
    setShowConfirmRemove(false);
    removeClass(item.id);
  }, [item]);

  const getBgPosition = () => {
    return Math.random() * 100;
  };

  return (
    <AdminClassesListItemStyled>
      <AdminClassesListItemLinkStyled to={"/admin-classes/" + item.id}>
        <AdminClassesListItemLinkBGStyled
          style={{
            backgroundImage: `url(${classBg})`,
            backgroundPosition: `${getBgPosition()}% ${getBgPosition()}%`,
          }}
        />
        {!!curator?.avatar && (
          <AdminClassesListItemCurator
            style={{ backgroundImage: `url(${curator.avatar})` }}
            to={
              curator.id === user?.id
                ? `/admin-profile`
                : `/admin-users/${curator.login}`
            }
          />
        )}
        <AdminClassesListItemTitleStyled>
          {classTitle.map((item, index) => (
            <>
              <AdminClassesListItemTitleLineStyled>
                {item}
              </AdminClassesListItemTitleLineStyled>
              {index === 1 && (
                <AdminClassesListItemInfo>{classInfo}</AdminClassesListItemInfo>
              )}
            </>
          ))}
        </AdminClassesListItemTitleStyled>
        <span
          className="adminClasses__list-item-remove"
          onClick={handleRemoveClass}
        >
          <TextTooltip
            text={translate("Видалити")}
            position="left"
            children={<i className="fa fa-trash-alt" />}
          />
        </span>
      </AdminClassesListItemLinkStyled>
      {showConfirmRemove && (
        <Confirm
          message={translate("sure_to_remove_class")}
          confirmAction={onConfirmRemove}
          cancelAction={() => setShowConfirmRemove(false)}
        />
      )}
    </AdminClassesListItemStyled>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
    usersList: state.usersReducer.usersList,
  };
};

const mapDispatchToProps = (dispatch) => ({
  removeClass: (classID) => dispatch(removeClass(classID)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminClassesListItem);

const AdminClassesListItemStyled = styled.div`
  width: 250px;
  height: 400px;
  margin: 20px;
`;

const AdminClassesListItemTitleStyled = styled.h2`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  font-weight: normal;
  font-size: 18px;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  overflow: hidden;
  border-radius: 4px;
`;

const AdminClassesListItemTitleLineStyled = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: "Roboto Condensed", Arial, sans-serif;
  transition: all 0.15s linear;
  color: #333;
  box-sizing: border-box;

  &:not(:empty) {
    background: #fff;
    box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.4);
  }

  &:empty {
    background: none !important;
  }

  &:nth-child(2) {
    font-size: 80px;
    font-weight: bold;
    background: none !important;
    color: #fff;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
    box-shadow: none;
    height: 100%;
  }
`;

const AdminClassesListItemInfo = styled.div`
  text-transform: none;
  padding: 0 20px;
  font-size: 14px;
  color: #fff;
  line-height: 1.25;
  opacity: 0;
  max-height: 0;
  transition: all 0.15s linear;
`;

const AdminClassesListItemCurator = styled(Link)`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-size: cover;
  position: absolute;
  left: -10px;
  top: -10px;
  z-index: 2;
  border: 1px solid #333;
  background-position: 50% 50%;
`;

const AdminClassesListItemLinkStyled = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  border-radius: 4px;
  transition: all 0.15s linear;
  transform: scale(1);
  background-size: cover;
  background-position: 50% 50%;
  position: relative;
  background: #333;
  transform: translateZ(0);
  border: 1px solid #333;

  i {
    color: #e32929;
  }

  &:hover {
    transform: scale(1.05);

    .adminClasses__list-item-remove {
      color: #e32929 !important;
      i {
        color: #e32929 !important;
      }
    }

    i {
      color: #fff;
    }

    ${AdminClassesListItemInfo} {
      max-height: 150px;
      padding-bottom: 20px;
      opacity: 1;
    }
  }
`;

const AdminClassesListItemLinkBGStyled = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-size: 150%;
  opacity: 0.15;
  border-radius: inherit;
`;
