import React, { useContext, useState, useEffect, useRef } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function SeamlessEditorGoogleExcel({ block, setBlock }) {
  const { translate } = useContext(siteSettingsContext);
  const [size, setSize] = useState({ width: 0, height: 0 });
  block.value = block.value || "";

  const wordContainerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const width =
        wordContainerRef.current.offsetWidth -
        parseInt(getComputedStyle(wordContainerRef.current).paddingLeft);

      setSize({
        width: width,
        height: (width * 56.25) / 100 + 23,
      });
    }, 0);
  }, []);

  return (
    <div className="seamlessEditor__editor-block-excel" ref={wordContainerRef}>
      <form className="form">
        <div className="form__row">
          <input
            type="text"
            className="form__field"
            value={block.value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={translate("enter_word_url")}
          />
        </div>
      </form>
      <br />
      {block.value && size.width > 0 ? (
        <div className="seamlessEditor__editor-block-excel-holder">
          <iframe
            src={getExcelURL(block.value)}
            style={{ width: "100%", height: (size.width * 141) / 100 }}
            frameBorder="0"
            allowFullScreen={true}
            mozAllowFullScreen={true}
            webkitAllowFullscreen={true}
          />
        </div>
      ) : (
        <div className="seamlessEditor__editor-block-placeholder">
          {translate("excel_will_be_here")}
        </div>
      )}
    </div>
  );

  function getExcelURL(url) {
    let newURL = url;

    if (newURL.length) {
      newURL = newURL +=
        "?embedded=true&widget=false&headers=false&chrome=false";
    }

    return newURL;
  }

  function handleChange(value) {
    setBlock({
      ...block,
      value: value,
    });
  }
}
