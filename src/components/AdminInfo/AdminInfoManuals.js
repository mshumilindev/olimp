import React from "react";
import AdminInfoManualsItem from "./AdminInfoManualsItem";

export default function AdminInfoManuals({ manuals, id }) {
  return (
    <div className="manuals">
      {_renderManual(manuals.find((item) => item.id === id))}
    </div>
  );

  function _renderManual(manual) {
    return (
      <div className="manuals__manual" key={"manual"}>
        <h2 className="manuals__title">{manual.content.title}</h2>
        {manual.content.sections && manual.content.sections.length
          ? manual.content.sections.map((section, index) =>
              _renderSection(section, index),
            )
          : null}
      </div>
    );
  }

  function _renderSection(section, index) {
    const sectionNum = index + 1;

    return (
      <div
        className="manuals__section"
        key={"section" + index}
        id={section.sectionID}
      >
        <h3 className="manuals__sectionTitle">
          <span>{sectionNum}.</span> {section.sectionTitle}
        </h3>
        {section.blocks && section.blocks.length
          ? section.blocks.map((block, index) =>
              _renderBlock(block, index, sectionNum),
            )
          : null}
      </div>
    );
  }

  function _renderBlock(block, index, sectionNum) {
    const blockNum = sectionNum + "." + (index + 1);

    return (
      <div className="manuals__block" key={"block" + index}>
        <h4 className="manuals__blockTitle">
          <span>{blockNum}</span> {block.blockTitle}
        </h4>
        {block.items && block.items.length
          ? block.items.map((item, index) => (
              <AdminInfoManualsItem item={item} key={index} id={id} />
            ))
          : null}
      </div>
    );
  }
}
