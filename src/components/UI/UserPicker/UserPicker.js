import React, { useContext, useState, useEffect, useCallback } from "react";
import "./userPicker.scss";
import siteSettingsContext from "../../../context/siteSettingsContext";
import { connect } from "react-redux";
import withFilters from "../../../utils/withFilters";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import Modal from "../Modal/Modal";
import { orderBy } from "natural-orderby";

const filterByOptions = [
  {
    id: "filterByRole",
    placeholder: "role",
    options: ["admin", "teacher", "student", "guest"],
  },
];

function UserPicker({
  type,
  multiple,
  usersList,
  addUsers,
  selectedList,
  noneditable,
  noSearch,
  placeholder,
  classesList,
  required,
  hasErrors,
  exclude,
  excludeRole,
  filters,
  searchQuery,
  filterBy,
  selectedClass,
  setSelectedClass,
}) {
  const { translate, lang } = useContext(siteSettingsContext);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(selectedList);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    setSelectedUsers(selectedList);
  }, [selectedList, setSelectedUsers]);

  const checkForClass = useCallback(
    (newUsersList) => {
      const listToCheck = newUsersList || selectedList;

      // === Checking if at least first user of the selected users has class
      if (usersList[0].class) {
        const firstClassItem = usersList[0].class;
        const usersFromSelected = listToCheck
          .filter((userItem) =>
            usersList.find((userItem) => userItem.id === userItem),
          )
          .map((item) => usersList.find((userItem) => userItem.id === item));

        // === Checking if all the selected users have the same class
        if (
          usersFromSelected.every(
            (userItem) => userItem.class && userItem.class === firstClassItem,
          )
        ) {
          // === Checking if there are more students in the selected class
          if (
            usersList.filter((userItem) => userItem.class === firstClassItem)
              .length === usersFromSelected.length
          ) {
            setSelectedClass(firstClassItem);
            setAllSelected(true);
          } else {
            setAllSelected(false);
          }
        }
      }
    },
    [usersList, setSelectedClass, setAllSelected, selectedList],
  );

  useEffect(() => {
    if (!showUserListModal && selectedClass) {
      setSelectedClass(null);
    }
    checkForClass();
  }, [setSelectedClass, checkForClass, showUserListModal, selectedClass]);

  const chooseUser = useCallback(
    (userID) => {
      const newUsersList = Object.assign([], selectedUsers);

      if (multiple) {
        if (newUsersList.some((user) => user === userID)) {
          newUsersList.splice(
            newUsersList.indexOf(newUsersList.find((user) => user === userID)),
            1,
          );
        } else {
          newUsersList.push(userID);
        }
      } else {
        newUsersList.splice(0, newUsersList.length);
        newUsersList.push(userID);
      }

      checkForClass(newUsersList);
      setSelectedUsers(newUsersList);
    },
    [selectedUsers, multiple, checkForClass, setSelectedUsers],
  );

  const filterUsers = useCallback(() => {
    const role = filterBy.find(
      (filterItem) => filterItem.id === "filterByRole",
    ).value;

    return orderBy(
      usersList
        .filter((user) => (exclude ? exclude.indexOf(user.id) === -1 : true))
        .filter((user) => (excludeRole ? user.role !== excludeRole : true))
        .filter((user) => user.status === "active")
        .filter(
          (user) =>
            (type !== "teacher" && type !== "admin" && type !== "student") ||
            (user.role === type && user.status === "active"),
        )
        .filter((user) => {
          if (searchQuery) {
            if (user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
              return user;
            } else {
              return false;
            }
          } else {
            return user;
          }
          return user;
        })
        .filter((user) =>
          selectedClass
            ? user.role === "student" && user.class === selectedClass
            : true,
        )
        .filter((user) => (role ? user.role === role : true)),
      (v) => v.name,
    );
  }, [
    usersList,
    filterBy,
    excludeRole,
    exclude,
    searchQuery,
    selectedClass,
    type,
  ]);

  const handleChooseUser = useCallback(
    (user) => {
      if (user === "selectAll") {
        if (allSelected) {
          setSelectedUsers([]);
        } else {
          setSelectedUsers(filterUsers().map((item) => item.id));
        }
        setAllSelected(!allSelected);
      } else {
        chooseUser(user.id);
      }
    },
    [allSelected, setSelectedUsers, filterUsers, setAllSelected, chooseUser],
  );

  const _renderUser = useCallback(
    (user) => {
      const usersList = selectedUsers;

      if (!user) return null;

      return (
        <div
          className={classNames("userPicker__list-item", {
            selected:
              user === "selectAll"
                ? allSelected
                : usersList.some((item) => item === user.id),
            selectAll: user === "selectAll",
          })}
          onClick={() => handleChooseUser(user)}
          key={user.id}
        >
          {multiple ? (
            (
              user === "selectAll"
                ? allSelected
                : usersList.some((item) => item === user.id)
            ) ? (
              <i className="userPicker__list-item-check far fa-check-square selected" />
            ) : (
              <i className="userPicker__list-item-check far fa-square" />
            )
          ) : usersList.some((item) => item === user.id) ? (
            <i className="userPicker__list-item-check far fa-dot-circle selected" />
          ) : (
            <i className="userPicker__list-item-check far fa-circle" />
          )}
          {user !== "selectAll" ? (
            <div
              className="userPicker__list-item-avatar"
              style={{ backgroundImage: "url(" + user.avatar + ")" }}
            >
              {!user.avatar ? (
                <div className="userPicker__list-item-avatar-placeholder">
                  <i className="fa fa-user" />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="userPicker__list-item-name">
            {user === "selectAll" ? translate("select_all") : user.name}
          </div>
          {user.class ? (
            <div className="userPicker__list-item-class">
              <i className="content_title-icon fas fa-graduation-cap" />
              {classesList.find((item) => item.id === user.class).title[lang]
                ? classesList.find((item) => item.id === user.class).title[lang]
                : classesList.find((item) => item.id === user.class).title[
                    "ua"
                  ]}
            </div>
          ) : null}
        </div>
      );
    },
    [
      allSelected,
      classesList,
      handleChooseUser,
      lang,
      multiple,
      selectedUsers,
      translate,
    ],
  );

  const quickRemoveUser = useCallback(
    (userID) => {
      const usersList = selectedUsers;

      usersList.splice(
        usersList.indexOf(usersList.find((user) => user === userID)),
        1,
      );

      addUsers(type, usersList);
    },
    [selectedUsers, addUsers, type],
  );

  const _renderSelectedUser = useCallback(
    (userID) => {
      const user = usersList.find((item) => item.id === userID);

      return user ? (
        <div
          className={classNames(
            "userPicker__list-item selectedUserItem " + type,
            { multiple: multiple && selectedList.length > 1 },
          )}
          key={userID}
        >
          <div
            className="userPicker__list-item-avatar"
            style={{ backgroundImage: "url(" + user.avatar + ")" }}
          >
            {!user.avatar ? (
              <div className="userPicker__list-item-avatar-placeholder">
                <i className="fa fa-user" />
              </div>
            ) : null}
          </div>
          <div className="userPicker__list-item-name">
            <Link to={"/admin-users/" + user.login}>{user.name}</Link>
          </div>
          {!noneditable ? (
            <span
              className="userPicker__list-item-remove"
              onClick={() => quickRemoveUser(userID)}
            >
              <i className="fa fa-trash-alt" />
            </span>
          ) : null}
        </div>
      ) : null;
    },
    [usersList, multiple, selectedList, quickRemoveUser, noneditable, type],
  );

  const _renderSelectedList = useCallback(() => {
    return selectedList
      .filter((userItem) => usersList.find((user) => user.id === userItem))
      .sort((a, b) => {
        const aName = usersList.find((user) => user.id === a).name;
        const bName = usersList.find((user) => user.id === b).name;

        if (aName < bName) {
          return -1;
        }
        if (aName > bName) {
          return 1;
        } else {
          return 0;
        }
      })
      .map((item) => _renderSelectedUser(item));
  }, [selectedList, _renderSelectedUser, usersList]);

  const handleHideModal = useCallback(() => {
    setSelectedUsers(Object.assign([], selectedList));
    setShowUserListModal(false);
  }, [setSelectedUsers, selectedList, setShowUserListModal]);

  const onAddUsers = useCallback(
    (e) => {
      e.preventDefault();

      addUsers(type, selectedUsers);
      handleHideModal();
    },
    [addUsers, type, selectedUsers, handleHideModal],
  );

  return (
    <div className={classNames("userPicker", { hasErrors: hasErrors })}>
      <input
        type="hidden"
        value={selectedList.toString()}
        className={classNames({ required: required })}
      />
      {selectedList.length ? (
        <div className="userPicker__selectedList">
          {selectedList.length === 1 ? (
            _renderSelectedList()
          ) : (
            <Scrollbars
              autoHeight
              hideTracksWhenNotNeeded
              autoHeightMax={500}
              renderTrackVertical={(props) => (
                <div {...props} className="scrollbar__track" />
              )}
              renderView={(props) => (
                <div {...props} className="scrollbar__content" />
              )}
            >
              {_renderSelectedList()}
            </Scrollbars>
          )}
        </div>
      ) : (
        <div className="nothingFound">{translate("no_user_selected")}</div>
      )}
      {!noneditable ? (
        <div className="userPicker__add">
          <span
            className="userPicker__add-btn"
            onClick={() => setShowUserListModal(true)}
          >
            {selectedList.length ? (
              <i className="fa fa-pencil-alt" />
            ) : (
              <i className="fa fa-plus" />
            )}
            {placeholder ? (
              <span className="userPicker__placeholder">{placeholder}</span>
            ) : null}
          </span>
        </div>
      ) : null}
      {showUserListModal ? (
        <Modal
          onHideModal={handleHideModal}
          heading={translate("new") + " " + translate(type)}
        >
          {noSearch ? null : (
            <div className="userPicker__filters">{filters}</div>
          )}
          <div className="userPicker__list">
            {selectedClass && usersList && filterUsers().length
              ? _renderUser("selectAll")
              : null}
            <Scrollbars
              autoHeight
              hideTracksWhenNotNeeded
              autoHeightMax={500}
              renderTrackVertical={(props) => (
                <div {...props} className="scrollbar__track" />
              )}
              renderView={(props) => (
                <div {...props} className="scrollbar__content" />
              )}
            >
              {usersList && filterUsers().length ? (
                <>
                  {filterUsers()
                    .filter((item) => selectedList.includes(item.id))
                    .map((user) => _renderUser(user))}
                  {filterUsers()
                    .filter((item) => !selectedList.includes(item.id))
                    .map((user) => _renderUser(user))}
                </>
              ) : (
                <div className="nothingFound">{translate("nothing_found")}</div>
              )}
            </Scrollbars>
          </div>
          {filterUsers().length ? (
            <div className="userPicker__list-btn">
              <a
                href="/"
                className="btn btn_primary"
                onClick={(e) => onAddUsers(e)}
              >
                {selectedList.length ? (
                  <>
                    <i className="content_title-icon fa fa-pencil-alt" />
                    {translate("update")}
                  </>
                ) : (
                  <>
                    <i className="content_title-icon fa fa-plus" />
                    {translate("add")}
                  </>
                )}
              </a>
            </div>
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading,
    classesList: state.classesReducer.classesList,
  };
};
export default connect(mapStateToProps)(
  withFilters(UserPicker, true, null, null, filterByOptions, null, true),
);
