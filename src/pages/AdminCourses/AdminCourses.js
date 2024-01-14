import React, {useContext, useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import { orderBy } from 'natural-orderby';
import styled, {keyframes} from 'styled-components';

import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import {fetchSubjects, updateSubject} from "../../redux/actions/coursesActions";
import AdminCoursesSubject from "../../components/AdminCoursesList/AdminCoursesSubject/AdminCoursesSubject";
import '../../components/AdminCoursesList/adminCourses.scss';

import Modal from '../../components/UI/Modal/Modal';
import Form from '../../components/Form/Form';

// === Need to move this to a separate file from all the files it's used in
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function AdminCourses({history, location, filters, list, loading, updateSubject, allCoursesList, isLessonCoppied, setIsLessonCoppied, user}) {
  const subjectIDRef = useRef(null);
  const params = useMemo(() => {
    const locStr = location?.pathname ? location?.pathname : '';
    const locArr = locStr.split('/');
    let p = {};

    if ( locArr[2] ) {
      p.subjectID = locArr[2];
    }

    if ( locArr[3] ) {
      p.courseID = locArr[3];
    }

    if ( locArr[4] ) {
      p.moduleID = locArr[4];
    }
    return p
  }, [location]);

    if ( params ) {
        if ( params.subjectID && list && list.length && !list.find(item => item.id === params.subjectID) ) {
            history.push('/admin-courses');
        }
        if ( params.courseID && list && list.length && list.find(item => item.id === params.subjectID) && list.find(item => item.id === params.subjectID).coursesList && !list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID) ) {
            history.push('/admin-courses/' + params.subjectID);
        }
        if ( params.moduleID && list && list.length && list.find(item => item.id === params.subjectID) && list.find(item => item.id === params.subjectID).coursesList && list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID) && list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID).modules && !list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID).modules.find(item => item.id === params.moduleID) ) {
            history.push('/admin-courses/' + params.subjectID + '/' + params.courseID);
        }
    }
    const { translate, lang, getSubjectModel, getSubjectFields, identify, transliterize } = useContext(siteSettingsContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ subjectFields, setSubjectFields ] = useState(JSON.stringify(getSubjectFields(getSubjectModel())));
    const [ formError, setFormError ] = useState(null);
    const [ formUpdated, setFormUpdated ] = useState(false);
    let prevLoading = usePrevious(loading);

    useEffect(() => {
        if ( showModal && prevLoading && !loading ) {
            toggleModal();
        }
    });

    const handleCreateSubject = useCallback(() => {
        const newSubjectFields = JSON.parse(subjectFields);
        const newSubject = {};

        newSubject.name = {
            en: newSubjectFields.find(item => item.id === 'subjectName_en').value.replace(/\s*$/,''),
            ru: newSubjectFields.find(item => item.id === 'subjectName_ru').value.replace(/\s*$/,''),
            ua: newSubjectFields.find(item => item.id === 'subjectName_ua').value.replace(/\s*$/,'')
        };
        newSubject.id = identify(transliterize(newSubject.name['ua']));

        if ( list.some(item => item.id.toLowerCase() === newSubject.id.toLowerCase()) ) {
            setFormError(translate('subject_already_exists'));
        }
        else {
            setFormError(null);
            updateSubject(newSubject);
        }
    }, [subjectFields, list, setFormError, updateSubject, identify, translate, transliterize]);

    const setFieldValue = useCallback((fieldID, value) => {
        const newSubjectFields = JSON.parse(subjectFields);

        newSubjectFields.find(item => item.id === fieldID).value = value;
        newSubjectFields.find(item => item.id === fieldID).updated = true;
        setFormUpdated(true);

        setSubjectFields(JSON.stringify(newSubjectFields));
    }, [subjectFields, setSubjectFields]);

    const toggleModal = useCallback(() => {
        setShowModal(false);
        setSubjectFields(JSON.stringify(getSubjectFields(getSubjectModel())));
    }, [setShowModal, setSubjectFields, getSubjectFields, getSubjectModel]);

    const filteredList = useMemo(() => {
      return orderBy(list, [v => v.name[lang] ? v.name[lang] : v.name['ua']])
    }, [list, lang]);

    const myList = useMemo(() => {
      return filteredList?.filter((item) => {
        const coursesList = allCoursesList?.filter((allItem) => allItem.id === item.id)?.[0]?.coursesList;
        const onlyMyCourses = coursesList?.filter(({teacher}) => teacher === user?.id);

        if ( !!onlyMyCourses?.length ) {
          return {
            ...item,
            children: onlyMyCourses.length
          }
        }
      });
    }, [filteredList, user, allCoursesList]);

    const getCoursesQty = useCallback((subjectID) => {
      const coursesList = allCoursesList?.find((allItem) => allItem.id === subjectID)?.coursesList;

      return coursesList?.filter((courseItem) => courseItem.teacher === user?.id)?.length;
    }, [allCoursesList, user]);

    const otherList = useMemo(() => {
      return filteredList?.filter((item) => !allCoursesList?.find((allItem) => allItem.id === item.id)?.coursesList?.some(({teacher}) => teacher === user?.id));
    }, [filteredList, user, allCoursesList]);

    const showCreateSubjectModal = useCallback((e) => {
        e.preventDefault();

        setShowModal(true);
    }, [setShowModal]);

    return (
        <div className="adminCourses">
            <div className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-book" />
                        { translate('courses') }
                    </h2>
                    <div className="section__title-actions">
                        <a href="/" className="btn btn_primary" onClick={showCreateSubjectModal}>
                            <i className="content_title-icon fa fa-plus" />
                            { translate('create_subject') }
                        </a>
                    </div>
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                { filters }
                <div className="adminLibrary__list widget">
                    {
                        <>
                            <div className="widget__descr">
                                <h3>Правила користування:</h3>
                                <p>Ліва кнопка миші - обрати предмет/модуль/урок</p>
                                <p>Права кнопка миші - відкрити контекстне меню</p>
                                <p><strong>Перед створенням нового основного предмету запевніться, що його ще не існує</strong></p>
                            </div>
                            <div className="adminCourses__list">
                              {
                                loading && !filteredList?.length && (
                                  <AdminCoursesSkeletonsHolderStyled>
                                    {
                                      [...Array(20)].map((item, index) => (
                                        <AdminCoursesSkeletonStyled key={index}>
                                          <AdminCoursesSkeletonLeftStyled>
                                            <AdminCoursesSkeletonIconStyled className="fa fa-folder" />
                                            <AdminCoursesSkeletonTextStyled />
                                          </AdminCoursesSkeletonLeftStyled>
                                          <AdminCoursesSkeletonQtyStyled />
                                        </AdminCoursesSkeletonStyled>
                                      ))
                                    }
                                  </AdminCoursesSkeletonsHolderStyled>
                                )
                              }
                              {
                                !loading && !filteredList?.length && (
                                  <div className="nothingFound">
                                      <a href="/" className="btn btn_primary" onClick={showCreateSubjectModal}>
                                          <i className="content_title-icon fa fa-plus" />
                                          { translate('create_subject') }
                                      </a>
                                  </div>
                                )
                              }
                              {
                                !!myList?.length && (
                                  <>
                                    {!!otherList?.length && <AdminCoursesListTitle>Мої предмети</AdminCoursesListTitle>}
                                    {
                                      myList.map(subject => <AdminCoursesSubject subjectIDRef={subjectIDRef} coursesQty={getCoursesQty(subject.id)} params={params} loading={loading} subject={subject} key={subject.id} isLessonCoppied={isLessonCoppied} setIsLessonCoppied={setIsLessonCoppied} />)
                                    }
                                  </>
                                )
                              }
                              {
                                !!otherList?.length && (
                                  <>
                                    {!!myList?.length && <AdminCoursesListTitle>Інші предмети</AdminCoursesListTitle>}
                                    {
                                      otherList.map(subject => (
                                        <AdminCoursesSubject
                                          subjectIDRef={subjectIDRef}
                                          params={params}
                                          loading={loading}
                                          subject={subject}
                                          key={subject.id}
                                          isLessonCoppied={isLessonCoppied}
                                          setIsLessonCoppied={setIsLessonCoppied}
                                          coursesQty={user?.role === 'admin' ? subject.children : 0}
                                        />
                                      ))
                                    }
                                  </>
                                )
                              }
                            </div>
                        </>
                    }
                </div>
            </div>
            {
                showModal ?
                    <Modal onHideModal={() => toggleModal()}>
                      <Form loading={loading} heading={translate('create_subject')} fields={JSON.parse(subjectFields)} setFieldValue={setFieldValue} formAction={handleCreateSubject} formError={formError} formUpdated={formUpdated}/>
                    </Modal>
                    :
                    null
            }
        </div>
    );
}

