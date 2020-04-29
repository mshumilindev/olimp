import React, {useContext, useEffect} from 'react';
import ContentEditor from "../UI/ContentEditor/ContentEditor";
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from 'react-redux';
import {fetchLessonContent} from "../../redux/actions/lessonActions";
import Preloader from "../UI/preloader";
import SeamlessEditor from "../UI/SeamlessEditor/SeamlessEditor";

function AdminLessonContent({title, subjectID, courseID, moduleID, lessonID, fetchLessonContent, contentLoading, lessonContent}) {
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
                    />
                    // <ContentEditor
                    //     contentType="content"
                    //     content={lessonContent}
                    //     types={
                    //         [
                    //             ['text', 'formula', 'media', 'word', 'powerpoint'],
                    //             ['youtube', 'video', 'audio'],
                    //             ['divider', 'page']
                    //         ]
                    //     }
                    //     setUpdated={value => setLessonUpdated(value)}
                    //     isUpdated={lessonUpdated}
                    //     setLessonContent={(newContent) => setContent(Object.assign([], newContent))}
                    //     loading={contentLoading}
                    // />
                    // <ContentEditor contentType="content" content={lessonContent} types={[['text', 'formula', 'media', 'word', 'powerpoint'], ['youtube', 'video', 'audio'], ['divider', 'page']]} setUpdated={value => setLessonUpdated(value)} isUpdated={lessonUpdated} setLessonContent={(newContent) => setContent(Object.assign([], newContent))} loading={contentLoading} />
            }
            {/*<div className="widget__descr">*/}
            {/*    <h3>Активні елементи:</h3>*/}
            {/*    <p><i className="content_title-icon fas fa-question-circle"/> - інформація, щодо використання блоку</p>*/}
            {/*    <p><i className="content_title-icon fa fa-cog"/> - налаштування блоку</p>*/}
            {/*    <p><i className="content_title-icon fa fa-trash-alt"/> - видалити блок</p>*/}
            {/*</div>*/}
            {/*{*/}
            {/*    content ?*/}
            {/*        <ContentEditor contentType="content" content={content} types={[['text', 'formula', 'media', 'word', 'powerpoint'], ['youtube', 'video', 'audio'], ['divider', 'page']]} setUpdated={value => setLessonUpdated(value)} isUpdated={lessonUpdated} setLessonContent={(newContent) => setContent(Object.assign([], newContent))} loading={loading} />*/}
            {/*        :*/}
            {/*        null*/}
            {/*}*/}
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