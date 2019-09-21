import React, { useContext } from 'react';
import Schedule from '../../components/Schedule/Schedule';
import siteSettingsContext from "../../context/siteSettingsContext";

function StudentSchedule() {
    const { translate } = useContext(siteSettingsContext);

    return (
        <>
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-calendar-alt" />
                    { translate('schedule') }
                </h2>
            </div>
            <Schedule/>
        </>
    )
}
export default StudentSchedule;