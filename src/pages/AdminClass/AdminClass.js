import React, { useContext, useState, useEffect } from 'react';
import { withRouter  } from 'react-router-dom';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import {fetchClass, updateClass} from "../../redux/actions/classesActions";
import Preloader from "../../components/UI/preloader";
import Form from '../../components/Form/Form';
import './adminClass.scss';
import AdminClassContent from '../../components/AdminClassContent/AdminClassContent';

function AdminClass({user, fetchClass, params, classData, updateClass, loading}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ classInfoFields, setClassInfoFields ] = useState(null);
    const [ classDescrFields, setClassDescrFields ] = useState(null);
    const [ classUpdated, setClassUpdated ] = useState(false);
    const [ initialCurrentClass, setInitialCurrentClass ] = useState(null);
    const [ currentClass, setCurrentClass ] = useState(null);

    if ( !classData || classData.id !== params.classID ) {
        fetchClass(params.classID);
    }
    else {
        if ( !classInfoFields ) {
            setClassInfoFields(JSON.stringify([
                {
                    value: classData.title.ua,
                    id: 'title_ua',
                    placeholder: translate('title') + ' ' + translate('in_ua'),
                    type: 'text',
                    updated: false
                },
                {
                    value: classData.title.ru,
                    id: 'title_ru',
                    placeholder: translate('title') + ' ' + translate('in_ru'),
                    type: 'text',
                    updated: false
                },
                {
                    value: classData.title.en,
                    id: 'title_en',
                    placeholder: translate('title') + ' ' + translate('in_en'),
                    type: 'text',
                    updated: false
                }
            ]));
        }
        if ( !classDescrFields ) {
            setClassDescrFields(JSON.stringify([
                {
                    value: classData.info.ua,
                    id: 'info_ua',
                    placeholder: translate('description') + ' ' + translate('in_ua'),
                    type: 'textarea',
                    updated: false
                },
                {
                    value: classData.info.ru,
                    id: 'info_ru',
                    placeholder: translate('description') + ' ' + translate('in_ru'),
                    type: 'textarea',
                    updated: false
                },
                {
                    value: classData.info.en,
                    id: 'info_en',
                    placeholder: translate('description') + ' ' + translate('in_en'),
                    type: 'textarea',
                    updated: false
                }
            ]));
        }
    }
    if ( classData && JSON.stringify(classData) !== initialCurrentClass ) {
        setCurrentClass(JSON.stringify(classData));
        setInitialCurrentClass(JSON.stringify(classData));
    }

    useEffect(() => {
        if ( currentClass ) {
            if ( JSON.stringify(classData) !== currentClass ) {
                setClassUpdated(true);
            }
            else {
                setClassUpdated(false);
            }
        }
    });

    return (
        <div className="adminClass">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        {
                            JSON.parse(currentClass) ?
                                <>
                                    <i className={'content_title-icon fa fa-graduation-cap'} />
                                    <span className="section__title-separator">{ translate('classes') }</span>
                                    { JSON.parse(currentClass).title[lang] ? JSON.parse(currentClass).title[lang] : JSON.parse(currentClass).title.ua }
                                </>
                                :
                                null
                        }
                    </h2>
                    {
                        user.role === 'admin' ?
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
                        <AdminClassContent content={currentClass} loading={loading} setContent={handleSetContent} />
                    </div>
                    <div className="grid_col col-4">
                        <div className="widget">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-info"/>
                                { translate('info') }
                            </div>
                            {
                                JSON.parse(currentClass) ?
                                    user.role === 'admin' ?
                                        <Form fields={JSON.parse(classInfoFields)} setFieldValue={setInfoFields} loading={loading} />
                                        :
                                        JSON.parse(currentClass).title[lang] ? JSON.parse(currentClass).title[lang] : JSON.parse(currentClass).title['ua']
                                    :
                                    loading ?
                                        <Preloader/>
                                        :
                                        null
                            }
                        </div>
                        <div className="widget">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-question"/>
                                { translate('description') }
                            </div>
                            {
                                JSON.parse(currentClass) ?
                                    user.role === 'admin' ?
                                        <Form fields={JSON.parse(classDescrFields)} setFieldValue={setDescrFields} loading={loading} />
                                        :
                                        JSON.parse(currentClass).info[lang] ? JSON.parse(currentClass).info[lang] : JSON.parse(currentClass).info['ua']
                                    :
                                    loading ?
                                        <Preloader/>
                                        :
                                        null
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    function handleSetContent(newContent) {
        setCurrentClass(JSON.stringify(newContent));
    }

    function onUpdateClass(e) {
        e.preventDefault();

        if ( classUpdated ) {
            updateClass(JSON.parse(currentClass).id, JSON.parse(currentClass));
        }
    }

    function setInfoFields(fieldID, value) {
        const tempFields = JSON.parse(classInfoFields);
        const tempModel = JSON.parse(currentClass);

        tempFields.find(item => item.id === fieldID).updated = tempFields.find(item => item.id === fieldID).value !== value;
        tempFields.find(item => item.id === fieldID).value = value;
        setClassInfoFields(JSON.stringify(tempFields));

        if ( fieldID === 'title_ua' ) {
            tempModel.title.ua = value;
        }
        if ( fieldID === 'title_ru' ) {
            tempModel.title.ru = value;
        }
        if ( fieldID === 'title_en' ) {
            tempModel.title.en = value;
        }

        setCurrentClass(JSON.stringify(tempModel));
    }

    function setDescrFields(fieldID, value) {
        const tempFields = JSON.parse(classDescrFields);
        const tempModel = JSON.parse(currentClass);

        tempFields.find(item => item.id === fieldID).updated = tempFields.find(item => item.id === fieldID).value !== value;
        tempFields.find(item => item.id === fieldID).value = value;
        setClassDescrFields(JSON.stringify(tempFields));

        if ( fieldID === 'info_ua' ) {
            tempModel.info.ua = value;
        }
        if ( fieldID === 'info_ru' ) {
            tempModel.info.ru = value;
        }
        if ( fieldID === 'info_en' ) {
            tempModel.info.en = value;
        }

        setCurrentClass(JSON.stringify(tempModel));
    }
}
const mapStateToProps = state => ({
    classData: state.classesReducer.classData,
    loading: state.classesReducer.loading,
    user: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
    fetchClass: classID => dispatch(fetchClass(classID)),
    updateClass: (classID, classData) => dispatch(updateClass(classID, classData))
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminClass));