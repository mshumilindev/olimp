import React, { useEffect, useContext } from 'react';
import {Link} from "react-router-dom";
import siteSettingsContext from "../../context/siteSettingsContext";
import LinePreloader from "../UI/LinePreloader";

const ScheduleItem = React.memo(({prefix, course, subject, courseID, isLast, getCourseToSave}) => {
    const { lang } = useContext(siteSettingsContext);

    useEffect(() => {
        if ( !course ) {
            getCourseToSave(subject, courseID, isLast);
        }
    });

    return (
        <div className={prefix + 'scheduleList_classes-item'}>
            {
                course ?
                    <Link to={'/courses/' + courseID} className={prefix + 'scheduleList_classes-text'}>{ course.name[lang] ? course.name[lang] : course.name['ua'] }</Link>
                    :
                    <LinePreloader height={19}/>
            }
        </div>
    )

});

export default ScheduleItem;
