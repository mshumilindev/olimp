import React, { memo, useCallback, useContext, useMemo, useState } from "react";
import { connect } from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import { createClass } from "../../redux/actions/classesActions";
import generator from "generate-password";
import Preloader from "../../components/UI/preloader";
import Modal from "../../components/UI/Modal/Modal";
import Form from "../../components/Form/Form";

const AdminClassesList = React.lazy(
  () => import("../../components/AdminClassesList/AdminClassesList"),
);

function AdminClasses({
  classesList,
  loading,
  searchQuery,
  filters,
  createClass,
}) {
  const { translate, lang } = useContext(siteSettingsContext);
  const initialClassFields = useMemo(() => {
    return [
      {
        type: "block",
        id: "titles",
        heading: translate("title"),
        children: [
          {
            value: "",
            id: "title_ua",
            placeholder: translate("title") + " " + translate("in_ua"),
            type: "text",
            updated: false,
            required: true,
          },
          {
            value: "",
            id: "title_ru",
            placeholder: translate("title") + " " + translate("in_ru"),
            type: "text",
            updated: false,
          },
          {
            value: "",
            id: "title_en",
            placeholder: translate("title") + " " + translate("in_en"),
            type: "text",
            updated: false,
          },
        ],
      },
      {
        type: "block",
        id: "info",
        heading: translate("description"),
        children: [
          {
            value: "",
            id: "info_ua",
            placeholder: translate("description") + " " + translate("in_ua"),
            type: "textarea",
            updated: false,
          },
          {
            value: "",
            id: "info_ru",
            placeholder: translate("description") + " " + translate("in_ru"),
            type: "textarea",
            updated: false,
          },
          {
            value: "",
            id: "info_en",
            placeholder: translate("description") + " " + translate("in_en"),
            type: "textarea",
            updated: false,
          },
        ],
      },
      {
        type: "submit",
        id: "submit_create_class",
        name: translate("create"),
      },
    ];
  }, [translate]);

  const initialNewClass = useMemo(() => {
    return {
      title: {
        ua: "",
        ru: "",
        en: "",
      },
      info: {
        ua: "",
        ru: "",
        en: "",
      },
    };
  }, []);

  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassFields, setNewClassFields] = useState(
    JSON.stringify(initialClassFields),
  );
  const [newClass, setNewClass] = useState(initialNewClass);

  const hideModal = useCallback(() => {
    setShowCreateClass(false);
    setNewClassFields(JSON.stringify(initialClassFields));
    setNewClass(initialNewClass);
  }, [
    setShowCreateClass,
    setNewClassFields,
    initialClassFields,
    setNewClass,
    initialNewClass,
  ]);

  const handleNewClassValue = useCallback(
    (fieldID, value) => {
      const tempNewClass = newClass;
      const tempNewClassFields = JSON.parse(newClassFields);

      if (fieldID.includes("title")) {
        tempNewClassFields
          .find((item) => item.id === "titles")
          .children.find((field) => field.id === fieldID).value = value;
        tempNewClassFields
          .find((item) => item.id === "titles")
          .children.find((field) => field.id === fieldID).updated =
          !!value.length;
      }
      if (fieldID.includes("info")) {
        tempNewClassFields
          .find((item) => item.id === "info")
          .children.find((field) => field.id === fieldID).value = value;
        tempNewClassFields
          .find((item) => item.id === "info")
          .children.find((field) => field.id === fieldID).updated =
          !!value.length;
      }

      setNewClassFields(JSON.stringify(tempNewClassFields));

      if (fieldID === "title_ua") {
        tempNewClass.title.ua = value;
      }
      if (fieldID === "name_ru") {
        tempNewClass.title.ru = value;
      }
      if (fieldID === "name_en") {
        tempNewClass.title.en = value;
      }

      if (fieldID === "info_ua") {
        tempNewClass.info.ua = value;
      }
      if (fieldID === "info_ru") {
        tempNewClass.info.ru = value;
      }
      if (fieldID === "info_en") {
        tempNewClass.info.en = value;
      }

      setNewClass({
        ...tempNewClass,
      });
    },
    [newClass, newClassFields, setNewClassFields, setNewClass],
  );

  const handleCreateClass = useCallback(() => {
    const newClassID = generator.generate({
      length: 16,
      strict: true,
    });
    createClass(newClassID, {
      ...newClass,
      schedule: [
        {
          title: "monday",
          lessons: [],
        },
        {
          title: "tuesday",
          lessons: [],
        },
        {
          title: "wednesday",
          lessons: [],
        },
        {
          title: "thursday",
          lessons: [],
        },
        {
          title: "friday",
          lessons: [],
        },
        {
          title: "saturday",
          lessons: [],
        },
        {
          title: "sunday",
          lessons: [],
        },
      ],
      courses: [],
    });
    hideModal();
  }, [createClass, newClass, hideModal]);

  const startCreateClass = useCallback(
    (e) => {
      e.preventDefault();

      setShowCreateClass(true);
    },
    [setShowCreateClass],
  );

  const filterClasses = useCallback(() => {
    const editedSearchQuery = searchQuery.toLowerCase();
    let newClasses = classesList;

    if (newClasses) {
      if (editedSearchQuery.trim()) {
        newClasses = classesList.filter(
          (item) =>
            item.title["ua"].toLowerCase().includes(editedSearchQuery) ||
            item.title["ru"].toLowerCase().includes(editedSearchQuery) ||
            item.title["en"].toLowerCase().includes(editedSearchQuery),
        );
      }
      return newClasses
        .sort((a, b) => {
          const aTitle = a.title[lang] || a.title["ua"];
          const bTitle = b.title[lang] || b.title["ua"];

          if (aTitle < bTitle) {
            return -1;
          } else if (aTitle > bTitle) {
            return 1;
          }
          return 0;
        })
        .sort((a, b) => {
          const aTitle = parseInt(a.title[lang]) || parseInt(a.title["ua"]);
          const bTitle = parseInt(b.title[lang]) || parseInt(b.title["ua"]);

          return aTitle - bTitle;
        });
    }
  }, [searchQuery, classesList, lang]);

  return (
    <div className="adminClasses">
      <section className="section">
        <div className="section__title-holder">
          <h2 className="section__title">
            <i className={"content_title-icon fa fa-graduation-cap"} />
            {translate("classes")}
          </h2>
          <div className="section__title-actions">
            <span>
              <a
                href="/"
                className="btn btn_primary"
                onClick={(e) => startCreateClass(e)}
              >
                <i className="content_title-icon fa fa-plus" />
                {translate("create_class")}
              </a>
            </span>
          </div>
          {loading ? <Preloader size={60} /> : null}
        </div>
        {filters}
        <AdminClassesList
          list={filterClasses(classesList)}
          loading={loading}
          searchQuery={searchQuery}
          startCreateClass={startCreateClass}
        />
      </section>
      {showCreateClass ? (
        <Modal onHideModal={hideModal}>
          <Form
            fields={JSON.parse(newClassFields)}
            heading={translate("create_class")}
            setFieldValue={handleNewClassValue}
            formAction={handleCreateClass}
            loading={loading}
          />
        </Modal>
      ) : null}
    </div>
  );
}
const mapStateToProps = (state) => ({
  classesList: state.classesReducer.classesList,
  loading: state.classesReducer.loading,
});
const mapDispatchToProps = (dispatch) => ({
  createClass: (classID, classData) =>
    dispatch(createClass(classID, classData)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withFilters(AdminClasses, true));
