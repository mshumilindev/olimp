import React, {useContext} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import AdminTestingTest from "./AdminTestingTest";
import { connect } from 'react-redux';

function AdminTestingLesson({lesson, tests, usersList}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="adminTesting__lesson">
            <div className="adminTesting__course-name">
                <i className="content_title-icon fa fa-graduation-cap"/>
                { lesson.name[lang] ? lesson.name[lang] : lesson.name['ua'] }
            </div>
            <div className="adminTesting__testsList">
                {
                    tests.length ?
                        <>
                            { tests.filter(testItem => testItem.isSent !== false && testItem.score).map(test => <AdminTestingTest test={test} key={test.id} userItem={usersList.filter(userItem => userItem.role === 'student' && userItem.id === test.userID)[0]} lesson={lesson} />) }
                            { tests.filter(testItem => testItem.isSent !== false && !testItem.score).map(test => <AdminTestingTest test={test} key={test.id} userItem={usersList.filter(userItem => userItem.role === 'student' && userItem.id === test.userID)[0]} lesson={lesson} />) }
                        </>
                        :
                        <div className="adminTesting__test no-test">
                            <i className="content_title-icon fa fa-unlink" />
                            { translate('no_tests') }
                        </div>
                }
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        usersList: state.usersReducer.usersList
    }
};

export default connect(mapStateToProps)(AdminTestingLesson);