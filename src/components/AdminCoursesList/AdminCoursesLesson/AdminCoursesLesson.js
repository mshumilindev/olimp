import React, { useContext } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {Link} from "react-router-dom";

function AdminCoursesLesson({lesson, params}) {
    const { lang } = useContext(siteSettingsContext);

    return (
        <div className="adminCourses__list-item" style={{marginTop: 10}}>
            <Link to={'/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID + '/' + lesson.id} className="adminCourses__list-courses-link">
                <i className="content_title-icon fa fa-paragraph" />
                { lesson.name[lang] ? lesson.name[lang] : lesson.name['ua'] }
            </Link>
        </div>
    );
}
export default AdminCoursesLesson;