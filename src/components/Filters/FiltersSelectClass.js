import React, { useContext } from "react";
import { connect } from "react-redux";
import Form from "../Form/Form";
import { orderBy } from "natural-orderby";
import siteSettingsContext from "../../context/siteSettingsContext";

function FiltersSelectClass({ filterChanged, classesList, selectedClass }) {
  const { translate, lang } = useContext(siteSettingsContext);
  return classesList ? (
    <Form fields={getClassesFields()} setFieldValue={filterChanged} />
  ) : null;

  function getClassesFields() {
    return [
      {
        type: "select",
        hasReset: true,
        id: "selectedClass",
        value: selectedClass
          ? classesList.find((item) => item.id === selectedClass).title[lang]
            ? classesList.find((item) => item.id === selectedClass).title[lang]
            : classesList.find((item) => item.id === selectedClass).title["ua"]
          : "",
        placeholder: translate("classes"),
        options: orderBy(
          classesList.map((item) => {
            return {
              id: item.id,
              title: item.title[lang] ? item.title[lang] : item.title["ua"],
            };
          }),
          (v) => v.title,
        ),
      },
    ];
  }
}

const mapStateToProps = (state) => {
  return {
    classesList: state.classesReducer.classesList,
  };
};

export default connect(mapStateToProps)(FiltersSelectClass);
