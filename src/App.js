/* global onSiteSettingsUpdate */

import React, { Suspense, useState, useEffect, lazy } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import SiteSettingsProvider from "./providers/siteSettingsProvider";
import Loader from "./assets/img/loader.svg";
import Page from "./pages/page";
import { Provider } from "react-redux";
import { mainStore } from "./redux/stores/mainStore";
import { Editor } from "@tinymce/tinymce-react";
import { collection, getDocs } from "firebase/firestore"; 

import { db } from "./db/firestore";
import { GlobalNotificationProvider } from "./components/UI/GlobalNotifications/context";

const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const StudentProfile = lazy(
  () => import("./pages/StudentProfile/StudentProfile"),
);
const StudentSchedule = lazy(
  () => import("./pages/StudentSchedule/StudentSchedule"),
);
const StudentContact = lazy(
  () => import("./pages/StudentContact/StudentContact"),
);
const StudentClass = lazy(
  () => import("./pages/StudentClass/StudentClass"),
);
const StudentCourses = lazy(
  () => import("./pages/StudentCourses/StudentCourses"),
);
const StudentCourse = lazy(
  () => import("./pages/StudentCourse/StudentCourse"),
);
const StudentPage = lazy(() => import("./pages/StudentPage/StudentPage"));
const StudentChats = lazy(
  () => import("./pages/StudentChats/StudentChats"),
);
const StudentLibrary = lazy(
  () => import("./pages/StudentLibrary/StudentLibrary"),
);
const StudentJournal = lazy(
  () => import("./pages/StudentJournal/StudentJournal"),
);
const StudentTestsPage = lazy(() => import("./pages/StudentTestsPage"));

const AdminPanel = lazy(() => import("./pages/AdminPanel/AdminPanel"));
const AdminUsers = lazy(() => import("./pages/AdminUsers/AdminUsers"));
const AdminTranslations = lazy(
  () => import("./pages/AdminTranslations/AdminTranslations"),
);
const AdminChats = lazy(() => import("./pages/AdminChats/AdminChats"));
const AdminLibrary = lazy(
  () => import("./pages/AdminLibrary/AdminLibrary"),
);
const AdminCourses = lazy(
  () => import("./pages/AdminCourses/AdminCourses"),
);
const AdminLesson = lazy(() => import("./pages/AdminLesson/AdminLesson"));
const AdminClasses = lazy(
  () => import("./pages/AdminClasses/AdminClasses"),
);
const AdminPages = lazy(() => import("./pages/AdminPages/AdminPages"));
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));
const AdminClass = lazy(() => import("./pages/AdminClass/AdminClass"));
const AdminSettings = lazy(
  () => import("./pages/AdminSettings/AdminSettings"),
);
const AdminProfile = lazy(
  () => import("./pages/AdminProfile/AdminProfile"),
);
const AdminInfo = lazy(() => import("./pages/AdminInfo/AdminInfo"));
const Chatroom = lazy(() => import("./pages/Chatroom/Chatroom"));
const AdminAttendance = lazy(
  () => import("./pages/AdminAttendance/AdminAttendance"),
);
const AdminTesting = lazy(
  () => import("./pages/AdminTesting/AdminTesting"),
);

const Guest = lazy(() => import("./pages/Guest/Guest"));

const Landing = lazy(() => import("./pages/Landing/Landing"));

const PageNotFound = lazy(
  () => import("./pages/PageNotFound/PageNotFound"),
);

