import React, {useContext, useEffect} from 'react';
import { connect } from 'react-redux';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import { fetchClass } from '../../redux/actions/classesActions';
import StudentLibraryList from "../../components/StudentLibraryList/StudentLibraryList";
import './studentLibrary.scss';
import Notifications from "../../components/Notifications/Notifications";

function StudentLibrary({ loading, libraryList, classData, fetchClass }) {
    const { translate } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);

    useEffect(() => {
        fetchClass(user.class);
    }, []);

    return (
        <>
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-book-open"/>
                    { translate('library') }
                </h2>
            </div>
            <Notifications/>
            <div className="library">
                {
                    loading || !libraryList || !classData ?
                        <Preloader/>
                        :
                        <StudentLibraryList list={libraryList} classData={classData}/>
                }
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return {
        libraryList: state.libraryReducer.libraryList,
        loading: state.libraryReducer.loading,
        classData: state.classesReducer.classData
    }
};

const mapDispatchToProps = dispatch => ({
    fetchClass: (classID) => dispatch(fetchClass(classID))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentLibrary)