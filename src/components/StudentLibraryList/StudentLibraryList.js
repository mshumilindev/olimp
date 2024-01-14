import React from "react";
import StudentLibraryListByCourse from "./StudentLibraryListByCourse";

export default function StudentLibraryList({ list, classData }) {
  return (
    <div className="library__list">
      {classData.courses.map((courseItem) => (
        <StudentLibraryListByCourse
          key={courseItem.course}
          courseItem={courseItem}
          list={list}
        />
      ))}
    </div>
  );
}