const App = () => {
  const [checkedForUpdates, setCheckedForUpdates] = useState(false);
  const [isLessonCoppied, setIsLessonCoppied] = useState(null);

  useEffect(() => {
    const updatesCollection = collection(db, "updates");
    const savedUpdates = localStorage.getItem("updates")
      ? JSON.parse(localStorage.getItem("updates"))
      : null;

    getDocs(updatesCollection).then((snapshot) => {
      const siteSettingsUpdates = snapshot.docs.find(
        (doc) => doc.id === "siteSettings",
      );

      if (savedUpdates) {
        if (
          siteSettingsUpdates &&
          siteSettingsUpdates.exists &&
          (!savedUpdates.siteSettings ||
            siteSettingsUpdates.data().date > savedUpdates.siteSettings)
        ) {
          localStorage.removeItem("siteSettings");
          localStorage.setItem(
            "updates",
            JSON.stringify({
              ...savedUpdates,
              siteSettings: siteSettingsUpdates.data().date,
            }),
          );
        }
      } else {
        if (siteSettingsUpdates.exists) {
          localStorage.setItem(
            "updates",
            JSON.stringify({
              siteSettings: siteSettingsUpdates.data().date,
            }),
          );
        }
      }

      setCheckedForUpdates(true);
    });
  }, []);

  const editorToolbar = [
    "undo redo | formatselect | forecolor | fontselect | fontsizeselect | numlist bullist | align | bold italic underline strikeThrough subscript superscript | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry",
  ];

  const editorConfig = {
    menubar: false,
    language: "uk",
    max_height: 550,
    plugins: [
      "autoresize fullscreen",
      "advlist lists image charmap anchor",
      "visualblocks",
      "paste",
    ],
    // external_plugins: {
    //   tiny_mce_wiris:
    //     "https://cdn.jsdelivr.net/npm/@wiris/mathtype-tinymce4@7.29.0/plugin.min.js",
    // },
    paste_word_valid_elements:
      "b,strong,i,em,h1,h2,u,p,ol,ul,li,a[href],span,color,font-size,font-color,font-family,mark,table,tr,td",
    paste_retain_style_properties: "all",
    fontsize_formats: "8 9 10 11 12 14 16 18 20 22 24 26 28 36 48 72",
    toolbar: editorToolbar,
  };

  if (!checkedForUpdates) {
    return null;
  }

  const renderLoader = () => {
    return (
      <div className="loader">
        <img src={Loader} alt="Loading" />
      </div>
    );
  }

  return (
    <SiteSettingsProvider>
      <GlobalNotificationProvider>
        <BrowserRouter>
          <Provider store={mainStore}>
            <Page>
              <div className="tinymcePreloader">
                <Editor
                  init={editorConfig}
                  apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
                />
              </div>
              <Suspense fallback={renderLoader()}>
                <Routes>
                  <Route exact path="/" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/suspended" element={<Login />} />
                  <Route path="/profile" element={<StudentProfile />} />
                  <Route path="/schedule" element={<StudentSchedule />} />
                  <Route path="/journal" element={<StudentJournal />} />
                  <Route path="/contact" element={<StudentContact />} />
                  <Route path="/class" element={<StudentClass />} />
                  <Route path="/library" element={<StudentLibrary />} />
                  <Route path="/tests" element={<StudentTestsPage />} />
                  <Route
                    exact
                    path="/user/:userLogin"
                    render={(props) => <StudentProfile {...props.match} />}
                  />
                  <Route
                    exact
                    path="/courses"
                    render={(props) => <StudentCourses {...props.match} />}
                  />
                  <Route
                    exact
                    path="/courses/:subjectID/:courseID"
                    render={(props) => <StudentCourse {...props.match} />}
                  />
                  <Route
                    exact
                    path="/courses/:subjectID/:courseID/:moduleID/:lessonID"
                    render={(props) => <StudentCourse {...props.match} />}
                  />
                  <Route
                    exact
                    path="/page/:pageSlug"
                    render={(props) => <StudentPage {...props.match} />}
                  />

                  <Route path="/admin" element={<AdminPanel />} />
                  <Route
                    exact
                    path="/admin-profile"
                    element={<AdminProfile />}
                  />
                  <Route exact path="/admin-users" element={<AdminUsers />} />
                  <Route
                    exact
                    path="/admin-users/:userLogin"
                    render={(props) => <AdminProfile {...props.match} />}
                  />
                  <Route
                    exact
                    path="/admin-lessons/:subjectID/:courseID/:moduleID/:lessonID"
                    render={(props) => <AdminLesson {...props.match} />}
                  />
                  <Route
                    path="/admin-courses"
                    render={(props) => (
                      <AdminCourses
                        {...props.match}
                        isLessonCoppied={isLessonCoppied}
                        setIsLessonCoppied={setIsLessonCoppied}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/admin-classes"
                    element={<AdminClasses />}
                  />
                  <Route
                    exact
                    path="/admin-classes/:classID"
                    render={(props) => <AdminClass {...props.match} />}
                  />
                  <Route exact path="/admin-pages" element={<AdminPages />} />
                  <Route
                    exact
                    path="/admin-pages/:pageSlug"
                    render={(props) => <AdminPage {...props.match} />}
                  />
                  <Route
                    path="/admin-translations"
                    element={<AdminTranslations />}
                  />
                  <Route
                    path="/admin-library"
                    render={(props) => <AdminLibrary {...props.match} />}
                  />
                  <Route path="/admin-settings" element={<AdminSettings />} />
                  <Route
                    exact
                    path="/admin-info"
                    render={(props) => <AdminInfo {...props.match} />}
                  />
                  <Route
                    exact
                    path="/admin-info/:id"
                    render={(props) => <AdminInfo {...props.match} />}
                  />
                  <Route path="/admin-chats" element={<AdminChats />} />
                  <Route exact path="/chats" element={<StudentChats />} />
                  <Route
                    exact
                    path="/chat/:chatID"
                    render={(props) => <Chatroom {...props.match} />}
                  />
                  <Route
                    path="/admin-attendance"
                    element={<AdminAttendance />}
                  />
                  <Route exact path="/admin-tests" element={<AdminTesting />} />
                  <Route
                    path="/admin-tests/:testID"
                    render={(props) => (
                      <AdminTesting testID={props.match.params.testID} />
                    )}
                  />

                  <Route exact path="/guest" element={<Guest />} />

                  <Route exact path="/landing" element={<Landing />} />

                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Suspense>
            </Page>
          </Provider>
        </BrowserRouter>
      </GlobalNotificationProvider>
    </SiteSettingsProvider>
  );
}

export default App;