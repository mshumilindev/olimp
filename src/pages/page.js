import React from 'react';
import MainContainer from "../containers/mainContainer";
import {Provider} from "react-redux";
import {mainStore} from "../redux/stores/mainStore";

export default class Page extends React.Component {
    render() {
        return (
            <Provider store={mainStore}>
                <MainContainer location={this.props.location} children={this.props.children}/>
            </Provider>
        )
    }
}
