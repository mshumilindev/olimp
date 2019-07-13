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

// === Need to remove nav from firebase and move it to the new Student component

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
                            <Route path='/admin-translations' component={AdminTranslations} />
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
