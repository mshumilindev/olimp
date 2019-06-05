import React, { Fragment, Suspense } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import SiteSettingsProvider from './providers/siteSettingsProvider';
import Loader from "./assets/img/loader.svg";
import Page from './pages/page';

const Schedule = React.lazy(() => import('./pages/schedule/schedule'));
const Dashboard = React.lazy(() => import('./pages/dashboard/dashboard'));

export default class App extends React.Component {
    render() {
        return (
            <SiteSettingsProvider>
                <BrowserRouter>
                    <Switch>
                        <Page>
                            <Fragment>
                                <Suspense fallback={ this._renderLoader() }>
                                    <Route exact path='/' component={Dashboard} />
                                    <Route path='/schedule' component={Schedule} />
                                </Suspense>
                            </Fragment>
                        </Page>
                    </Switch>
                </BrowserRouter>
            </SiteSettingsProvider>
        )
    }

    _renderLoader() {
        return (
            <div className="loader">
                <img src={Loader} alt="Loading"/>
            </div>
        )
    }
}