const mapStateToProps = state => ({
    list: state.coursesReducer.subjectsList,
    loading: state.coursesReducer.loading,
    allCoursesList: state.coursesReducer.coursesList,
    user: state.authReducer.currentUser,
});
const mapDispatchToProps = dispatch => ({
    fetchSubjects: dispatch(fetchSubjects()),
    updateSubject: (subject) => dispatch(updateSubject(subject))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminCourses));

const shimmer = keyframes`
  0 {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
`;

const AdminCoursesListTitle = styled.h3`
  font-family: 'Roboto Condensed', Arial, sans-serif;
  font-weight: bold;
  padding: 40px 0 20px;
  width: 100%;
  text-transform: uppercase;

  &:first-child {
    padding-top: 0;
  }
`;

const AdminCoursesSkeletonsHolderStyled = styled.div`

`;

const AdminCoursesSkeletonStyled = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  &:nth-child(2n) {
    background: #f2f2f2;
  }

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0));
    animation: ${shimmer} 1s infinite;
    content: '';
  }
`;

const AdminCoursesSkeletonLeftStyled = styled.div`
  display: flex;
  align-items: center;
`;

const AdminCoursesSkeletonIconStyled = styled.i`
  margin-right: 10px;
  color: #ccc;
`;

const AdminCoursesSkeletonTextStyled = styled.div`
  height: 10px;
  width: 250px;
  background: #ccc;
`;

const AdminCoursesSkeletonQtyStyled = styled.div`
  height: 10px;
  width: 130px;
  background: #ccc;
`;
