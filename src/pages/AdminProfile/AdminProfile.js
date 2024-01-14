import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from "react-redux";
import { fetchProfile, updateUser } from "../../redux/actions/usersActions";
import Preloader from "../../components/UI/preloader";
import Form from "../../components/Form/Form";
import Profile from "../../components/Profile/Profile";
import generator from "generate-password";
import "./adminProfile.scss";
import Journal from "../../components/Journal/Journal";

function AdminProfile({
  user,
  profile,
  fetchProfile,
  params,
  usersLoading,
  classesLoading,
  coursesLoading,
  userLoading,
  classesList,
  allCoursesList,
  updateUser,
}) {
  const { translate, getUserFormFields, lang } =
    useContext(siteSettingsContext);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [formFields, setFormFields] = useState(null);
  const [currentUser, setCurrentUser] = useState(JSON.stringify(null));
  const [initialCurrentUser, setInitialCurrentUser] = useState(
    JSON.stringify(null),
  );

  const loading = useMemo(() => {
    return usersLoading || classesLoading || coursesLoading || userLoading;
  }, [usersLoading, classesLoading, coursesLoading, userLoading]);

  const attendance = useMemo(() => {
    if (JSON.parse(currentUser)) {
      return JSON.parse(currentUser).attendance;
    }
    return null;
  }, [currentUser]);

  const insertClass = useCallback(
    (newProfile) => {
      const opts = [];
      const profileClass = newProfile
        ? newProfile.class
        : JSON.parse(currentUser).class;
      const selectedClass = classesList.find(
        (item) => item.id === profileClass,
      );

      classesList
        .sort((a, b) => {
          const aTitle = a.title[lang] || a.title["ua"];
          const bTitle = b.title[lang] || b.title["ua"];

          if (aTitle < bTitle) {
            return -1;
          } else if (aTitle > bTitle) {
            return 1;
          }
          return 0;
        })
        .sort((a, b) => {
          const aTitle = parseInt(a.title[lang]) || parseInt(a.title["ua"]);
          const bTitle = parseInt(b.title[lang]) || parseInt(b.title["ua"]);

          return aTitle - bTitle;
        })
        .forEach((item) => {
          opts.push({
            id: item.id,
            title: item.title[lang] ? item.title[lang] : item.title["ua"],
          });
        });

      return {
        type: "select",
        id: "class",
        name: "class",
        placeholder: "class",
        hasErrors: false,
        value:
          JSON.parse(currentUser) && selectedClass
            ? selectedClass.title[lang]
              ? selectedClass.title[lang]
              : selectedClass.title["ua"]
            : "",
        storedValue:
          JSON.parse(currentUser) && selectedClass ? selectedClass.id : "",
        updated: false,
        options: [...opts],
      };
    },
    [classesList, currentUser, lang],
  );

  const insertCourse = useCallback(() => {
    const selectedCourses = [];

    allCoursesList.forEach((subject) => {
      if (subject.coursesList) {
        subject.coursesList.forEach((course) => {
          if (course.teacher === JSON.parse(currentUser).id) {
            selectedCourses.push(
              course.name[lang] ? course.name[lang] : course.name["ua"],
            );
          }
        });
      }
    });

    return {
      type: "text",
      id: "courses",
      name: "courses",
      value: selectedCourses.join(", ") ? selectedCourses.join(", ") : "",
      placeholder: translate("courses"),
      readonly: true,
    };
  }, [allCoursesList, translate, lang, currentUser]);

  const getUserFields = useCallback(
    (newProfile) => {
      const useProfile = newProfile || JSON.parse(currentUser);
      const formFields = getUserFormFields(user, useProfile, generatePassword);

      if (useProfile.role === "student" && classesList) {
        formFields.splice(2, 0, insertClass(newProfile));
      }
      if (useProfile.role === "teacher" && allCoursesList) {
        formFields.splice(2, 0, insertCourse());
      }

      return formFields;
    },
    [
      currentUser,
      user,
      allCoursesList,
      classesList,
      getUserFormFields,
      insertClass,
      insertCourse,
    ],
  );

  const setFieldValue = useCallback(
    (fieldID, value) => {
      const parsedUser = JSON.parse(currentUser);

      parsedUser[fieldID] = value;
      setCurrentUser(JSON.stringify(parsedUser));
      setFormFields(getUserFields(parsedUser));
    },
    [currentUser, setCurrentUser, setFormFields, getUserFields],
  );

  const generatePassword = useCallback(
    (fieldID) => {
      const newPassword = generator.generate({
        length: 16,
        symbols: true,
        strict: true,
      });

      setFieldValue(fieldID, newPassword);
    },
    [setFieldValue],
  );

  useEffect(() => {
    if (params && params.userLogin) {
      fetchProfile(params.userLogin);
    } else {
      fetchProfile(user.login);
    }
  }, [params, fetchProfile, user]);

  useEffect(() => {
    if (profile && classesList && allCoursesList) {
      setCurrentUser(JSON.stringify(profile));
      setInitialCurrentUser(JSON.stringify(profile));
    }
  }, [params, classesList, allCoursesList, profile]);

  useEffect(() => {
    if (classesList && allCoursesList && JSON.parse(initialCurrentUser)) {
      setFormFields(getUserFields());
    }
  }, [
    params,
    classesList,
    allCoursesList,
    initialCurrentUser,
    setFormFields,
    getUserFields,
  ]);

  useEffect(() => {
    if (currentUser !== initialCurrentUser) {
      setProfileUpdated(true);
    } else {
      setProfileUpdated(false);
    }
  }, [currentUser, initialCurrentUser]);

  const getUpdatedFields = useCallback(() => {
    const updatedFields = {};

    formFields.forEach((field) => {
      if (field.children) {
        field.children.forEach((child) => {
          if (child.updated) {
            Object.assign(updatedFields, { [child.id]: child.value });
          }
        });
      } else if (field.tabs) {
        field.tabs.forEach((tab) => {
          tab.content.forEach((child) => {
            if (child.updated) {
              Object.assign(updatedFields, { [child.id]: child.value });
            }
          });
        });
      } else {
        if (field.updated) {
          if (field.id === "class") {
            Object.assign(updatedFields, { [field.id]: field.storedValue });
          } else {
            Object.assign(updatedFields, { [field.id]: field.value });
          }
        }
      }
    });
    Object.assign(updatedFields, {
      ...JSON.parse(currentUser),
      ...updatedFields,
    });

    delete updatedFields.isNew;

    return updatedFields;
  }, [formFields, currentUser]);

  const updateProfile = useCallback(
    (e) => {
      e.preventDefault();

      if (profileUpdated) {
        const updatedFields = getUpdatedFields();
        const userID = profile.id;

        delete profile.id;

        updateUser(userID, {
          ...profile,
          ...updatedFields,
        });
        if (!params) {
          const userToSave = {
            ...profile,
            ...updatedFields,
          };

          delete userToSave.password;

          localStorage.setItem("user", JSON.stringify(userToSave));
        }
        profile.id = userID;
        setFormFields(getUserFields(updatedFields));
        setProfileUpdated(false);
        setCurrentUser(JSON.stringify(updatedFields));
        setInitialCurrentUser(JSON.stringify(updatedFields));
      }
    },
    [
      profileUpdated,
      getUpdatedFields,
      profile,
      updateUser,
      params,
      setFormFields,
      getUserFields,
      setProfileUpdated,
      setCurrentUser,
      setInitialCurrentUser,
    ],
  );

  return (
    <div className="adminProfile">
      <section className="section">
        <div className="section__title-holder">
          <h2 className="section__title">
            <i className="content_title-icon fa fa-user" />
            {JSON.parse(currentUser) ? (
              <>
                <span className="section__title-separator">
                  {translate("profile")}
                </span>
                {JSON.parse(currentUser).name}
              </>
            ) : (
              translate("profile")
            )}
          </h2>
          {user.role !== "admin" && params ? null : (
            <div className="section__title-actions">
              <a
                href="/"
                className="btn btn__success"
                disabled={!profileUpdated}
                onClick={(e) => updateProfile(e)}
              >
                <i className="content_title-icon fa fa-save" />
                {translate("save")}
              </a>
            </div>
          )}
          {loading ? <Preloader size={60} /> : null}
        </div>
        <div className="grid">
          <div className="grid_col col-6 desktop-col-4 adminProfile__profile">
            <div className="widget">
              <div className="widget__title">
                <i className="content_title-icon fa fa-info" />
                {translate("info")}
              </div>
              {!JSON.parse(currentUser) || loading ? (
                <Preloader />
              ) : user.role === "teacher" && params ? (
                <Profile
                  user={JSON.parse(currentUser)}
                  allCoursesList={allCoursesList}
                  classesList={classesList}
                />
              ) : (
                <Form
                  fields={formFields}
                  loading={loading}
                  setFieldValue={setFieldValue}
                />
              )}
            </div>
          </div>
          {JSON.parse(currentUser) &&
          JSON.parse(currentUser).role === "student" &&
          JSON.parse(currentUser).status === "active" &&
          attendance ? (
            <div className="grid_col col-12">
              <div className="widget">
                <div className="widget__title">
                  <i className="content_title-icon fa fa-user-check" />
                  {translate("attendance")}
                </div>
                <Journal
                  attendance={attendance}
                  user={JSON.parse(currentUser)}
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

const mapStateToProps = (state) => ({
  profile: state.usersReducer.profile,
  usersLoading: state.usersReducer.loading,
  classesLoading: state.classesReducer.loading,
  coursesLoading: state.coursesReducer.loading,
  userLoading: state.authReducer.loading,
  classesList: state.classesReducer.classesList,
  allCoursesList: state.coursesReducer.coursesList,
  usersList: state.usersReducer.usersList,
  user: state.authReducer.currentUser,
});
const mapDispatchToProps = (dispatch) => ({
  updateUser: (id, data) => dispatch(updateUser(id, data)),
  fetchProfile: (profileLogin) => dispatch(fetchProfile(profileLogin)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminProfile);
