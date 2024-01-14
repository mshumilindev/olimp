/* global onSiteSettingsUpdate */

import React, { Suspense, useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import SiteSettingsProvider from './providers/siteSettingsProvider';
import Loader from "./assets/img/loader.svg";
import Page from './pages/page';
import firebase from "./db/firestore";
import {Provider} from "react-redux";
import {mainStore} from "./redux/stores/mainStore";
import {Editor} from "@tinymce/tinymce-react";

import { GlobalNotificationProvider } from "./components/UI/GlobalNotifications/context";

const Login  = React.lazy(() => import('./pages/Login/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const StudentProfile = React.lazy(() => import ('./pages/StudentProfile/StudentProfile'));
const StudentSchedule = React.lazy(() => import ('./pages/StudentSchedule/StudentSchedule'));
const StudentContact = React.lazy(() => import ('./pages/StudentContact/StudentContact'));
const StudentClass = React.lazy(() => import('./pages/StudentClass/StudentClass'));
const StudentCourses = React.lazy(() => import('./pages/StudentCourses/StudentCourses'));
const StudentCourse = React.lazy(() => import('./pages/StudentCourse/StudentCourse'));
const StudentPage = React.lazy(() => import('./pages/StudentPage/StudentPage'));
const StudentChats = React.lazy(() => import('./pages/StudentChats/StudentChats'));
const StudentLibrary = React.lazy(() => import('./pages/StudentLibrary/StudentLibrary'));
const StudentJournal = React.lazy(() => import('./pages/StudentJournal/StudentJournal'));
const StudentTestsPage = React.lazy(() => import('./pages/StudentTestsPage'));

const AdminPanel = React.lazy(() => import('./pages/AdminPanel/AdminPanel'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers/AdminUsers'));
const AdminTranslations = React.lazy(() => import('./pages/AdminTranslations/AdminTranslations'));
const AdminChats = React.lazy(() => import('./pages/AdminChats/AdminChats'));
const AdminLibrary = React.lazy(() => import('./pages/AdminLibrary/AdminLibrary'));
const AdminCourses = React.lazy(() => import('./pages/AdminCourses/AdminCourses'));
const AdminLesson = React.lazy(() => import('./pages/AdminLesson/AdminLesson'));
const AdminClasses = React.lazy(() => import('./pages/AdminClasses/AdminClasses'));
const AdminPages = React.lazy(() => import('./pages/AdminPages/AdminPages'));
const AdminPage = React.lazy(() => import('./pages/AdminPage/AdminPage'));
const AdminClass = React.lazy(() => import('./pages/AdminClass/AdminClass'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings/AdminSettings'));
const AdminProfile = React.lazy(() => import('./pages/AdminProfile/AdminProfile'));
const AdminInfo = React.lazy(() => import('./pages/AdminInfo/AdminInfo'));
const Chatroom = React.lazy(() => import('./pages/Chatroom/Chatroom'));
const AdminAttendance = React.lazy(() => import('./pages/AdminAttendance/AdminAttendance'));
const AdminTesting = React.lazy(() => import('./pages/AdminTesting/AdminTesting'));

const Guest = React.lazy(() => import('./pages/Guest/Guest'));

const Landing = React.lazy(() => import('./pages/Landing/Landing'));

const PageNotFound = React.lazy(() => import('./pages/PageNotFound/PageNotFound'));

export default function App() {
    const [ checkedForUpdates, setCheckedForUpdates ] = useState(false);
    const [isLessonCoppied, setIsLessonCoppied] = useState(null);

    useEffect(() => {
        const db = firebase.firestore();
        const updatesCollection = db.collection('updates');
        const savedUpdates = localStorage.getItem('updates') ? JSON.parse(localStorage.getItem('updates')) : null;

        updatesCollection.get().then(snapshot => {
            const siteSettingsUpdates = snapshot.docs.find(doc => doc.id === 'siteSettings');

            if (savedUpdates) {
                if (siteSettingsUpdates && siteSettingsUpdates.exists && (!savedUpdates.siteSettings || siteSettingsUpdates.data().date > savedUpdates.siteSettings)) {
                    localStorage.removeItem('siteSettings');
                    localStorage.setItem('updates', JSON.stringify({
                        ...savedUpdates,
                        siteSettings: siteSettingsUpdates.data().date
                    }));
                }
            } else {
                if (siteSettingsUpdates.exists) {
                    localStorage.setItem('updates', JSON.stringify({
                        siteSettings: siteSettingsUpdates.data().date
                    }));
                }
            }

            setCheckedForUpdates(true);
        });
    }, []);


    const editorToolbar = ['undo redo | formatselect | forecolor | fontselect | fontsizeselect | numlist bullist | align | bold italic underline strikeThrough subscript superscript | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry'];

    const editorConfig = {
        menubar: false,
        language: 'uk',
        max_height: 550,
        plugins: [
            'autoresize fullscreen',
            'advlist lists image charmap anchor',
            'visualblocks',
            'paste'
        ],
        external_plugins: {
            'tiny_mce_wiris' : 'https://cdn.jsdelivr.net/npm/@wiris/mathtype-tinymce4@7.17.0/plugin.min.js'
        },
        paste_word_valid_elements: "b,strong,i,em,h1,h2,u,p,ol,ul,li,a[href],span,color,font-size,font-color,font-family,mark,table,tr,td",
        paste_retain_style_properties: "all",
        fontsize_formats: "8 9 10 11 12 14 16 18 20 22 24 26 28 36 48 72",
        toolbar: editorToolbar
    };

    if ( !checkedForUpdates ) {
        return null;
    }
    else {
        return (
            <SiteSettingsProvider>
              <GlobalNotificationProvider>
                <BrowserRouter>
                    <Switch>
                        <Provider store={mainStore}>
                            <Page>
                                <div className="tinymcePreloader">
                                    <Editor
                                        init={editorConfig}
                                        apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
                                    />
                                </div>
                                <Suspense fallback={_renderLoader()}>
                                    <Route exact path='/' component={Dashboard}/>
                                    <Route path='/login' component={Login}/>
                                    <Route path='/suspended' component={Login}/>
                                    <Route path='/profile' component={StudentProfile}/>
                                    <Route path='/schedule' component={StudentSchedule}/>
                                    <Route path='/journal' component={StudentJournal}/>
                                    <Route path='/contact' component={StudentContact}/>
                                    <Route path='/class' component={StudentClass}/>
                                    <Route path='/library' component={StudentLibrary}/>
                                    <Route path='/tests' component={StudentTestsPage}/>
                                    <Route exact path='/user/:userLogin' render={props => <StudentProfile {...props.match} />}/>
                                    <Route exact path='/courses' render={props => <StudentCourses {...props.match} />}/>
                                    <Route exact path='/courses/:subjectID/:courseID'
                                           render={props => <StudentCourse {...props.match} />}/>
                                    <Route exact path='/courses/:subjectID/:courseID/:moduleID/:lessonID'
                                           render={props => <StudentCourse {...props.match} />}/>
                                    <Route exact path='/page/:pageSlug' render={props => <StudentPage {...props.match} />}/>

                                    <Route path='/admin' component={AdminPanel}/>
                                    <Route exact path='/admin-profile' component={AdminProfile}/>
                                    <Route exact path='/admin-users' component={AdminUsers}/>
                                    <Route exact path='/admin-users/:userLogin'
                                           render={props => <AdminProfile {...props.match} />}/>
                                    <Route exact path='/admin-lessons/:subjectID/:courseID/:moduleID/:lessonID'
                                          render={props => <AdminLesson {...props.match} />}/>
                                    <Route path='/admin-courses' render={props => <AdminCourses {...props.match} isLessonCoppied={isLessonCoppied} setIsLessonCoppied={setIsLessonCoppied} />}/>
                                    <Route exact path='/admin-classes' component={AdminClasses}/>
                                    <Route exact path='/admin-classes/:classID'
                                           render={props => <AdminClass {...props.match} />}/>
                                    <Route exact path='/admin-pages' component={AdminPages}/>
                                    <Route exact path='/admin-pages/:pageSlug'
                                           render={props => <AdminPage {...props.match} />}/>
                                    <Route path='/admin-translations' component={AdminTranslations}/>
                                    <Route path='/admin-library' render={props => <AdminLibrary {...props.match} />}/>
                                    <Route path='/admin-settings' component={AdminSettings}/>
                                    <Route exact path='/admin-info' render={props => <AdminInfo {...props.match} />}/>
                                    <Route exact path='/admin-info/:id' render={props => <AdminInfo {...props.match} />}/>
                                    <Route path='/admin-chats' component={AdminChats}/>
                                    <Route exact path='/chats' component={StudentChats} />
                                    <Route exact path='/chat/:chatID' render={props => <Chatroom {...props.match} />} />
                                    <Route path='/admin-attendance' component={AdminAttendance}/>
                                    <Route exact path='/admin-tests' component={AdminTesting}/>
                                    <Route path='/admin-tests/:testID' render={props => <AdminTesting testID={props.match.params.testID} />}/>

                                    <Route exact path='/guest' component={Guest} />

                                    <Route exact path='/landing' component={Landing} />

                                    <Route path="*" component={PageNotFound}/>
                                </Suspense>
                            </Page>
                        </Provider>
                    </Switch>
                </BrowserRouter>
              </GlobalNotificationProvider>
            </SiteSettingsProvider>
        );
    }
    function _renderLoader() {
        return (
            <div className="loader">
                <img src={Loader} alt="Loading"/>
            </div>
        )
    }
}
