import React, {useContext} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from 'react-redux';
import Preloader from "../UI/preloader";
import SeamlessEditor from "../UI/SeamlessEditor/SeamlessEditor";

function AdminLessonQA({title, QALoading, content, setUpdated, updateContent}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-file-alt"/>
                { translate('QA') }
            </div>
            {
                QALoading || !content ?
                    <Preloader/>
                    :
                    <SeamlessEditor
                        content={content}
                        title={title}
                        type={'QA'}
                        setUpdated={setUpdated}
                        updateContent={updateContent}
                        loading={QALoading}
                        types={{
                            text: ['text'],
                            media: ['image', 'audio', 'video', 'youtube'],
                            answers: ['answers'],
                            other: ['divider']
                        }}
                    />
            }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        QALoading: state.lessonReducer.QALoading
    }
};

export default connect(mapStateToProps)(AdminLessonQA);