import React, { Suspense } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import SiteSettingsProvider from './providers/siteSettingsProvider';
import Loader from "./assets/img/loader.svg";
import Page from './pages/page';

const Login  = React.lazy( () => import('./pages/Login/Login'));
const Schedule = React.lazy(() => import('./pages/schedule/schedule'));
const Dashboard = React.lazy(() => import('./pages/dashboard/dashboard'));

const AdminPanel = React.lazy(() => import('./pages/AdminPanel/AdminPanel'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers/AdminUsers'));
const AdminTranslations = React.lazy(() => import('./pages/AdminTranslations/AdminTranslations'));
const AdminLibrary = React.lazy(() => import('./pages/AdminLibrary/AdminLibrary'));
const AdminCourses = React.lazy(() => import('./pages/AdminCourses/AdminCourses'));

const PageNotFound = React.lazy(() => import('./pages/PageNotFound/PageNotFound'));

export default function App() {
    return (
        <SiteSettingsProvider>
            <BrowserRouter>
                <Switch>
                    <Page>
                        <Suspense fallback={ _renderLoader() }>
                            <Route exact path='/' component={Dashboard} />
                            <Route path='/schedule' component={Schedule} />
                            <Route path='/login' component={Login} />

                            <Route path='/admin' component={AdminPanel} />
                            <Route path='/admin-users' component={AdminUsers} />
                            <Route exact path='/admin-courses' component={AdminCourses} />
                            <Route exact path="/admin-courses/:subjectID" render={props => <AdminCourses {...props.match} />} />
                            <Route exact path="/admin-courses/:subjectID/:courseID" render={props => <AdminCourses {...props.match} />} />
                            <Route exact path="/admin-courses/:subjectID/:courseID/:moduleID" render={props => <AdminCourses {...props.match} />} />
                            <Route path='/admin-translations' component={AdminTranslations} />
                            <Route path='/admin-library' component={AdminLibrary} />

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
