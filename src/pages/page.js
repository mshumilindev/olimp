import React from 'react';
import MainContainer from "../containers/configContainer";
import {Provider} from "react-redux";
import {mainStore} from "../redux/stores/mainStore";

export default class Page extends React.Component {
    render() {
        const { location, children } = this.props;

        return (
            <Provider store={mainStore}>
                <MainContainer location={location} children={children}/>
            </Provider>
        )
    }
}
