import React, { useEffect, useRef } from "react";
import "./modal.scss";

export default function Modal({ children, onHideModal, heading, className }) {
  const $wrapper = useRef(null);

  useEffect(() => {
    document.querySelector("body").classList.add("overflow");
    return () => {
      document.querySelector("body").classList.remove("overflow");
    };
  });

  return (
    <div className={className ? className + " modal" : "modal"}>
      <div className="modal__overlay" />
      <div className="modal__inner">
        <div className="modal__box-wrapper" ref={$wrapper}>
          <div className="modal__box-holder">
            <div className="modal__box">
              <div className="modal__box-inner">
                <i
                  className={"modal__close fa fa-times"}
                  onClick={onHideModal}
                />
                {heading ? (
                  <h2
                    className="modal__heading"
                    dangerouslySetInnerHTML={{ __html: heading }}
                  />
                ) : null}
                {children}
              </div>
            </div>
            <div className="modal__backToTop" onClick={handleScroll}>
              <i className="fas fa-arrow-circle-up" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function handleScroll() {
    $wrapper.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
}
