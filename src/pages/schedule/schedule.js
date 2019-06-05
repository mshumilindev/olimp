import React, { Fragment } from 'react';
import {Provider} from "react-redux";
import {scheduleStore} from "../../redux/stores/scheduleStore";
import ScheduleContainer from "../../containers/scheduleContainer";

export default function Schedule() {
    return (
        <Fragment>
            <Provider store={scheduleStore}>
                <ScheduleContainer prefix="schedule--" />
            </Provider>
        </Fragment>
    )
}