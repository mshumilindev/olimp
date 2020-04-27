import React, {useContext} from 'react';
import { connect } from 'react-redux';
import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import {orderBy} from "natural-orderby";
import AdminTestingSubject from "./AdminTestingSubject";
import './adminTesting.scss';
import {fetchTests} from "../../redux/actions/testsActions";

function AdminTesting({user, coursesList, tests}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="adminTesting">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fas fa-clipboard-check'} />
                        { translate('testing') }
                    </h2>
                </div>
                <div className="grid">
                    <div className="grid_col col-12">
                        {
                            !coursesList || !tests ?
                                <Preloader />
                                :
                                filterCourses().length ?
                                    <div className="adminTesting__subjectsList">
                                        { filterCourses().map(subjectItem => <AdminTestingSubject subjectItem={subjectItem} key={subjectItem.id} tests={tests} />) }
                                    </div>
                                    :
                                    <div className="nothingFound">
                                        { translate('nothing_found') }
                                    </div>
                        }
                    </div>
                </div>
            </section>
        </div>
    );

    function filterCourses() {
        return orderBy(coursesList, v => v.name[lang] ? v.name[lang] : v.name['ua']).filter(subjectItem => subjectItem.coursesList.some(courseItem => courseItem.teacher === user.id)).filter(subjectItem => tests.some(testItem => testItem.lesson.subjectID === subjectItem.id));
    }
}

const mapStateToProps = state => {
    return {
        coursesList: state.coursesReducer.coursesList,
        tests: state.testsReducer.tests,
        user: state.authReducer.currentUser
    }
};

const mapDispatchToProps = dispatch => ({
    fetchTests: dispatch(fetchTests())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminTesting);