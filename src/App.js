import React, { Suspense } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import SiteSettingsProvider from './providers/siteSettingsProvider';
import Loader from "./assets/img/loader.svg";
import Page from './pages/page';

const Login  = React.lazy( () => import('./pages/Login/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const StudentProfile = React.lazy(() => import ('./pages/StudentProfile/StudentProfile'));
const StudentSchedule = React.lazy(() => import ('./pages/StudentSchedule/StudentSchedule'));
const StudentContact = React.lazy(() => import ('./pages/StudentContact/StudentContact'));
const StudentClass = React.lazy(() => import('./pages/StudentClass/StudentClass'));
const StudentCourses = React.lazy(() => import('./pages/StudentCourses/StudentCourses'));
const StudentCourse = React.lazy(() => import('./pages/StudentCourse/StudentCourse'));
const StudentPage = React.lazy(() => import('./pages/StudentPage/StudentPage'));

const AdminPanel = React.lazy(() => import('./pages/AdminPanel/AdminPanel'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers/AdminUsers'));
const AdminTranslations = React.lazy(() => import('./pages/AdminTranslations/AdminTranslations'));
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

const PageNotFound = React.lazy(() => import('./pages/PageNotFound/PageNotFound'));

export default function App() {
    return (
        <SiteSettingsProvider>
            <BrowserRouter>
                <Switch>
                    <Page>
                        <Suspense fallback={ _renderLoader() }>
                            <Route exact path='/' component={Dashboard} />
                            <Route path='/login' component={Login} />
                            <Route path='/suspended' component={Login} />
                            <Route path='/profile' component={StudentProfile} />
                            <Route path='/schedule' component={StudentSchedule} />
                            <Route path='/contact' component={StudentContact} />
                            <Route path='/class' component={StudentClass} />
                            <Route exact path='/user/:userLogin' render={props => <StudentProfile {...props.match} />} />
                            <Route exact path='/courses' render={props => <StudentCourses {...props.match} />} />
                            <Route exact path='/courses/:subjectID/:courseID' render={props => <StudentCourse {...props.match} />} />
                            <Route exact path='/courses/:subjectID/:courseID/:moduleID/:lessonID' render={props => <StudentCourse {...props.match} />} />
                            <Route exact path='/page/:pageSlug' render={props => <StudentPage {...props.match} />} />

                            <Route path='/admin' component={AdminPanel} />
                            <Route exact path='/admin-profile' component={AdminProfile} />
                            <Route exact path='/admin-users' component={AdminUsers} />
                            <Route exact path='/admin-users/:userLogin' render={props => <AdminProfile {...props.match} />} />
                            <Route exact path='/admin-courses' component={AdminCourses} />
                            <Route exact path="/admin-courses/:subjectID" render={props => <AdminCourses {...props.match} />} />
                            <Route exact path="/admin-courses/:subjectID/:courseID" render={props => <AdminCourses {...props.match} />} />
                            <Route exact path="/admin-courses/:subjectID/:courseID/:moduleID" render={props => <AdminCourses {...props.match} />} />
                            <Route exact path="/admin-courses/:subjectID/:courseID/:moduleID/:lessonID" render={props => <AdminLesson {...props.match} />} />
                            <Route exact path='/admin-classes' component={AdminClasses} />
                            <Route exact path='/admin-classes/:classID' render={props => <AdminClass {...props.match} />} />
                            <Route exact path='/admin-pages' component={AdminPages} />
                            <Route exact path='/admin-pages/:pageSlug' render={props => <AdminPage {...props.match} />} />
                            <Route path='/admin-translations' component={AdminTranslations} />
                            <Route path='/admin-library' component={AdminLibrary} />
                            <Route path='/admin-settings' component={AdminSettings} />
                            <Route path='/admin-info' component={AdminInfo} />

                            <Route path="*" component={PageNotFound} />
                        </Suspense>
                    </Page>
                </Switch>
            </BrowserRouter>
        </SiteSettingsProvider>
    );

    function _renderLoader() {
        return (
            <div className="loader">
                <img src={Loader} alt="Loading"/>
            </div>
        )
    }
}
