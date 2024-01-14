import React, { useContext } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function SeamlessEditorAudio({ block, setBlock }) {
  const { translate } = useContext(siteSettingsContext);
  block.value = block.value || {
    caption: "",
    url: "",
  };

  return (
    <div className="seamlessEditor__editor-block-audio">
      <form className="form">
        <div className="form__row">
          <input
            type="text"
            className="form__field"
            value={block.value.caption}
            onChange={(e) => handleChange("caption", e.target.value)}
            placeholder={translate("enter_audio_caption")}
          />
        </div>
        <div className="form__row">
          <input
            type="text"
            className="form__field"
            value={block.value.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder={translate("enter_audio_url")}
          />
        </div>
      </form>
      <br />
      {block.value.url ? (
        <audio controls>
          <source src={getPlayLink(block.value.url)} />
        </audio>
      ) : (
        <div className="seamlessEditor__editor-block-placeholder">
          {translate("audio_will_be_here")}
        </div>
      )}
    </div>
  );

  function getPlayLink(url) {
    let newURL = url;

    if (newURL.indexOf("https://drive.google.com/file/d/") !== -1) {
      newURL = newURL.replace("https://drive.google.com/file/d/", "");
    }
    if (newURL.indexOf("https://drive.google.com/open?id=") !== -1) {
      newURL = newURL.replace("https://drive.google.com/open?id=", "");
    }
    if (newURL.indexOf("/view?usp=sharing") !== -1) {
      newURL = newURL.replace("/view?usp=sharing", "");
    }

    if (newURL.length) {
      newURL = "https://docs.google.com/uc?export=download&id=" + newURL;
    }

    return newURL;
  }

  function handleChange(type, value) {
    const newValue = block.value;

    newValue[type] = value;

    setBlock({
      ...block,
      value: newValue,
    });
  }
}
