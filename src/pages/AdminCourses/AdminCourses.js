import React, { useContext } from 'react';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import {fetchSubjects} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import Breadcrumbs from '../../components/UI/Breadcrumbs/Breadcrumbs';
import AdminCoursesSubject from "../../components/AdminCoursesList/AdminCoursesSubject";
import '../../components/AdminCoursesList/adminCourses.scss';

function AdminCourses({filters, pager, list, loading, searchQuery, params}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const breadcrumbs = [
        {
            name: translate('subjects'),
            url: '/admin-courses'
        }
    ];

    return (
        <div className="adminCourses">
            <div className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-book" />
                        { translate('courses') }
                    </h2>
                    <div className="section__title-actions">
                        <a href="/" className="btn btn_primary" onClick={createSubject}>
                            <i className="content_title-icon fa fa-plus" />
                            { translate('create_subject') }
                        </a>
                    </div>
                </div>
                { filters }
                <div className="adminLibrary__list widget">
                    {
                        list && list.length ?
                            <>
                                <div className="widget__title">
                                    <Breadcrumbs list={getBreadcrumbs()} />
                                </div>
                                <div className="adminCourses__list">
                                    {
                                        filterList().map(subject => <AdminCoursesSubject params={params} loading={loading} subject={subject} key={subject.id} />)
                                    }
                                    <div className="adminCourses__list-item">
                                        <a href="/" className="adminCourses__add" onClick={createSubject}>
                                            <i className="content_title-icon fa fa-plus" />
                                            { translate('create_subject') }
                                        </a>
                                    </div>
                                </div>
                                { pager }
                            </>
                            :
                            <Preloader/>
                    }
                </div>
            </div>
        </div>
    );

    function filterList() {
        return list.filter(item => searchQuery.trim().length ? item.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) : true);
    }

    function createSubject(e) {
        e.preventDefault();

        console.log('create subject');
    }

    function getBreadcrumbs() {
        if ( params ) {
            let currentSubject = null;
            let currentCourse = null;
            let currentModule = null;

            if ( params.subjectID ) {
                currentSubject = list.find(item => item.id === params.subjectID);
                breadcrumbs.push({
                    name: currentSubject ? currentSubject.name[lang] ? currentSubject.name[lang] : currentSubject.name['ua'] : '',
                    url: '/admin-courses/' + params.subjectID
                });
            }
            if ( params.courseID ) {
                if ( currentSubject.coursesList ) {
                    currentCourse = currentSubject.coursesList.find(item => item.id === params.courseID);
                    breadcrumbs.push({
                        name: currentCourse ? currentCourse.name[lang] ? currentCourse.name[lang] : currentCourse.name['ua'] : '',
                        url: '/admin-courses/' + params.subjectID + '/' + params.courseID
                    });
                }
            }
            if ( params.moduleID ) {
                if ( currentCourse && currentCourse.modules ) {
                    currentModule = currentCourse.modules.find(item => item.id === params.moduleID);
                    breadcrumbs.push({
                        name: currentModule ? currentModule.name[lang] ? currentModule.name[lang] : currentModule.name['ua'] : '',
                        url: '/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID
                    });
                }
            }
        }

        return breadcrumbs;
    }
}

const mapStateToProps = state => ({
    list: state.coursesReducer.subjectsList,
    loading: state.coursesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchSubjects: dispatch(fetchSubjects())
});

export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminCourses, true));