import React from "react";
import "./tagsList.scss";

export default function TagsList({ tagsList, setTags }) {
  return (
    <div className="tagsList">
      {tagsList && tagsList.length
        ? tagsList.map((tag) => (
            <span
              className="tagsList__item"
              key={tag}
              onClick={() => setTags(tag)}
            >
              {tag}
            </span>
          ))
        : null}
    </div>
  );
}
