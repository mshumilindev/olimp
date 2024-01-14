import React from "react";
import "./adminInfoManuals.scss";

export default function AdminInfoManualsItem({ item, id }) {
  return <div className={"manuals__item " + item.type}>{_renderItem()}</div>;

  function _renderItem() {
    switch (item.type) {
      case "text":
        return <p>{item.value}</p>;

      case "prominent":
        return <p className="prominent">{item.value}</p>;

      case "list":
        return (
          <ul>
            {item.children.map((li, index) => {
              if (typeof li === "object") {
                return (
                  <li key={index}>
                    <ul>
                      {li.map((subLi, index) => (
                        <li key={index}>
                          <span>&mdash; </span>
                          <span>
                            {subLi}
                            {index + 1 === item.children.length ? "." : ";"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={index}>
                  <span>&mdash; </span>
                  <span>
                    {li}
                    {index + 1 === item.children.length ? "." : ";"}
                  </span>
                </li>
              );
            })}
          </ul>
        );

      case "oList":
        return (
          <ol>
            {item.children.map((li, index) => {
              if (typeof li === "object") {
                return (
                  <li key={index}>
                    <ol>
                      {li.map((subLi, index) => (
                        <li key={index}>
                          <span>{index + 1})</span>{" "}
                          <span>
                            {subLi}
                            {index + 1 === item.children.length ? "." : ";"}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </li>
                );
              }
              return (
                <li key={index}>
                  <span>{index + 1})</span>{" "}
                  <span>
                    {li}
                    {index + 1 === item.children.length ? "." : ";"}
                  </span>
                </li>
              );
            })}
          </ol>
        );

      case "image":
        return (
          <figure>
            <img
              src={require("../../info/admin/" + id + "/" + item.url)}
              alt={item.caption}
            />
            <figcaption>{item.caption}</figcaption>
          </figure>
        );
    }
  }
}
