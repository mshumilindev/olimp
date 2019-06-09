import React, { useEffect, useContext } from 'react';
import {Link} from "react-router-dom";
import siteSettingsContext from "../../context/siteSettingsContext";
import LinePreloader from '../UI/LinePreloader';

const EventsCalendarClass = ({subject, courseID, course, getCourseToSave, isLast, isHoliday, isNoClasses}) => {
    const { lang } = useContext(siteSettingsContext);

    useEffect(() => {
        if ( !course ) {
            getCourseToSave(subject, courseID, isLast);
        }
    });

    return (
        <div className="eventsCalendar__date-content-item">
            {
                course ?
                    <Link to={'/courses/' + courseID} title={course.name[lang] ? course.name[lang] : course.name['ua']}>{ course.name[lang] ? course.name[lang] : course.name['ua'] }</Link>
                    :
                    isNoClasses ?
                        <div className="eventsCalendar__date-content-item-empty">PLACEHOLDER Немає уроків</div>
                        :
                        !isHoliday ?
                            <LinePreloader/>
                            :
                            null
            }
        </div>
    )
};

export default EventsCalendarClass;
