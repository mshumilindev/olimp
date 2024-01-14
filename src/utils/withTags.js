import React, { useState, useContext } from "react";
import siteSettingsContext from "../context/siteSettingsContext";

const withTags = (WrappedComponent) => {
  return function Tags(props) {
    const [selectedTags, setTags] = useState("[]");
    const { translate } = useContext(siteSettingsContext);

    filterListByTags();

    return (
      <WrappedComponent
        {...props}
        setTags={(tag) => onSetTags(tag)}
        list={filterListByTags()}
        selectedTags={_renderSelectedTags()}
      />
    );

    function _renderSelectedTags() {
      const tagsList = JSON.parse(selectedTags);

      return tagsList.length ? (
        <div className="tagsList selectedTags">
          <h2 className="selectedTags__heading">
            {translate("find_by_tags")}:
          </h2>
          {tagsList.map((tag) => (
            <span
              className="tagsList__item selectedTags__item"
              key={tag}
              onClick={() => removeTag(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null;
    }

    function filterListByTags() {
      const { list } = props;
      let newList = [];

      if (list && JSON.parse(selectedTags).length) {
        list.forEach((item) => {
          const itemTags = [];
          JSON.parse(selectedTags).forEach((tag) => {
            if (item.tags) {
              itemTags.push(item.tags.indexOf(tag) !== -1);
            } else {
              itemTags.push(false);
            }
          });
          if (itemTags.indexOf(false) === -1) {
            newList.push(item);
          }
        });
      } else {
        newList = list;
      }

      return newList;
    }

    function onSetTags(tag) {
      const newTags = JSON.parse(selectedTags);

      if (newTags.indexOf(tag) === -1) {
        newTags.push(tag);
      }

      setTags(JSON.stringify(newTags));
    }

    function removeTag(tag) {
      const newTags = JSON.parse(selectedTags);

      if (newTags.indexOf(tag) !== -1) {
        newTags.splice(newTags.indexOf(tag), newTags.indexOf(tag) + 1);
      }
      setTags(JSON.stringify(newTags));
    }
  };
};

export default withTags;
