import React, { useContext, useEffect } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {Link} from "react-router-dom";
import {fetchLessons} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";
import classNames from "classnames";

function AdminCoursesModule({module, params, loading, fetchLessons}) {
    const { lang, translate } = useContext(siteSettingsContext);

    useEffect(() => {
        if ( checkIfIsOpen() && !module.lessons ) {
            fetchLessons(params.subjectID, params.courseID, module.id);
        }
    });

    return (
        <div className={classNames('adminCourses__list-item', {someOpen: params && params.moduleID && params.moduleID !== module.id, isOpen: params && params.moduleID === module.id})} style={{marginTop: 10}}>
            <Link to={'/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + module.id} className="adminCourses__list-courses-link">
                {
                    checkIfIsOpen() ?
                        loading ?
                            <i className="content_title-icon fas fa-spinner" />
                            :
                            <i className="content_title-icon fa fa-folder-open" />
                        :
                        <i className="content_title-icon fa fa-folder" />
                }
                { module.name[lang] ? module.name[lang] : module.name['ua'] }
            </Link>
            {
                params && params.moduleID === module.id ?
                    <div className="adminCourses__list-courses" style={{marginTop: -10}}>
                        {
                            module.lessons && module.lessons.length ?
                                module.lessons.map(item => <div>{ item.name[lang] }</div>)
                                :
                                <div className="adminCourses__list-item adminCourses__list-item-nothingFound" style={{marginTop: 10}}>
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('nothing_found') }
                                </div>
                        }
                    </div>
                    :
                    null
            }
        </div>
    );

    function createLesson(e) {
        e.preventDefault();

        console.log('create lesson');
    }

    function checkIfIsOpen() {
        return params && params.moduleID === module.id;
    }
}
const mapDispatchToProps = dispatch => ({
    fetchLessons: (subjectID, courseID, moduleID) => dispatch(fetchLessons(subjectID, courseID, moduleID))
});
export default connect(null, mapDispatchToProps)(AdminCoursesModule);