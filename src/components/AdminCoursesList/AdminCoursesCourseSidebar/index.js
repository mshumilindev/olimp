import React, { memo, useContext, useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import {connect} from "react-redux";
import { Link } from "react-router-dom";

import {deleteCourse, fetchModules} from "../../../redux/actions/coursesActions";
import siteSettingsContext from '../../../context/siteSettingsContext';
import TextTooltip from "../../UI/TextTooltip/TextTooltip";
import AdminCoursesModule from '../AdminCoursesModule/AdminCoursesModule';
import Confirm from '../../UI/Confirm/Confirm';

const AdminCoursesCourseSidebar = ({ course, subjectID, usersList, user, libraryList, modulesList, fetchModules, moduleCreate, courseUpdate, params, loading, isLessonCoppied, setIsLessonCoppied, deleteCourse }) => {
  const { lang, translate } = useContext(siteSettingsContext);
  const [ showConfirm, setShowConfirm ] = useState(false);

  const teacher = useMemo(() => {
    return usersList?.find((item) => item.id === course?.teacher);
  }, [usersList, course]);

  const textbooks = useMemo(() => {
    return typeof course?.textbook === 'object' ? course?.textbook : [course?.textbook] || [];
  }, [course]);

  useEffect(() => {
    fetchModules(subjectID, course.id);
  }, [course, subjectID, fetchModules]);

  const sortedModules = useMemo(() => {
    return modulesList?.sort((a, b) => a.index - b.index);
  }, [modulesList]);

  const sortedLibrary = useMemo(() => {
    return libraryList?.filter((item) => textbooks?.find((book) => book === item.id))
  }, [libraryList, textbooks]);

  return (
    <SidebarStyled>
      <SidebarTitleStyled>
        <SidebarTitleTextStyled>{ course.name[lang] || course.name['ua'] }</SidebarTitleTextStyled>
        <SidebarActionsStyled>
          <SidebarActionHolderStyled>
            <TextTooltip text={translate('create_module')} children={
              <SidebarActionStyled className="fa fa-plus" onClick={moduleCreate} />
            } />
          </SidebarActionHolderStyled>
          <SidebarActionHolderStyled>
            <TextTooltip text={translate('edit_course')} children={
              <SidebarActionStyled className="fa fa-pencil-alt" onClick={courseUpdate} />
            } />
          </SidebarActionHolderStyled>
          <SidebarActionHolderStyled>
            <TextTooltip text={translate('delete_course')} children={
              <SidebarActionStyled className="fa fa-trash-alt error" onClick={() => setShowConfirm(true)} />
            } />
          </SidebarActionHolderStyled>
        </SidebarActionsStyled>
      </SidebarTitleStyled>
      <SidebarTeacherStyled>
        <SidebarTeacherTitleStyled>{ translate('teacher') }:</SidebarTeacherTitleStyled>
        {
          teacher ? (
            <>
              <SidebarTeacherAvatarStyled style={{backgroundImage: `url(${teacher?.avatar})`}} />
              <SidebarTeacherNameStyled>
                <Link to={`/admin-users/${teacher?.login}`}>
                  {teacher?.name}
                </Link>
              </SidebarTeacherNameStyled>
            </>
          ) : (
            <SidebarNotFoundStyled>
              <SidebarNotFoundIconStyled className="fa fa-user" />
              { translate('no_teacher') }
            </SidebarNotFoundStyled>
          )
        }
      </SidebarTeacherStyled>
      <SidebarTeacherTitleStyled>{ translate('textbooks') }:</SidebarTeacherTitleStyled>
      {
        !!sortedLibrary?.length ? (
          <SidebarTextbooksHolderStyled>
            {
              sortedLibrary.map((textbook) => (
                <>
                  <SidebarTextbookStyled>
                    <SidebarTextbookIconStyled className="fa fa-bookmark" />
                    <Link to={'/admin-library/?item=' + textbook.id}>{ textbook.name }</Link>
                  </SidebarTextbookStyled>
                </>
              ))
            }
          </SidebarTextbooksHolderStyled>
        ) : (
          <SidebarNotFoundStyled>
            <SidebarNotFoundIconStyled className="fa fa-bookmark" />
            { translate('no_textbook') }
          </SidebarNotFoundStyled>
        )
      }
      <SidebarTeacherTitleStyled>{ translate('modules') }:</SidebarTeacherTitleStyled>
      <SidebarModulesListStyled>
        {
          !!sortedModules?.length ? (
            sortedModules.map((module) => (
              <AdminCoursesModule subjectID={subjectID} courseID={course.id} module={module} key={module.id} params={params} loading={loading} isLessonCoppied={isLessonCoppied} setIsLessonCoppied={setIsLessonCoppied} />
            ))
          ) : (
            <SidebarNotFoundStyled>
              <SidebarNotFoundIconStyled className="fa fa-book" />
              { translate('no_modules') }
            </SidebarNotFoundStyled>
          )
        }
      </SidebarModulesListStyled>
      {
        showConfirm ?
          <Confirm message={translate('sure_to_delete_course')} cancelAction={() => setShowConfirm(false)} confirmAction={() => deleteCourse(subjectID, course.id)} />
          :
          null
      }
    </SidebarStyled>
  )
}

const mapStateToProps = state => ({
  usersList: state.usersReducer.usersList,
  libraryList: state.libraryReducer.libraryList,
  modulesList: state.coursesReducer.modulesList,
  user: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
  fetchModules: (subjectID, courseID) => dispatch(fetchModules(subjectID, courseID)),
  deleteCourse: (subjectID, courseID) => dispatch(deleteCourse(subjectID, courseID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(AdminCoursesCourseSidebar));

const SidebarStyled = styled.div`
  align-self: flex-start;
  padding: 40px;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-transform: none;
  font-weight: initial;
`;

const SidebarTitleStyled = styled.h3`
  text-transform: uppercase;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const SidebarTitleTextStyled = styled.h3`
  width: 100%;
`;

const SidebarActionsStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-weight: normal;
`;

const SidebarActionHolderStyled = styled.div`
  margin-left: 10px;
  overflow: hidden;

  &:hover {
    overflow: visible;
  }
`;

const SidebarActionStyled = styled.i`
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #333;
  color: #fff;
  font-size: 14px;

  &:hover {
    background: #4ec1e2;

    &.error {
      background: #e32929;
    }
  }
`;

const SidebarNotFoundStyled = styled.div`
  color: #999;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const SidebarNotFoundIconStyled = styled.i`
  width: 30px;
  height: 30px;
  border-radius: 100%;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
  font-size: 14px;
  color: #fff;
`;

const SidebarTeacherStyled = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;

  ${SidebarNotFoundStyled} {
    margin-bottom: 0;
  }
`;

const SidebarTeacherTitleStyled = styled.div`
  width: 100%;
  margin-bottom: 10px;
  font-weight: bold;
`;

const SidebarTeacherAvatarStyled = styled.div`
  width: 30px;
  height: 30px;
  background-size: cover;
  border-radius: 100%;
  background-position: 50% 50%;
  margin-right: 10px;
  background-color: #ccc;
`;

const SidebarTeacherNameStyled = styled.p`

`;

const SidebarTextbooksHolderStyled = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const SidebarTextbookStyled = styled.div`
  margin-top: 10px;
  line-height: 1.25;
  display: flex;

  &:first-child {
    margin-top: 0;
  }

  a {
    color: #333;
    display: inline-flex;

    &:hover {
      color: #4ec1e2;
    }
  }
`;

const SidebarTextbookIconStyled = styled.i`
  margin-right: 10px;
  height: 20px;
  width: 15px;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const SidebarModulesListStyled = styled.div`
  width: 100%;
`;
