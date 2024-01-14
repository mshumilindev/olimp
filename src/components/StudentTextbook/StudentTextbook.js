import React, { useContext, useEffect, useState } from "react";
import { db } from "../../db/firestore";
import siteSettingsContext from "../../context/siteSettingsContext";
import Modal from "../UI/Modal/Modal";

export default function StudentTextbook({ docRef, name }) {
  const [textbook, setTextbook] = useState(null);
  const { translate } = useContext(siteSettingsContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const libraryRef = db.ref().child("library/" + docRef);

    libraryRef.getDownloadURL().then((url) => {
      if (docRef.includes(".pdf")) {
        setTextbook({ type: "pdf", url: url });
      } else {
        setTextbook({ type: "else", url: url });
      }
    });
  }, []);

  return (
    <>
      {textbook ? (
        <>
          <div className="studentCourse__textbook-item-title">{name}</div>
          <div className="studentCourse__textbook-item-holder">
            {checkIfMobile() || textbook.type === "else" ? (
              <a
                href={textbook.url}
                target="_blank"
                className="btn btn_primary"
              >
                <i className="content_title-icon fa fa-book" />
                {translate("open_textbook")}
              </a>
            ) : (
              <span
                className="btn btn_primary"
                onClick={() => setShowModal(true)}
              >
                <i className="content_title-icon fa fa-book" />
                {translate("open_textbook")}
              </span>
            )}
          </div>
        </>
      ) : null}
      {showModal ? (
        <Modal
          className="textbookModal"
          onHideModal={() => setShowModal(false)}
          heading={translate("textbook")}
        >
          <object
            data={textbook.url}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <embed src={textbook.url} type="application/pdf" />
          </object>
        </Modal>
      ) : null}
    </>
  );

  function checkIfMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }
}
