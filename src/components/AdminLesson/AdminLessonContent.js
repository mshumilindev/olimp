import React, {useContext} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from 'react-redux';
import Preloader from "../UI/preloader";
import SeamlessEditor from "../UI/SeamlessEditor/SeamlessEditor";

function AdminLessonContent({title, contentLoading, content, setUpdated, updateContent}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-file-alt"/>
                { translate('content') }
            </div>
            {
                contentLoading || !content ?
                    <Preloader/>
                    :
                    <SeamlessEditor
                        content={content}
                        title={title}
                        type={'content'}
                        setUpdated={setUpdated}
                        updateContent={updateContent}
                        loading={contentLoading}
                        types={{
                            text: ['text'],
                            media: ['image', 'audio', 'video', 'youtube'],
                            document: ['word', 'iframe'],
                            googleDrive: ['googleWord', 'googleExcel', 'googlePowerpoint'],
                            other: ['divider']
                        }}
                    />
            }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        contentLoading: state.lessonReducer.contentLoading
    }
};

export default connect(mapStateToProps)(AdminLessonContent);
