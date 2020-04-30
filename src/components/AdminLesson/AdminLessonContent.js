import React, {useContext, useEffect} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from 'react-redux';
import {fetchLessonContent} from "../../redux/actions/lessonActions";
import Preloader from "../UI/preloader";
import SeamlessEditor from "../UI/SeamlessEditor/SeamlessEditor";

function AdminLessonContent({title, subjectID, courseID, moduleID, lessonID, fetchLessonContent, contentLoading, lessonContent, setUpdated}) {
    const { translate } = useContext(siteSettingsContext);

    useEffect(() => {
        fetchLessonContent(subjectID, courseID, moduleID, lessonID);
    }, []);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-file-alt"/>
                { translate('content') }
            </div>
            {
                contentLoading || !lessonContent ?
                    <Preloader/>
                    :
                    <SeamlessEditor
                        content={lessonContent}
                        title={title}
                        type={'content'}
                        setUpdated={setUpdated}
                    />
            }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        lessonContent: state.lessonReducer.lessonContent,
        contentLoading: state.lessonReducer.contentLoading
    }
};

const mapDispatchToProps = dispatch => ({
    fetchLessonContent: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLessonContent(subjectID, courseID, moduleID, lessonID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLessonContent);