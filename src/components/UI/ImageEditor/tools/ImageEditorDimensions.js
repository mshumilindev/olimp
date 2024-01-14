import React, { useContext, useEffect, useRef, useState } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import classNames from "classnames";
import Form from "../../../Form/Form";

export default function ImageEditorDimensions({
  originalDimensions,
  dimensions,
  setSettingsItem,
}) {
  const { translate } = useContext(siteSettingsContext);
  const [showDrop, setShowDrop] = useState(false);
  const $dimensions = useRef(null);
  const availableDimensions = [
    {
      width: 16,
      height: 9,
    },
    {
      width: 6,
      height: 4,
    },
    {
      width: 4,
      height: 3,
    },
    {
      width: 1,
      height: 1,
    },
    {
      width: 3,
      height: 4,
    },
    {
      width: 4,
      height: 6,
    },
    {
      width: 9,
      height: 16,
    },
    {
      label: "A4",
      width: 210,
      height: 297,
    },
  ];
  const formFields = [
    {
      type: "text",
      id: "width",
      value: dimensions ? dimensions.width : "",
      placeholder: translate("width"),
    },
    {
      type: "text",
      id: "height",
      value: dimensions ? dimensions.height : "",
      placeholder: translate("height"),
    },
  ];

  useEffect(() => {
    document.addEventListener("click", closeDrop);

    return () => {
      document.removeEventListener("click", closeDrop);
    };
  }, []);

  return (
    <div className="imageEditor__dimensions" ref={$dimensions}>
      <div
        className={classNames("imageEditor__toolbar-btn", { open: showDrop })}
        onClick={() => setShowDrop(!showDrop)}
      >
        <i className="imageEditor__toolbar-btn-icon fas fa-vector-square" />
        <div className="imageEditor__toolbar-btn-label">
          {translate("dimensions")}
        </div>
      </div>
      {showDrop ? (
        <div className="imageEditor__dimensions-drop">
          <Form
            fields={formFields}
            setFieldValue={(fieldID, value) =>
              setSettingsItem("dimensions", { ...dimensions, [fieldID]: value })
            }
          />
          <div className="imageEditor__dimensions-list">
            {originalDimensions
              ? _renderDimension({
                  ...originalDimensions,
                  label: "original_dimensions",
                })
              : null}
            {availableDimensions.map((item) => _renderDimension(item))}
          </div>
        </div>
      ) : null}
    </div>
  );

  function _renderDimension(item) {
    return (
      <div
        className={classNames("imageEditor__toolbar-btn", {
          active:
            dimensions.width / dimensions.height === item.width / item.height,
        })}
        onClick={() =>
          setSettingsItem("dimensions", {
            width: item.width,
            height: item.height,
          })
        }
      >
        <i
          className="imageEditor__toolbar-btn-icon customIcon dimensionsIcon"
          style={{ width: 20, height: (item.height * 20) / item.width }}
        />
        <div className="imageEditor__toolbar-btn-label">
          {item.label ? item.label : item.width + " x " + item.height}
        </div>
      </div>
    );
  }

  function closeDrop(e) {
    if (
      e.target !== $dimensions.current &&
      !$dimensions.current.contains(e.target)
    ) {
      setShowDrop(false);
    }
  }
}
