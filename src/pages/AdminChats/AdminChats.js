import React, { useCallback, useContext, useMemo, useState } from "react";
import SiteSettingsContext from "../../context/siteSettingsContext";
import { connect } from "react-redux";
import ChatList from "../../components/ChatList/ChatList";
import "./adminChats.scss";
import Modal from "../../components/UI/Modal/Modal";
import Form from "../../components/Form/Form";
import { generate } from "generate-password";
import {
  updateEvent,
  deleteMultipleEvents,
} from "../../redux/actions/eventsActions";
import moment from "moment";
import Preloader from "../../components/UI/preloader";
import Confirm from "../../components/UI/Confirm/Confirm";

function AdminChats({
  user,
  loading,
  events,
  usersList,
  updateEvent,
  deleteMultipleEvents,
}) {
  const { translate } = useContext(SiteSettingsContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const initialFormFields = useMemo(() => {
    return [
      {
        type: "block",
        id: "info",
        heading: translate("info"),
        children: [
          {
            type: "text",
            placeholder: translate("videochat_name"),
            value: "",
            id: "name",
            required: true,
          },
          {
            type: "datepicker",
            value: moment().unix(),
            id: "datepicker",
            time: true,
            required: true,
          },
        ],
      },
      {
        type: "block",
        heading: translate("organizer"),
        id: "block_organizer",
        children: [
          {
            type: "userPicker",
            value: user.id,
            id: "organizer",
            placeholder: translate("organizator"),
            noneditable: true,
            required: true,
          },
        ],
      },
      {
        type: "block",
        heading: translate("participants"),
        id: "block_participants",
        children: [
          {
            type: "userPicker",
            value: [],
            id: "participant",
            placeholder: translate("participant"),
            multiple: true,
            required: true,
            exclude: [user.id],
          },
        ],
      },
      {
        type: "block",
        heading: translate("lesson"),
        id: "lesson",
        children: [
          {
            type: "lessonPicker",
            value: {},
            id: "lessonPicker",
          },
        ],
      },
      {
        id: "submit",
        type: "submit",
        name: translate("save"),
      },
    ];
  }, [translate, user.id]);

  const [showEditModal, setShowEditModal] = useState(null);
  const [formFields, setFormFields] = useState(
    Object.assign([], initialFormFields),
  );

  const mapEventToFormFields = useCallback(
    (event) => {
      const newFormFields = Object.assign([], initialFormFields);

      newFormFields.find(
        (item) => item.id === "block_organizer",
      ).children[0].value = event.organizer;
      newFormFields.find(
        (item) => item.id === "block_participants",
      ).children[0].value = event.participants;
      newFormFields.find((item) => item.id === "lesson").children[0].value =
        event.lesson;
      newFormFields
        .find((item) => item.id === "info")
        .children.find((item) => item.id === "name").value = event.name;
      newFormFields
        .find((item) => item.id === "info")
        .children.find((item) => item.id === "datepicker").value =
        event.datetime;
      setFormFields(Object.assign([], newFormFields));
      setShowEditModal(event);
    },
    [initialFormFields, setFormFields, setShowEditModal],
  );

  const handleHideModal = useCallback(() => {
    setShowEditModal(null);
    setFormFields(Object.assign([], initialFormFields));
  }, [setShowEditModal, setFormFields, initialFormFields]);

  const setFieldValue = useCallback(
    (fieldID, value) => {
      const newFields = formFields;

      if (fieldID === "participant") {
        newFields.find(
          (item) => item.id === "block_participants",
        ).children[0].value = value;
      }
      if (
        fieldID === "name" ||
        fieldID === "recurring" ||
        fieldID === "datepicker"
      ) {
        newFields
          .find((item) => item.id === "info")
          .children.find((item) => item.id === fieldID).value = value;
      }
      if (fieldID === "lessonPicker") {
        newFields
          .find((item) => item.id === "lesson")
          .children.find((item) => item.id === fieldID).value = value;
      }

      setFormFields(Object.assign([], newFields));
    },
    [setFormFields, formFields],
  );

  const onUpdateEvent = useCallback(() => {
    let newEvent = {};

    const organizerField = formFields.find(
      (item) => item.id === "block_organizer",
    ).children[0];
    const participantsField = formFields.find(
      (item) => item.id === "block_participants",
    ).children[0];

    if (!showEditModal.id) {
      newEvent.id = generate({
        length: 20,
        numbers: true,
      });
    } else {
      newEvent.id = showEditModal.id;
    }
    newEvent.organizer = organizerField.value;
    newEvent.participants =
      typeof participantsField.value === "object"
        ? participantsField.value
        : [participantsField.value];
    if (formFields.find((item) => item.id === "lesson").children[0].value) {
      newEvent.lesson = formFields.find(
        (item) => item.id === "lesson",
      ).children[0].value;
    }
    newEvent.name = formFields
      .find((item) => item.id === "info")
      .children.find((item) => item.id === "name").value;
    newEvent.datetime = formFields
      .find((item) => item.id === "info")
      .children.find((item) => item.id === "datepicker").value;

    updateEvent(newEvent.id, newEvent);
    setFormFields(Object.assign([], initialFormFields));
    setShowEditModal(false);
  }, [
    formFields,
    updateEvent,
    setFormFields,
    setShowEditModal,
    initialFormFields,
    showEditModal,
  ]);

  return (
    <section className="section">
      <div className="section__title-holder">
        <h2 className="section__title">
          <i className="content_title-icon fa fa-video" />
          {translate("videochats")}
        </h2>
        <div className="section__title-actions">
          {events?.all?.length &&
            (user.role === "admin" ||
              (!!user?.isManagement && user?.isManagement !== "teacher")) && (
              <span
                className="btn btn__error"
                onClick={() => setShowConfirm(true)}
              >
                <i className="content_title-icon fa fa-trash" />
                Видалити всі відеочати
              </span>
            )}
          <span
            className="btn btn_primary"
            onClick={() => setShowEditModal({})}
          >
            <i className="content_title-icon fa fa-plus" />
            {translate("create_videochat")}
          </span>
        </div>
      </div>
      {events.all || events.organizer || events.participant ? (
        user.role === "admin" ? (
          <ChatList
            events={events.all}
            usersList={usersList}
            loading={loading}
            mapEventToFormFields={mapEventToFormFields}
            heading={translate("videochats")}
          />
        ) : (
          <div className="grid">
            {events.organizer ? (
              <div className="grid_col col-12 desktop-col-6">
                <ChatList
                  events={events.organizer}
                  usersList={usersList}
                  loading={loading}
                  mapEventToFormFields={mapEventToFormFields}
                  heading={translate("organizer")}
                />
              </div>
            ) : null}
            {events.participant ? (
              <div className="grid_col col-12 desktop-col-6">
                <ChatList
                  events={events.participant}
                  usersList={usersList}
                  loading={loading}
                  mapEventToFormFields={mapEventToFormFields}
                  heading={translate("participant")}
                />
              </div>
            ) : null}
            {!!user?.isManagement && user?.isManagement !== "teacher" && (
              <div className="grid_col col-12">
                <ChatList
                  events={events.all}
                  usersList={usersList}
                  loading={loading}
                  mapEventToFormFields={mapEventToFormFields}
                  heading={translate("other_videochats")}
                />
              </div>
            )}
          </div>
        )
      ) : (
        <div className="grid">
          <div className="grid_col col-12">
            <Preloader />
          </div>
        </div>
      )}
      {showEditModal ? (
        <Modal
          onHideModal={handleHideModal}
          children={
            <Form
              setFieldValue={setFieldValue}
              fields={formFields}
              formAction={onUpdateEvent}
              heading={
                showEditModal.id
                  ? translate("edit_videochat")
                  : translate("create_videochat")
              }
            />
          }
        />
      ) : null}
      {showConfirm && (
        <Confirm
          message="Ви впевнені, що хочете видалити всі чати?"
          confirmAction={() => {
            deleteMultipleEvents();
            setShowConfirm(false);
          }}
          cancelAction={() => setShowConfirm(false)}
        />
      )}
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.eventsReducer.loading,
    events: state.eventsReducer.events,
    usersList: state.usersReducer.usersList,
    user: state.authReducer.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (eventID, newEvent) =>
      dispatch(updateEvent(eventID, newEvent)),
    deleteMultipleEvents: () => dispatch(deleteMultipleEvents()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminChats);
