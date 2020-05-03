import React, { useContext, useState, useEffect } from 'react';
import { withRouter  } from 'react-router-dom';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import {fetchClass, updateClass, discardClass} from "../../redux/actions/classesActions";
import Preloader from "../../components/UI/preloader";
import './adminClass.scss';
import AdminClassContent from '../../components/AdminClassContent/AdminClassContent';
import AdminClassInfo from "./AdminClassInfo";
import AdminClassDescr from "./AdminClassDescr";
import AdminClassCurator from "./AdminClassCurator";

function AdminClass({user, fetchClass, params, classData, updateClass, loading, discardClass}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ classUpdated, setClassUpdated ] = useState(false);
    const [ currentClass, setCurrentClass ] = useState(null);

    useEffect(() => {
        fetchClass(params.classID);

        return () => {
            discardClass();
            setCurrentClass(null);
            setClassUpdated(false);
        }
    }, []);

    useEffect(() => {
        if ( JSON.stringify(currentClass) !== JSON.stringify(classData) ) {
            setClassUpdated(true);
        }
        else {
            setClassUpdated(false);
        }
    }, [currentClass]);

    useEffect(() => {
        if ( classData ) {
            setCurrentClass(JSON.parse(JSON.stringify(classData)));
        }
    }, [classData]);

    return (
        <div className="adminClass">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        {
                            currentClass ?
                                <>
                                    <i className={'content_title-icon fa fa-graduation-cap'} />
                                    <span className="section__title-separator">{ translate('classes') }</span>
                                    { currentClass.title[lang] ? currentClass.title[lang] : currentClass.title.ua }
                                </>
                                :
                                null
                        }
                    </h2>
                    {
                        canEdit() ?
                            <div className="section__title-actions">
                                <span>
                                    <a href="/" className="btn btn__success" onClick={e => onUpdateClass(e)} disabled={!classUpdated}>
                                        <i className="content_title-icon fa fa-save"/>
                                        { translate('save') }
                                    </a>
                                </span>
                            </div>
                            :
                            null
                    }
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                <div className="grid">
                    <div className="grid_col col-8">
                        <AdminClassContent content={currentClass} loading={loading} setContent={handleSetContent} canEdit={canEdit} />
                    </div>
                    <div className="grid_col col-4">
                        <AdminClassInfo classData={currentClass} loading={loading} setInfo={setInfo} canEdit={canEdit} />
                        <AdminClassCurator classData={currentClass} loading={loading} setCurator={setCurator} canEdit={canEdit} />
                        <AdminClassDescr classData={currentClass} loading={loading} setDescr={setDescr} canEdit={canEdit} />
                    </div>
                </div>
            </section>
        </div>
    );

    function canEdit() {
        return user.role === 'admin' || (currentClass && currentClass.curator === user.id);
    }

    function handleSetContent(newContent) {
        setCurrentClass(Object.assign({}, newContent));
    }

    function onUpdateClass(e) {
        e.preventDefault();

        if ( classUpdated ) {
            updateClass(currentClass.id, currentClass);
        }
    }

    function setInfo(fieldID, value) {
        const newValue = currentClass.title;

        if ( fieldID === 'title_ua' ) {
            newValue.ua = value;
        }
        if ( fieldID === 'title_en' ) {
            newValue.en = value;
        }
        if ( fieldID === 'title_ru' ) {
            newValue.ru = value;
        }

        setCurrentClass(Object.assign({}, {
            ...currentClass,
            title: newValue
        }));
    }

    function setDescr(fieldID, value) {
        const newValue = currentClass.info;

        if ( fieldID === 'descr_ua' ) {
            newValue.ua = value;
        }
        if ( fieldID === 'descr_en' ) {
            newValue.en = value;
        }
        if ( fieldID === 'descr_ru' ) {
            newValue.ru = value;
        }

        setCurrentClass(Object.assign({}, {
            ...currentClass,
            info: newValue
        }));
    }

    function setCurator(type, value) {
        setCurrentClass(Object.assign({}, {
            ...currentClass,
            curator: value[0]
        }));
    }
}
const mapStateToProps = state => ({
    classData: state.classesReducer.classData,
    loading: state.classesReducer.loading,
    user: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
    fetchClass: classID => dispatch(fetchClass(classID)),
    updateClass: (classID, classData) => dispatch(updateClass(classID, classData)),
    discardClass: () => dispatch(discardClass())
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminClass));