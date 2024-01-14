import React, { useContext, useEffect, useRef, useState } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import classNames from "classnames";
import Form from "../../../Form/Form";

export default function ImageEditorTransform({ transform, setSettingsItem }) {
  const { translate } = useContext(siteSettingsContext);
  const [showDrop, setShowDrop] = useState(false);
  const $transform = useRef(null);

  useEffect(() => {
    document.addEventListener("click", closeDrop);

    return () => {
      document.removeEventListener("click", closeDrop);
    };
  }, []);

  return (
    <div className="imageEditor__transform" ref={$transform}>
      <div
        className={classNames("imageEditor__toolbar-btn", { open: showDrop })}
        onClick={() => setShowDrop(!showDrop)}
      >
        <i className="imageEditor__toolbar-btn-icon fas fa-draw-polygon" />
        <div className="imageEditor__toolbar-btn-label">
          {translate("transform")}
        </div>
      </div>
      {showDrop ? (
        <div className="imageEditor__transform-drop">
          <div className="imageEditor__transform-rotate">
            <div className="imageEditor__toolbar-heading">
              {translate("rotate")}
            </div>
            <div
              className="imageEditor__toolbar-btn"
              onClick={() =>
                setSettingsItem("transform", {
                  ...transform,
                  rotate: {
                    ...transform.rotate,
                    z: transform.rotate.z + 15,
                  },
                })
              }
            >
              <i className="imageEditor__toolbar-btn-icon fas fa-redo" />
              <div className="imageEditor__toolbar-btn-label">
                {translate("clockwise")}
              </div>
            </div>
            <div
              className="imageEditor__toolbar-btn"
              onClick={() =>
                setSettingsItem("transform", {
                  ...transform,
                  rotate: {
                    ...transform.rotate,
                    z: transform.rotate.z - 15,
                  },
                })
              }
            >
              <i className="imageEditor__toolbar-btn-icon fas fa-undo" />
              <div className="imageEditor__toolbar-btn-label">
                {translate("counter_clockwise")}
              </div>
            </div>
          </div>
          <div className="imageEditor__transform-flip">
            <div className="imageEditor__toolbar-heading">
              {translate("flip")}
            </div>
            <div
              className="imageEditor__toolbar-btn"
              onClick={() =>
                setSettingsItem("transform", {
                  ...transform,
                  rotate: {
                    ...transform.rotate,
                    y: transform.rotate.y === 0 ? 180 : 0,
                  },
                })
              }
            >
              <i className="imageEditor__toolbar-btn-icon flipV" />
              <div className="imageEditor__toolbar-btn-label">
                {translate("flip_horizontal")}
              </div>
            </div>
            <div
              className="imageEditor__toolbar-btn"
              onClick={() =>
                setSettingsItem("transform", {
                  ...transform,
                  rotate: {
                    ...transform.rotate,
                    x: transform.rotate.x === 0 ? 180 : 0,
                  },
                })
              }
            >
              <i className="imageEditor__toolbar-btn-icon flipH" />
              <div className="imageEditor__toolbar-btn-label">
                {translate("flip_vertical")}
              </div>
            </div>
          </div>
          <div className="imageEditor__transform-skew">
            <div className="imageEditor__toolbar-heading">
              {translate("skew")}
            </div>
            <div className="imageEditor__toolbar-btn">
              <div className="imageEditor__toolbar-btn-icon-holder">
                <i
                  className="substract"
                  onClick={() =>
                    setSettingsItem("transform", {
                      ...transform,
                      skew: {
                        ...transform.skew,
                        x: transform.skew.x + 10,
                      },
                    })
                  }
                >
                  -
                </i>
                <i className="imageEditor__toolbar-btn-icon skewX" />
                <i
                  className="add"
                  onClick={() =>
                    setSettingsItem("transform", {
                      ...transform,
                      skew: {
                        ...transform.skew,
                        x: transform.skew.x - 10,
                      },
                    })
                  }
                >
                  +
                </i>
              </div>
              <div className="imageEditor__toolbar-btn-label">
                {translate("skew_x")}
              </div>
            </div>
            <div className="imageEditor__toolbar-btn">
              <div className="imageEditor__toolbar-btn-icon-holder">
                <i
                  className="substract"
                  onClick={() =>
                    setSettingsItem("transform", {
                      ...transform,
                      skew: {
                        ...transform.skew,
                        y: transform.skew.y - 10,
                      },
                    })
                  }
                >
                  -
                </i>
                <i className="imageEditor__toolbar-btn-icon skewY" />
                <i
                  className="add"
                  onClick={() =>
                    setSettingsItem("transform", {
                      ...transform,
                      skew: {
                        ...transform.skew,
                        y: transform.skew.y + 10,
                      },
                    })
                  }
                >
                  +
                </i>
              </div>
              <div className="imageEditor__toolbar-btn-label">
                {translate("skew_y")}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  function closeDrop(e) {
    if (
      e.target !== $transform.current &&
      !$transform.current.contains(e.target)
    ) {
      setShowDrop(false);
    }
  }
}
