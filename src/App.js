/* global onSiteSettingsUpdate */

import React, { Suspense, useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import SiteSettingsProvider from './providers/siteSettingsProvider';
import Loader from "./assets/img/loader.svg";
import Page from './pages/page';
import firebase from "./db/firestore";

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
const AdminUpdates = React.lazy(() => import('./pages/AdminUpdates/AdminUpdates'));
const AdminAttendance = React.lazy(() => import('./pages/AdminAttendance/AdminAttendance'));
const AdminTesting = React.lazy(() => import('./pages/AdminTesting/AdminTesting'));

const Guest = React.lazy(() => import('./pages/Guest/Guest'));

const PageNotFound = React.lazy(() => import('./pages/PageNotFound/PageNotFound'));

export default function App() {
    const [ checkedForUpdates, setCheckedForUpdates ] = useState(false);

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

    if ( !checkedForUpdates ) {
        return null;
    }
    else {
        return (
            <SiteSettingsProvider>
                <BrowserRouter>
                    <Switch>
                        <Page>
                            <Suspense fallback={_renderLoader()}>
                                <Route exact path='/' component={Dashboard}/>
                                <Route path='/login' component={Login}/>
                                <Route path='/suspended' component={Login}/>
                                <Route path='/profile' component={StudentProfile}/>
                                <Route path='/schedule' component={StudentSchedule}/>
                                <Route path='/contact' component={StudentContact}/>
                                <Route path='/class' component={StudentClass}/>
                                <Route path='/library' component={StudentLibrary}/>
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
                                <Route exact path='/admin-courses' component={AdminCourses}/>
                                <Route exact path="/admin-courses/:subjectID"
                                       render={props => <AdminCourses {...props.match} />}/>
                                <Route exact path="/admin-courses/:subjectID/:courseID"
                                       render={props => <AdminCourses {...props.match} />}/>
                                <Route exact path="/admin-courses/:subjectID/:courseID/:moduleID"
                                       render={props => <AdminCourses {...props.match} />}/>
                                <Route exact path="/admin-courses/:subjectID/:courseID/:moduleID/:lessonID"
                                       render={props => <AdminLesson {...props.match} />}/>
                                <Route exact path='/admin-classes' component={AdminClasses}/>
                                <Route exact path='/admin-classes/:classID'
                                       render={props => <AdminClass {...props.match} />}/>
                                <Route exact path='/admin-pages' component={AdminPages}/>
                                <Route exact path='/admin-pages/:pageSlug'
                                       render={props => <AdminPage {...props.match} />}/>
                                <Route path='/admin-translations' component={AdminTranslations}/>
                                <Route path='/admin-library' component={AdminLibrary}/>
                                <Route path='/admin-settings' component={AdminSettings}/>
                                <Route exact path='/admin-info' render={props => <AdminInfo {...props.match} />}/>
                                <Route exact path='/admin-info/:id' render={props => <AdminInfo {...props.match} />}/>
                                <Route path='/admin-chats' component={AdminChats}/>
                                <Route exact path='/chats' component={StudentChats} />
                                <Route exact path='/chat/:chatID' render={props => <Chatroom {...props.match} />} />
                                <Route path='/admin-updates' component={AdminUpdates}/>
                                <Route path='/admin-attendance' component={AdminAttendance}/>
                                <Route path='/admin-tests' component={AdminTesting}/>

                                <Route exact path='/guest' component={Guest} />

                                <Route path="*" component={PageNotFound}/>
                            </Suspense>
                        </Page>
                    </Switch>
                </BrowserRouter>
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
